// ---------------------------------------------------------------------------
// CategoryPills
// ---------------------------------------------------------------------------
// Pill-style category tabs with per-category icons, accent colors and live
// item counts. Clicking a pill selects that category in the menu section.
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';
import type { FoodCategory, FoodItem } from '../../types';
import { getCategoryStyle } from '../../constants/categoryStyles';

interface CategoryPillsProps {
  categories: FoodCategory[];
  selectedCategoryId: string | null;
  /** Search-filtered items grouped by category — used for the counts. */
  itemsByCategory: ReadonlyMap<string, FoodItem[]>;
  onSelect: (categoryId: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategoryId,
  itemsByCategory,
  onSelect,
}) => (
  <div className="flex flex-wrap justify-center gap-2.5 mb-4">
    {categories.map((cat) => {
      const style = getCategoryStyle(cat.name);
      const Icon = style.icon;
      const isActive = selectedCategoryId === cat.id;
      const itemCount = itemsByCategory.get(cat.id)?.length ?? 0;

      return (
        <motion.button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
          style={{
            background: isActive ? `${style.accent}18` : '#ffffff',
            color: isActive ? style.accent : '#57534e',
            border: isActive ? `1.5px solid ${style.accent}60` : '1.5px solid #e7e5e4',
            boxShadow: isActive ? `0 2px 16px ${style.accent}20` : '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <Icon size={15} />
          <span>{cat.name}</span>
          {itemCount > 0 && (
            <span
              className="ml-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                background: isActive ? `${style.accent}25` : '#f5f5f4',
                color: isActive ? style.accent : '#a8a29e',
              }}
            >
              {itemCount}
            </span>
          )}
          {isActive && (
            <motion.span
              layoutId="pill-active-bg"
              className="absolute inset-0 rounded-full -z-10"
              style={{ background: `${style.accent}10` }}
            />
          )}
        </motion.button>
      );
    })}
  </div>
);
