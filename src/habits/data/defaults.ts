import { generateId } from '@/lib/utils';
import type { Habit, Reward, HabitStore } from '@/habits/types';

const DEFAULT_HABITS: Omit<Habit, 'id' | 'createdAt' | 'sortOrder'>[] = [
  { name: 'Exercise', emoji: '🏃', basePoints: 10, color: 'emerald', archived: false, description: '30 min of movement' },
  { name: 'Read', emoji: '📖', basePoints: 5, color: 'sky', archived: false, description: '20 pages or 15 min' },
  { name: 'Meditate', emoji: '🧘', basePoints: 5, color: 'violet', archived: false, description: '10 min mindfulness' },
  { name: 'Journal', emoji: '✍️', basePoints: 5, color: 'amber', archived: false, description: 'Write a few thoughts' },
];

const DEFAULT_REWARDS: Omit<Reward, 'id' | 'createdAt'>[] = [
  { name: '1hr Gaming', emoji: '🎮', cost: 50, description: 'Guilt-free gaming session' },
  { name: 'Treat Meal', emoji: '🍕', cost: 80, description: 'Order something nice' },
  { name: 'Movie Night', emoji: '🎬', cost: 30, description: 'Watch whatever you want' },
];

export function makeDefaultStore(): HabitStore {
  const now = new Date().toISOString();
  return {
    habits: DEFAULT_HABITS.map((h, i) => ({
      ...h,
      id: generateId(),
      createdAt: now,
      sortOrder: i,
    })),
    completions: [],
    rewards: DEFAULT_REWARDS.map((r) => ({
      ...r,
      id: generateId(),
      createdAt: now,
    })),
    redemptions: [],
    activeStrategyId: 'streak-bonus',
    version: 1,
  };
}
