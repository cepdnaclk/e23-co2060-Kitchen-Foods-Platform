// ---------------------------------------------------------------------------
// PaymentGateway — Premium Simulation
// ---------------------------------------------------------------------------
// A fully simulated, frontend-only payment gateway modal. Triggered after a
// customer accepts a chef's quote (order confirmed). Supports three payment
// methods: Card, Bank Transfer, and Cash on Delivery.
//
// No real money is transferred. A 2-second "processing" animation mimics a
// real payment processor response before resolving to a success or failure.
//
// Positioning: renders via a React portal into document.body so it is always
// perfectly centred in the viewport regardless of page scroll position.
// ---------------------------------------------------------------------------

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  Check,
  ChevronLeft,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
  X,
  Zap,
} from 'lucide-react';
import { formatPrice } from '../../utils/format';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaymentMethod = 'card' | 'bank' | 'cod';
type GatewayStep = 'method' | 'details' | 'processing' | 'success' | 'failed';

interface CardDetails {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

interface BankDetails {
  bank: string;
  account: string;
  otp: string;
}

export interface PaymentGatewayProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Order/request title shown in the summary. */
  orderTitle: string;
  /** Amount to charge in LKR. */
  amount: number;
  /** Called when payment succeeds. */
  onSuccess: () => void;
  /** Called when the modal is dismissed. */
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function simulatePaymentResult(): Promise<'success' | 'failed'> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(Math.random() < 0.85 ? 'success' : 'failed'), 2800),
  );
}

/** Detect card brand from first digit for the visual card preview. */
function detectCardBrand(num: string): 'visa' | 'mc' | 'amex' | 'unknown' {
  const d = num.replace(/\s/g, '');
  if (d.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(d)) return 'mc';
  if (/^3[47]/.test(d)) return 'amex';
  return 'unknown';
}

// ---------------------------------------------------------------------------
// Animated Floating Card Preview
// ---------------------------------------------------------------------------

const CardPreview: React.FC<{ details: CardDetails }> = ({ details }) => {
  const brand = detectCardBrand(details.number);
  const displayNum = details.number || '•••• •••• •••• ••••';
  const displayName = details.name || 'CARDHOLDER NAME';
  const displayExp = details.expiry || 'MM/YY';

  return (
    <motion.div
      initial={{ rotateY: -15, opacity: 0, y: 10 }}
      animate={{ rotateY: 0, opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      style={{ perspective: 1000 }}
      className="relative mx-auto mb-6 w-full max-w-[320px] h-44 rounded-2xl overflow-hidden select-none"
    >
      {/* Card background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-black" />
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/30 via-transparent to-amber-400/20" />

      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-brand-primary/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl" />

      {/* Chip */}
      <div className="absolute top-6 left-6 w-10 h-8 rounded-md bg-gradient-to-br from-amber-300 to-amber-500 opacity-90 flex items-center justify-center">
        <div className="w-7 h-5 rounded-sm border border-amber-400/50 grid grid-cols-2 gap-px p-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-amber-400/40 rounded-sm" />
          ))}
        </div>
      </div>

      {/* Brand mark */}
      <div className="absolute top-5 right-6 text-white/70 font-bold text-xs tracking-widest uppercase">
        {brand === 'visa' && <span className="text-base font-black italic">VISA</span>}
        {brand === 'mc' && (
          <div className="flex">
            <div className="w-7 h-7 bg-red-500 rounded-full opacity-90" />
            <div className="w-7 h-7 bg-amber-400 rounded-full -ml-3 opacity-80" />
          </div>
        )}
        {brand === 'amex' && <span className="text-base font-black">AMEX</span>}
        {brand === 'unknown' && <CreditCard size={24} className="text-white/40" />}
      </div>

      {/* Card number */}
      <div className="absolute bottom-14 left-6 right-6">
        <p className="font-mono text-white text-lg tracking-[0.2em] font-medium tabular-nums">
          {displayNum.padEnd(19, ' ')}
        </p>
      </div>

      {/* Name + Expiry */}
      <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
        <div>
          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Card Holder</p>
          <p className="text-white/90 text-xs font-bold uppercase tracking-wider truncate max-w-[160px]">
            {displayName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Expires</p>
          <p className="text-white/90 text-xs font-bold font-mono">{displayExp}</p>
        </div>
      </div>

      {/* Shimmer overlay */}
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'linear', repeatDelay: 2 }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
      />
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Styled Input
// ---------------------------------------------------------------------------

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon?: React.ReactNode }> = ({
  label,
  icon,
  ...props
}) => (
  <label className="block group">
    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block group-focus-within:text-brand-primary transition-colors">
      {label}
    </span>
    <div className="relative">
      <input
        {...props}
        className={`w-full px-4 py-3.5 ${icon ? 'pr-11' : ''} rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15 transition-all font-medium ${props.className ?? ''}`}
      />
      {icon && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-primary transition-colors">
          {icon}
        </div>
      )}
    </div>
  </label>
);

