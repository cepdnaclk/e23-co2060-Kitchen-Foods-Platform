// ---------------------------------------------------------------------------
// DateTimeFields
// ---------------------------------------------------------------------------
// Native date + time inputs. The date/time value comes from the parent via
// props, so the form can submit it both as the delivery date and (through
// RequestForm) as the delivery time.
// ---------------------------------------------------------------------------

import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface DateTimeFieldsProps {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}

/** Make the entire native picker input clickable (icon overlaps it). */
const PICKER_STYLE = `
  input[type="date"]::-webkit-calendar-picker-indicator,
  input[type="time"]::-webkit-calendar-picker-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`;

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({
  date,
  time,
  onDateChange,
  onTimeChange,
}) => (
  <div className="grid grid-cols-2 gap-5">
    <div>
      <label className="block text-sm font-bold text-stone-900 uppercase tracking-widest mb-3">Date</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Calendar size={18} className="text-stone-400 group-focus-within:text-brand-primary transition-colors" />
        </div>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-stone-50 text-stone-900 border border-stone-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-medium cursor-pointer"
        />
        <style>{PICKER_STYLE}</style>
      </div>
    </div>
    <div>
      <label className="block text-sm font-bold text-stone-900 uppercase tracking-widest mb-3">Time</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Clock size={18} className="text-stone-400 group-focus-within:text-brand-primary transition-colors" />
        </div>
        <input
          type="time"
          required
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-stone-50 text-stone-900 border border-stone-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-medium cursor-pointer"
        />
        <style>{PICKER_STYLE}</style>
      </div>
    </div>
  </div>
);
