// ---------------------------------------------------------------------------
// HeroContent
// ---------------------------------------------------------------------------
// Left column of the hero: eyebrow badge, headline, tagline, call-to-action
// buttons and trust badges. The "Order Now" button smooth-scrolls to the
// #menu section, navigating home first if needed.
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, MapPin, ShieldCheck, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const TRUST_BADGES = [
  { icon: <ShieldCheck size={14} />, label: 'Verified Chefs' },
  { icon: <MapPin size={14} />, label: 'Hyper-Local' },
  { icon: <Star size={14} />, label: '4.9 Avg Rating' },
];

export const HeroContent: React.FC = () => {
  const navigate = useNavigate();

  const scrollToMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.querySelector('#menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#menu');
    }
  };

  return (
    <div>
      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
        <span className="text-brand-primary text-xs font-bold uppercase tracking-[0.2em] font-mono">
          Sri Lanka's Home Kitchen Network
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-5xl md:text-7xl font-serif font-bold leading-[1.1] text-stone-900 mb-6"
      >
        Real food,
        <br />
        real kitchens,
        <br />
        <span className="italic text-brand-primary">real people.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-lg text-stone-600 mb-10 max-w-md leading-relaxed"
      >
        Skip the restaurant. Order authentic, home-cooked Sri Lankan meals directly from verified local
        chefs within 10 km of you.
      </motion.p>

      {/* CTA row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-wrap items-center gap-5 mb-12"
      >
        <button
          onClick={scrollToMenu}
          className="group px-8 py-4 bg-stone-900 text-white rounded-full font-bold text-base flex items-center gap-3 hover:bg-brand-primary transition-colors duration-300 shadow-2xl shadow-stone-900/20"
        >
          Order Now
          <span className="w-8 h-8 rounded-full bg-brand-primary group-hover:bg-white group-hover:text-stone-900 flex items-center justify-center transition-colors duration-300">
            <ArrowRight size={16} className="-rotate-45" />
          </span>
        </button>
        <Link
          to="/impact"
          className="text-sm font-bold text-stone-900/60 hover:text-brand-primary transition-colors flex items-center gap-2"
        >
          Meet our chefs <ChevronRight size={16} />
        </Link>
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="flex flex-wrap gap-3"
      >
        {TRUST_BADGES.map((b, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 border border-stone-900/8 text-xs font-semibold text-stone-600 shadow-sm"
          >
            <span className="text-brand-primary">{b.icon}</span>
            {b.label}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
