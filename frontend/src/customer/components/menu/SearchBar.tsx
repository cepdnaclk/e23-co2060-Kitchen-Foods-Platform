// ---------------------------------------------------------------------------
// SearchBar
// ---------------------------------------------------------------------------
// Text input that filters food items across all categories. The query is
// held in MenuCustomization and passed down so chips + search share it.
// ---------------------------------------------------------------------------

import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange }) => (
  <div className="max-w-2xl mx-auto relative mb-20">
    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-stone-500" />
    </div>
    <input
      type="text"
      placeholder="Search for specific food items (e.g. String Hoppers, Lamprais)..."
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
      className="w-full pl-16 pr-8 py-6 bg-white rounded-[32px] border border-stone-900/5 focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/50 text-lg shadow-xl shadow-stone-900/5 transition-all"
    />
  </div>
);
