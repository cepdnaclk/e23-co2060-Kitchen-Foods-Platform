// ---------------------------------------------------------------------------
// SpiceLevelSelector
// ---------------------------------------------------------------------------
// Segmented control for the spice level: Mild → Medium → Hot → Extra Hot.
// The value is an index 0-3.
// ---------------------------------------------------------------------------

import React from 'react';
import { Flame } from 'lucide-react';

const SPICE_LEVELS = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

interface SpiceLevelSelectorProps {
  spiceLevel: number;
  onChange: (value: number) => void;
}

export const SpiceLevelSelector: React.FC<SpiceLevelSelectorProps> = ({ spiceLevel, onChange }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">
      <Flame size={16} className="text-brand-primary" />
      Spice Level
    </label>
    <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
      {SPICE_LEVELS.map((level, idx) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(idx)}
          className={`flex-1 py-3 px-2 text-sm font-semibold rounded-xl transition-all ${
            spiceLevel === idx
              ? 'bg-white text-brand-primary shadow-sm border border-stone-200/50'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          {level}
        </button>
      ))}
    </div>
  </div>
);
