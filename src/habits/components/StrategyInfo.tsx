import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PointsStrategy, Habit, Completion } from '@/habits/types';
import { getCurrentWeekKey, getAdjacentWeekKey } from '@/habits/lib/weeks';

interface StrategyInfoProps {
  strategy: PointsStrategy;
  exampleHabit?: Habit;
}

export function StrategyInfo({ strategy, exampleHabit }: StrategyInfoProps) {
  const [open, setOpen] = useState(false);
  const tiers = useMemo(() => {
    // Default example habit if not provided
    const habit: Habit = exampleHabit ?? {
      id: 'example',
      name: 'Example',
      emoji: '📝',
      basePoints: 10,
      color: 'emerald',
      archived: false,
      createdAt: new Date().toISOString(),
      sortOrder: 0,
    };

    const currentWeek = getCurrentWeekKey();
    const results = [];

    // Simulate different streak lengths
    const streakDays = [0, 2, 4, 6, 8];

    for (const days of streakDays) {
      // Build completions to create a streak of `days` length going backwards from day 0
      const completions: Completion[] = [];
      let week = currentWeek;
      let day = 0;

      for (let i = 0; i < days; i++) {
        completions.push({
          habitId: habit.id,
          weekKey: week,
          day,
          completedAt: new Date().toISOString(),
          status: 'checked',
        });
        day--;
        if (day < 0) {
          day = 6;
          week = getAdjacentWeekKey(week, -1);
        }
      }

      // Calculate the points for a hypothetical completion today
      const breakdown = strategy.calculate(habit, completions, 0, currentWeek);
      results.push({
        streak: days,
        breakdown,
      });
    }

    return results;
  }, [strategy, exampleHabit]);

  return (
    <div className="text-xs text-muted-foreground space-y-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
      >
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        <span className="font-semibold">{strategy.name}</span>
      </button>
      {open && (
        <div className="space-y-0.5 pl-2 border-l border-border/50">
          {tiers.map((tier) => (
            <div key={tier.streak}>
              <span>
                {tier.streak === 0 ? 'Day 1' : `Day ${tier.streak + 1}+ (${tier.streak}-day streak)`}:
                <span className="font-semibold ml-1">{tier.breakdown.total} pts</span>
                {tier.breakdown.streakBonus > 0 && (
                  <span className="text-amber-400/70 ml-1">
                    +{tier.breakdown.streakBonus} bonus 🔥
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
