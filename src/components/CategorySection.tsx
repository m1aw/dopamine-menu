import type { MenuItem } from '@/types';
import { MenuItemCard } from '@/components/MenuItemCard';

interface CategorySectionProps {
  items: MenuItem[];
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
  newItemId?: string | null;
}

export function CategorySection({
  items,
  onEditItem,
  onDeleteItem,
  newItemId,
}: CategorySectionProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p className="text-sm">No items yet.</p>
        <p className="text-xs mt-1">Tap <strong>+ Add</strong> to add something here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          onEdit={() => onEditItem(item)}
          onDelete={() => onDeleteItem(item.id)}
          isNew={item.id === newItemId}
        />
      ))}
    </div>
  );
}
