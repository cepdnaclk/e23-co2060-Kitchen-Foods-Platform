// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------
// "Today's top picks" — an auto-scrolling, seamless carousel of the 6
// highest-rated food items. Live data comes from GET /food with the mock
// list (data/mockFoodItems.ts) as an offline fallback.
//
// Seamless-loop trick: the card array is rendered TWICE in a row and the
// whole strip is translated from 0% to -50% on an infinite linear loop —
// because both halves are identical, the wrap-around is invisible.
// ---------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChefHat, Clock, Heart, Star } from 'lucide-react';
import { API_BASE_URL } from '../../shared/api';
import { mockFoodItems } from '../data/mockFoodItems';
import type { FoodItem } from '../types';

/** Decorative labels cycling per card position in the strip. */
const RATING_LABELS: Record<number, string> = {
  0: '🔥 Most Ordered',
  1: '⭐ Top Rated',
  2: '❤️ Fan Favourite',
  3: '🌿 Healthy Pick',
  4: '🚀 New & Buzzing',
  5: "💎 Chef's Special",
};

export const Recommendations: React.FC = () => {
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<FoodItem[]>(mockFoodItems);

  // Load real food items from the backend; keep the mock list offline.
  useEffect(() => {
    let active = true;

    fetch(`${API_BASE_URL}/food`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load food items');
        return res.json();
      })
      .then((data: FoodItem[]) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      })
      .catch(() => {
        // Silently keep the mock fallback.
      });

    return () => {
      active = false;
    };
  }, []);

  // Sort by rating descending and take the top 6.
  const recommended = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="py-20 overflow-hidden" style={{ background: '#fdf8f3' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-3 block">
              Curated for you
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Today's top picks
            </h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm font-bold text-stone-900/50 hover:text-brand-primary transition-colors group">
            View all
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Cards row — infinite auto scroll */}
        <div className="relative w-full overflow-hidden pb-8 pt-4">
          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 40,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {/* Render the array twice to create the seamless loop */}
            {[...recommended, ...recommended].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="flex-shrink-0 w-64 md:w-72 group cursor-pointer relative"
              >
                {/* Card shell */}
                <div className="relative h-80 rounded-[32px] overflow-hidden shadow-xl shadow-stone-900/10 border-[6px] border-white group-hover:-translate-y-2 transition-transform duration-500">
                  {/* Background image */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Full-bleed gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent pointer-events-none" />

                  {/* Top row: label + heart */}
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-5 z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-stone-900 px-3 py-1.5 rounded-full shadow-sm">
                      {RATING_LABELS[idx % 6] ?? ''}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(item.id);
                      }}
                      className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-sm ${
                        liked.has(item.id)
                          ? 'bg-rose-500 text-white scale-110 shadow-rose-500/30'
                          : 'bg-white/25 text-white hover:bg-white/40 border border-white/20'
                      }`}
                    >
                      <Heart size={18} className={liked.has(item.id) ? 'fill-current' : ''} />
                    </button>
                  </div>

                  {/* Bottom info block */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10 pointer-events-none">
                    {/* Chef badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center shadow-md">
                        <ChefHat size={12} className="text-white" />
                      </div>
                      <span className="text-white/80 text-[10px] font-bold font-mono uppercase tracking-widest drop-shadow-md">
                        Home Chef
                      </span>
                    </div>

                    {/* Name */}
                    <h4 className="text-white font-serif font-bold text-lg leading-tight mb-4 line-clamp-2 drop-shadow-md">
                      {item.name}
                    </h4>

                    {/* Stats row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 bg-stone-900/40 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
                          <Star size={12} className="text-brand-primary fill-current" />
                          <span className="text-white text-xs font-bold">{item.rating || '4.8'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium bg-stone-900/40 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
                          <Clock size={12} />
                          <span>{item.prepTime || '25 min'}</span>
                        </div>
                      </div>

                      {/* Price pill */}
                      <span className="px-3.5 py-1.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-xl shadow-brand-primary/40 border border-brand-primary/50">
                        LKR {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Fade edges to blend into the background */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-48 bg-gradient-to-r from-[#fdf8f3] to-transparent pointer-events-none z-20" />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-48 bg-gradient-to-l from-[#fdf8f3] to-transparent pointer-events-none z-20" />
        </div>

        {/* Mobile view-all */}
        <div className="mt-8 flex justify-center md:hidden">
          <button className="flex items-center gap-2 px-6 py-3 border border-stone-900/10 rounded-full text-sm font-bold text-stone-700 hover:border-brand-primary hover:text-brand-primary transition-all">
            View all picks <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};
