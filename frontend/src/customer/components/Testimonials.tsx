// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
// "What Our Community Says" — a small static list of reviews beside a
// heading + CTA. Data is hardcoded for now (no testimonials API yet).
// ---------------------------------------------------------------------------

import React from 'react';
import { motion } from 'motion/react';

const REVIEWS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Food Critic',
    text: "The best home-cooked meal I've had in years. Truly authentic and full of love.",
    avatar: 'https://i.pravatar.cc/150?u=sarah',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Local Resident',
    text: 'Convenient, healthy, and supports local talent. A game changer for my weekly dinners.',
    avatar: 'https://i.pravatar.cc/150?u=michael',
  },
];

export const Testimonials: React.FC = () => (
  <section className="py-32 bg-brand-cream/30">
    <div className="max-w-7xl mx-auto px-6 lg:px-12">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        {/* Left: heading + CTA */}
        <div>
          <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
            Testimonials
          </span>
          <h2 className="text-5xl font-serif font-bold text-stone-900 mb-8">What Our Community Says</h2>
          <p className="text-stone-500 mb-12 max-w-md">
            Hear from our satisfied foodies and local chefs who have joined the Kitchen Foods family.
          </p>
          <button className="px-8 py-4 border border-stone-900/10 rounded-full text-stone-900 font-bold hover:bg-stone-900 hover:text-white transition-all">
            Read All Stories
          </button>
        </div>

        {/* Right: review cards */}
        <div className="space-y-8">
          {REVIEWS.map((review) => (
            <motion.div key={review.id} whileHover={{ x: 10 }} className="glass p-8 rounded-[40px] flex gap-6 items-start">
              <img src={review.avatar} alt={review.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <p className="text-stone-900/70 italic mb-4">"{review.text}"</p>
                <h4 className="text-stone-900 font-bold">{review.name}</h4>
                <p className="text-brand-primary text-xs font-mono uppercase tracking-widest">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
