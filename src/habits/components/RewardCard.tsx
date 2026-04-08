import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Reward } from '@/habits/types';

interface RewardCardProps {
  reward: Reward;
  canAfford: boolean;
  onRedeem: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function RewardCard({ reward, canAfford, onRedeem, onEdit, onDelete }: RewardCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2500);
    }
  };

  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-lg border border-border bg-card">
      <span className="text-xl">{reward.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{reward.name}</div>
        {reward.description && (
          <div className="text-xs text-muted-foreground truncate">{reward.description}</div>
        )}
      </div>
      <span className="text-xs font-semibold text-muted-foreground tabular-nums shrink-0">
        {reward.cost} pts
      </span>
      <Button
        size="sm"
        className="h-7 text-xs px-2.5"
        disabled={!canAfford}
        onClick={onRedeem}
      >
        Redeem
      </Button>
      <button
        type="button"
        onClick={onEdit}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className={cn(
          'p-1.5 rounded-md transition-colors',
          confirmDelete
            ? 'text-red-400 bg-red-400/10'
            : 'text-muted-foreground hover:text-red-400 hover:bg-muted',
        )}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
