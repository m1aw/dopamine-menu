import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { MenuItem } from '@/types';
import { Button } from '@/components/ui/button';
import { getCategoryMeta } from '@/data/categories';
import { cn } from '@/lib/utils';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: () => void;
  onDelete: () => void;
  isNew?: boolean;
}

export function MenuItemCard({ item, onEdit, onDelete, isNew }: MenuItemCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const categoryMeta = getCategoryMeta(item.category);

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
        `grid rounded-xl cursor-pointer transition-all duration-200 border ${categoryMeta.borderColor}`,
        categoryMeta.bgColor,
        showActions ? 'brightness-110' : 'hover:brightness-125',
        isNew && 'animate-slide-up'
      )}
      onClick={() => setShowActions((v) => !v)}
    >
      {/* Row 1: content */}
      <div className="px-4 py-3">
        <div className="text-sm font-medium text-foreground leading-snug">{item.name}</div>
        {item.description && (
          <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.description}</div>
        )}
      </div>

      {/* Row 2: actions — only shown after clicking */}
      {showActions && (
        <div
          className={cn(`flex items-center gap-1 px-3 py-2 border-t ${categoryMeta.borderColor}`)}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            onClick={onEdit}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-7 gap-1.5 text-xs transition-colors',
              confirmDelete
                ? 'text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20'
                : 'text-muted-foreground hover:text-red-400'
            )}
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            {confirmDelete ? 'Confirm' : 'Delete'}
          </Button>
        </div>
      )}
    </div>
  );
}
