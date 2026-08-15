// ---------------------------------------------------------------------------
// FoodItemCard
// ---------------------------------------------------------------------------
// A single portrait food card: photo, gradient scrim, "Top Pick" badge,
// price, name, rating and prep time. Clicking it opens the order form.
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';
import { Clock, ShoppingBag, Star } from 'lucide-react';
import type { FoodItem } from '../../types';
import type { CategoryStyle } from '../../constants/categoryStyles';
import { formatPrice } from '../../utils/format';

interface FoodItemCardProps {
  item: FoodItem;
  style: CategoryStyle;
  /** Position in the grid — controls stagger delay + "Top Pick" badge. */
  index: number;
  onClick: (item: FoodItem) => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({ item, style, index, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.06, duration: 0.4 }}
    whileHover={{ y: -6 }}
    onClick={() => onClick(item)}
    className="group cursor-pointer"
  >
    {/* Photo */}
    <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden mb-3 shadow-md shadow-stone-900/10">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      {/* Gradient scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-transparent to-transparent" />

      {/* Badge */}
      {index < 2 && (
        <div
          className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider"
          style={{ background: style.accent }}
        >
          Top Pick
        </div>
      )}

      {/* Bottom: price */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="text-white font-bold text-base">{formatPrice(item.price)}</span>
        <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ShoppingBag size={14} style={{ color: style.accent }} />
        </span>
      </div>
    </div>

    {/* Info below photo */}
    <div className="px-1">
      <h5 className="font-serif font-bold text-stone-900 text-sm leading-snug mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">
        {item.name}
      </h5>
      <div className="flex items-center gap-3 text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
        <span className="flex items-center gap-1" style={{ color: style.accent }}>
          <Star size={10} className="fill-current" /> {item.rating || '4.8'}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={10} /> {item.prepTime || '25 min'}
        </span>
      </div>
    </div>
  </motion.div>
);
