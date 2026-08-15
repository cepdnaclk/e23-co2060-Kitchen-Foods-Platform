// ---------------------------------------------------------------------------
// MenuHeader
// ---------------------------------------------------------------------------
// Eyebrow label + big serif heading at the top of the menu section.
// ---------------------------------------------------------------------------

import React from 'react';

export const MenuHeader: React.FC = () => (
  <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">
      Customize Your Experience
    </span>
    <h2 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 tracking-tight mb-8">
      What do you feel like
      <br />
      <span className="text-brand-primary italic">eating today?</span>
    </h2>
  </div>
);
