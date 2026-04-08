import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWeekLabel, getCurrentWeekKey } from '@/habits/lib/weeks';

interface WeekNavigatorProps {
  weekKey: string;
  onPrev: () => void;
  onNext: () => void;
}

export function WeekNavigator({ weekKey, onPrev, onNext }: WeekNavigatorProps) {
  const isCurrentWeek = weekKey === getCurrentWeekKey();

  return (
    <div className="flex items-center justify-center gap-2 mb-3">
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrev}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium text-foreground min-w-[8rem] text-center">
        {getWeekLabel(weekKey)}
        {isCurrentWeek && (
          <span className="text-xs text-muted-foreground ml-1">(this week)</span>
        )}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={onNext}
        disabled={isCurrentWeek}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
