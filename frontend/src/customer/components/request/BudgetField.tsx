// ---------------------------------------------------------------------------
// BudgetField
// ---------------------------------------------------------------------------
// Numeric budget input with quick-add buttons (+500 / +1,000 / +5,000).
// ---------------------------------------------------------------------------

import React from 'react';

const QUICK_ADD_AMOUNTS = [500, 1000, 5000];

interface BudgetFieldProps {
  budget: number;
  onChange: (value: number) => void;
}

export const BudgetField: React.FC<BudgetFieldProps> = ({ budget, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-stone-900 uppercase tracking-widest mb-3">Budget</label>
    <div className="p-1">
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <span className="text-stone-400 font-bold">LKR</span>
        </div>
        <input
          type="number"
          min="500"
          value={budget}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-full pl-16 pr-5 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-bold text-2xl text-stone-900 transition-all shadow-sm"
        />
      </div>
      <div className="flex gap-2">
        {QUICK_ADD_AMOUNTS.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => onChange(budget + amount)}
            className="flex-1 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-brand-primary hover:text-white rounded-xl transition-all"
          >
            + {amount.toLocaleString()}
          </button>
        ))}
      </div>
    </div>
  </div>
);
