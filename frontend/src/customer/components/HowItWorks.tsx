// ---------------------------------------------------------------------------
// HowItWorks
// ---------------------------------------------------------------------------
// "The Self-Pickup Journey" — four static steps (Discover → Customize →
// Secure Pay → Pick Up) presented as a responsive card grid with scroll-
// reveal animations.
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, ShoppingBag, Utensils } from 'lucide-react';

const STEPS = [
  {
    icon: <Utensils size={32} />,
    title: 'Discover',
    desc: 'Browse verified local chefs in your neighborhood.',
    color: 'bg-stone-900/5 text-brand-primary',
  },
  {
    icon: <Heart size={32} />,
    title: 'Customize',
    desc: 'Choose spice levels and portions just for you.',
    color: 'bg-stone-900/5 text-brand-primary',
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Secure Pay',
    desc: 'Fast checkout with military-grade encryption.',
    color: 'bg-stone-900/5 text-brand-primary',
  },
  {
    icon: <ShoppingBag size={32} />,
    title: 'Pick Up',
    desc: 'Grab your meal fresh from a kitchen within 10km.',
    color: 'bg-stone-900/5 text-brand-primary',
  },
];

export const HowItWorks: React.FC = () => (
  <section id="how-it-works" className="py-32 bg-brand-cream/50 border-y border-stone-900/5">
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      <div className="text-center mb-20">
        <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
          The Process
        </span>
        <h2 className="text-5xl font-serif font-bold text-stone-900 mb-6">The Self-Pickup Journey</h2>
        <p className="text-stone-500 max-w-2xl mx-auto">
          Simple, secure, and community-driven. We've streamlined every step to ensure you get the best
          home-cooked experience.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-10">
        {STEPS.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="relative p-10 glass rounded-[40px] text-center group hover:border-brand-primary/30 transition-colors"
          >
            <div
              className={`w-20 h-20 ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform`}
            >
              {step.icon}
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 mb-4">{step.title}</h3>
            <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
