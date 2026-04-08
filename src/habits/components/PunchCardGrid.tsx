import { Fragment } from 'react';
import { DAY_LABELS } from '@/habits/lib/weeks';
import { PunchCardCell } from './PunchCardCell';
import type { Habit, Completion, PointsStrategy, PointsBreakdown } from '@/habits/types';
import { cn } from '@/lib/utils';

function computeCellBreakdown(
  habit: Habit,
  completions: Completion[],
  weekKey: string,
  day: number,
  strategy: PointsStrategy,
  isAlreadyCompleted: boolean,
): PointsBreakdown {
  if (isAlreadyCompleted) {
    return strategy.calculate(habit, completions, day, weekKey);
  }
  // Hypothetical: what would be earned if this cell were checked now
  const hypothetical: Completion = {
    habitId: habit.id,
    weekKey,
    day,
    completedAt: new Date().toISOString(),
  };
  return strategy.calculate(habit, [...completions, hypothetical], day, weekKey);
}

interface PunchCardGridProps {
  habits: Habit[];
  completions: Completion[];
  weekKey: string;
  todayIndex: number;
  isCurrentWeek: boolean;
  readOnly: boolean;
  strategy: PointsStrategy;
  isCompleted: (habitId: string, weekKey: string, day: number) => boolean;
  onToggle: (habitId: string, weekKey: string, day: number) => void;
}

export function PunchCardGrid({
  habits,
  completions,
  weekKey,
  todayIndex,
  isCurrentWeek,
  readOnly,
  strategy,
  isCompleted,
  onToggle,
}: PunchCardGridProps) {
  if (habits.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
        Add habits in Settings to get started
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto px-2">
      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `2.25rem repeat(${habits.length}, 3rem)`,
        }}
      >
        {/* Header row */}
        <div />
        {habits.map((habit) => (
          <div key={habit.id} className="flex flex-col items-center justify-end h-10 pb-0.5">
            <span className="text-base leading-none">{habit.emoji}</span>
            <span className="text-[9px] text-muted-foreground leading-none mt-0.5 truncate w-full text-center px-0.5">
              {habit.name}
            </span>
          </div>
        ))}

        {/* Day rows */}
        {DAY_LABELS.map((label, i) => (
          <Fragment key={label}>
            <div
              className={cn(
                'flex items-center justify-end text-xs font-medium pr-1',
                isCurrentWeek && i === todayIndex
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground',
              )}
            >
              {label}
            </div>

            {habits.map((habit) => {
              const completed = isCompleted(habit.id, weekKey, i);
              const breakdown = computeCellBreakdown(habit, completions, weekKey, i, strategy, completed);
              return (
                <PunchCardCell
                  key={habit.id}
                  completed={completed}
                  color={habit.color}
                  isToday={isCurrentWeek && i === todayIndex}
                  readOnly={readOnly}
                  breakdown={breakdown}
                  onToggle={() => onToggle(habit.id, weekKey, i)}
                />
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
