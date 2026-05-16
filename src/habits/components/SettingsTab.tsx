import { useState } from 'react';
import { HabitList } from './HabitList';
import { HabitFormDialog } from './HabitFormDialog';
import { BackupActions } from '@/components/BackupActions';
import type { Habit } from '@/habits/types';

interface SettingsTabProps {
  habits: Habit[];
  onAddHabit: (h: Omit<Habit, 'id' | 'createdAt' | 'archived' | 'sortOrder'>) => void;
  onUpdateHabit: (id: string, updates: Partial<Omit<Habit, 'id'>>) => void;
  onDeleteHabit: (id: string) => void;
  onDownload: () => void;
  onUpload: () => void;
  onReset: () => void;
}

export function SettingsTab({
  habits,
  onAddHabit,
  onUpdateHabit,
  onDeleteHabit,
  onDownload,
  onUpload,
  onReset,
}: SettingsTabProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

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

  return (
    <div className="space-y-6">
      <HabitList
        habits={habits}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={onDeleteHabit}
      />

      <BackupActions
        onDownload={onDownload}
        onUpload={onUpload}
        onReset={onReset}
        resetLabel="Reset all data"
      />

      <HabitFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialHabit={editingHabit}
        onSave={handleSave}
      />
    </div>
  );
}
