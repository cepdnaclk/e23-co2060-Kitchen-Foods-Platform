// ---------------------------------------------------------------------------
// AuthForm
// ---------------------------------------------------------------------------
// Right half of the login page: the sign-in / sign-up form. Owns all auth
// state and talks to the backend via /auth/login and /auth/register.
//
// On success:
//   - the JWT + user object are stored in localStorage ("token", "user")
//   - chefs are redirected to the chef app, customers to the homepage
//
// The card uses the brand's glass / serif / mono design language, and the
// fields animate in when switching between sign-in and sign-up modes.
// ---------------------------------------------------------------------------

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ChefHat, Lock, Mail, ShieldCheck, Sparkles, User, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../shared/api';
import { TextField } from './TextField';
import { RoleSelector } from './RoleSelector';
import type { AuthRole } from './RoleSelector';

const BENEFITS = [
  { icon: <Sparkles size={16} />, label: 'Free forever' },
  { icon: <Users size={16} />, label: 'Verified chefs' },
  { icon: <ShieldCheck size={16} />, label: 'Secure payments' },
];

export const AuthForm: React.FC = () => {
  // Mode: true = sign in, false = sign up
  const [isLogin, setIsLogin] = useState(true);

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AuthRole>('Customer');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email, password }
        : { full_name: fullName, email, password, role };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isLogin) {
        // Persist the session, then route by role.
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        if (data.user?.role === 'Chef') {
          window.location.href = '/chef';
        } else {
          navigate('/');
        }
      } else {
        // Successful registration → flip to the sign-in view.
        setIsLogin(true);
        setPassword('');
        setErrorMsg(
          role === 'Chef'
            ? 'Registration successful! Your chef account is pending admin approval. You will be able to sign in once an admin approves it.'
            : 'Registration successful! Please sign in.',
        );
      }
    } catch (error) {
      setErrorMsg((error as Error).message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-y-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="relative bg-white/70 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-[0_32px_80px_-24px_rgba(10,10,10,0.25)] p-8 sm:p-10">
          {/* Gradient hairline on top edge */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-brand-primary/70 to-transparent" />

          {/* Mobile brand mark (visible under lg, when the panel hides) */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-[#d4521a] flex items-center justify-center">
              <ChefHat size={18} className="text-white" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">Kitchen Foods</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative w-fit mx-auto mb-6">
              <div className="absolute inset-0 bg-brand-primary/30 blur-2xl rounded-full scale-125" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-brand-primary to-[#d4521a] rounded-3xl flex items-center justify-center shadow-lg shadow-brand-primary/40 -rotate-3">
                <ChefHat className="text-white" size={30} />
              </div>
            </div>
            <p className="text-brand-primary font-mono text-xs uppercase tracking-[0.35em] mb-3">
              {isLogin ? 'Welcome Back' : 'Join the Community'}
            </p>
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-3">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-stone-500 font-medium">
              {isLogin
                ? 'Please enter your details to sign in.'
                : 'Join our vibrant food community — it takes less than a minute.'}
            </p>
          </div>

          {errorMsg && (
            <div
              className={`mb-6 p-4 rounded-2xl text-sm font-medium ${
                errorMsg.includes('successful')
                  ? 'bg-green-50/80 text-green-700 border border-green-200'
                  : 'bg-red-50/80 text-red-700 border border-red-200'
              }`}
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isLogin ? 'signin' : 'signup'}
                initial={{ opacity: 0, x: isLogin ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 16 : -16 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-4"
              >
                {!isLogin && (
                  <>
                    <TextField
                      label="Full Name"
                      icon={User}
                      value={fullName}
                      onChange={setFullName}
                      placeholder="Enter your full name"
                      required
                    />
                    <RoleSelector role={role} onChange={setRole} />
                  </>
                )}

                <TextField
                  label="Email"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="Enter your email"
                  required
                />

                <TextField
                  label="Password"
                  icon={Lock}
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  required
                  minLength={isLogin ? undefined : 6}
                  hint={!isLogin ? 'Must be at least 6 characters long' : undefined}
                />

                {isLogin && (
                  <div className="flex items-center justify-between text-sm pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary border-stone-300 focus:ring-offset-0"
                      />
                      <span className="text-stone-600 font-medium group-hover:text-stone-900 transition-colors">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="#"
                      className="text-brand-primary hover:text-brand-primary/80 font-bold transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r from-brand-primary to-[#e05e12] text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-brand-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 flex-row-reverse disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
                    !isLogin ? 'mt-6' : 'mt-2'
                  }`}
                >
                  {!isLoading && <ArrowRight size={20} />}
                  {isLoading
                    ? isLogin
                      ? 'Signing in...'
                      : 'Creating account...'
                    : isLogin
                      ? 'Sign In'
                      : 'Sign Up'}
                </button>
              </motion.div>
            </AnimatePresence>
          </form>

          {/* Trust row — only meaningful when signing up */}
          {!isLogin && (
            <div className="mt-7 pt-6 border-t border-stone-900/5 flex items-center justify-center gap-6 text-stone-500 text-sm font-medium">
              {BENEFITS.map((benefit) => (
                <span key={benefit.label} className="flex items-center gap-1.5">
                  <span className="text-brand-primary">{benefit.icon}</span>
                  {benefit.label}
                </span>
              ))}
            </div>
          )}

          {/* Mode switch */}
          <div className="mt-7 pt-6 border-t border-stone-900/5 text-center text-stone-600 font-medium">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
                setPassword('');
              }}
              className="text-brand-primary font-bold hover:underline underline-offset-4 ml-1"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          {isLogin && (
            <div className="mt-4 text-center text-stone-600 font-medium">
              Ready to start your culinary journey?{' '}
              <button className="text-brand-primary font-bold hover:underline underline-offset-4 ml-1">
                Apply to be a Chef
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