// ---------------------------------------------------------------------------
// Step 1 — Method Selection
// ---------------------------------------------------------------------------

const METHODS: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode; gradient: string }[] = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    sub: 'Visa · Mastercard · AMEX',
    icon: <CreditCard size={22} />,
    gradient: 'from-blue-500 to-violet-600',
  },
  {
    id: 'bank',
    label: 'Online Banking',
    sub: 'Sampath · BOC · HNB · People\'s',
    icon: <Smartphone size={22} />,
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    sub: 'Pay when your food arrives',
    icon: <Wallet size={22} />,
    gradient: 'from-amber-500 to-orange-600',
  },
];

const MethodStep: React.FC<{
  selected: PaymentMethod | null;
  amount: number;
  onSelect: (m: PaymentMethod) => void;
  onNext: () => void;
}> = ({ selected, amount, onSelect, onNext }) => (
  <motion.div
    key="method"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.28 }}
  >
    {/* Amount hero */}
    <div className="text-center mb-8">
      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Total Amount Due</p>
      <motion.p
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
        className="text-4xl font-serif font-bold text-stone-900"
      >
        {formatPrice(amount)}
      </motion.p>
    </div>

    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">
      Choose payment method
    </p>

    <div className="space-y-2.5 mb-7">
      {METHODS.map((opt, i) => (
        <motion.button
          key={opt.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          onClick={() => onSelect(opt.id)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
            selected === opt.id
              ? 'border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/15'
              : 'border-stone-100 bg-white hover:border-stone-200 hover:shadow-md hover:shadow-stone-900/5'
          }`}
        >
          {/* Selected glow */}
          {selected === opt.id && (
            <motion.div
              layoutId="method-glow"
              className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 to-transparent"
            />
          )}

          <div
            className={`relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${opt.gradient} text-white shadow-md`}
          >
            {opt.icon}
          </div>

          <div className="flex-1 relative">
            <p className="text-sm font-bold text-stone-800">{opt.label}</p>
            <p className="text-xs text-stone-400 mt-0.5">{opt.sub}</p>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 relative transition-all ${
              selected === opt.id
                ? 'border-brand-primary bg-brand-primary scale-110'
                : 'border-stone-200'
            }`}
          >
            {selected === opt.id && (
              <Check size={11} className="text-white" strokeWidth={3} />
            )}
          </div>
        </motion.button>
      ))}
    </div>

    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onNext}
      disabled={!selected}
      className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-amber-500 text-white font-bold text-sm shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
    >
      <Zap size={16} />
      Continue to Payment
    </motion.button>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Step 2a — Card Form
// ---------------------------------------------------------------------------

