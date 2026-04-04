import { useState, useEffect, useCallback } from 'react';
import type { Menu, MenuItem, Category } from '@/types';
import { loadMenu, saveMenu, clearMenu } from '@/lib/storage';
import { DEFAULT_ITEMS } from '@/data/defaults';
import { generateId } from '@/lib/utils';

function makeDefaultMenu(): Menu {
  return {
    items: DEFAULT_ITEMS,
    createdAt: new Date().toISOString(),
  };
}

export function useMenu() {
  const [menu, setMenu] = useState<Menu>(() => {
    return loadMenu() ?? makeDefaultMenu();
  });

  useEffect(() => {
    saveMenu(menu);
  }, [menu]);

  const addItem = useCallback((item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = { ...item, id: generateId() };
    setMenu((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    return newItem;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<Omit<MenuItem, 'id'>>) => {
    setMenu((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setMenu((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  }, []);

  const getItemsByCategory = useCallback(
    (category: Category) => menu.items.filter((item) => item.category === category),
    [menu.items]
  );

  const resetToDefaults = useCallback(() => {
    const defaultMenu = makeDefaultMenu();
    setMenu(defaultMenu);
  }, []);

  const importMenu = useCallback((imported: Menu) => {
    clearMenu();
    setMenu({ ...imported, createdAt: new Date().toISOString() });
  }, []);

  const replaceMenu = useCallback((newMenu: Menu) => {
    setMenu(newMenu);
  }, []);

  return {
    menu,
    addItem,
    updateItem,
    deleteItem,
    getItemsByCategory,
    resetToDefaults,
    importMenu,
    replaceMenu,
  };
}
