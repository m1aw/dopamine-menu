import { useState } from 'react';
import { WeekNavigator } from './WeekNavigator';
import { PunchCardGrid } from './PunchCardGrid';
import { WeekPointsSummary } from './WeekPointsSummary';
import { StrategyInfo } from './StrategyInfo';
import {
  getCurrentWeekKey,
  getAdjacentWeekKey,
  getTodayDayIndex,
  isWeekEditable,
} from '@/habits/lib/weeks';
import type { Habit, Completion, CompletionStatus, PointsStrategy } from '@/habits/types';

interface GridTabProps {
  habits: Habit[];
  completions: Completion[];
  strategy: PointsStrategy;
  getCompletionStatus: (habitId: string, weekKey: string, day: number) => CompletionStatus | 'clear';
  onToggle: (habitId: string, weekKey: string, day: number) => void;
}

export function GridTab({ habits, completions, strategy, getCompletionStatus, onToggle }: GridTabProps) {
  const [weekKey, setWeekKey] = useState(getCurrentWeekKey);

  const currentWeekKey = getCurrentWeekKey();
  const isCurrentWeek = weekKey === currentWeekKey;
  const readOnly = !isWeekEditable(weekKey);

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)]">
      <WeekNavigator
        weekKey={weekKey}
        onPrev={() => setWeekKey((k) => getAdjacentWeekKey(k, -1))}
        onNext={() => setWeekKey((k) => {
          const next = getAdjacentWeekKey(k, 1);
          return next <= currentWeekKey ? next : k;
        })}
      />

      <div className="flex-1 overflow-y-auto min-h-0">
        <PunchCardGrid
          habits={habits}
          completions={completions}
          weekKey={weekKey}
          todayIndex={getTodayDayIndex()}
          isCurrentWeek={isCurrentWeek}
          readOnly={readOnly}
          strategy={strategy}
          getCompletionStatus={getCompletionStatus}
          onToggle={onToggle}
        />
      </div>

      <WeekPointsSummary
        habits={habits}
        completions={completions}
        weekKey={weekKey}
        strategy={strategy}
      />

      <div className="mt-3 pt-2">
        <StrategyInfo strategy={strategy} />
      </div>
    </div>
  );
}
