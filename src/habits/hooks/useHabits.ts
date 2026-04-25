import { useState, useEffect, useCallback, useMemo } from 'react';
import type { HabitStore, Habit, Completion, CompletionStatus, Reward, Redemption, PointsBreakdown } from '@/habits/types';
import { loadHabitStore, saveHabitStore } from '@/habits/lib/storage';
import { makeDefaultStore } from '@/habits/data/defaults';
import { getStrategy } from '@/habits/lib/strategies';
import { generateId } from '@/lib/utils';

export function useHabits() {
  const [store, setStore] = useState<HabitStore>(() => {
    return loadHabitStore() ?? makeDefaultStore();
  });

  useEffect(() => {
    saveHabitStore(store);
  }, [store]);

  const activeStrategy = useMemo(
    () => getStrategy(store.activeStrategyId),
    [store.activeStrategyId],
  );

  // --- Habits CRUD ---

  const addHabit = useCallback((h: Omit<Habit, 'id' | 'createdAt' | 'archived' | 'sortOrder'>) => {
    const habit: Habit = {
      ...h,
      id: generateId(),
      createdAt: new Date().toISOString(),
      archived: false,
      sortOrder: 0,
    };
    setStore((prev) => ({
      ...prev,
      habits: [
        ...prev.habits.map((existing) => ({ ...existing, sortOrder: existing.sortOrder + 1 })),
        { ...habit, sortOrder: 0 },
      ].sort((a, b) => a.sortOrder - b.sortOrder),
    }));
    return habit;
  }, []);

  const updateHabit = useCallback((id: string, updates: Partial<Omit<Habit, 'id'>>) => {
    setStore((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== id),
      completions: prev.completions.filter((c) => c.habitId !== id),
    }));
  }, []);

  const reorderHabits = useCallback((ids: string[]) => {
    setStore((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        const idx = ids.indexOf(h.id);
        return idx >= 0 ? { ...h, sortOrder: idx } : h;
      }).sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }, []);

  // --- Completions ---

  const CYCLE: Array<CompletionStatus | 'clear'> = ['checked', 'half', 'failed', 'clear'];

  const toggleCompletion = useCallback((habitId: string, weekKey: string, day: number) => {
    setStore((prev) => {
      const existing = prev.completions.find(
        (c) => c.habitId === habitId && c.weekKey === weekKey && c.day === day,
      );
      const currentStatus: CompletionStatus | 'clear' = existing?.status ?? 'clear';
      const nextStatus = CYCLE[(CYCLE.indexOf(currentStatus) + 1) % CYCLE.length];

      if (nextStatus === 'clear') {
        return { ...prev, completions: prev.completions.filter((c) => c !== existing) };
      }

      if (existing) {
        return {
          ...prev,
          completions: prev.completions.map((c) =>
            c === existing ? { ...c, status: nextStatus } : c,
          ),
        };
      }

      const completion: Completion = {
        habitId,
        weekKey,
        day,
        completedAt: new Date().toISOString(),
        status: nextStatus,
      };
      return { ...prev, completions: [...prev.completions, completion] };
    });
  }, []);

  const getCompletionsForWeek = useCallback(
    (weekKey: string) => store.completions.filter((c) => c.weekKey === weekKey),
    [store.completions],
  );

  const getCompletionStatus = useCallback(
    (habitId: string, weekKey: string, day: number): CompletionStatus | 'clear' =>
      store.completions.find(
        (c) => c.habitId === habitId && c.weekKey === weekKey && c.day === day,
      )?.status ?? 'clear',
    [store.completions],
  );

  const isCompleted = useCallback(
    (habitId: string, weekKey: string, day: number) =>
      store.completions.some(
        (c) => c.habitId === habitId && c.weekKey === weekKey && c.day === day,
      ),
    [store.completions],
  );

  // --- Points ---

  const getPointsForCompletion = useCallback(
    (habitId: string, weekKey: string, day: number): PointsBreakdown => {
      const habit = store.habits.find((h) => h.id === habitId);
      if (!habit) return { base: 0, streakBonus: 0, total: 0, streakLength: 0, multiplier: 1 };
      return activeStrategy.calculate(habit, store.completions, day, weekKey);
    },
    [store.habits, store.completions, activeStrategy],
  );

  const totalPointsEarned = useMemo(() => {
    return store.completions.reduce((sum, c) => {
      const habit = store.habits.find((h) => h.id === c.habitId);
      if (!habit) return sum;
      const breakdown = activeStrategy.calculate(habit, store.completions, c.day, c.weekKey);
      return sum + breakdown.total;
    }, 0);
  }, [store.completions, store.habits, activeStrategy]);

  const totalPointsSpent = useMemo(
    () => store.redemptions.reduce((sum, r) => sum + r.cost, 0),
    [store.redemptions],
  );

  const pointsBalance = totalPointsEarned - totalPointsSpent;

  // --- Rewards CRUD ---

  const addReward = useCallback((r: Omit<Reward, 'id' | 'createdAt'>) => {
    const reward: Reward = { ...r, id: generateId(), createdAt: new Date().toISOString() };
    setStore((prev) => ({ ...prev, rewards: [...prev.rewards, reward] }));
    return reward;
  }, []);

  const updateReward = useCallback((id: string, updates: Partial<Omit<Reward, 'id'>>) => {
    setStore((prev) => ({
      ...prev,
      rewards: prev.rewards.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    }));
  }, []);

  const deleteReward = useCallback((id: string) => {
    setStore((prev) => ({ ...prev, rewards: prev.rewards.filter((r) => r.id !== id) }));
  }, []);

  // --- Redemptions ---

  const redeemReward = useCallback(
    (rewardId: string): boolean => {
      const reward = store.rewards.find((r) => r.id === rewardId);
      if (!reward || pointsBalance < reward.cost) return false;
      const redemption: Redemption = {
        id: generateId(),
        rewardId,
        rewardName: reward.name,
        cost: reward.cost,
        redeemedAt: new Date().toISOString(),
      };
      setStore((prev) => ({ ...prev, redemptions: [...prev.redemptions, redemption] }));
      return true;
    },
    [store.rewards, pointsBalance],
  );

  // --- Strategy ---

  const setStrategy = useCallback((id: string) => {
    setStore((prev) => ({ ...prev, activeStrategyId: id }));
  }, []);

  // --- Reset ---

  const resetAll = useCallback(() => {
    setStore(makeDefaultStore());
  }, []);

  return {
    store,
    habits: store.habits.filter((h) => !h.archived),
    allHabits: store.habits,
    addHabit,
    updateHabit,
    deleteHabit,
    reorderHabits,
    toggleCompletion,
    getCompletionsForWeek,
    getCompletionStatus,
    isCompleted,
    getPointsForCompletion,
    totalPointsEarned,
    totalPointsSpent,
    pointsBalance,
    rewards: store.rewards,
    addReward,
    updateReward,
    deleteReward,
    redeemReward,
    redemptions: store.redemptions,
    activeStrategy,
    setStrategy,
    resetAll,
  };
}
