import type { PointsStrategy, Habit, Completion } from '@/habits/types';
import { getAdjacentWeekKey } from '@/habits/lib/weeks';

/**
 * Count consecutive days of completion for a habit, going backwards from
 * the given day/week. Looks across week boundaries.
 */
function computeConsecutiveDays(
  completions: Completion[],
  habitId: string,
  day: number,
  weekKey: string,
): number {
  const habitCompletions = new Set(
    completions
      .filter((c) => c.habitId === habitId && (c.status ?? 'checked') === 'checked')
      .map((c) => `${c.weekKey}:${c.day}`),
  );

  let streak = 0;
  let currentWeek = weekKey;
  let currentDay = day;

  while (true) {
    if (!habitCompletions.has(`${currentWeek}:${currentDay}`)) break;
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

    if (status === 'half') {
      const halfPoints = Math.round(habit.basePoints * 0.5);
      return { base: halfPoints, streakBonus: 0, total: halfPoints, streakLength: 0, multiplier: 0.5 };
    }

    const streak = computeConsecutiveDays(completions, habit.id, day, weekKey);
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
