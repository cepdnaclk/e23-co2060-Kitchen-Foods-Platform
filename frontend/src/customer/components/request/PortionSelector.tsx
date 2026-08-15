// ---------------------------------------------------------------------------
// PortionSelector
// ---------------------------------------------------------------------------
// +/- stepper for choosing how many portions to order.
// ---------------------------------------------------------------------------

import React from 'react';
import { Users } from 'lucide-react';

interface PortionSelectorProps {
  portions: number;
  onChange: (value: number) => void;
}

export const PortionSelector: React.FC<PortionSelectorProps> = ({ portions, onChange }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">
      <Users size={16} className="text-brand-primary" />
      Portions
    </label>
    <div className="inline-flex items-center p-1.5 bg-stone-100 rounded-2xl border border-stone-200">
      <button
        type="button"
        className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-stone-200 text-xl font-medium text-stone-600 hover:text-brand-primary hover:border-brand-primary/30 transition-all"
        onClick={() => onChange(Math.max(1, portions - 1))}
      >
        -
      </button>
      <span className="w-16 text-center text-2xl font-serif font-bold text-stone-900">{portions}</span>
      <button
        type="button"
        className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-stone-200 text-xl font-medium text-stone-600 hover:text-brand-primary hover:border-brand-primary/30 transition-all"
        onClick={() => onChange(portions + 1)}
      >
        +
      </button>
    </div>
  </div>
);
