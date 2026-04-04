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
import type { MenuItem, Category } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { cn } from '@/lib/utils';

interface ItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialItem?: MenuItem | null;
  defaultCategory?: Category;
  onSave: (item: Omit<MenuItem, 'id'>) => void;
}

export function ItemFormDialog({
  open,
  onOpenChange,
  initialItem,
  defaultCategory = 'entree',
  onSave,
}: ItemFormDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>(defaultCategory);

  useEffect(() => {
    if (open) {
      setName(initialItem?.name ?? '');
      setDescription(initialItem?.description ?? '');
      setCategory(initialItem?.category ?? defaultCategory);
    }
  }, [open, initialItem, defaultCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      category,
    });
    onOpenChange(false);
  };

  const isEditing = !!initialItem;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit item' : 'Add to menu'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update this menu item.' : 'Add a new feel-good activity to your menu.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Activity name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Go for a walk"
              autoFocus
              maxLength={80}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              Description{' '}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short note about why or how..."
              rows={2}
              maxLength={140}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Category</label>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all',
                    category === cat.id
                      ? `border-current ${cat.color} bg-muted`
                      : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <span className="text-lg leading-none">{cat.emoji}</span>
                  <div>
                    <div className="text-sm font-medium leading-none">{cat.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{cat.description}</div>
                  </div>
                  {category === cat.id && (
                    <div className={cn('ml-auto w-2 h-2 rounded-full', cat.accentColor)} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={!name.trim()}>
              {isEditing ? 'Save changes' : 'Add to menu'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
