// ---------------------------------------------------------------------------
// ImpactStats
// ---------------------------------------------------------------------------
// Three static stat cards ("Women Onboarded", "Income Generated",
// "Meals Shared") shown in the middle of the ImpactStory article.
// ---------------------------------------------------------------------------

import React from 'react';
import { ChefHat, TrendingUp, Users } from 'lucide-react';

const STATS = [
  { icon: Users, value: '42', label: 'Women Onboarded' },
  { icon: TrendingUp, value: 'LKR 350k', label: 'Income Generated' },
  { icon: ChefHat, value: '1,250+', label: 'Meals Shared' },
];

export const ImpactStats: React.FC = () => (
  <div className="grid sm:grid-cols-3 gap-6 my-16">
    {STATS.map((stat) => (
      <div key={stat.label} className="bg-white p-8 rounded-3xl border border-stone-900/10 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mx-auto mb-4">
          <stat.icon size={24} />
        </div>
        <div className="text-4xl font-bold font-serif text-stone-900 mb-2">{stat.value}</div>
        <div className="text-sm font-bold text-stone-500 uppercase tracking-widest">{stat.label}</div>
      </div>
    ))}
  </div>
);
