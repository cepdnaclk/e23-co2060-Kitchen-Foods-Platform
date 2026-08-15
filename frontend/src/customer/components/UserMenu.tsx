import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface User {
  uid: string;
  full_name: string;
  email: string;
  role: string;
}

interface UserMenuProps {
  user: User;
  onLogout: () => void;
}

function getInitials(name: string, email: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (email.slice(0, 2) || 'U').toUpperCase();
}

export const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const initials = getInitials(user.full_name, user.email);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full border-2 border-brand-primary/30 hover:border-brand-primary bg-white/60 hover:bg-white transition-all active:scale-95"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold">
          {initials}
        </span>
        <span className="hidden sm:block text-sm font-bold text-stone-900 max-w-[120px] truncate">
          {user.full_name}
        </span>
        <ChevronDown
          size={16}
          className={`text-stone-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              role="menu"
              className="absolute right-0 top-full mt-2 w-64 z-50 bg-white rounded-2xl border border-stone-900/5 shadow-xl shadow-stone-900/5 overflow-hidden"
            >
              <div className="px-5 py-4 bg-stone-50/80 border-b border-stone-900/5">
                <p className="font-serif font-bold text-stone-900 truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-stone-500 truncate mt-0.5">{user.email}</p>
                <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-primary bg-brand-primary/10 rounded-full">
                  {user.role}
                </span>
              </div>

              <div className="p-2">
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
