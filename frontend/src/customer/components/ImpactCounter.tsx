// ---------------------------------------------------------------------------
// ImpactCounter
// ---------------------------------------------------------------------------
// Homepage "Our Impact" section: three animated counters that count up from
// zero when the section renders. Receives its numbers via the `stats` prop
// (loaded by the useStats hook in App) and renders nothing without them.
// ---------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import type { Stats } from '../types';

interface CounterProps {
  value: number;
  label: string;
  suffix?: string;
}

/** A single number that animates from 0 to `value` over ~2 seconds. */
const Counter: React.FC<CounterProps> = ({ value, label, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // ~60fps count-up: step by `value / duration` each 16ms frame.
    let current = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-5xl md:text-6xl font-serif font-bold text-brand-primary mb-2">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-stone-500 font-medium uppercase tracking-wider text-xs">{label}</div>
    </div>
  );
};

export const ImpactCounter: React.FC<{ stats: Stats | null }> = ({ stats }) => {
  if (!stats) return null; // no data (backend down / still loading) → hide section

  return (
    <section className="py-24 bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-3 block">
            Our Impact
          </span>
          <h2 className="text-4xl font-serif font-bold text-stone-900">Growing every day</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <Counter value={stats.active_chefs} label="Active Chefs" />
          <Counter value={stats.meals_served} label="Healthy Meals Served" />
          <Counter value={stats.income_generated} label="Families Supported" suffix="+" />
        </div>
      </div>
    </section>
  );
};
