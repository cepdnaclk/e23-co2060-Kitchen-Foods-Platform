// ---------------------------------------------------------------------------
// PaymentGateway
// ---------------------------------------------------------------------------
// A fully simulated, frontend-only payment gateway modal. Triggered after a
// customer accepts a chef's quote (order confirmed). Supports three payment
// methods: Card, Bank Transfer, and Cash on Delivery.
//
// No real money is transferred. A 2-second "processing" animation mimics a
// real payment processor response before resolving to a success or failure.
// ---------------------------------------------------------------------------

import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  ChevronLeft,
  CreditCard,
  Lock,
  ShieldCheck,
  Smartphone,
  Wallet,
  X,
  AlertCircle,
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

interface PaymentGatewayProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Order/request title shown in the summary. */
  orderTitle: string;
  /** Amount to charge in LKR. */
  amount: number;
  /** Called when payment succeeds — parent should refresh or update state. */
  onSuccess: () => void;
  /** Called when the modal is dismissed without completing payment. */
  onClose: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mask a card number, keeping only the last 4 digits visible. */
function maskCard(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/** Format expiry input as MM/YY. */
function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/** Simulate a 70% success rate for card / bank payments. */
function simulatePaymentResult(): Promise<'success' | 'failed'> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(Math.random() < 0.85 ? 'success' : 'failed'), 2400),
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Top-right close button. */
const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors z-10"
    aria-label="Close payment modal"
  >
    <X size={18} />
  </button>
);

/** Order summary pill shown across all payment steps. */
const OrderSummary: React.FC<{ title: string; amount: number }> = ({ title, amount }) => (
  <div className="flex items-center justify-between px-5 py-3 bg-stone-50 rounded-2xl border border-stone-100 mb-6">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">
        Order
      </p>
      <p className="text-sm font-bold text-stone-800 truncate max-w-[160px]">{title}</p>
    </div>
    <div className="text-right">
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">
        Amount
      </p>
      <p className="text-lg font-serif font-bold text-stone-900">{formatPrice(amount)}</p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Step 1 — Method selection
// ---------------------------------------------------------------------------

const METHOD_OPTIONS: { id: PaymentMethod; label: string; sub: string; icon: React.ReactNode }[] =
  [
    {
      id: 'card',
      label: 'Credit / Debit Card',
      sub: 'Visa, Mastercard, AMEX',
      icon: <CreditCard size={20} />,
    },
    {
      id: 'bank',
      label: 'Online Bank Transfer',
      sub: 'Sampath, BOC, HNB & more',
      icon: <Smartphone size={20} />,
    },
    {
      id: 'cod',
      label: 'Cash on Delivery',
      sub: 'Pay when food arrives',
      icon: <Wallet size={20} />,
    },
  ];

const MethodStep: React.FC<{
  selected: PaymentMethod | null;
  onSelect: (m: PaymentMethod) => void;
  onNext: () => void;
}> = ({ selected, onSelect, onNext }) => (
  <motion.div
    key="method"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">Select Payment Method</h3>
    <p className="text-sm text-stone-500 mb-6">Choose how you'd like to pay.</p>

    <div className="space-y-3 mb-8">
      {METHOD_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all text-left ${
            selected === opt.id
              ? 'border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/10'
              : 'border-stone-100 bg-white hover:border-stone-200'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              selected === opt.id
                ? 'bg-brand-primary text-white'
                : 'bg-stone-100 text-stone-500'
            }`}
          >
            {opt.icon}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-stone-800">{opt.label}</p>
            <p className="text-xs text-stone-400">{opt.sub}</p>
          </div>
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              selected === opt.id ? 'border-brand-primary bg-brand-primary' : 'border-stone-200'
            }`}
          >
            {selected === opt.id && <Check size={11} className="text-white" strokeWidth={3} />}
          </div>
        </button>
      ))}
    </div>

    <button
      onClick={onNext}
      disabled={!selected}
      className="w-full py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-lg shadow-brand-primary/25 hover:bg-brand-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
    >
      Continue
    </button>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Step 2a — Card details form
// ---------------------------------------------------------------------------

