import { useState } from 'react';
import { RotateCcw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HabitList } from './HabitList';
import { HabitFormDialog } from './HabitFormDialog';
import type { Habit } from '@/habits/types';

interface SettingsTabProps {
  habits: Habit[];
  onAddHabit: (h: Omit<Habit, 'id' | 'createdAt' | 'archived' | 'sortOrder'>) => void;
  onUpdateHabit: (id: string, updates: Partial<Omit<Habit, 'id'>>) => void;
  onDeleteHabit: (id: string) => void;
  onDownload: () => void;
  onReset: () => void;
}

export function SettingsTab({
  habits,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onDownload,
  onReset,
}: SettingsTabProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleAdd = () => {
    setEditingHabit(null);
    setFormOpen(true);
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setFormOpen(true);
  };

  const handleSave = (data: Omit<Habit, 'id' | 'createdAt' | 'archived' | 'sortOrder'>) => {
    if (editingHabit) {
      onUpdateHabit(editingHabit.id, data);
    } else {
      onAddHabit(data);
    }
  };

  const handleReset = () => {
    if (confirmReset) {
      onReset();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <HabitList
        habits={habits}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={onDeleteHabit}
      />

      <div className="pt-4 border-t border-border flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground"
          onClick={onDownload}
        >
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download backup
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={confirmReset ? 'text-red-400 border-red-400/50' : 'text-muted-foreground'}
          onClick={handleReset}
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          {confirmReset ? 'Tap again to confirm' : 'Reset all data'}
        </Button>
      </div>

      <HabitFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialHabit={editingHabit}
        onSave={handleSave}
      />
    </div>
  );
}
