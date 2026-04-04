import { useState, useEffect } from 'react';
import { Share2, RotateCcw, Plus, Shuffle, UtensilsCrossed } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import { CATEGORIES } from '@/data/categories';
import { CategorySection } from '@/components/CategorySection';
import { ItemFormDialog } from '@/components/ItemFormDialog';
import { SpinDialog } from '@/components/SpinDialog';
import { ShareDialog } from '@/components/ShareDialog';
import { ResetDialog } from '@/components/ResetDialog';
import { Button } from '@/components/ui/button';
import type { Category, MenuItem } from '@/types';
import { decodeMenuFromUrl, clearShareFromUrl } from '@/lib/share';

export default function App() {
  const { menu, addItem, updateItem, deleteItem, getItemsByCategory, resetToDefaults, importMenu } = useMenu();

  // Dialogs
  const [itemFormOpen, setItemFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [addingToCategory, setAddingToCategory] = useState<Category>('entree');
  const [spinOpen, setSpinOpen] = useState(false);
  const [spinCategory, setSpinCategory] = useState<Category | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [newItemId, setNewItemId] = useState<string | null>(null);

  // Shared menu from URL
  const [sharedMenu, setSharedMenu] = useState(() => decodeMenuFromUrl());

  useEffect(() => {
    if (sharedMenu) {
      setShareOpen(true);
      clearShareFromUrl();
    }
  }, []);

  const handleAddItem = (category: Category) => {
    setEditingItem(null);
    setAddingToCategory(category);
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

  const handleSpin = (category: Category) => {
    setSpinCategory(category);
    setSpinOpen(true);
  };

  const handleSpinRandom = () => {
    const nonEmpty = CATEGORIES.filter((c) => getItemsByCategory(c.id).length > 0);
    if (nonEmpty.length === 0) return;
    const cat = nonEmpty[Math.floor(Math.random() * nonEmpty.length)];
    setSpinCategory(cat.id);
    setSpinOpen(true);
  };

  const totalItems = menu.items.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <UtensilsCrossed className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-none">Dopamine Menu</h1>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">{totalItems} items</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-muted-foreground"
              onClick={handleSpinRandom}
              title="Spin a random category"
            >
              <Shuffle className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Random</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-xs text-muted-foreground"
              onClick={() => setShareOpen(true)}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => handleAddItem('entree')}
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add item</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Hero tagline */}
        <div className="text-center py-2 pb-4">
          <p className="text-sm text-muted-foreground">
            Your personal feel-good activity menu.{' '}
            <span className="text-foreground/70">Pick something, do the thing.</span>
          </p>
        </div>

        {/* Category sections */}
        {CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.id}
            meta={cat}
            items={getItemsByCategory(cat.id)}
            onAddItem={handleAddItem}
            onEditItem={handleEditItem}
            onDeleteItem={deleteItem}
            onSpin={handleSpin}
            newItemId={newItemId}
          />
        ))}

        {/* Footer actions */}
        <div className="flex justify-center pt-4 pb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground gap-1.5 h-8"
            onClick={() => setResetOpen(true)}
          >
            <RotateCcw className="h-3 w-3" />
            Reset to defaults
          </Button>
        </div>
      </main>

      {/* Dialogs */}
      <ItemFormDialog
        open={itemFormOpen}
        onOpenChange={setItemFormOpen}
        initialItem={editingItem}
        defaultCategory={addingToCategory}
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