const CardForm: React.FC<{
  details: CardDetails;
  onChange: (d: CardDetails) => void;
  onBack: () => void;
  onPay: () => void;
}> = ({ details, onChange, onBack, onPay }) => {
  const isValid =
    details.number.replace(/\s/g, '').length === 16 &&
    details.name.trim().length > 2 &&
    details.expiry.length === 5 &&
    details.cvv.length >= 3;

  return (
    <motion.div
      key="card-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-600 mb-4 transition-colors"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">Card Details</h3>
      <p className="text-sm text-stone-500 mb-6">Enter your card information securely.</p>

      {/* Card number */}
      <label className="block mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1.5 block">
          Card Number
        </span>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            maxLength={19}
            placeholder="1234 5678 9012 3456"
            value={details.number}
            onChange={(e) =>
              onChange({ ...details, number: maskCard(e.target.value) })
            }
            className="w-full px-4 py-3 pr-12 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
          />
          <CreditCard
            size={18}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300"
          />
        </div>
      </label>

      {/* Cardholder name */}
      <label className="block mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1.5 block">
          Cardholder Name
        </span>
        <input
          type="text"
          placeholder="John Perera"
          value={details.name}
          onChange={(e) => onChange({ ...details, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
        />
      </label>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1.5 block">
            Expiry
          </span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="MM/YY"
            value={details.expiry}
            onChange={(e) => onChange({ ...details, expiry: formatExpiry(e.target.value) })}
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1.5 block">
            CVV
          </span>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="•••"
            value={details.cvv}
            onChange={(e) =>
              onChange({ ...details, cvv: e.target.value.replace(/\D/g, '') })
            }
            className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
          />
        </label>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 text-xs text-stone-400 mb-6">
        <Lock size={12} className="text-emerald-500" />
        <span>Your payment is secured with 256-bit SSL encryption</span>
      </div>

      <button
        onClick={onPay}
        disabled={!isValid}
        className="w-full py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-lg shadow-brand-primary/25 hover:bg-brand-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        Pay {formatPrice(0).replace('0', '')}
      </button>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Step 2b — Bank transfer form
// ---------------------------------------------------------------------------

const BANKS = ['Sampath Bank', 'Bank of Ceylon', 'HNB', 'People\'s Bank', 'Commercial Bank', 'Seylan Bank', 'NSB'];

const BankForm: React.FC<{
  details: BankDetails;
  onChange: (d: BankDetails) => void;
  onBack: () => void;
  onPay: () => void;
}> = ({ details, onChange, onBack, onPay }) => {
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
    details.account.replace(/\s/g, '').length >= 10 &&
    details.otp.length === 6;

  return (
    <motion.div
      key="bank-form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-600 mb-4 transition-colors"
      >
        <ChevronLeft size={14} /> Back
      </button>

      <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">Bank Transfer</h3>
      <p className="text-sm text-stone-500 mb-6">Select your bank and authorise the transfer.</p>

      {/* Bank selector */}
      <label className="block mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1.5 block">
          Select Bank
        </span>
        <select
          value={details.bank}
          onChange={(e) => onChange({ ...details, bank: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white transition-all appearance-none"
        >
          <option value="">Choose your bank…</option>
          {BANKS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </label>

      {/* Account number */}
      <label className="block mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1.5 block">
          Account / Mobile Number
        </span>
        <input
          type="text"
          inputMode="numeric"
          placeholder="e.g. 007 1234 5678"
          value={details.account}
          onChange={(e) => onChange({ ...details, account: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
        />
      </label>

      {/* OTP */}
      <label className="block mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1.5 block">
          OTP Verification
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={details.otp}
            onChange={(e) =>
              onChange({ ...details, otp: e.target.value.replace(/\D/g, '') })
            }
            className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all"
          />
          <button
            onClick={sendOtp}
            disabled={otpTimer > 0 || !details.bank || !details.account}
            className="px-4 py-3 rounded-xl bg-stone-900 text-white text-xs font-bold whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors"
          >
            {otpTimer > 0 ? `${otpTimer}s` : otpSent ? 'Resend' : 'Send OTP'}
          </button>
        </div>
        {otpSent && otpTimer > 0 && (
          <p className="text-[11px] text-emerald-600 mt-1.5 font-medium">
            OTP sent to your registered mobile number. (Simulation: use any 6 digits)
          </p>
        )}
      </label>

      <button
        onClick={onPay}
        disabled={!isValid}
        className="w-full py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-lg shadow-brand-primary/25 hover:bg-brand-primary/90 hover:-translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        Authorise Transfer
      </button>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Step 2c — Cash on Delivery confirmation
// ---------------------------------------------------------------------------

const CodConfirm: React.FC<{
  amount: number;
  onBack: () => void;
  onPay: () => void;
}> = ({ amount, onBack, onPay }) => (
  <motion.div
    key="cod"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.3 }}
  >
    <button
      onClick={onBack}
      className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-600 mb-4 transition-colors"
    >
      <ChevronLeft size={14} /> Back
    </button>

    <h3 className="text-xl font-serif font-bold text-stone-900 mb-1">Cash on Delivery</h3>
    <p className="text-sm text-stone-500 mb-6">You'll pay when your food arrives at your door.</p>

    <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl mb-6 space-y-3">
      <div className="flex items-start gap-3">
        <Wallet size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-bold text-amber-800">Please prepare exact change</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Have <strong>{formatPrice(amount)}</strong> ready in cash.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <ShieldCheck size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          Your order is confirmed. Payment will be collected by the chef/delivery person on arrival.
        </p>
      </div>
    </div>

    <button
      onClick={onPay}
      className="w-full py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-lg shadow-brand-primary/25 hover:bg-brand-primary/90 hover:-translate-y-0.5 transition-all"
    >
      Confirm Order
    </button>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Step 3 — Processing spinner
// ---------------------------------------------------------------------------

const ProcessingStep: React.FC = () => (
  <motion.div
    key="processing"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center justify-center py-12 text-center"
  >
    <div className="relative w-20 h-20 mb-6">
      {/* Outer spin ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-4 border-brand-primary border-t-transparent"
      />
      {/* Inner pulse */}
      <motion.div
        animate={{ scale: [0.8, 1, 0.8], opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        className="absolute inset-3 rounded-full bg-brand-primary/20"
      />
      <Lock size={20} className="absolute inset-0 m-auto text-brand-primary" />
    </div>
    <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Processing Payment…</h3>
    <p className="text-sm text-stone-500">Securely communicating with payment gateway.</p>
    <p className="text-xs text-stone-400 mt-1">Please do not close this window.</p>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Step 4a — Success
// ---------------------------------------------------------------------------

const SuccessStep: React.FC<{ amount: number; method: PaymentMethod; onClose: () => void }> = ({
  amount,
  method,
  onClose,
}) => (
  <motion.div
    key="success"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="flex flex-col items-center justify-center py-8 text-center"
  >
    {/* Green circle with check */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
      className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30"
    >
      <Check size={36} className="text-white" strokeWidth={3} />
    </motion.div>

    <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Payment Successful!</h3>
    <p className="text-sm text-stone-500 mb-1">
      {formatPrice(amount)} paid via{' '}
      <span className="font-bold text-stone-700 capitalize">
        {method === 'card' ? 'Card' : method === 'bank' ? 'Bank Transfer' : 'Cash on Delivery'}
      </span>
    </p>
    <p className="text-xs text-stone-400 mb-8">
      Transaction ID: <span className="font-mono">{Math.random().toString(36).slice(2, 12).toUpperCase()}</span>
    </p>

    <div className="w-full p-4 bg-emerald-50 border border-emerald-200 rounded-2xl mb-8 text-left">
      <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">What's next?</p>
      <ul className="space-y-1.5 text-sm text-emerald-700">
        <li className="flex items-center gap-2">
          <Check size={13} className="flex-shrink-0" strokeWidth={3} /> Your chef has been notified
        </li>
        <li className="flex items-center gap-2">
          <Check size={13} className="flex-shrink-0" strokeWidth={3} /> Preparation will begin shortly
        </li>
        <li className="flex items-center gap-2">
          <Check size={13} className="flex-shrink-0" strokeWidth={3} /> Track your order in "Active Requests"
        </li>
      </ul>
    </div>

    <button
      onClick={onClose}
      className="w-full py-3.5 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all"
    >
      Done
    </button>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Step 4b — Payment failed
// ---------------------------------------------------------------------------

const FailedStep: React.FC<{ onRetry: () => void; onClose: () => void }> = ({
  onRetry,
  onClose,
}) => (
  <motion.div
    key="failed"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center py-8 text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 20 }}
      className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30"
    >
      <AlertCircle size={36} className="text-white" />
    </motion.div>

    <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">Payment Failed</h3>
    <p className="text-sm text-stone-500 mb-8">
      We couldn't process your payment. Please check your details and try again.
    </p>

    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={onRetry}
        className="w-full py-3.5 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-lg shadow-brand-primary/25 hover:bg-brand-primary/90 transition-all"
      >
        Try Again
      </button>
      <button
        onClick={onClose}
        className="w-full py-3 rounded-2xl border border-stone-200 text-stone-600 font-bold text-sm hover:bg-stone-50 transition-all"
      >
        Cancel
      </button>
    </div>
  </motion.div>
);

// ---------------------------------------------------------------------------
// Main PaymentGateway component
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
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    bank: '',
    account: '',
    otp: '',
  });

  // Reset state whenever modal opens
  useEffect(() => {
    if (open) {
      setStep('method');
      setMethod(null);
      setCardDetails({ number: '', name: '', expiry: '', cvv: '' });
      setBankDetails({ bank: '', account: '', otp: '' });
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && step !== 'processing') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, step, onClose]);

  const handlePay = useCallback(async () => {
    // Cash on Delivery always succeeds instantly (no processing simulation needed)
    if (method === 'cod') {
      onSuccess();
      return;
    }

    setStep('processing');
    const result = await simulatePaymentResult();
    setStep(result);
    if (result === 'success') {
      onSuccess();
    }
  }, [method, onSuccess]);

  const handleRetry = () => {
    setStep('method');
    setMethod(null);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => step !== 'processing' && onClose()}
          />

          {/* Modal panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative bg-white rounded-[32px] shadow-2xl shadow-stone-900/20 w-full max-w-md p-8 pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Brand header stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-amber-400 to-brand-primary rounded-t-[32px]" />

              {/* Secure badge */}
              {step !== 'success' && step !== 'failed' && (
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                    Secure Payment Gateway
                  </span>
                </div>
              )}

              {/* Close button — hidden during processing */}
              {step !== 'processing' && <CloseButton onClick={onClose} />}

              {/* Order summary — shown on method/details steps */}
              {(step === 'method' || step === 'details') && (
                <OrderSummary title={orderTitle} amount={amount} />
              )}

              {/* Step content */}
              <AnimatePresence mode="wait">
                {step === 'method' && (
                  <MethodStep
                    selected={method}
                    onSelect={setMethod}
                    onNext={() => setStep('details')}
                  />
                )}

                {step === 'details' && method === 'card' && (
                  <CardForm
                    details={cardDetails}
                    onChange={setCardDetails}
                    onBack={() => setStep('method')}
                    onPay={handlePay}
                  />
                )}

                {step === 'details' && method === 'bank' && (
                  <BankForm
                    details={bankDetails}
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
                  <SuccessStep amount={amount} method={method!} onClose={onClose} />
                )}

                {step === 'failed' && (
                  <FailedStep onRetry={handleRetry} onClose={onClose} />
                )}
              </AnimatePresence>

              {/* Footer */}
              {(step === 'method' || step === 'details') && (
                <div className="flex items-center justify-center gap-4 mt-6 pt-5 border-t border-stone-100">
                  {['visa', 'mc', 'amex', 'boc'].map((brand) => (
                    <div
                      key={brand}
                      className="px-2.5 py-1.5 bg-stone-50 border border-stone-100 rounded-lg"
                    >
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        {brand === 'mc' ? 'MC' : brand === 'amex' ? 'AMEX' : brand === 'boc' ? 'BOC' : 'VISA'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
