import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Habit } from '@/habits/types';

interface HabitListProps {
  habits: Habit[];
  onAdd: () => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

export function HabitList({ habits, onAdd, onEdit, onDelete }: HabitListProps) {
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirmingDelete === id) {
      onDelete(id);
      setConfirmingDelete(null);
    } else {
      setConfirmingDelete(id);
      setTimeout(() => setConfirmingDelete(null), 2500);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Habits</h3>
        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={onAdd}>
          <Plus className="h-3.5 w-3.5" />
          Add habit
        </Button>
      </div>

      {habits.length === 0 && (
        <p className="text-sm text-muted-foreground">No habits yet. Add one to get started.</p>
      )}

      {habits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card"
        >
          <span className="text-lg">{habit.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{habit.name}</div>
            {habit.description && (
              <div className="text-xs text-muted-foreground truncate">{habit.description}</div>
            )}
          </div>
          <span className="text-xs text-muted-foreground tabular-nums shrink-0">{habit.basePoints} pts</span>
          <button
            type="button"
            onClick={() => onEdit(habit)}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDelete(habit.id)}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              confirmingDelete === habit.id
                ? 'text-red-400 bg-red-400/10'
                : 'text-muted-foreground hover:text-red-400 hover:bg-muted',
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
