import type { Menu } from '../types';

const STORAGE_KEY = 'dopamine-menu-v1';

export function loadMenu(): Menu | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Menu;
  } catch {
    return null;
  }
}

export function saveMenu(menu: Menu): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menu));
  } catch {
    console.error('Failed to save menu to localStorage');
  }
}

export function clearMenu(): void {
  localStorage.removeItem(STORAGE_KEY);
}
