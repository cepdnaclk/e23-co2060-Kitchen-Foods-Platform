// ---------------------------------------------------------------------------
// TextField
// ---------------------------------------------------------------------------
// Reusable labeled input with a leading icon, used for every field in the
// auth form (name, email, password) so their styling stays identical.
// ---------------------------------------------------------------------------

import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface TextFieldProps {
  label: string;
  icon: LucideIcon;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  /** Small helper text shown below the input. */
  hint?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  minLength,
  hint,
}) => (
  <div>
    <label className="block text-sm font-bold text-stone-700 mb-2">{label}</label>
    <div className="relative group">
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-brand-primary"
        size={20}
      />
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3.5 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary outline-none transition-all text-stone-900 font-medium placeholder-stone-400 hover:border-stone-300"
        placeholder={placeholder}
        required={required}
        minLength={minLength}
      />
    </div>
    {hint && <p className="text-xs text-stone-500 mt-2 ml-1">{hint}</p>}
  </div>
);
