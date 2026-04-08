import type { HabitStore } from '@/habits/types';

const STORAGE_KEY = 'habit-tracker-v1';

export function loadHabitStore(): HabitStore | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as HabitStore;
  } catch {
    return null;
  }
}

export function saveHabitStore(store: HabitStore): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    console.error('Failed to save habit store to localStorage');
  }
}

export function clearHabitStore(): void {
  localStorage.removeItem(STORAGE_KEY);
}
