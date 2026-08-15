import React, { useEffect, useState } from 'react';
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
import { ChefHat } from 'lucide-react';

const TITLE = 'Kitchen Foods';
const TAGLINE = 'Excellence Loading';
const SUBTITLE = 'Preparing your feast';

const PARTICLES = [
  { top: '16%', left: '20%', size: 5, delay: 0 },
  { top: '22%', left: '78%', size: 4, delay: 1.4 },
  { top: '68%', left: '14%', size: 3, delay: 0.8 },
  { top: '74%', left: '80%', size: 6, delay: 2 },
  { top: '38%', left: '90%', size: 4, delay: 0.4 },
  { top: '56%', left: '6%', size: 5, delay: 1.1 },
  { top: '84%', left: '45%', size: 3, delay: 1.7 },
  { top: '10%', left: '52%', size: 3, delay: 2.3 },
];

export const SplashScreen: React.FC = () => {
  const progress = useMotionValue(0);
  const barWidth = useTransform(progress, (v) => `${v}%`);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: 2.4,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [progress]);

  useMotionValueEvent(progress, 'change', (v) => {
    setPercent(Math.round(v));
  });

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
      role="status"
      aria-label="Loading Kitchen Foods"
      className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* --- Ambient background --- */}
      <div className="absolute -top-44 -left-44 h-[36rem] w-[36rem] rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="absolute -bottom-52 -right-40 h-[32rem] w-[32rem] rounded-full bg-amber-600/10 blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.45) 100%)' }}
      />

      {/* --- Floating particles --- */}
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-amber-300/70"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
          animate={{ y: [0, -18, 0], opacity: [0.1, 0.55, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        />
      ))}

      {/* --- Content --- */}
      <div className="relative flex flex-col items-center px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-12"
        >
          {/* soft breathing glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.8, 0.45] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-8 rounded-full bg-brand-primary/30 blur-2xl"
          />

          {/* slow counter-rotating dashed ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-10 rounded-full border border-dashed border-white/10"
          />

          {/* orbiting arc + comet */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-6"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0deg, rgba(242,125,38,0.9) 28deg, transparent 70deg)',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))',
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.9, 0.4, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.9)]"
            />
          </motion.div>

          {/* badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="relative w-24 h-24 bg-gradient-to-br from-brand-primary via-brand-primary to-amber-500 rounded-3xl flex items-center justify-center text-white shadow-[0_20px_60px_-15px_rgba(242,125,38,0.6)]"
          >
            <ChefHat size={46} strokeWidth={1.75} />
          </motion.div>
        </motion.div>

        {/* Title — letter by letter */}
        <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight">
          {TITLE.split('').map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 26, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.35 + i * 0.055, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block ${i < 7 ? 'text-stone-100' : 'text-brand-primary text-glow'}`}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h1>

        {/* amber flourish */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 h-px w-20 bg-gradient-to-r from-transparent via-brand-primary to-transparent"
        />

        {/* tagline + animated dots */}
        <div className="mt-5 flex items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-stone-400">{TAGLINE}</p>
          <div className="flex items-end gap-1 pb-0.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                className="h-1 w-1 rounded-full bg-brand-primary"
              />
            ))}
          </div>
        </div>

        {/* progress bar + percentage */}
        <div className="mt-12 w-72">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500">{SUBTITLE}</p>
            <p className="font-mono text-xs text-amber-300 tabular-nums">{percent}%</p>
          </div>
          <div className="relative h-[3px] overflow-hidden rounded-full bg-white/10">
            <motion.div
              style={{ width: barWidth }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-primary via-amber-400 to-amber-200"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
