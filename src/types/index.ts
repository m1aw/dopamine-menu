export type Category = 'salad' | 'side' | 'entree' | 'dessert' | 'special';

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  category: Category;
};

export type Menu = {
  items: MenuItem[];
  createdAt: string;
};

export type CategoryMeta = {
  id: Category;
  label: string;
  emoji: string;
  description: string;
  color: string;
  accentColor: string;
  borderColor: string;
  ringColor: string;
  bgColor: string;
  glowColor: string;
  badgeClass: string;
};
