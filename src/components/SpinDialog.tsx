import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import type { Category, MenuItem } from '../types';
import { getCategoryMeta } from '../data/categories';
import { cn } from '../lib/utils';

interface SpinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
  items: MenuItem[];
}

type SpinState = 'idle' | 'spinning' | 'result';

export function SpinDialog({ open, onOpenChange, category, items }: SpinDialogProps) {
  const [spinState, setSpinState] = useState<SpinState>('idle');
  const [displayItems, setDisplayItems] = useState<string[]>([]);
  const [result, setResult] = useState<MenuItem | null>(null);
  const [resultKey, setResultKey] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const meta = category ? getCategoryMeta(category) : null;

  useEffect(() => {
    if (open) {
      setSpinState('idle');
      setResult(null);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [open]);

  const startSpin = () => {
    if (items.length === 0) return;

    setSpinState('spinning');
    setResult(null);

    const names = items.map((i) => i.name);
    let count = 0;
    const totalTicks = 18 + Math.floor(Math.random() * 8);

    // Show cycling items
    intervalRef.current = setInterval(() => {
      const shuffled = [...names].sort(() => Math.random() - 0.5).slice(0, 3);
      setDisplayItems(shuffled);
      count++;

      if (count >= totalTicks) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        timeoutRef.current = setTimeout(() => {
          const winner = items[Math.floor(Math.random() * items.length)];
          setResult(winner);
          setResultKey((k) => k + 1);
          setSpinState('result');
        }, 120);
      }
    }, 80 + count * 3);
  };

  const handleClose = () => {
    onOpenChange(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  if (!meta) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader>
          <DialogTitle className="text-center">
            <span className="text-2xl">{meta.emoji}</span>{' '}
            <span className={meta.color}>Spin {meta.label}</span>
          </DialogTitle>
          <DialogDescription className="text-center">
            {items.length} item{items.length !== 1 ? 's' : ''} in the pool
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Spin display area */}
          <div
            className={cn(
              'relative mx-auto w-full max-w-xs rounded-2xl border-2 overflow-hidden transition-all duration-300',
              spinState === 'spinning' ? meta.borderColor : 'border-border',
              spinState === 'result' && 'glow-pulse'
            )}
            style={spinState === 'result' ? { '--glow-color': meta.glowColor } as React.CSSProperties : undefined}
          >
            {spinState === 'idle' && (
              <div className="h-32 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <span className="text-4xl">{meta.emoji}</span>
                <p className="text-sm">Press spin to get a suggestion</p>
              </div>
            )}

            {spinState === 'spinning' && (
              <div className="h-32 flex flex-col items-center justify-center gap-1 overflow-hidden">
                {displayItems.map((name, i) => (
                  <div
                    key={`${name}-${i}`}
                    className={cn(
                      'text-sm font-medium px-3 py-1 rounded-lg transition-all duration-75',
                      i === 1
                        ? `${meta.color} bg-muted text-base font-bold`
                        : 'text-muted-foreground opacity-50'
                    )}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}

            {spinState === 'result' && result && (
              <div
                key={resultKey}
                className="result-pop h-auto min-h-32 flex flex-col items-center justify-center gap-2 px-4 py-5"
              >
                <span className="text-4xl float-anim">{meta.emoji}</span>
                <div className={cn('text-lg font-bold leading-snug text-center', meta.color)}>
                  {result.name}
                </div>
                {result.description && (
                  <p className="text-xs text-muted-foreground text-center leading-relaxed">
                    {result.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {spinState !== 'spinning' && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              {spinState === 'result' ? 'Done' : 'Cancel'}
            </Button>
          )}
          <Button
            className={cn('flex-1', spinState === 'spinning' && 'w-full')}
            disabled={spinState === 'spinning' || items.length === 0}
            onClick={startSpin}
          >
            {spinState === 'spinning' ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Spinning...
              </span>
            ) : spinState === 'result' ? (
              'Spin again'
            ) : (
              'Spin!'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
