import React, { useState, useEffect, useRef } from 'react';
import { X, Users, Flame, DollarSign, Calendar, Clock, AlertCircle } from 'lucide-react';
import { Request } from '../types';

interface RequestFormProps {
    category: string;
    onCancel: () => void;
    onSubmit: (data: Partial<Request>) => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ category, onCancel, onSubmit }) => {
    const formRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        portions: 1,
        spiceLevel: 1, // 0-3: Mild, Medium, Hot, Extra Hot
        dietary: '',
        customizations: '',
        date: '',
        time: '',
        budget: 50,
        budgetType: 'manual' as 'slider' | 'manual'
    });

    // Auto-scroll to form on mount
    useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title: `${category} Request`,
            guests: formData.portions,
            budget: formData.budget,
            date: formData.date,
            dietary: formData.dietary ? formData.dietary.split(',').map(d => d.trim()) : [],
            description: `
        Category: ${category}
        Spice Level: ${['Mild', 'Medium', 'Hot', 'Extra Hot'][formData.spiceLevel]}
        Time: ${formData.time}
        Customizations: ${formData.customizations}
      `
        });
    };

    return (
        <div ref={formRef} className="glass rounded-[40px] border border-white/5 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 scroll-mt-24">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div>
                    <h2 className="text-2xl font-bold text-white">{category}</h2>
                    <p className="text-white/40">Customize your order to your exact preferences</p>
                </div>
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors font-medium"
                >
                    <X size={18} />
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Portions */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                <Users size={16} className="text-brand-primary" />
                                Number of Portions
                            </label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center hover:border-brand-primary hover:bg-white/5 transition-all text-xl text-white"
                                    onClick={() => setFormData(p => ({ ...p, portions: Math.max(1, p.portions - 1) }))}
                                >
                                    -
                                </button>
                                <span className="text-2xl font-bold w-12 text-center text-white">{formData.portions}</span>
                                <button
                                    type="button"
                                    className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center hover:border-brand-primary hover:bg-white/5 transition-all text-xl text-white"
                                    onClick={() => setFormData(p => ({ ...p, portions: p.portions + 1 }))}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Spice Level */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
                                <Flame size={16} className="text-brand-primary" />
                                Spice Level
                            </label>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="3"
                                    step="1"
                                    value={formData.spiceLevel}
                                    onChange={(e) => setFormData(p => ({ ...p, spiceLevel: parseInt(e.target.value) }))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                />
                                <div className="flex justify-between text-sm text-white/50 mt-3 font-medium">
                                    <span className={formData.spiceLevel === 0 ? 'text-brand-primary font-bold' : ''}>Mild</span>
                                    <span className={formData.spiceLevel === 1 ? 'text-brand-primary font-bold' : ''}>Medium</span>
                                    <span className={formData.spiceLevel === 2 ? 'text-brand-primary font-bold' : ''}>Hot</span>
                                    <span className={formData.spiceLevel === 3 ? 'text-brand-primary font-bold' : ''}>Extra Hot</span>
                                </div>
                            </div>
                        </div>

                        {/* Dietary Restrictions */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                <AlertCircle size={16} className="text-brand-primary" />
                                Dietary Restrictions
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Gluten-free, Nut allergy..."
                                value={formData.dietary}
                                onChange={(e) => setFormData(p => ({ ...p, dietary: e.target.value }))}
                                className="w-full px-4 py-3 bg-white/5 text-white placeholder-white/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                    <Calendar size={16} className="text-brand-primary" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                    <Clock size={16} className="text-brand-primary" />
                                    Time
                                </label>
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))}
                                    className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                <DollarSign size={16} className="text-brand-primary" />
                                Budget (LKR)
                            </label>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 justify-between">
                                    <div className="flex bg-white/10 rounded-lg p-1 border border-white/5 shadow-sm w-fit">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, budgetType: 'slider' }))}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${formData.budgetType === 'slider' ? 'bg-brand-primary text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
                                        >
                                            Slider
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, budgetType: 'manual' }))}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${formData.budgetType === 'manual' ? 'bg-brand-primary text-white shadow-sm' : 'text-white/50 hover:text-white'}`}
                                        >
                                            Manual Input
                                        </button>
                                    </div>
                                    <div className="text-xl font-bold text-white whitespace-nowrap">
                                        LKR {formData.budget.toLocaleString()}
                                    </div>
                                </div>

                                {formData.budgetType === 'slider' ? (
                                    <input
                                        type="range"
                                        min="500"
                                        max="50000"
                                        step="100"
                                        value={formData.budget}
                                        onChange={(e) => setFormData(p => ({ ...p, budget: parseInt(e.target.value) }))}
                                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                    />
                                ) : (
                                    <input
                                        type="number"
                                        min="500"
                                        value={formData.budget}
                                        onChange={(e) => setFormData(p => ({ ...p, budget: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none font-bold text-white bg-white/5"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Other Customizations */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Other Customizations
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Any specific preferences or instructions?"
                                value={formData.customizations}
                                onChange={(e) => setFormData(p => ({ ...p, customizations: e.target.value }))}
                                className="w-full px-4 py-3 bg-white/5 text-white placeholder-white/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none resize-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border border-white/10 rounded-xl text-white/60 font-bold hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3 bg-brand-primary text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-brand-primary/20 cursor-pointer"
                    >
                        Post Request
                    </button>
                </div>
            </form>
        </div>
    );
};
