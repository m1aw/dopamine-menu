import { getWeekLabel, isWeekEditable } from '@/habits/lib/weeks';
import { cn } from '@/lib/utils';
import type { Habit, Completion, PointsStrategy } from '@/habits/types';

interface WeekSummaryCardProps {
  weekKey: string;
  habits: Habit[];
  completions: Completion[];
  strategy: PointsStrategy;
}

export function WeekSummaryCard({ weekKey, habits, completions, strategy }: WeekSummaryCardProps) {
  const weekCompletions = completions.filter((c) => c.weekKey === weekKey);
  const editable = isWeekEditable(weekKey);
  const totalPossible = habits.length * 7;
  const completionCount = weekCompletions.length;
  const completionRate = totalPossible > 0 ? Math.round((completionCount / totalPossible) * 100) : 0;

  let totalPoints = 0;
  for (const c of weekCompletions) {
    const habit = habits.find((h) => h.id === c.habitId);
    if (!habit) continue;
    totalPoints += strategy.calculate(habit, completions, c.day, c.weekKey).total;
  }

  // Per-habit completion count for the mini summary
  const perHabit = habits.map((h) => ({
    emoji: h.emoji,
    name: h.name,
    count: weekCompletions.filter((c) => c.habitId === h.id).length,
  }));

  return (
    <div className={cn(
      'px-3 py-3 rounded-lg border border-border bg-card',
      editable && 'border-primary/20',
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{getWeekLabel(weekKey)}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tabular-nums text-foreground">{totalPoints} pts</span>
          <span className="text-xs text-muted-foreground tabular-nums">{completionRate}%</span>
        </div>
      </div>

      {/* Completion bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${completionRate}%` }}
        />
      </div>

      {/* Per-habit mini summary */}
      <div className="flex flex-wrap gap-2">
        {perHabit.map((h) => (
          <span key={h.name} className="text-xs text-muted-foreground">
            {h.emoji} {h.count}/7
          </span>
        ))}
      </div>
    </div>
  );
}
