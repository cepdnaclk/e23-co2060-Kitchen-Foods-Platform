import React, { useState } from 'react';
import { ChefHat, ArrowRight, Lock, Mail } from 'lucide-react';
import { AppContext } from './Layout';

export const Login: React.FC = () => {
  const { setView } = React.useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setView('dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex bg-neutral-50">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-orange-600 relative overflow-hidden items-center justify-center p-12 text-white">
        <div className="absolute inset-0 opacity-20">
             <img 
               src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920" 
               className="w-full h-full object-cover" 
               alt="Cooking background" 
             />
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="mb-6 bg-white/20 backdrop-blur-sm w-fit p-3 rounded-xl">
            <ChefHat size={48} />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">Bring the restaurant experience home.</h1>
          <p className="text-xl text-orange-100 leading-relaxed">
            Connect with top local chefs, customize your menu, and enjoy a personalized dining experience in the comfort of your home.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">Welcome back</h2>
            <p className="text-neutral-500 mt-2">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-neutral-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-neutral-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-orange-600 focus:ring-orange-500 border-gray-300" />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neutral-900 text-white py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-neutral-500">
            Don't have an account? <button className="text-orange-600 font-medium hover:underline">Sign up for free</button>
          </div>
        </div>
      </div>
    </div>
  );
};
