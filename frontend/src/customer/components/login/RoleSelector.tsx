// ---------------------------------------------------------------------------
// RoleSelector
// ---------------------------------------------------------------------------
// "I am registering as" toggle shown during sign-up: a pair of radio-card
// buttons for Customer vs Chef.
// ---------------------------------------------------------------------------

import React from 'react';

export type AuthRole = 'Customer' | 'Chef';

const ROLES: AuthRole[] = ['Customer', 'Chef'];

interface RoleSelectorProps {
  role: AuthRole;
  onChange: (role: AuthRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({ role, onChange }) => (
  <div>
    <label className="block text-sm font-bold text-stone-700 mb-2">I am registering as a</label>
    <div className="flex gap-4">
      {ROLES.map((r) => (
        <label
          key={r}
          className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 rounded-xl cursor-pointer transition-all ${
            role === r
              ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
              : 'border-stone-200 text-stone-500 hover:border-brand-primary/50'
          }`}
        >
          <input
            type="radio"
            className="hidden"
            name="role"
            value={r}
            checked={role === r}
            onChange={() => onChange(r)}
          />
          <span className="font-bold">{r}</span>
        </label>
      ))}
    </div>
  </div>
);