const CardForm: React.FC<{
  details: CardDetails;
  amount: number;
  onChange: (d: CardDetails) => void;
  onBack: () => void;
  onPay: () => void;
}> = ({ details, amount, onChange, onBack, onPay }) => {
  const isValid =
    details.number.replace(/\s/g, '').length === 16 &&
    details.name.trim().length > 2 &&
    details.expiry.length === 5 &&
    details.cvv.length >= 3;

  return (
    <motion.div
      key="card-form"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-stone-700 mb-5 transition-colors group"
      >
        <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      {/* Animated card preview */}
      <CardPreview details={details} />

      <div className="space-y-4 mb-5">
        <Input
          label="Card Number"
          type="text"
          inputMode="numeric"
          maxLength={19}
          placeholder="1234 5678 9012 3456"
          value={details.number}
          icon={<CreditCard size={16} />}
          onChange={(e) => onChange({ ...details, number: formatCardNumber(e.target.value) })}
          className="font-mono tracking-widest"
        />

        <Input
          label="Cardholder Name"
          type="text"
          placeholder="John Perera"
          value={details.name}
          onChange={(e) => onChange({ ...details, name: e.target.value.toUpperCase() })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Expiry"
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="MM/YY"
            value={details.expiry}
            onChange={(e) => onChange({ ...details, expiry: formatExpiry(e.target.value) })}
            className="font-mono"
          />
          <Input
            label="CVV"
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="•••"
            value={details.cvv}
            onChange={(e) => onChange({ ...details, cvv: e.target.value.replace(/\D/g, '') })}
            className="font-mono"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl mb-5">
        <Lock size={12} className="text-emerald-500 flex-shrink-0" />
        <span className="text-[11px] text-emerald-700 font-medium">
          Secured with 256-bit SSL encryption · PCI DSS Compliant
        </span>
      </div>

      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPay}
        disabled={!isValid}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-amber-500 text-white font-bold text-sm shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
      >
        <Lock size={15} />
        Pay {formatPrice(amount)} Securely
      </motion.button>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Step 2b — Bank Form
// ---------------------------------------------------------------------------

const BANKS = [
  'Sampath Bank',
  'Bank of Ceylon (BOC)',
  'HNB (Hatton National Bank)',
  "People's Bank",
  'Commercial Bank',
  'Seylan Bank',
  'NSB (National Savings Bank)',
  'DFCC Bank',
];

const BankForm: React.FC<{
  details: BankDetails;
  amount: number;
  onChange: (d: BankDetails) => void;
  onBack: () => void;
  onPay: () => void;
}> = ({ details, amount, onChange, onBack, onPay }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const sendOtp = () => {
    setOtpSent(true);
    setOtpTimer(30);
  };

  useEffect(() => {
    if (otpTimer <= 0) return;
    const id = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [otpTimer]);

  const isValid =
    details.bank.length > 0 &&
    details.account.replace(/\s/g, '').length >= 8 &&
    details.otp.length === 6;

  return (
    <motion.div
      key="bank-form"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-stone-700 mb-5 transition-colors group"
      >
        <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </button>

      {/* Bank icon hero */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 mb-3">
          <Smartphone size={28} />
        </div>
        <p className="text-xs text-stone-400 font-medium">Authorise via your bank's portal</p>
        <p className="text-2xl font-serif font-bold text-stone-900 mt-1">{formatPrice(amount)}</p>
      </div>

      <div className="space-y-4 mb-5">
        {/* Bank selector */}
        <div className="block group">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block group-focus-within:text-brand-primary transition-colors">
            Select Your Bank
          </span>
          <select
            value={details.bank}
            onChange={(e) => onChange({ ...details, bank: e.target.value })}
            className="w-full px-4 py-3.5 rounded-xl border border-stone-200 bg-stone-50 text-sm text-stone-800 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15 transition-all font-medium appearance-none cursor-pointer"
          >
            <option value="">Choose your bank…</option>
            {BANKS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <Input
          label="Account / Mobile Number"
          type="text"
          inputMode="numeric"
          placeholder="e.g. 0711234567"
          value={details.account}
          onChange={(e) => onChange({ ...details, account: e.target.value })}
          className="font-mono"
        />

        {/* OTP field */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2 block">
            OTP Verification
          </span>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit OTP"
              value={details.otp}
              onChange={(e) => onChange({ ...details, otp: e.target.value.replace(/\D/g, '') })}
              className="flex-1 px-4 py-3.5 rounded-xl border border-stone-200 bg-stone-50 text-sm font-mono text-stone-800 placeholder:text-stone-300 focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-2 focus:ring-brand-primary/15 transition-all tracking-[0.3em] font-bold"
            />
            <button
              onClick={sendOtp}
              disabled={otpTimer > 0 || !details.bank || details.account.length < 8}
              className="px-4 py-3 rounded-xl bg-stone-900 text-white text-xs font-bold whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors min-w-[72px]"
            >
              {otpTimer > 0 ? `${otpTimer}s` : otpSent ? 'Resend' : 'Get OTP'}
            </button>
          </div>
          {otpSent && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] text-emerald-600 mt-2 font-medium flex items-center gap-1"
            >
              <Check size={11} strokeWidth={3} />
              OTP sent! (Simulation: enter any 6 digits)
            </motion.p>
          )}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onPay}
        disabled={!isValid}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
      >
        <ShieldCheck size={15} />
        Authorise Bank Transfer
      </motion.button>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Step 2c — Cash on Delivery
// ---------------------------------------------------------------------------

const CodConfirm: React.FC<{
  amount: number;
  onBack: () => void;
  onPay: () => void;
}> = ({ amount, onBack, onPay }) => (
  <motion.div
    key="cod"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.28 }}
  >
    <button
      onClick={onBack}
      className="flex items-center gap-1.5 text-xs font-bold text-stone-400 hover:text-stone-700 mb-5 transition-colors group"
    >
      <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
      Back
    </button>

    <div className="flex flex-col items-center mb-7">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 mb-4"
      >
        <Wallet size={36} />
      </motion.div>
      <h4 className="text-lg font-serif font-bold text-stone-900">Cash on Delivery</h4>
      <p className="text-xs text-stone-400 mt-1">Pay in cash when your order arrives</p>
    </div>

    <div className="space-y-3 mb-7">
      {[
        { icon: '💰', text: `Prepare exact change of ${formatPrice(amount)}` },
        { icon: '🚗', text: 'Chef / delivery person will collect on arrival' },
        { icon: '✅', text: 'Your order is confirmed and will begin preparation' },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-xl"
        >
          <span className="text-lg leading-none mt-0.5">{item.icon}</span>
          <p className="text-sm text-amber-800 font-medium">{item.text}</p>
        </motion.div>
      ))}
    </div>

    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onPay}
      className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all flex items-center justify-center gap-2"
    >
      <Check size={16} strokeWidth={3} />
      Confirm Order — Pay on Delivery
    </motion.button>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Step 3 — Processing
// ---------------------------------------------------------------------------

const ProcessingStep: React.FC = () => (
  <motion.div
    key="processing"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center py-10 text-center"
  >
    {/* Layered spinner */}
    <div className="relative w-24 h-24 mb-8">
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-[3px] border-brand-primary/20 border-t-brand-primary"
      />
      {/* Middle ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        className="absolute inset-3 rounded-full border-[2px] border-amber-400/30 border-b-amber-400"
      />
      {/* Center pulse */}
      <motion.div
        animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute inset-7 rounded-full bg-gradient-to-br from-brand-primary to-amber-400"
      />
      <Lock size={16} className="absolute inset-0 m-auto text-white z-10" />
    </div>

    <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Processing Payment</h3>
    <p className="text-sm text-stone-500 mb-1">Communicating with the payment gateway…</p>

    {/* Animated dots */}
    <div className="flex items-center gap-1.5 mt-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: 'easeInOut' }}
          className="w-2 h-2 rounded-full bg-brand-primary"
        />
      ))}
    </div>

    <p className="text-xs text-stone-300 mt-5">Please do not close this window</p>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Step 4a — Success
