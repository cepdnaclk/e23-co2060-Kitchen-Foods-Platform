import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Zap, Gift, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

const PROMOS = [
  {
    id: 1,
    tag: "Special Offer",
    icon: <Zap size={20} className="fill-current" />,
    title: "Chef of the Month: \nAunty Kamala's Kitchen",
    description: "Experience the authentic taste of Jaffna with Auntie Kamala's signature spice blends. Exclusive 20% discount this week.",
    image: "/src/assets/aunty-kamala.jpg",
    stats: ["4.9 Rating", "120+ Orders"],
    color: "from-brand-primary/20 to-transparent"
  },
  {
    id: 2,
    tag: "Limited Time",
    icon: <Flame size={20} className="fill-current" />,
    title: "Weekend Seafood \nExtravaganza",
    description: "Fresh catch from the Negombo coast delivered to your doorstep. Try our Lagoon Crab Curry at special rates.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    stats: ["Fresh Catch", "Premium Quality"],
    color: "from-blue-500/20 to-transparent"
  },
  {
    id: 3,
    tag: "New Arrival",
    icon: <Gift size={20} className="fill-current" />,
    title: "Traditional Sweets \nGift Boxes",
    description: "Perfect for sharing. Our new curated collection of Watalappam and Kevum is here to sweeten your celebrations.",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80",
    stats: ["Handmade", "Gift Ready"],
    color: "from-pink-500/20 to-transparent"
  }
];

export const PromoBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 12500); 
    return () => clearInterval(timer);
  }, [current]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % PROMOS.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + PROMOS.length) % PROMOS.length);
  };

  return (
    <section className="py-12 bg-brand-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="relative h-[450px] md:h-[400px] group/container">
          <AnimatePresence initial={false}>
            <motion.div 
              key={PROMOS[current].id}
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "-100%" }}
              transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0 bg-stone-900 rounded-[40px] p-10 md:p-16 overflow-hidden flex flex-col md:flex-row items-center gap-12 group cursor-pointer"
            >
              {/* Decorative backgrounds */}
              <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${PROMOS[current].color} rounded-full blur-[100px] -mr-20 -mt-20 group-hover:opacity-80 transition-opacity`}></div>
              
              <div className="flex-1 z-10">
                <div className="flex items-center gap-3 text-brand-primary mb-6">
                  {PROMOS[current].icon}
                  <span className="text-xs font-mono font-bold uppercase tracking-[0.3em]">{PROMOS[current].tag}</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight whitespace-pre-line">
                  {PROMOS[current].title}
                </h3>
                <p className="text-stone-400 text-base md:text-lg mb-8 max-w-lg leading-relaxed line-clamp-3">
                  {PROMOS[current].description}
                </p>
                <div className="flex flex-wrap gap-6">
                  {PROMOS[current].stats.map((stat, i) => (
                    <div key={i} className="flex items-center gap-2 text-white">
                      <Star className="text-brand-primary fill-current" size={16} />
                      <span className="font-bold text-sm">{stat}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative z-10 flex-shrink-0 hidden md:block">
                <div className="relative">
                  <div className="absolute inset-4 bg-brand-primary/20 blur-[60px] rounded-full group-hover:bg-brand-primary/40 transition-colors"></div>
                  <img 
                    src={PROMOS[current].image} 
                    alt="Promo" 
                    className="relative w-64 h-64 md:w-80 md:h-80 rounded-[40px] object-cover shadow-2xl border-4 border-white/10 group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Manual Navigation Buttons */}
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-30 pointer-events-none">
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-brand-primary hover:border-brand-primary transition-all pointer-events-auto opacity-0 group-hover/container:opacity-100 -translate-x-4 group-hover/container:translate-x-0"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-brand-primary hover:border-brand-primary transition-all pointer-events-auto opacity-0 group-hover/container:opacity-100 translate-x-4 group-hover/container:translate-x-0"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Progress Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {PROMOS.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-500 ${i === current ? "w-10 bg-brand-primary" : "w-2 bg-white/20 hover:bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
