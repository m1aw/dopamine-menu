import type { Category, CategoryMeta } from '../types';

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'salad',
    label: 'Salads',
    emoji: '🥗',
    description: 'Low-dopamine but nourishing — good for you, every time',
    color: 'text-emerald-400',
    accentColor: 'bg-emerald-400',
    borderColor: 'border-emerald-500/40',
    glowColor: 'rgba(52, 211, 153, 0.3)',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    id: 'side',
    label: 'Sides',
    emoji: '🍟',
    description: 'Light feel-good add-ons — best paired with something else',
    color: 'text-yellow-400',
    accentColor: 'bg-yellow-400',
    borderColor: 'border-yellow-500/40',
    glowColor: 'rgba(250, 204, 21, 0.3)',
    badgeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  },
  {
    id: 'entree',
    label: 'Entrees',
    emoji: '🍽️',
    description: 'Reliable go-tos — satisfying, sustainable dopamine',
    color: 'text-orange-400',
    accentColor: 'bg-orange-400',
    borderColor: 'border-orange-500/40',
    glowColor: 'rgba(251, 146, 60, 0.3)',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  },
  {
    id: 'dessert',
    label: 'Desserts',
    emoji: '🍰',
    description: 'High-dopamine indulgences — enjoy mindfully',
    color: 'text-pink-400',
    accentColor: 'bg-pink-400',
    borderColor: 'border-pink-500/40',
    glowColor: 'rgba(244, 114, 182, 0.3)',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  },
  {
    id: 'special',
    label: 'Specials',
    emoji: '⭐',
    description: 'Occasional treats — worth the planning and effort',
    color: 'text-violet-400',
    accentColor: 'bg-violet-400',
    borderColor: 'border-violet-500/40',
    glowColor: 'rgba(167, 139, 250, 0.3)',
    badgeClass: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  },
];

export const getCategoryMeta = (id: Category): CategoryMeta => {
  return CATEGORIES.find((c) => c.id === id)!;
};
