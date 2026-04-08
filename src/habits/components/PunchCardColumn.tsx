import { PunchCardCell } from './PunchCardCell';
import type { Habit } from '@/habits/types';

interface PunchCardColumnProps {
  habit: Habit;
  weekKey: string;
  todayIndex: number;
  readOnly: boolean;
  isCompleted: (habitId: string, weekKey: string, day: number) => boolean;
  onToggle: (habitId: string, weekKey: string, day: number) => void;
}

export function PunchCardColumn({
  habit,
  weekKey,
  todayIndex,
  readOnly,
  isCompleted,
  onToggle,
}: PunchCardColumnProps) {
  return (
    <div className="flex-1 min-w-8 max-w-14 flex flex-col items-center gap-1">
      <div className="h-10 w-full flex flex-col items-center justify-center">
        <span className="text-base leading-none">{habit.emoji}</span>
        <span className="text-[9px] text-muted-foreground leading-none mt-0.5 truncate w-full text-center px-0.5">
          {habit.name}
        </span>
      </div>
      {Array.from({ length: 7 }, (_, day) => (
        <PunchCardCell
          key={day}
          completed={isCompleted(habit.id, weekKey, day)}
          color={habit.color}
          isToday={day === todayIndex}
          readOnly={readOnly}
          onToggle={() => onToggle(habit.id, weekKey, day)}
        />
      ))}
    </div>
  );
}
