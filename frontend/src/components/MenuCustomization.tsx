import React, { useState } from 'react';
import { Calendar, MapPin, Users, ChevronRight, Search, Utensils, Coffee, Leaf, IceCream, Soup, CheckSquare } from 'lucide-react';
import { Request } from '../types';
import { RequestForm } from './RequestForm';
import { motion, AnimatePresence } from 'motion/react';

export const MenuCustomization: React.FC = () => {
    // Local state for requests since we don't have AppContext in MVP branch yet
    const [requests, setRequests] = useState<Request[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [
        { id: 'rice-curry', name: 'Rice & Curry', icon: Soup, color: 'text-orange-500' },
        { id: 'short-eats', name: 'Short Eats', icon: CheckSquare, color: 'text-yellow-500' },
        { id: 'salads', name: 'Salads', icon: Leaf, color: 'text-green-500' },
        { id: 'desserts', name: 'Desserts', icon: IceCream, color: 'text-pink-500' },
        { id: 'beverages', name: 'Beverages', icon: Coffee, color: 'text-blue-500' },
        { id: 'other', name: 'Other', icon: Utensils, color: 'text-purple-500' },
    ];

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
    };

    const handleFormCancel = () => {
        setSelectedCategory(null);
    };

    const handleFormSubmit = (data: Partial<Request>) => {
        const newRequest: Request = {
            id: Math.random().toString(36).substr(2, 9),
            title: data.title || 'New Request',
            date: data.date || new Date().toISOString().split('T')[0],
            guests: data.guests || 1,
            budget: data.budget || 0,
            status: 'open',
            bids: 0,
            location: 'Current Location', // Defaulting for now
            dietary: data.dietary || [],
            description: data.description || ''
        };
        setRequests(prev => [newRequest, ...prev]);
        setSelectedCategory(null);
    };

    const handleRequestClick = (req: Request) => {
        // Placeholder for future request details view
        console.log("Clicked request:", req);
    };

    return (
        <section className="py-32 bg-brand-cream relative overflow-hidden text-stone-900 border-b border-stone-900/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Hero Section */}
                <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.3em] mb-4 block">Customize Your Experience</span>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 tracking-tight mb-8">
                        What do you feel like<br />
                        <span className="text-brand-primary italic">eating today?</span>
                    </h2>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative mb-20">
                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-stone-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for specific food items (e.g. String Hoppers, Lamprais)..."
                            className="w-full py-5 pl-14 pr-6 rounded-full glass border border-stone-900/10 shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none text-lg transition-all text-stone-900 placeholder-stone-500"
                        />
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.name)}
                                className={`flex flex-col items-center justify-center p-8 rounded-[32px] border transition-all duration-300 group cursor-pointer
                                ${selectedCategory === cat.name
                                        ? 'bg-brand-primary border-brand-primary text-white shadow-2xl scale-105 z-10 shadow-brand-primary/20'
                                        : 'glass border-stone-900/5 hover:border-brand-primary/50 text-stone-900/80 hover:text-stone-900'
                                    }
                            `}
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform ${selectedCategory === cat.name ? 'bg-stone-900/20 text-stone-900' : `bg-stone-900/5 ${cat.color} group-hover:scale-110`
                                    }`}>
                                    <cat.icon size={28} />
                                </div>
                                <span className="font-bold font-serif">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Section: Toggle between Form and List */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {selectedCategory ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                                className="max-w-4xl mx-auto"
                            >
                                <RequestForm
                                    category={selectedCategory}
                                    onCancel={handleFormCancel}
                                    onSubmit={handleFormSubmit}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-3xl font-serif font-bold text-stone-900">Your Active Requests</h3>
                                </div>

                                <div className="grid gap-6">
                                    {requests.length === 0 ? (
                                        <div className="text-center py-16 glass rounded-[40px] border border-dashed border-stone-900/20">
                                            <div className="w-16 h-16 bg-stone-900/5 rounded-full flex items-center justify-center mx-auto mb-6 text-stone-500">
                                                <Calendar size={28} />
                                            </div>
                                            <h4 className="text-xl font-bold text-stone-900 font-serif mb-2">No active requests</h4>
                                            <p className="text-stone-600">Select a category above to create one!</p>
                                        </div>
                                    ) : (
                                        requests.map((req) => (
                                            <div
                                                key={req.id}
                                                onClick={() => handleRequestClick(req)}
                                                className="glass p-8 rounded-[32px] border border-stone-900/5 hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all cursor-pointer group"
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div>
                                                        <div className="flex items-center gap-4 mb-3">
                                                            <h4 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-brand-primary transition-colors">{req.title}</h4>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                        ${req.status === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/20' : 'bg-stone-900/10 text-stone-900/60'}`}>
                                                                {req.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-stone-600 font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar size={16} className="text-brand-primary" />
                                                                {new Date(req.date).toLocaleDateString()}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users size={16} className="text-brand-primary" />
                                                                {req.guests} Guests
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin size={16} className="text-brand-primary" />
                                                                {req.location}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-8 md:border-l md:border-stone-900/10 md:pl-8">
                                                        <div className="text-right">
                                                            <div className="text-3xl font-bold text-stone-900 mb-1">{req.bids}</div>
                                                            <div className="text-xs text-stone-500 uppercase font-bold tracking-widest font-mono">Active Bids</div>
                                                        </div>
                                                        <div className="w-12 h-12 rounded-full bg-stone-900/5 group-hover:bg-brand-primary flex items-center justify-center text-stone-500 group-hover:text-stone-900 transition-all">
                                                            <ChevronRight size={24} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
