// ---------------------------------------------------------------------------
// BrandingPanel
// ---------------------------------------------------------------------------
// Left half of the split-screen login page (desktop only): a dark panel
// with a kitchen photo, the logo mark and the value proposition copy.
// ---------------------------------------------------------------------------

import React from 'react';
import { ChefHat } from 'lucide-react';

export const BrandingPanel: React.FC = () => (
  <div className="hidden lg:flex w-1/2 bg-stone-900 relative overflow-hidden items-center justify-center p-12 text-white">
    <div className="absolute inset-0 opacity-40">
      <img
        src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
        className="w-full h-full object-cover"
        alt="Cooking background"
      />
    </div>
    <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply" />
    <div className="relative z-10 max-w-lg">
      <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 w-fit p-4 rounded-2xl shadow-xl">
        <ChefHat size={48} className="text-brand-primary" />
      </div>
      <h1 className="text-5xl font-serif font-bold mb-6 leading-tight">
        Turn your passion into your profession.
      </h1>
      <p className="text-xl text-stone-300 leading-relaxed font-medium">
        Join thousands of women across the country running their own culinary micro-businesses right from
        their home kitchens.
      </p>
    </div>
  </div>
);
