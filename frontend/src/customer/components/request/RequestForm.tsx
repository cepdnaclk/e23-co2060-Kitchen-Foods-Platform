// ---------------------------------------------------------------------------
// RequestForm
// ---------------------------------------------------------------------------
// The "customize your order" form: portions, spice level, dietary needs on
// the left; date/time, budget, special instructions on the right. Field
// state lives in the useRequestForm hook; this component only composes the
// field components and serializes the result into a Partial<Request>.
// ---------------------------------------------------------------------------

import React, { useEffect, useRef } from 'react';
import { AlertCircle, MessageSquare, X } from 'lucide-react';
import type { Request } from '../../types';
import { useRequestForm } from '../../hooks/useRequestForm';
import { PortionSelector } from './PortionSelector';
import { SpiceLevelSelector } from './SpiceLevelSelector';
import { DateTimeFields } from './DateTimeFields';
import { BudgetField } from './BudgetField';

const SPICE_LEVELS = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

interface RequestFormProps {
  category: string;
  onCancel: () => void;
  onSubmit: (data: Partial<Request>) => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ category, onCancel, onSubmit }) => {
  const formRef = useRef<HTMLDivElement>(null);
  const { formData, setField } = useRequestForm();

  // Bring the form into view whenever it mounts (it appears below the fold).
  useEffect(() => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: `${category} Request`,
      guests: formData.portions,
      budget: formData.budget,
      date: formData.date,
      // Passed explicitly so MenuCustomization doesn't have to regex-parse it.
      deliveryTime: formData.time,
      dietary: formData.dietary ? formData.dietary.split(',').map((d) => d.trim()) : [],
      // The description doubles as a free-text summary of the order.
      description: `
        Category: ${category}
        Spice Level: ${SPICE_LEVELS[formData.spiceLevel]}
        Time: ${formData.time}
        Customizations: ${formData.customizations}
      `,
    });
  };

  return (
    <div
      ref={formRef}
      className="bg-white rounded-[32px] border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 scroll-mt-24"
    >
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
          {/* Left column */}
          <div className="space-y-10">
            <PortionSelector portions={formData.portions} onChange={(v) => setField('portions', v)} />
            <SpiceLevelSelector spiceLevel={formData.spiceLevel} onChange={(v) => setField('spiceLevel', v)} />

            {/* Dietary needs */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">
                <AlertCircle size={16} className="text-brand-primary" />
                Dietary Needs
              </label>
              <input
                type="text"
                placeholder="e.g., Gluten-free, no peanuts..."
                value={formData.dietary}
                onChange={(e) => setField('dietary', e.target.value)}
                className="w-full px-5 py-4 bg-stone-50 text-stone-900 placeholder-stone-400 border border-stone-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-10">
            <DateTimeFields
              date={formData.date}
              time={formData.time}
              onDateChange={(v) => setField('date', v)}
              onTimeChange={(v) => setField('time', v)}
            />
            <BudgetField budget={formData.budget} onChange={(v) => setField('budget', v)} />

            {/* Special instructions */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-stone-900 uppercase tracking-widest mb-4">
                <MessageSquare size={16} className="text-brand-primary" />
                Special Instructions
              </label>
              <textarea
                rows={2}
                placeholder="Any specific preferences or requests..."
                value={formData.customizations}
                onChange={(e) => setField('customizations', e.target.value)}
                className="w-full px-5 py-4 bg-stone-50 text-stone-900 placeholder-stone-400 border border-stone-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none resize-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
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
