import type { Habit, Completion, PointsBreakdown } from '@/habits/types';
import type { PointsStrategy } from '@/habits/types';

interface WeekPointsSummaryProps {
  habits: Habit[];
  completions: Completion[];
  weekKey: string;
  strategy: PointsStrategy;
}

export function WeekPointsSummary({ habits, completions, weekKey, strategy }: WeekPointsSummaryProps) {
  const weekCompletions = completions.filter((c) => c.weekKey === weekKey);

  let totalBase = 0;
  let totalBonus = 0;

  for (const c of weekCompletions) {
    const habit = habits.find((h) => h.id === c.habitId);
    if (!habit) continue;
    const breakdown: PointsBreakdown = strategy.calculate(habit, completions, c.day, c.weekKey);
    totalBase += breakdown.base;
    totalBonus += breakdown.streakBonus;
  }

  const total = totalBase + totalBonus;

  if (weekCompletions.length === 0) {
    return (
      <div className="text-center text-xs text-muted-foreground mt-3">
        No completions this week
      </div>
    );
  }

  return (
    <div className="text-center mt-3">
      <span className="text-sm font-semibold text-foreground tabular-nums">{total} pts</span>
      {totalBonus > 0 && (
        <span className="text-xs text-emerald-400 ml-1">(+{totalBonus} streak bonus)</span>
      )}
      <span className="text-xs text-muted-foreground ml-1">
        this week
      </span>
    </div>
  );
}
