import React, { useState, useEffect, useRef } from 'react';
import { X, Users, Flame, DollarSign, Calendar, Clock, AlertCircle, MessageSquare, MapPin, Loader2 } from 'lucide-react';
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
        budget: 500,
        budgetType: 'slider' as 'slider' | 'manual'
    });

    const [clientLocation, setClientLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [locationError, setLocationError] = useState<string | null>(null);

    const fetchLocation = () => {
        setLocationStatus('loading');
        setLocationError(null);
        if (!navigator.geolocation) {
            setLocationStatus('error');
            setLocationError('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setClientLocation({
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude
                });
                setLocationStatus('success');
                setLocationError(null);
            },
            (err) => {
                console.warn('Geolocation capture error:', err);
                setLocationStatus('error');
                setLocationError(
                    err.code === 1
                        ? 'Location access denied. Please allow browser location access to verify the 10km delivery radius.'
                        : 'Unable to retrieve your location. Please check your browser location settings.'
                );
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    };

    // Auto-scroll to form on mount and capture location
    useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        fetchLocation();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const basePayload: Partial<Request> = {
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
        };

        if (!clientLocation) {
            if (locationStatus === 'loading') {
                alert('Please wait a moment while we detect your location for 10km radius verification.');
                return;
            }

            // If not captured yet, attempt to trigger prompt once more
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                        setClientLocation(coords);
                        onSubmit({
                            ...basePayload,
                            clientLatitude: coords.latitude,
                            clientLongitude: coords.longitude
                        });
                    },
                    () => {
                        alert('Location permission is required to verify you are within the 10km delivery radius of the chef.');
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
                return;
            } else {
                alert('Geolocation is not supported by your browser.');
                return;
            }
        }

        onSubmit({
            ...basePayload,
            clientLatitude: clientLocation.latitude,
            clientLongitude: clientLocation.longitude
        });
    };

    const spiceLevels = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

    return (
        <div ref={formRef} className="bg-white rounded-[32px] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 scroll-mt-24">
            {/* Header */}
            <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-stone-900 leading-tight">Order Details</h2>
                    <p className="text-sm text-stone-500 mt-1">Customize your {category.toLowerCase()} to perfection.</p>
                </div>
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:bg-stone-200 hover:text-stone-700 transition-all cursor-pointer"
                >
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                    {/* Left Column */}
                    <div className="space-y-10">
                        
                        {/* Portions */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">
                                <Users size={16} className="text-brand-primary" />
                                Portions
                            </label>
                            <div className="inline-flex items-center p-1.5 bg-stone-100 rounded-2xl border border-stone-200">
                                <button
                                    type="button"
                                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-stone-200 text-xl font-medium text-stone-600 hover:text-brand-primary hover:border-brand-primary/30 transition-all"
                                    onClick={() => setFormData(p => ({ ...p, portions: Math.max(1, p.portions - 1) }))}
                                >
                                    -
                                </button>
                                <span className="w-16 text-center text-2xl font-serif font-bold text-stone-900">
                                    {formData.portions}
                                </span>
                                <button
                                    type="button"
                                    className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-stone-200 text-xl font-medium text-stone-600 hover:text-brand-primary hover:border-brand-primary/30 transition-all"
                                    onClick={() => setFormData(p => ({ ...p, portions: p.portions + 1 }))}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Spice Level (Segmented Control) */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">
                                <Flame size={16} className="text-brand-primary" />
                                Spice Level
                            </label>
                            <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                                {spiceLevels.map((level, idx) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, spiceLevel: idx }))}
                                        className={`flex-1 py-3 px-2 text-sm font-semibold rounded-xl transition-all ${
                                            formData.spiceLevel === idx 
                                                ? 'bg-white text-brand-primary shadow-sm border border-stone-200/50' 
                                                : 'text-stone-500 hover:text-stone-900'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dietary Restrictions */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">
                                <AlertCircle size={16} className="text-brand-primary" />
                                Dietary Needs
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Gluten-free, no peanuts..."
                                value={formData.dietary}
                                onChange={(e) => setFormData(p => ({ ...p, dietary: e.target.value }))}
                                className="w-full px-5 py-4 bg-stone-50 text-stone-900 placeholder-stone-400 border border-stone-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-10">
                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-stone-900 uppercase tracking-widest mb-3">
                                    Date
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Calendar size={18} className="text-stone-400 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                                        className="w-full pl-12 pr-4 py-4 bg-stone-50 text-stone-900 border border-stone-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-medium cursor-pointer"
                                        style={{
                                            position: 'relative'
                                        }}
                                    />
                                    {/* Make entire input click open the native calendar */}
                                    <style>{`
                                        input[type="date"]::-webkit-calendar-picker-indicator {
                                            position: absolute;
                                            left: 0;
                                            top: 0;
                                            width: 100%;
                                            height: 100%;
                                            opacity: 0;
                                            cursor: pointer;
                                        }
                                    `}</style>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-stone-900 uppercase tracking-widest mb-3">
                                    Time
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Clock size={18} className="text-stone-400 group-focus-within:text-brand-primary transition-colors" />
                                    </div>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))}
                                        className="w-full pl-12 pr-4 py-4 bg-stone-50 text-stone-900 border border-stone-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-medium cursor-pointer"
                                    />
                                    <style>{`
                                        input[type="time"]::-webkit-calendar-picker-indicator {
                                            position: absolute;
                                            left: 0;
                                            top: 0;
                                            width: 100%;
                                            height: 100%;
                                            opacity: 0;
                                            cursor: pointer;
                                        }
                                    `}</style>
                                </div>
                            </div>
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="block text-sm font-bold text-stone-900 uppercase tracking-widest mb-3">
                                Budget
                            </label>
                            
                            <div className="p-1">
                                <div className="relative mb-3">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <span className="text-stone-400 font-bold">LKR</span>
                                    </div>
                                    <input
                                        type="number"
                                        min="500"
                                        value={formData.budget}
                                        onChange={(e) => setFormData(p => ({ ...p, budget: parseInt(e.target.value) || 0 }))}
                                        className="w-full pl-16 pr-5 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none font-bold text-2xl text-stone-900 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    {[500, 1000, 5000].map(amount => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => setFormData(p => ({ ...p, budget: p.budget + amount }))}
                                            className="flex-1 py-2 text-xs font-bold text-stone-600 bg-stone-100 hover:bg-brand-primary hover:text-white rounded-xl transition-all"
                                        >
                                            + {amount.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">
                                <MessageSquare size={16} className="text-brand-primary" />
                                Special Instructions
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Any specific preferences or requests..."
                                value={formData.customizations}
                                onChange={(e) => setFormData(p => ({ ...p, customizations: e.target.value }))}
                                className="w-full px-5 py-4 bg-stone-50 text-stone-900 placeholder-stone-400 border border-stone-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none transition-all"
                            />
                        </div>

                        {/* Delivery Location Status (Automatic Geolocation) */}
                        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider">
                                    <MapPin size={14} className="text-brand-primary" />
                                    Delivery Location (10km Check)
                                </label>
                                {locationStatus === 'success' && (
                                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-300">
                                        ✓ Verified GPS
                                    </span>
                                )}
                            </div>

                            {locationStatus === 'loading' && (
                                <div className="flex items-center gap-2 text-xs text-stone-500 py-1">
                                    <Loader2 size={13} className="animate-spin text-brand-primary" />
                                    <span>Acquiring browser GPS coordinates automatically...</span>
                                </div>
                            )}

                            {locationStatus === 'success' && clientLocation && (
                                <div className="flex items-center justify-between text-xs text-stone-600 py-1">
                                    <span className="font-mono text-[11px] text-stone-500">
                                        Lat: {clientLocation.latitude.toFixed(4)}, Lng: {clientLocation.longitude.toFixed(4)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={fetchLocation}
                                        className="text-[11px] text-brand-primary hover:underline font-bold ml-2 cursor-pointer"
                                    >
                                        Refresh GPS
                                    </button>
                                </div>
                            )}

                            {locationStatus === 'error' && (
                                <div className="text-xs text-rose-600 bg-rose-50/60 p-2.5 rounded-xl border border-rose-200/60 flex items-start justify-between gap-2 mt-1">
                                    <span className="leading-snug">{locationError}</span>
                                    <button
                                        type="button"
                                        onClick={fetchLocation}
                                        className="text-[11px] font-bold text-brand-primary hover:underline shrink-0 cursor-pointer"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="mt-12 pt-8 border-t border-stone-100 flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-4 rounded-2xl text-stone-500 font-bold hover:bg-stone-50 hover:text-stone-900 transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all cursor-pointer text-lg"
                    >
                        Confirm Order
                    </button>
                </div>
            </form>
        </div>
    );
};
