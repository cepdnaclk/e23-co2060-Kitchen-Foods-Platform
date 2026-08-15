// ---------------------------------------------------------------------------
// Category visual styling
// ---------------------------------------------------------------------------
// Each food category gets its own icon, gradient and accent color so the
// menu section feels cohesive. Looked up by *lower-cased* category name so
// "Rice & Curry" and "rice & curry" both resolve.
// ---------------------------------------------------------------------------

import { CheckSquare, Coffee, IceCream, Leaf, Soup, Utensils } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/** Visual identity for a food category: icon, gradient, accent color. */
export interface CategoryStyle {
  icon: LucideIcon;
  gradient: string;
  accent: string;
}

/** Fallback used for any category without a custom entry. */
export const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  icon: Utensils,
  gradient: 'from-stone-400 to-stone-600',
  accent: '#78716c',
};

/** Per-category styling, keyed by lower-cased category name. */
export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'rice & curry': { icon: Soup, gradient: 'from-orange-400 to-red-500', accent: '#ea580c' },
  'short eats': { icon: CheckSquare, gradient: 'from-yellow-400 to-orange-400', accent: '#d97706' },
  salads: { icon: Leaf, gradient: 'from-green-400 to-emerald-600', accent: '#16a34a' },
  desserts: { icon: IceCream, gradient: 'from-pink-400 to-rose-600', accent: '#e11d48' },
  beverages: { icon: Coffee, gradient: 'from-sky-400 to-blue-600', accent: '#2563eb' },
  other: { icon: Utensils, gradient: 'from-violet-400 to-purple-600', accent: '#7c3aed' },
};

/** Look up the style for a category name, falling back to the default. */
export function getCategoryStyle(name?: string): CategoryStyle {
  return CATEGORY_STYLES[name?.toLowerCase() ?? ''] ?? DEFAULT_CATEGORY_STYLE;
}
