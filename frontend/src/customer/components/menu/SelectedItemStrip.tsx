// ---------------------------------------------------------------------------
// SelectedItemStrip
// ---------------------------------------------------------------------------
// Cinematic "selected item" header: the food photo is shown full-bleed and
// blurred behind a dark scrim, with the item's details in front. Below it
// sits the order customization form (RequestForm).
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';
import type { FoodCategory, FoodItem, Request } from '../../types';
import { getCategoryStyle } from '../../constants/categoryStyles';
import { formatPrice } from '../../utils/format';
import { RequestForm } from '../request/RequestForm';

interface SelectedItemStripProps {
  item: FoodItem;
  category: FoodCategory;
  onCancel: () => void;
  onSubmit: (data: Partial<Request>) => void;
}

export const SelectedItemStrip: React.FC<SelectedItemStripProps> = ({
  item,
  category,
  onCancel,
  onSubmit,
}) => {
  const style = getCategoryStyle(category.name);
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto mt-10"
    >
      {/* Cinematic selected item strip */}
      <div className="relative rounded-[28px] overflow-hidden mb-8 shadow-xl shadow-stone-900/10">
        {/* Background food image, blurred */}
        <img
          src={item.imageUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-stone-900/60" />

        {/* Foreground content */}
        <div className="relative z-10 flex gap-5 items-center p-6">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-24 w-24 md:h-28 md:w-28 rounded-2xl object-cover flex-shrink-0 border-2 border-white/20 shadow-2xl"
          />
          <div className="flex-1 min-w-0">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ background: `${style.accent}90` }}
            >
              <Icon size={10} /> {category.name}
            </div>
            <h4 className="text-xl md:text-2xl font-serif font-bold text-white leading-tight truncate">
              {item.name}
            </h4>
            <p className="text-white/60 text-sm mt-1 line-clamp-1">{item.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-white">{formatPrice(item.price)}</div>
            <div className="text-white/50 text-xs font-mono uppercase tracking-wider mt-0.5">per serving</div>
          </div>
        </div>
      </div>

      <RequestForm category={category.name} onCancel={onCancel} onSubmit={onSubmit} />
    </motion.div>
  );
};
