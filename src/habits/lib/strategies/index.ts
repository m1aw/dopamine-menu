import type { PointsStrategy } from '@/habits/types';
import { streakBonusStrategy } from './streak-bonus';

const strategies: Record<string, PointsStrategy> = {
  'streak-bonus': streakBonusStrategy,
};

export function getStrategy(id: string): PointsStrategy {
  return strategies[id] ?? streakBonusStrategy;
}

export function getAllStrategies(): PointsStrategy[] {
  return Object.values(strategies);
}
