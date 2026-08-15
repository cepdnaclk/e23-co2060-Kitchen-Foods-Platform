// ---------------------------------------------------------------------------
// CravingChips
// ---------------------------------------------------------------------------
// One-tap shortcut chips ("Spicy", "Vegetarian", ...) that set the search
// query, plus a "Clear" link once a query is active.
// ---------------------------------------------------------------------------

import React from 'react';
import { CRAVINGS } from '../../constants/cravings';

interface CravingChipsProps {
  query: string;
  onSelect: (craving: string) => void;
  onClear: () => void;
}

export const CravingChips: React.FC<CravingChipsProps> = ({ query, onSelect, onClear }) => (
  <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
    {CRAVINGS.map((craving) => (
      <button
        key={craving}
        onClick={() => onSelect(craving)}
        className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border
          ${query === craving
            ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20'
            : 'bg-white border-stone-900/5 text-stone-600 hover:border-brand-primary/30'
          }`}
      >
        {craving}
      </button>
    ))}
    {query && (
      <button
        onClick={onClear}
        className="text-xs font-bold text-stone-400 hover:text-brand-primary ml-2"
      >
        Clear
      </button>
    )}
  </div>
);
