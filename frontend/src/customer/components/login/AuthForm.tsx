// ---------------------------------------------------------------------------
// AuthForm
// ---------------------------------------------------------------------------
// Right half of the login page: the sign-in / sign-up form. Owns all auth
// state and talks to the backend via /auth/login and /auth/register.
//
// On success:
//   - the JWT + user object are stored in localStorage ("token", "user")
//   - chefs are redirected to the chef app, customers to the homepage
// ---------------------------------------------------------------------------

import React, { useState } from 'react';
import { ArrowRight, ChefHat, Lock, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../shared/api';
import { TextField } from './TextField';
import { RoleSelector } from './RoleSelector';
import type { AuthRole } from './RoleSelector';

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
        setErrorMsg('Registration successful! Please sign in.');
        setPassword('');
      }
    } catch (error) {
      setErrorMsg((error as Error).message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
      <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-sm border border-stone-900/5 my-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat className="text-brand-primary" size={32} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-stone-500 font-medium">
            {isLogin ? 'Please enter your details to sign in.' : 'Join our vibrant food community.'}
          </p>
        </div>

        {errorMsg && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              errorMsg.includes('successful')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center justify-between text-sm mt-4 mb-6">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary border-stone-300 focus:ring-offset-0"
                />
                <span className="text-stone-600 font-medium group-hover:text-stone-900 transition-colors">
                  Remember me
                </span>
              </label>
              <a href="#" className="text-brand-primary hover:text-brand-primary/80 font-bold transition-colors">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-brand-primary text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-primary/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 flex-row-reverse disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
              !isLogin ? 'mt-8' : ''
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
        </form>

        <div className="mt-8 pt-6 border-t border-stone-100 text-center text-stone-600 font-medium">
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
    </div>
  );
};
