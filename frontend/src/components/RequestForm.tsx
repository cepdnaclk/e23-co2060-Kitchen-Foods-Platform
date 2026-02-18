import React, { useState, useEffect, useRef } from 'react';
import { X, Users, Flame, DollarSign, Calendar, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Request } from './Layout';

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
            date: formData.date, // Note: Layout.tsx Request type expects string date
            dietary: formData.dietary ? formData.dietary.split(',').map(d => d.trim()) : [],
            // We'll need to handle custom fields (spice, time, customizations) in the parent or update the type
            description: `
        Category: ${category}
        Spice Level: ${['Mild', 'Medium', 'Hot', 'Extra Hot'][formData.spiceLevel]}
        Time: ${formData.time}
        Customizations: ${formData.customizations}
      `
        } as any); // Casting for now until we update the Request interface fully
    };

    return (
        <div ref={formRef} className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 scroll-mt-24">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900">{category}</h2>
                    <p className="text-neutral-500">Customize your order to your exact preferences</p>
                </div>
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors font-medium"
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
                            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                                <Users size={16} className="text-orange-600" />
                                Number of Portions
                            </label>
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    className="w-12 h-12 rounded-xl border border-neutral-200 flex items-center justify-center hover:borderColor-neutral-300 hover:bg-neutral-50 transition-all text-xl"
                                    onClick={() => setFormData(p => ({ ...p, portions: Math.max(1, p.portions - 1) }))}
                                >
                                    -
                                </button>
                                <span className="text-2xl font-bold w-12 text-center text-neutral-900">{formData.portions}</span>
                                <button
                                    type="button"
                                    className="w-12 h-12 rounded-xl border border-neutral-200 flex items-center justify-center hover:borderColor-neutral-300 hover:bg-neutral-50 transition-all text-xl"
                                    onClick={() => setFormData(p => ({ ...p, portions: p.portions + 1 }))}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Spice Level */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-4 flex items-center gap-2">
                                <Flame size={16} className="text-orange-600" />
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
                                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                                />
                                <div className="flex justify-between text-sm text-neutral-600 mt-3 font-medium">
                                    <span className={formData.spiceLevel === 0 ? 'text-orange-600 font-bold' : ''}>Mild</span>
                                    <span className={formData.spiceLevel === 1 ? 'text-orange-600 font-bold' : ''}>Medium</span>
                                    <span className={formData.spiceLevel === 2 ? 'text-orange-600 font-bold' : ''}>Hot</span>
                                    <span className={formData.spiceLevel === 3 ? 'text-orange-600 font-bold' : ''}>Extra Hot</span>
                                </div>
                            </div>
                        </div>

                        {/* Dietary Restrictions */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                                <AlertCircle size={16} className="text-orange-600" />
                                Dietary Restrictions
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Gluten-free, Nut allergy..."
                                value={formData.dietary}
                                onChange={(e) => setFormData(p => ({ ...p, dietary: e.target.value }))}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                                    <Calendar size={16} className="text-orange-600" />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                                    <Clock size={16} className="text-orange-600" />
                                    Time
                                </label>
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))}
                                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                                <DollarSign size={16} className="text-orange-600" />
                                Budget (LKR)
                            </label>
                            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex bg-white rounded-lg p-1 border border-neutral-200 shadow-sm">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, budgetType: 'slider' }))}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${formData.budgetType === 'slider' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                                        >
                                            Slider
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, budgetType: 'manual' }))}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${formData.budgetType === 'manual' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'}`}
                                        >
                                            Manual Input
                                        </button>
                                    </div>
                                    <div className="ml-auto text-xl font-bold text-neutral-900">
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
                                        className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-neutral-900 border border-neutral-200"
                                    />
                                ) : (
                                    <input
                                        type="number"
                                        min="500"
                                        value={formData.budget}
                                        onChange={(e) => setFormData(p => ({ ...p, budget: parseInt(e.target.value) || 0 }))}
                                        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-bold text-neutral-900 bg-white"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Other Customizations */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Other Customizations
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Any specific preferences or instructions?"
                                value={formData.customizations}
                                onChange={(e) => setFormData(p => ({ ...p, customizations: e.target.value }))}
                                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border border-neutral-200 rounded-xl text-neutral-600 font-bold hover:bg-neutral-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-200"
                    >
                        Post Request
                    </button>
                </div>
            </form>
        </div>
    );
};
