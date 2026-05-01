export type Habit = {
  id: string;
  name: string;
  description?: string;
  basePoints: number;
  color: string;
  emoji: string;
  archived: boolean;
  createdAt: string;
  sortOrder: number;
};

export type CompletionStatus = 'checked' | 'half' | 'failed';

export type Completion = {
  habitId: string;
  weekKey: string;
  day: number;
  completedAt: string;
  status: CompletionStatus;
};

export type PointsBreakdown = {
  base: number;
  streakBonus: number;
  total: number;
  streakLength: number;
  multiplier: number;
};

export type PointsStrategy = {
  id: string;
  name: string;
  calculate: (
    habit: Habit,
    completions: Completion[],
    day: number,
    weekKey: string,
  ) => PointsBreakdown;
};

export type Reward = {
  id: string;
  name: string;
  description?: string;
  cost: number;
  emoji: string;
  createdAt: string;
};

export type Redemption = {
  id: string;
  rewardId: string;
  rewardName: string;
  cost: number;
  redeemedAt: string;
};

export type HabitStore = {
  habits: Habit[];
  completions: Completion[];
  rewards: Reward[];
  redemptions: Redemption[];
  activeStrategyId: string;
  version: number;
};
