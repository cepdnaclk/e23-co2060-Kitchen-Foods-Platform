// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
// The "/profile" page: shows the logged-in customer's identity card (avatar
// monogram, name, email, role) plus a quick orders summary and an editable
// details form. Data is loaded fresh from GET /users/:uid; saving goes through
// PUT /users/:uid. On any backend failure we fall back to the user object
// cached in localStorage so the page still renders.
// ---------------------------------------------------------------------------

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BadgeCheck, Check, Loader2, Mail, Pencil, ShieldCheck, UtensilsCrossed, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCustomerOrders, fetchUserProfile, updateUserProfile } from '../services/customerApi';

interface StoredUser {
  uid: string;
  full_name: string;
  email: string;
  role: string;
}

/** Read the logged-in user from localStorage (set at login). */
function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

/** Derive an avatar monogram, e.g. "Jane Doe" → "JD". */
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

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = useMemo(getStoredUser, []);

  // Redirect guests to login.
  useEffect(() => {
    if (!storedUser || !localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [storedUser, navigate]);

  const [profile, setProfile] = useState<StoredUser | null>(storedUser);
  const [orderCount, setOrderCount] = useState<number | null>(null);

  // Edit state.
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(storedUser?.full_name ?? '');
  const [email, setEmail] = useState(storedUser?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  // Load the freshest profile + order count from the backend.
  useEffect(() => {
    if (!storedUser?.uid) return;

    fetchUserProfile(storedUser.uid)
      .then((p) => setProfile({ uid: p.uid ?? storedUser.uid, full_name: p.full_name, email: p.email, role: p.role }))
      .catch(() => {/* keep localStorage fallback */});

    fetchCustomerOrders(storedUser.uid)
      .then((orders) => setOrderCount(orders.length))
      .catch(() => setOrderCount(null));
  }, [storedUser]);

  if (!profile) return null; // redirecting

  const initials = getInitials(profile.full_name, profile.email);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError('Name and email are both required.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateUserProfile(profile.uid, {
        full_name: fullName.trim(),
        email: email.trim(),
      });
      const next: StoredUser = {
        uid: profile.uid,
        full_name: updated.full_name,
        email: updated.email,
        role: profile.role,
      };
      setProfile(next);
      // Keep the navbar avatar in sync (it reads this on route change).
      localStorage.setItem('user', JSON.stringify(next));
      setIsEditing(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setError(null);
    setFullName(profile.full_name);
    setEmail(profile.email);
  };

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-2 block font-bold">
            Your Account
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900">My Profile</h1>
        </motion.div>

        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-[32px] border border-stone-900/5 shadow-sm shadow-stone-900/5 overflow-hidden mb-8"
        >
          <div className="h-28 bg-gradient-to-r from-brand-primary/90 to-brand-primary/60 relative">
            <div className="absolute inset-0 bg-[url('/images/chef_impact_1.png')] bg-cover bg-center opacity-10" />
          </div>

          <div className="px-8 pb-8 -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-brand-primary text-white flex items-center justify-center text-3xl font-bold ring-4 ring-white shrink-0">
                {initials}
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-full border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white active:scale-95 transition-all"
                >
                  <Pencil size={15} />
                  Edit Details
                </button>
              )}
            </div>

            {/* View mode */}
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-serif font-bold text-stone-900">{profile.full_name}</h2>
                    <BadgeCheck size={20} className="text-brand-primary" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-primary bg-brand-primary/10 rounded-full">
                      <ShieldCheck size={13} />
                      {profile.role}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-stone-500 text-sm">
                      <Mail size={14} />
                      {profile.email}
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* Edit mode */
                <motion.form
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSave}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="profile-name" className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-brand-primary outline-none bg-stone-50 focus:bg-white transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-email" className="block text-xs font-bold uppercase tracking-wide text-stone-500 mb-1.5">
                      Email
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-stone-200 focus:border-brand-primary outline-none bg-stone-50 focus:bg-white transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  {error && (
                    <p className="text-sm font-semibold text-rose-600">{error}</p>
                  )}

                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-brand-primary/30 active:scale-95 transition-all disabled:opacity-60"
                    >
                      {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                      {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-full border-2 border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-50 active:scale-95 transition-all"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Saved flash message */}
            <AnimatePresence>
              {savedFlash && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-4 py-2 rounded-xl"
                >
                  <Check size={15} />
                  Profile updated successfully
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <button
            onClick={() => document.querySelector('#orders')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-left bg-white rounded-3xl border border-stone-900/5 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <UtensilsCrossed size={22} className="text-brand-primary mb-3" />
            <p className="text-3xl font-serif font-bold text-stone-900">{orderCount ?? '—'}</p>
            <p className="text-sm text-stone-500 font-medium">Total Orders</p>
          </button>
          <div className="bg-white rounded-3xl border border-stone-900/5 p-6">
            <BadgeCheck size={22} className="text-brand-primary mb-3" />
            <p className="text-3xl font-serif font-bold text-stone-900 capitalize">{profile.role}</p>
            <p className="text-sm text-stone-500 font-medium">Account Type</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
