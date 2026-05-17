import type { PointsStrategy, Habit, Completion, CompletionStatus } from '@/habits/types';
import { getAdjacentWeekKey } from '@/habits/lib/weeks';

/**
 * Statuses that keep a streak alive without necessarily earning points.
 * 'checked' earns full points; 'skipped' marks the day as N/A (streak
 * preserved but 0 points — e.g. a rest day for a gym habit).
 */
const STREAK_PRESERVING: ReadonlySet<CompletionStatus> = new Set(['checked', 'skipped']);

function computeStreakLength(
  completions: Completion[],
  habitId: string,
  day: number,
  weekKey: string,
): number {
  const streakDays = new Set(
    completions
      .filter((c) => c.habitId === habitId && STREAK_PRESERVING.has(c.status ?? 'checked'))
      .map((c) => `${c.weekKey}:${c.day}`),
  );

  let streak = 0;
  let currentWeek = weekKey;
  let currentDay = day;

  while (streakDays.has(`${currentWeek}:${currentDay}`)) {
    streak++;
    currentDay--;
    if (currentDay < 0) {
      currentDay = 6;
      currentWeek = getAdjacentWeekKey(currentWeek, -1);
    }
  }

  return streak;
}

export const streakBonusStrategy: PointsStrategy = {
  id: 'streak-bonus',
  name: 'Streak Bonus',
  calculate(habit: Habit, completions: Completion[], day: number, weekKey: string) {
    const thisCompletion = completions.find(
      (c) => c.habitId === habit.id && c.weekKey === weekKey && c.day === day,
    );
    const status = thisCompletion?.status ?? 'checked';

    if (status === 'failed') {
      return { base: 0, streakBonus: 0, total: 0, streakLength: 0, multiplier: 0 };
    }

    // Skipped days preserve the streak but award no points (N/A day).
    if (status === 'skipped') {
      return { base: 0, streakBonus: 0, total: 0, streakLength: 0, multiplier: 0 };
    }

    if (status === 'half') {
      const halfPoints = Math.round(habit.basePoints * 0.5);
      return { base: halfPoints, streakBonus: 0, total: halfPoints, streakLength: 0, multiplier: 0.5 };
    }

    const streak = computeStreakLength(completions, habit.id, day, weekKey);
    const multiplier = 1 + Math.floor(streak / 2) * 0.25;
    const base = habit.basePoints;
    const streakBonus = Math.round(base * (multiplier - 1));
    return {
      base,
      streakBonus,
      total: base + streakBonus,
      streakLength: streak,
      multiplier,
    };
  },
};
