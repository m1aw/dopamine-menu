import { useState, useEffect } from 'react';
import { Share2, RotateCcw, Plus, Shuffle, MoreHorizontal } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import { CATEGORIES } from '@/data/categories';
import { CategorySection } from '@/components/CategorySection';
import { ItemFormDialog } from '@/components/ItemFormDialog';
import { SpinDialog } from '@/components/SpinDialog';
import { ShareDialog } from '@/components/ShareDialog';
import { ResetDialog } from '@/components/ResetDialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Category, MenuItem, Menu } from '@/types';
import { decodeMenuFromUrl, clearShareFromUrl } from '@/lib/share';
import { cn } from '@/lib/utils';

export default function App() {
  const { menu, addItem, updateItem, deleteItem, getItemsByCategory, resetToDefaults, importMenu } = useMenu();

  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [spinOpen, setSpinOpen] = useState(false);
  const [spinCategory, setSpinCategory] = useState<Category | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [newItemId, setNewItemId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>(CATEGORIES[0].id);

  const [sharedMenu, setSharedMenu] = useState<Menu | null>(null);

  useEffect(() => {
    const shared = decodeMenuFromUrl();
    if (shared) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSharedMenu(shared);
      setShareOpen(true);
      clearShareFromUrl();
    }
  }, []);

  const handleAddItem = () => {
    setEditingItem(null);
    setItemFormOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemFormOpen(true);
  };

  const handleSaveItem = (itemData: Omit<MenuItem, 'id'>) => {
    if (editingItem) {
      updateItem(editingItem.id, itemData);
    } else {
      const newItem = addItem(itemData);
      setNewItemId(newItem.id);
      setTimeout(() => setNewItemId(null), 1000);
    }
  };

  const handleSpin = () => {
    setSpinCategory(activeCategory);
    setSpinOpen(true);
  };

  const activeMeta = CATEGORIES.find((c) => c.id === activeCategory)!;
  const activeItems = getItemsByCategory(activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Tabs
        value={activeCategory}
        onValueChange={(v) => setActiveCategory(v as Category)}
      >
        {/* Scrollable content — padded so it clears the fixed bottom bar */}
        <main className="max-w-2xl mx-auto px-4 pt-6 pb-36">
          {CATEGORIES.map((cat) => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0 focus-visible:ring-0">
              {/* Category header */}
              <div className="mb-4">
                <h2 className={cn('text-lg font-bold', cat.color)}>
                  {cat.emoji} {cat.label}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
              </div>

              <CategorySection
                items={getItemsByCategory(cat.id)}
                onEditItem={handleEditItem}
                onDeleteItem={deleteItem}
                newItemId={newItemId}
              />
            </TabsContent>
          ))}
        </main>

        {/* Fixed bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border">
          <div className="max-w-2xl mx-auto px-3">

            {/* Action row */}
            <div className="flex items-center gap-2 pt-2 pb-1">
              <Button
                size="sm"
                className={cn('flex-1 h-9 gap-1.5 text-sm')}
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4" />
                Add to {activeMeta.label}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-sm"
                disabled={activeItems.length === 0}
                onClick={handleSpin}
              >
                <Shuffle className="h-4 w-4" />
                Spin
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => setShareOpen(true)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share menu
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/habits.html">
                      <span>Habit tracker</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-400 focus:text-red-300"
                    onClick={() => setResetOpen(true)}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to defaults
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tab strip */}
            <TabsList className="w-full h-auto p-1 gap-2 bg-transparent rounded-none mb-safe">
              {CATEGORIES.map((cat) => {
                const count = getItemsByCategory(cat.id).length;
                const isActive = activeCategory === cat.id;
                return (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id}
                    className={cn(
                      `flex-1 flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg text-xs font-medium transition-all ring-offset-0 ${cat.ringColor} data-[state=active]:${cat.bgColor}`,
                      isActive ? `ring-2 ${cat.bgColor}` : `ring-1 text-muted-foreground`
                    )}
                  >
                    <span className="text-lg leading-none">{cat.emoji}</span>
                    <span className="leading-none text-[10px]">{cat.label}</span>
                    <span className={cn(
                      'text-[10px] leading-none font-semibold tabular-nums',
                      isActive ? cat.color : 'text-muted-foreground/50'
                    )}>
                      {count}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

          </div>
        </div>
      </Tabs>

      {/* Dialogs */}
      <ItemFormDialog
        open={itemFormOpen}
        onOpenChange={setItemFormOpen}
        initialItem={editingItem}
        defaultCategory={activeCategory}
        onSave={handleSaveItem}
      />

      <SpinDialog
        open={spinOpen}
        onOpenChange={setSpinOpen}
        category={spinCategory}
        items={spinCategory ? getItemsByCategory(spinCategory) : []}
      />

      <ShareDialog
        open={shareOpen}
        onOpenChange={(v) => {
          setShareOpen(v);
          if (!v) setSharedMenu(null);
        }}
        menu={menu}
        sharedMenu={sharedMenu}
        onImportShared={() => sharedMenu && importMenu(sharedMenu)}
      />

      <ResetDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        onConfirm={resetToDefaults}
      />
    </div>
  );
}
