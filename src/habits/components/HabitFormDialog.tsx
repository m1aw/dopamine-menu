import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Habit } from '@/habits/types';

const COLORS = [
  { id: 'emerald', label: 'Green', class: 'bg-emerald-500' },
  { id: 'sky', label: 'Blue', class: 'bg-sky-500' },
  { id: 'violet', label: 'Violet', class: 'bg-violet-500' },
  { id: 'amber', label: 'Amber', class: 'bg-amber-500' },
  { id: 'rose', label: 'Rose', class: 'bg-rose-500' },
  { id: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { id: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { id: 'pink', label: 'Pink', class: 'bg-pink-500' },
];

const EMOJI_SUGGESTIONS = ['🏃', '📖', '🧘', '✍️', '💪', '🎯', '🧠', '💧', '🥗', '😴', '🎵', '🧹'];

interface HabitFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialHabit?: Habit | null;
  onSave: (habit: Omit<Habit, 'id' | 'createdAt' | 'archived' | 'sortOrder'>) => void;
}

export function HabitFormDialog({ open, onOpenChange, initialHabit, onSave }: HabitFormDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🎯');
  const [color, setColor] = useState('emerald');
  const [basePoints, setBasePoints] = useState(5);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialHabit?.name ?? '');
      setDescription(initialHabit?.description ?? '');
      setEmoji(initialHabit?.emoji ?? '🎯');
      setColor(initialHabit?.color ?? 'emerald');
      setBasePoints(initialHabit?.basePoints ?? 5);
    }
  }, [open, initialHabit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      emoji,
      color,
      basePoints,
    });
    onOpenChange(false);
  };

  const isEditing = !!initialHabit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit habit' : 'New habit'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update this habit.' : 'Add a new habit to track.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Exercise"
              autoFocus
              maxLength={40}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What counts as done?"
              rows={2}
              maxLength={100}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Emoji</label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_SUGGESTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all',
                    emoji === e ? 'bg-muted ring-2 ring-primary' : 'bg-muted/50 hover:bg-muted',
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Color</label>
            <div className="flex flex-wrap gap-1.5">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-all',
                    c.class,
                    color === c.id ? 'ring-2 ring-offset-2 ring-offset-background ring-primary scale-110' : 'opacity-60 hover:opacity-100',
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Base points</label>
            <div className="flex items-center gap-2">
              {[1, 5, 10, 15, 20].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => setBasePoints(pts)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    basePoints === pts
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:text-foreground',
                  )}
                >
                  {pts}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!name.trim()}>
              {isEditing ? 'Save' : 'Add habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
