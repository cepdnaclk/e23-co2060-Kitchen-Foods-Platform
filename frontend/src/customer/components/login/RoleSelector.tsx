// ---------------------------------------------------------------------------
// RoleSelector
// ---------------------------------------------------------------------------
// "I am registering as" toggle shown during sign-up: a pair of radio-card
// buttons for Customer vs Chef, each with an icon and a short description.
// ---------------------------------------------------------------------------

import React from 'react';
import { ChefHat, User } from 'lucide-react';

export type AuthRole = 'Customer' | 'Chef';

interface RoleOption {
  value: AuthRole;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  desc: string;
}

const ROLES: RoleOption[] = [
  { value: 'Customer', icon: User, desc: 'Order home-cooked meals' },
  { value: 'Chef', icon: ChefHat, desc: 'Cook & earn from home' },
];

interface RoleSelectorProps {
  role: AuthRole;
  onChange: (role: AuthRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ role, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-stone-700 mb-2">I am registering as a</label>
    <div className="flex gap-4">
      {ROLES.map(({ value, icon: Icon, desc }) => {
        const isSelected = role === value;
        return (
          <label
            key={value}
            className={`flex-1 flex flex-col items-center gap-1.5 py-4 border-2 rounded-2xl cursor-pointer transition-all ${
              isSelected
                ? 'border-brand-primary bg-gradient-to-b from-brand-primary/10 to-transparent text-brand-primary shadow-sm shadow-brand-primary/10'
                : 'border-stone-200 text-stone-500 hover:border-brand-primary/40 hover:bg-white/60'
            }`}
          >
            <input
              type="radio"
              className="hidden"
              name="role"
              value={value}
              checked={isSelected}
              onChange={() => onChange(value)}
            />
            <Icon size={22} />
            <span className="font-bold text-stone-900">{value}</span>
            <span className="text-xs text-stone-500 font-medium text-center leading-tight">{desc}</span>
          </label>
        );
      })}
    </div>
  </div>
);
