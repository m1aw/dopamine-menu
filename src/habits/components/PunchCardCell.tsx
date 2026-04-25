import { cn } from '@/lib/utils';
import type { CompletionStatus, PointsBreakdown } from '@/habits/types';

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
  status: CompletionStatus | 'clear';
  color: string;
  isToday: boolean;
  readOnly: boolean;
  breakdown: PointsBreakdown;
  onToggle: () => void;
}

function CheckIcon() {
  return (
    <svg className="w-[40%] h-[40%]" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HalfIcon() {
  return (
    <svg className="w-[40%] h-[40%]" viewBox="0 0 16 16" fill="none">
      <path d="M4 8H12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function FailIcon() {
  return (
    <svg className="w-[40%] h-[40%]" viewBox="0 0 16 16" fill="none">
      <path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function PunchCardCell({ status, color, isToday, readOnly, breakdown, onToggle }: PunchCardCellProps) {
  const { bg } = COLOR_MAP[color] ?? COLOR_MAP.emerald;
  const hasBonus = breakdown.streakBonus > 0;

  const bgClass = {
    clear:   cn('bg-muted/50 hover:bg-muted', isToday && 'ring-2 ring-primary/40'),
    checked: cn(bg, 'text-white shadow-sm'),
    half:    'bg-yellow-400 text-white shadow-sm',
    failed:  'bg-red-500 text-white shadow-sm',
  }[status];

  return (
    <button
      type="button"
      disabled={readOnly}
      onClick={onToggle}
      className={cn(
        'w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-0 transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        bgClass,
        readOnly && 'opacity-60 cursor-default',
      )}
    >
      {status === 'clear' && (
        <span className={cn(
          'text-[9px] leading-none tabular-nums',
          hasBonus ? 'text-amber-400/80 font-semibold' : 'text-muted-foreground/50',
        )}>
          +{breakdown.total}{hasBonus ? '🔥' : ''}
        </span>
      )}
      {status === 'checked' && (
        <>
          <CheckIcon />
          <span className={cn('text-[9px] leading-none font-semibold tabular-nums', hasBonus && 'text-orange-200')}>
            {breakdown.total}{hasBonus ? '🔥' : ''}
          </span>
        </>
      )}
      {status === 'half' && (
        <>
          <HalfIcon />
          <span className="text-[9px] leading-none font-semibold tabular-nums">
            {breakdown.total}
          </span>
        </>
      )}
      {status === 'failed' && (
        <FailIcon />
      )}
    </button>
  );
}
