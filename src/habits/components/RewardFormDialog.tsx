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
import { cn } from '@/lib/utils';
import type { Reward } from '@/habits/types';

const EMOJI_SUGGESTIONS = ['🎮', '🍕', '🎬', '🛋️', '🍦', '☕', '🎧', '🛍️', '🏖️', '📱'];

interface RewardFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialReward?: Reward | null;
  onSave: (reward: Omit<Reward, 'id' | 'createdAt'>) => void;
}

export function RewardFormDialog({ open, onOpenChange, initialReward, onSave }: RewardFormDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('🎮');
  const [cost, setCost] = useState(50);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(initialReward?.name ?? '');
      setDescription(initialReward?.description ?? '');
      setEmoji(initialReward?.emoji ?? '🎮');
      setCost(initialReward?.cost ?? 50);
    }
  }, [open, initialReward]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || cost <= 0) return;
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      emoji,
      cost,
    });
    onOpenChange(false);
  };

  const isEditing = !!initialReward;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit reward' : 'New reward'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update this reward.' : 'Add a reward you can redeem with points.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. 1hr Gaming"
              autoFocus
              maxLength={40}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's the treat?"
              maxLength={80}
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
            <label className="text-sm font-medium text-foreground">Cost (points)</label>
            <Input
              type="number"
              min={1}
              value={cost}
              onChange={(e) => setCost(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!name.trim() || cost <= 0}>
              {isEditing ? 'Save' : 'Add reward'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