// ---------------------------------------------------------------------------

const SuccessStep: React.FC<{ amount: number; method: PaymentMethod; onClose: () => void }> = ({
  amount,
  method,
  onClose,
}) => {
  const txId = useRef(Math.random().toString(36).slice(2, 12).toUpperCase());
  const methodLabel =
    method === 'card' ? 'Credit / Debit Card' : method === 'bank' ? 'Bank Transfer' : 'Cash on Delivery';

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center text-center"
    >
      {/* ── Full-width celebration banner ── */}
      <div className="w-full -mx-0 mb-6 pt-6 pb-5 px-6 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 relative overflow-hidden">
        {/* Background shimmer */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', repeatDelay: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
        />

        {/* Floating emoji stars */}
        {['🌟', '✨', '⭐', '💫'].map((star, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -10, 0], rotate: [0, 15, 0, -15, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.4, delay: i * 0.3, ease: 'easeInOut' }}
            className="absolute text-xl select-none"
            style={{
              top: `${10 + (i % 2) * 55}%`,
              left: `${8 + i * 22}%`,
              fontSize: '1.1rem',
            }}
          >
            {star}
          </motion.span>
        ))}

        {/* Big emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 16, delay: 0.08 }}
          className="text-6xl mb-3 relative z-10 select-none"
        >
          🎉
        </motion.div>

        {/* Success ring */}
        <div className="relative inline-block mb-3 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.18 }}
            className="w-16 h-16 rounded-full bg-white/20 border-4 border-white flex items-center justify-center shadow-lg mx-auto"
          >
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.3 }}
            >
              <Check size={30} className="text-white" strokeWidth={3} />
            </motion.div>
          </motion.div>
          {[0, 1].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 2.2 + i * 0.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.65, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-white"
            />
          ))}
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="text-xl font-serif font-bold text-white relative z-10"
        >
          Your Payment Was Successful!
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="text-emerald-100 text-sm mt-1 relative z-10"
        >
          {formatPrice(amount)} via <span className="font-bold text-white">{methodLabel}</span>
        </motion.p>
      </div>

      {/* Receipt strip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl mb-5"
      >
        <span className="text-xs text-stone-400 font-medium">Transaction ID</span>
        <span className="text-xs font-mono font-bold text-stone-600">{txId.current}</span>
      </motion.div>

      {/* Bouncing confetti dots */}
      <div className="flex justify-center gap-2 mb-5">
        {['bg-brand-primary', 'bg-amber-400', 'bg-emerald-400', 'bg-blue-400', 'bg-pink-400', 'bg-violet-400'].map((c, i) => (
          <motion.div
            key={i}
            animate={{ y: [-12, 0], scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 0.9 + i * 0.12, delay: i * 0.08, ease: 'easeInOut', repeatType: 'reverse' }}
            className={`w-2.5 h-2.5 rounded-full ${c}`}
          />
        ))}
      </div>

      {/* What happens next */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 text-left mb-5"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-1.5">
          <Sparkles size={11} /> What happens next
        </p>
        {[
          { emoji: '👨‍🍳', text: 'Your chef has been notified', sub: 'They\'ll start cooking right away' },
          { emoji: '🍳', text: 'Preparation in progress', sub: 'Check the progress bar on your order' },
          { emoji: '🚗', text: 'Delivery on the way', sub: 'Your food arrives at the agreed time' },
        ].map((item, i) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 + i * 0.1 }}
            className="flex items-start gap-3 py-2 border-b border-emerald-100 last:border-0"
          >
            <span className="text-xl leading-none mt-0.5">{item.emoji}</span>
            <div>
              <p className="text-sm font-bold text-emerald-800">{item.text}</p>
              <p className="text-xs text-emerald-600 mt-0.5">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
      >
        🎉 &nbsp;Done — Back to My Orders
      </motion.button>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Step 4b — Failed
// ---------------------------------------------------------------------------

const FailedStep: React.FC<{ onRetry: () => void; onClose: () => void }> = ({ onRetry, onClose }) => (
  <motion.div
    key="failed"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center text-center py-6"
  >
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-red-600 flex items-center justify-center shadow-xl shadow-rose-500/40 mb-6"
    >
      <AlertCircle size={40} className="text-white" />
    </motion.div>

    <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Payment Failed</h3>
    <p className="text-stone-500 text-sm mb-1 max-w-[260px]">
      We couldn't process your payment. Please check your details and try again.
    </p>
    <p className="text-xs text-stone-300 mb-8">Error code: PAYMENT_DECLINED</p>

    <div className="flex flex-col gap-3 w-full">
      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onRetry}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-primary to-amber-500 text-white font-bold text-sm shadow-lg shadow-brand-primary/30 hover:shadow-xl transition-all flex items-center justify-center gap-2"
      >
        <Zap size={15} /> Try Again
      </motion.button>
      <button
        onClick={onClose}
        className="w-full py-3.5 rounded-2xl border-2 border-stone-100 text-stone-500 font-bold text-sm hover:bg-stone-50 hover:border-stone-200 transition-all"
      >
        Cancel
      </button>
    </div>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Main PaymentGateway — rendered via Portal for perfect viewport centering
// ---------------------------------------------------------------------------

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
  open,
  orderTitle,
  amount,
  onSuccess,
  onClose,
}) => {
  const [step, setStep] = useState<GatewayStep>('method');
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [cardDetails, setCardDetails] = useState<CardDetails>({ number: '', name: '', expiry: '', cvv: '' });
  const [bankDetails, setBankDetails] = useState<BankDetails>({ bank: '', account: '', otp: '' });

  // Reset state on open
  useEffect(() => {
    if (open) {
      setStep('method');
      setMethod(null);
      setCardDetails({ number: '', name: '', expiry: '', cvv: '' });
      setBankDetails({ bank: '', account: '', otp: '' });
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleFinishSuccess = useCallback(() => {
    onSuccess();
    onClose();
  }, [onSuccess, onClose]);

  const handleClose = useCallback(() => {
    if (step === 'success') {
      handleFinishSuccess();
    } else {
      onClose();
    }
  }, [step, handleFinishSuccess, onClose]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'processing') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, step, handleClose]);

  const handlePay = useCallback(async () => {
    if (method === 'cod') {
      setStep('processing');
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStep('success');
      return;
    }
    setStep('processing');
    const result = await simulatePaymentResult();
    setStep(result);
  }, [method]);

  const handleRetry = () => {
    setStep('method');
    setMethod(null);
  };

  // Render into portal so it is always on top of everything, independent of page scroll
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="pg-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => step !== 'processing' && handleClose()}
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            className="bg-black/60 backdrop-blur-sm"
          />

          {/* ── Centering shell — static fixed full-screen flex container.
               Keeps centering independent of Framer Motion's transforms. ── */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              pointerEvents: 'none',
            }}
          >
          {/* ── Animated card — only scale/opacity/y, no translate conflict ── */}
          <motion.div
            key="pg-panel"
            initial={{ opacity: 0, scale: 0.93, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
            style={{
              width: '100%',
              maxWidth: '440px',
              maxHeight: '92dvh',
              overflowY: 'auto',
              pointerEvents: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-[28px] shadow-2xl shadow-stone-900/25 overflow-hidden">
              {/* Top accent gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-amber-400 to-amber-300" />

              {/* Header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-4 border-b border-stone-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-primary to-amber-400 flex items-center justify-center shadow-md shadow-brand-primary/30">
                    <Lock size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 leading-none">
                      Kitchen Foods
                    </p>
                    <p className="text-[11px] font-bold text-stone-600 leading-tight">Secure Checkout</p>
                  </div>
                </div>

                {/* Order title pill */}
                <div className="flex items-center gap-1.5 max-w-[140px]">
                  <span className="text-[10px] text-stone-400 truncate">{orderTitle}</span>
                </div>

                {/* Close — hidden during processing */}
                {step !== 'processing' && (
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-all ml-2 flex-shrink-0"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="px-7 py-6">
                <AnimatePresence mode="wait">
                  {step === 'method' && (
                    <MethodStep
                      selected={method}
                      amount={amount}
                      onSelect={setMethod}
                      onNext={() => setStep('details')}
                    />
                  )}

                  {step === 'details' && method === 'card' && (
                    <CardForm
                      details={cardDetails}
                      amount={amount}
                      onChange={setCardDetails}
                      onBack={() => setStep('method')}
                      onPay={handlePay}
                    />
                  )}

                  {step === 'details' && method === 'bank' && (
                    <BankForm
                      details={bankDetails}
                      amount={amount}
                      onChange={setBankDetails}
                      onBack={() => setStep('method')}
                      onPay={handlePay}
                    />
                  )}

                  {step === 'details' && method === 'cod' && (
                    <CodConfirm
                      amount={amount}
                      onBack={() => setStep('method')}
                      onPay={handlePay}
                    />
                  )}

                  {step === 'processing' && <ProcessingStep />}

                  {step === 'success' && (
                    <SuccessStep amount={amount} method={method!} onClose={handleFinishSuccess} />
                  )}

                  {step === 'failed' && (
                    <FailedStep onRetry={handleRetry} onClose={handleClose} />
                  )}
                </AnimatePresence>
              </div>

              {/* Footer — shown only on method/details steps */}
              {(step === 'method' || step === 'details') && (
                <div className="px-7 py-4 border-t border-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-stone-300">
                    <ShieldCheck size={13} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Bank-grade Security
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {['VISA', 'MC', 'AMEX', 'BOC'].map((b) => (
                      <div
                        key={b}
                        className="px-2 py-1 bg-stone-50 border border-stone-100 rounded-md"
                      >
                        <span className="text-[9px] font-black text-stone-400 tracking-wide">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};
