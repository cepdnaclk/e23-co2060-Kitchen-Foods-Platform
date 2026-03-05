import React, { useState } from 'react';
import { ChefHat, ArrowRight, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            // For now, redirect to dashboard or home on successful login
            navigate('/');
        }, 1000);
    };

    return (
        <div className="min-h-screen w-full flex bg-brand-cream text-stone-900">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 bg-stone-900 relative overflow-hidden items-center justify-center p-12 text-white">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
                        className="w-full h-full object-cover"
                        alt="Cooking background"
                    />
                </div>
                <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply"></div>
                <div className="relative z-10 max-w-lg">
                    <div className="mb-6 bg-white/10 backdrop-blur-md border border-white/20 w-fit p-4 rounded-2xl shadow-xl">
                        <ChefHat size={48} className="text-brand-primary" />
                    </div>
                    <h1 className="text-5xl font-serif font-bold mb-6 leading-tight">Turn your passion into your profession.</h1>
                    <p className="text-xl text-stone-300 leading-relaxed font-medium">
                        Join thousands of women across the country running their own culinary micro-businesses right from their home kitchens.
                    </p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white p-10 rounded-[40px] shadow-sm border border-stone-900/5">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ChefHat className="text-brand-primary" size={32} />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-stone-900 mb-2">Welcome Back, Chef</h2>
                        <p className="text-stone-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-stone-400" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-stone-900 font-medium placeholder-stone-400"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-stone-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-stone-400" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all text-stone-900 font-medium placeholder-stone-400"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm mt-6 mb-8">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-5 h-5 rounded text-brand-primary focus:ring-brand-primary border-stone-300 focus:ring-offset-0" />
                                <span className="text-stone-600 font-medium group-hover:text-stone-900 transition-colors">Remember me</span>
                            </label>
                            <a href="#" className="text-brand-primary hover:text-brand-primary/80 font-bold transition-colors">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold hover:shadow-lg hover:shadow-brand-primary/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 flex-row-reverse disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {!isLoading && <ArrowRight size={20} />}
                            {isLoading ? 'Signing into your kitchen...' : 'Sign in to Dashboard'}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-stone-100 text-center text-stone-600 font-medium">
                        Ready to start your culinary journey?{' '}
                        <button className="text-brand-primary font-bold hover:underline underline-offset-4 ml-1">
                            Apply to be a Chef
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
