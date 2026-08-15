import React, { useEffect, useRef, useState } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'orange' | 'emerald' | 'blue' | 'amber';
}

const colorMap: Record<StatsCardProps['color'], { icon: string; glow: string; bar: string }> = {
  orange: {
    icon: 'bg-brand-primary/10 text-brand-primary border-brand-primary/25',
    glow: 'bg-brand-primary/10',
    bar: 'from-brand-primary to-amber-500',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25',
    glow: 'bg-emerald-500/10',
    bar: 'from-emerald-500 to-teal-400',
  },
  blue: {
    icon: 'bg-blue-500/10 text-blue-600 border-blue-500/25',
    glow: 'bg-blue-500/10',
    bar: 'from-blue-500 to-sky-400',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-600 border-amber-500/25',
    glow: 'bg-amber-500/10',
    bar: 'from-amber-500 to-yellow-400',
  },
};

/** Smoothly animates a number toward its target whenever it changes. */
function useAnimatedNumber(target: number, duration = 800): number {
  const [display, setDisplay] = useState(target);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      fromRef.current = target;
    };
  }, [target, duration]);

  return display;
}

export const StatsCard = ({ label, value, prefix = '', suffix = '', icon: Icon, trend, color }: StatsCardProps) => {
  const c = colorMap[color];
  const animated = useAnimatedNumber(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative p-6 rounded-2xl chef-card overflow-hidden group"
    >
      {/* Decorative glow */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${c.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      <div className={`absolute bottom-0 left-6 right-6 h-[2px] bg-gradient-to-r ${c.bar} opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-full`} />

      <div className="relative flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl border ${c.icon} glow-badge-${color}`}>
          <Icon size={20} className="stroke-[2]" />
        </div>
        {trend && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${
            trend.isPositive
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600'
              : 'bg-rose-500/10 border-rose-500/25 text-rose-600'
          }`}>
            {trend.isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      <div className="relative">
        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em] mb-1.5">{label}</p>
        <h3 className="text-2xl font-display font-bold text-stone-900 tracking-tight tabular-nums">
          {prefix}{animated.toLocaleString()}{suffix}
        </h3>
      </div>
    </motion.div>
  );
};
