// ---------------------------------------------------------------------------
// BrandingPanel
// ---------------------------------------------------------------------------
// Left half of the split-screen login page (desktop only): a light, warm
// brand panel with the wordmark, serif headline, a framed food photo with
// floating stat card + rotating circular badge, and a rating row. Uses the
// same serif / mono / brand-orange language as the rest of the frontend.
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, Flame, Star, Users } from 'lucide-react';

export const BrandingPanel: React.FC = () => (
  <div
    className="hidden lg:flex w-1/2 relative overflow-hidden p-12 xl:p-16 self-stretch"
    style={{ background: 'linear-gradient(165deg, #fdf8f1 0%, #f6efe4 55%, #f2e7d6 100%)' }}
  >
    {/* Ambient blobs */}
    <div
      className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full opacity-25 pointer-events-none"
      style={{ background: 'radial-gradient(circle, #F27D26 0%, transparent 70%)', filter: 'blur(80px)' }}
    />
    <div
      className="absolute -bottom-32 -left-32 w-[460px] h-[460px] rounded-full opacity-20 pointer-events-none"
      style={{ background: 'radial-gradient(circle, #d4521a 0%, transparent 70%)', filter: 'blur(100px)' }}
    />
    {/* Subtle dotted texture */}
    <div
      className="absolute inset-0 opacity-[0.35] pointer-events-none"
      style={{
        backgroundImage: 'radial-gradient(rgba(10,10,10,0.14) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    />

    <div className="relative z-10 w-full max-w-xl flex flex-col justify-between gap-12">
      {/* Brand mark */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-primary to-[#d4521a] flex items-center justify-center shadow-lg shadow-brand-primary/40">
          <ChefHat size={24} className="text-white" />
        </div>
        <span className="text-2xl font-serif font-bold tracking-tight">Kitchen Foods</span>
      </div>

      {/* Headline block */}
      <div>
        <p className="text-brand-primary font-mono text-xs uppercase tracking-[0.35em] mb-5">
          Women-powered home kitchens
        </p>
        <h1 className="text-5xl font-serif font-bold mb-6 leading-[1.12]">
          Turn your passion into your{' '}
          <span className="italic text-brand-primary">profession.</span>
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed font-medium max-w-md">
          Join thousands of women across the country running their own culinary micro-businesses
          right from their home kitchens.
        </p>
      </div>

      {/* Image composition */}
      <div className="relative">
        {/* Framed photo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative h-72 rounded-[40px] overflow-hidden shadow-2xl shadow-stone-900/15 border-[8px] border-white"
        >
          <img
            src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=900"
            alt="Home-cooked rice and curry"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent pointer-events-none" />
          <span className="absolute bottom-5 left-6 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest">
            Fresh from home kitchens
          </span>
        </motion.div>

        {/* Rotating circular badge (text rotates, center icon stays upright) */}
        <div className="absolute -top-12 -right-8 w-28 h-28 z-20">
          <motion.svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            <defs>
              <path id="branding-circle" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
            </defs>
            <text
              className="fill-stone-900 font-mono uppercase"
              style={{ fontSize: '9.5px', letterSpacing: '0.18em' }}
            >
              <textPath href="#branding-circle">home-cooked • women powered •</textPath>
            </text>
          </motion.svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-[#d4521a] flex items-center justify-center shadow-lg shadow-brand-primary/40">
              <Flame size={22} className="text-white" />
            </div>
          </div>
        </div>

        {/* Floating stat card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
          transition={{
            opacity: { delay: 0.4, duration: 0.6 },
            x: { delay: 0.4, duration: 0.6 },
            y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 },
          }}
          className="absolute -bottom-8 -left-6 bg-white/95 backdrop-blur-xl rounded-[28px] shadow-2xl shadow-stone-900/10 px-6 py-5 flex items-center gap-4 border border-white z-20"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Users size={24} />
          </div>
          <div>
            <p className="text-2xl font-black text-stone-900 leading-none tracking-tight">2,400+</p>
            <p className="text-xs text-stone-500 font-bold uppercase tracking-widest mt-1.5">
              Home chefs
            </p>
          </div>
        </motion.div>
      </div>

      {/* Rating row */}
      <div className="flex items-center gap-2 text-stone-500 text-sm font-medium">
        <Star size={16} className="text-brand-primary fill-brand-primary" />
        Rated 4.9/5 by 3,000+ happy customers
      </div>
    </div>
  </div>
);
