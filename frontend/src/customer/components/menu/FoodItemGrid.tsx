// ---------------------------------------------------------------------------
// FoodItemGrid
// ---------------------------------------------------------------------------
// Grid of food cards for the selected category, including the category
// header row, a loading skeleton, and error / empty states. The parent
// (MenuCustomization) only renders it while a category is selected.
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';
import { Utensils } from 'lucide-react';
import type { FoodCategory, FoodItem } from '../../types';
import { getCategoryStyle } from '../../constants/categoryStyles';
import { FoodItemCard } from './FoodItemCard';

interface FoodItemGridProps {
  category?: FoodCategory;
  /** Items to show — already filtered by the search query in the parent. */
  items: FoodItem[];
  loading: boolean;
  error: string | null;
  onSelectItem: (item: FoodItem) => void;
  onClose: () => void;
}

export const FoodItemGrid: React.FC<FoodItemGridProps> = ({
  category,
  items,
  loading,
  error,
  onSelectItem,
  onClose,
}) => {
  const style = getCategoryStyle(category?.name);
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
      className="mb-16"
    >
      {/* Inline category header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${style.gradient}`}
          >
            <Icon size={18} />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-stone-900 leading-none">{category?.name}</h3>
            <p className="text-xs text-stone-400 mt-0.5">{category?.description} — tap to order</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-all text-sm"
        >
          ✕
        </button>
      </div>

      {/* Items: loading skeleton → error → empty → grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-[20px] bg-stone-200 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-500 font-medium">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <Utensils size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No items in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <FoodItemCard key={item.id} item={item} style={style} index={idx} onClick={onSelectItem} />
          ))}
        </div>
      )}
    </motion.div>
  );
};
