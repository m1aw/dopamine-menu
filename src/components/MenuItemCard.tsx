import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  accentColor: string;
  onEdit: () => void;
  onDelete: () => void;
  isNew?: boolean;
}

export function MenuItemCard({ item, accentColor, onEdit, onDelete, isNew }: MenuItemCardProps) {
  const [showActions, setShowActions] = useState(false);
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
    <div
      className={cn(
        'group relative flex items-start gap-3 px-4 py-3 rounded-xl border border-transparent hover:border-border hover:bg-muted/40 transition-all duration-200 cursor-default',
        isNew && 'animate-slide-up'
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setConfirmDelete(false); }}
    >
      {/* Accent dot */}
      <div className={cn('mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0', accentColor)} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground leading-snug">{item.name}</div>
        {item.description && (
          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</div>
        )}
      </div>

      {/* Action buttons — visible on hover (desktop) or always on mobile */}
      <div
        className={cn(
          'flex items-center gap-1 flex-shrink-0 transition-opacity duration-150',
          showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
        // On mobile, always show actions via touch
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onEdit}
          aria-label="Edit item"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-7 w-7 transition-colors',
            confirmDelete
              ? 'text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20'
              : 'text-muted-foreground hover:text-red-400'
          )}
          onClick={handleDelete}
          aria-label={confirmDelete ? 'Confirm delete' : 'Delete item'}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Mobile: tap to show/hide actions */}
      <button
        className="absolute inset-0 sm:hidden"
        style={{ zIndex: showActions ? -1 : 0 }}
        onClick={() => setShowActions((v) => !v)}
        aria-label="Show actions"
      />
    </div>
  );
}
