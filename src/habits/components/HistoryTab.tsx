import { useMemo } from 'react';
import { WeekSummaryCard } from './WeekSummaryCard';
import { getCurrentWeekKey, getAdjacentWeekKey } from '@/habits/lib/weeks';
import type { Habit, Completion, PointsStrategy } from '@/habits/types';

interface HistoryTabProps {
  habits: Habit[];
  completions: Completion[];
  strategy: PointsStrategy;
}

export function HistoryTab({ habits, completions, strategy }: HistoryTabProps) {
  const weekKeys = useMemo(() => {
    // Collect all unique week keys from completions, plus the current and previous week
    const keys = new Set<string>();
    const current = getCurrentWeekKey();
    keys.add(current);
    keys.add(getAdjacentWeekKey(current, -1));
    for (const c of completions) {
      keys.add(c.weekKey);
    }
    // Sort descending (most recent first)
    return Array.from(keys).sort().reverse();
  }, [completions]);

  if (weekKeys.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">No history yet.</div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground mb-3">Weekly History</h3>
      {weekKeys.map((weekKey) => (
        <WeekSummaryCard
          key={weekKey}
          weekKey={weekKey}
          habits={habits}
          completions={completions}
          strategy={strategy}
        />
      ))}
    </div>
  );
}
