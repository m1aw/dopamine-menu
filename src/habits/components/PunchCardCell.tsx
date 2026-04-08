import { cn } from '@/lib/utils';
import type { PointsBreakdown } from '@/habits/types';

const COLOR_MAP: Record<string, { bg: string }> = {
  emerald: { bg: 'bg-emerald-500' },
  sky:     { bg: 'bg-sky-500' },
  violet:  { bg: 'bg-violet-500' },
  amber:   { bg: 'bg-amber-500' },
  rose:    { bg: 'bg-rose-500' },
  pink:    { bg: 'bg-pink-500' },
  orange:  { bg: 'bg-orange-500' },
  teal:    { bg: 'bg-teal-500' },
};

interface PunchCardCellProps {
  completed: boolean;
  color: string;
  isToday: boolean;
  readOnly: boolean;
  breakdown: PointsBreakdown;
  onToggle: () => void;
}

export function PunchCardCell({ completed, color, isToday, readOnly, breakdown, onToggle }: PunchCardCellProps) {
  const { bg } = COLOR_MAP[color] ?? COLOR_MAP.emerald;
  const hasBonus = breakdown.streakBonus > 0;

  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={onToggle}
      className={cn(
        'w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-0 transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isToday && !completed && 'ring-2 ring-primary/40',
        completed ? cn(bg, 'text-white shadow-sm') : 'bg-muted/50 hover:bg-muted',
        readOnly && 'opacity-60 cursor-default',
      )}
    >
      {completed ? (
        <>
          <svg className="w-[40%] h-[40%]" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={cn('text-[9px] leading-none font-semibold tabular-nums', hasBonus && 'text-orange-200')}>
            {breakdown.total}{hasBonus ? '🔥' : ''}
          </span>
        </>
      ) : (
        <span className={cn(
          'text-[9px] leading-none tabular-nums',
          hasBonus ? 'text-amber-400/80 font-semibold' : 'text-muted-foreground/50',
        )}>
          +{breakdown.total}{hasBonus ? '🔥' : ''}
        </span>
      )}
    </button>
  );
}
