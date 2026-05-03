import React from 'react';
import { motion } from 'motion/react';
import { Star, Clock, Heart } from 'lucide-react';
import { mockFoodItems } from '../data/mockFoodItems';

export const Recommendations: React.FC = () => {
  // Sort by rating descending and take top 6
  const recommended = [...mockFoodItems]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">Picked for you</h3>
            <p className="text-sm text-stone-500">Based on popular choices in your area</p>
          </div>
          <button className="text-brand-primary font-bold text-sm hover:underline">View all</button>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar">
          {recommended.map((item, idx) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8 }}
              className="flex-shrink-0 w-72 group cursor-pointer"
            >
              <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden mb-4">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-stone-400 hover:text-brand-primary transition-colors shadow-lg">
                  <Heart size={20} />
                </div>
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full flex items-center gap-1.5 shadow-lg">
                  <Star size={14} className="text-brand-primary fill-current" />
                  <span className="text-xs font-bold text-stone-900">{item.rating}</span>
                </div>
              </div>
              <h4 className="text-lg font-serif font-bold text-stone-900 mb-1 group-hover:text-brand-primary transition-colors truncate">
                {item.name}
              </h4>
              <div className="flex items-center gap-3 text-xs font-bold text-stone-400 uppercase tracking-widest">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{item.prepTime}</span>
                </div>
                <div className="border-l border-stone-200 pl-3">
                  <span>LKR {item.price.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
