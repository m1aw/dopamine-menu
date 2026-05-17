import type { PointsStrategy, Habit, Completion, CompletionStatus } from '@/habits/types';
import { getAdjacentWeekKey } from '@/habits/lib/weeks';

/**
 * Statuses that are transparent to the streak walk.
 * They don't increment the streak count, but they don't break it either —
 * the walk continues past them to find the next checked or stopping day.
 * 'skipped' = N/A day (e.g. rest day); 'half' = partial effort.
 */
const STREAK_TRANSPARENT: ReadonlySet<CompletionStatus> = new Set(['skipped', 'half']);

/**
 * Count the number of 'checked' days in the unbroken run ending at day/weekKey.
 * 'skipped' and 'half' days are transparent: they don't add to the count but
 * don't reset it either. 'failed' or a missing record (clear) terminates the walk.
 */
function computeStreakLength(
  completions: Completion[],
  habitId: string,
  day: number,
  weekKey: string,
): number {
  const completionMap = new Map(
    completions
      .filter((c) => c.habitId === habitId)
      .map((c) => [`${c.weekKey}:${c.day}`, c.status ?? 'checked']),
  );

  let streak = 0;
  let currentWeek = weekKey;
  let currentDay = day;

  while (true) {
    const status = completionMap.get(`${currentWeek}:${currentDay}`);

    if (status === undefined || status === 'failed') break;

    if (status === 'checked') streak++;
    else if (!STREAK_TRANSPARENT.has(status)) break; // defensive: unknown status stops the walk

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

    // Skipped: N/A day — streak is preserved for the next checked day, but 0 points.
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
