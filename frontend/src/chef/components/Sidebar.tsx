import React, { useState } from 'react';
import { LayoutDashboard, Utensils, ClipboardList, Settings, LogOut, User, X, ToggleLeft, ToggleRight, ChefHat, Flame } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';
import { ChefProfile } from '../types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
  profile: ChefProfile;
  deliveredCount?: number;
  activeCount?: number;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: ClipboardList, label: 'Orders' },
  { icon: Utensils, label: 'Menu Items' },
  { icon: User, label: 'Profile' },
  { icon: Settings, label: 'Settings' },
];

export const Sidebar = ({ activeTab, onTabChange, onLogout, isOpen, onClose, profile, deliveredCount = 0, activeCount = 0 }: SidebarProps) => {
  const [isOnline, setIsOnline] = useState(true);

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join('');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/30 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 26, stiffness: 190 }}
            className="fixed inset-y-0 left-0 w-64 bg-[#fdf8f3]/95 backdrop-blur-2xl border-r border-stone-900/10 flex flex-col z-50 shadow-2xl lg:shadow-none"
          >
            {/* Decorative top glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl" />

            {/* Header / Brand */}
            <div className="relative p-6 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-tr from-brand-primary to-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/30 ring-1 ring-white/40">
                      <ChefHat size={20} className="stroke-[2.2]" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>
                  <div>
                    <span className="block text-lg font-display font-bold text-stone-900 tracking-tight leading-none">
                      ChefDash
                    </span>
                    <span className="block text-[9px] font-semibold tracking-[0.22em] uppercase text-stone-400 mt-1">
                      Kitchen Console
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all duration-200 lg:hidden"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chef Mini Profile Card */}
            <div className="px-6 py-4 my-1">
              <div className="relative overflow-hidden p-4 rounded-2xl chef-panel">
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative mb-2.5">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-brand-primary/50 ring-offset-2 ring-offset-white"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-primary to-amber-500 flex items-center justify-center text-white font-display font-bold text-lg ring-2 ring-brand-primary/50 ring-offset-2 ring-offset-white">
                        {initials || 'C'}
                      </div>
                    )}
                    <span
                      className={cn(
                        "absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-[3px] border-white",
                        isOnline ? "bg-emerald-500" : "bg-stone-400"
                      )}
                    />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 line-clamp-1 px-1">{profile.name || 'Chef'}</h4>
                  <p className="text-[10px] text-brand-primary font-semibold mt-0.5 tracking-wide uppercase line-clamp-1">
                    {profile.specialty || 'Home Kitchen'}
                  </p>

                  {/* Kitchen open/close toggle */}
                  <button
                    onClick={() => setIsOnline(!isOnline)}
                    className={cn(
                      "w-full mt-3 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200",
                      isOnline
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/15"
                        : "bg-white/60 border-stone-200 text-stone-500 hover:bg-white"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <Flame size={13} className={isOnline ? "text-emerald-600" : "text-stone-400"} />
                      Kitchen {isOnline ? 'Open' : 'Closed'}
                    </span>
                    {isOnline ? (
                      <ToggleRight className="text-emerald-600" size={18} />
                    ) : (
                      <ToggleLeft className="text-stone-400" size={18} />
                    )}
                  </button>

                  {/* Mini stats */}
                  <div className="w-full grid grid-cols-2 gap-2 mt-3">
                    <div className="rounded-xl bg-white/70 border border-stone-900/10 py-2">
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Delivered</p>
                      <p className="text-sm font-display font-bold text-stone-900 leading-tight">{deliveredCount}</p>
                    </div>
                    <div className="rounded-xl bg-white/70 border border-stone-900/10 py-2">
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Active</p>
                      <p className="text-sm font-display font-bold text-brand-primary leading-tight">{activeCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <div className="px-4 flex-1 overflow-y-auto">
              <p className="px-3 pb-2 text-[9px] font-bold tracking-[0.2em] uppercase text-stone-400">Menu</p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeTab === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        onTabChange(item.label);
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group",
                        isActive
                          ? "bg-gradient-to-r from-brand-primary/15 to-amber-500/5 text-brand-primary border border-brand-primary/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
                          : "text-stone-500 hover:bg-white/70 hover:text-stone-900 border border-transparent"
                      )}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-bar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-brand-primary to-amber-500 shadow-[0_0_10px_rgba(242,125,38,0.6)]"
                        />
                      )}
                      <item.icon size={18} className={cn(
                        "shrink-0 transition-colors",
                        isActive ? "text-brand-primary stroke-[2.2]" : "text-stone-400 group-hover:text-stone-900"
                      )} />
                      <span>{item.label}</span>
                      {item.label === 'Orders' && activeCount > 0 && (
                        <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-brand-primary text-[10px] font-bold flex items-center justify-center">
                          {activeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Footer / Sign Out */}
            <div className="mt-auto p-4 border-t border-stone-900/10">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-stone-500 hover:bg-rose-500/10 hover:text-rose-600 border border-transparent hover:border-rose-500/25 transition-all duration-200"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
              <p className="text-center text-[9px] text-stone-400 mt-3 font-medium tracking-wide">
                ChefDash v2.0
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
