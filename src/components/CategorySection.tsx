import { useState } from 'react';
import { Plus, Shuffle } from 'lucide-react';
import type { Category, MenuItem } from '../types';
import type { CategoryMeta } from '../types';
import { Button } from './ui/button';
import { MenuItemCard } from './MenuItemCard';
import { cn } from '../lib/utils';

interface CategorySectionProps {
  meta: CategoryMeta;
  items: MenuItem[];
  onAddItem: (category: Category) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  onSpin: (category: Category) => void;
  newItemId?: string | null;
}

export function CategorySection({
  meta,
  items,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onSpin,
  newItemId,
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section
      className={cn(
        'rounded-2xl border overflow-hidden transition-all duration-300',
        meta.borderColor,
        'bg-card'
      )}
      style={{ '--glow-color': meta.glowColor } as React.CSSProperties}
    >
      {/* Category Header */}
      <div
        className="flex items-center gap-3 px-4 py-4 cursor-pointer select-none"
        onClick={() => setIsExpanded((v) => !v)}
      >
        <span className="text-2xl leading-none">{meta.emoji}</span>
        <div className="flex-1 min-w-0">
          <h2 className={cn('text-base font-bold leading-none', meta.color)}>{meta.label}</h2>
          <p className="text-xs text-muted-foreground mt-1 leading-snug hidden sm:block">
            {meta.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', meta.badgeClass)}>
            {items.length}
          </span>
          <svg
            className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', !isExpanded && '-rotate-90')}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px mx-4" style={{ background: meta.glowColor.replace('0.3', '0.15') }} />

      {/* Items list */}
      {isExpanded && (
        <div className="px-2 py-2">
          {items.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">No items yet.</p>
              <p className="text-xs mt-1">Add something to this section!</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  accentColor={meta.accentColor}
                  onEdit={() => onEditItem(item)}
                  onDelete={() => onDeleteItem(item.id)}
                  isNew={item.id === newItemId}
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 mt-3 px-2 pb-1">
            <Button
              variant="ghost"
              size="sm"
              className={cn('flex-1 text-xs gap-1.5 h-8', meta.color, 'hover:bg-muted')}
              onClick={() => onAddItem(meta.id)}
            >
              <Plus className="h-3.5 w-3.5" />
              Add item
            </Button>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => onSpin(meta.id)}
              >
                <Shuffle className="h-3.5 w-3.5" />
                Spin
              </Button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
