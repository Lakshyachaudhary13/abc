import React, { useState, useEffect, useId } from 'react';
import QRCode from 'qrcode';
import { Lead, PaymentRecord, PaymentMethod, PaymentType } from '../types';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Lock,
  Download,
  Printer,
  MessageSquare,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Clock,
  Zap,
  Layers
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  initialPackage?: string;
  initialLead?: Lead | null;
  onPaymentSuccess?: (payment: PaymentRecord) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 499,
  initialPackage = 'Basic 1-Page Website',
  initialLead = null,
  onPaymentSuccess
}) => {
  // Input and Selection States
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [paymentType, setPaymentType] = useState<PaymentType>('token_299');
  const [customAmount, setCustomAmount] = useState<number>(initialAmount);
  const [clientName, setClientName] = useState(initialLead?.name || '');
  const [clientWhatsapp, setClientWhatsapp] = useState(initialLead?.whatsapp || '');
  const [packageTitle, setPackageTitle] = useState(initialPackage || initialLead?.selectedPackage || 'Website Development');

  // UPI and QR states
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');

  // Card Simulator states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Completed Payment / Receipt state
  const [receipt, setReceipt] = useState<PaymentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  const STUDIO_UPI_ID = 'lakshyakumar133456@okaxis';
  const STUDIO_PAYEE_NAME = 'LC Web Studio';

  // Sync initial lead data when opened
  useEffect(() => {
    if (initialLead) {
      if (initialLead.name) setClientName(initialLead.name);
      if (initialLead.whatsapp) setClientWhatsapp(initialLead.whatsapp);
      if (initialLead.selectedPackage) setPackageTitle(initialLead.selectedPackage);
      if (initialLead.quotedAmount) setCustomAmount(initialLead.quotedAmount);
    } else if (initialAmount) {
      setCustomAmount(initialAmount);
    }
  }, [initialLead, initialAmount, initialPackage]);

  // Calculate final amount based on type
  const calculateFinalAmount = (): number => {
    switch (paymentType) {
      case 'token_299':
        return 299;
      case 'advance_50':
        return Math.max(299, Math.round(customAmount * 0.5));
      case 'full':
        // 5% discount on full payment
        return Math.max(499, Math.round(customAmount * 0.95));
      case 'custom':
        return Math.max(100, customAmount);
      default:
        return customAmount;
    }
  };

  const finalAmount = calculateFinalAmount();

  // Generate dynamic UPI QR Code whenever amount changes
  useEffect(() => {
    const upiPayload = `upi://pay?pa=${encodeURIComponent(STUDIO_UPI_ID)}&pn=${encodeURIComponent(
      STUDIO_PAYEE_NAME
    )}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent('LC Web Studio Order ' + (initialLead?.id || 'Web'))}`;

    QRCode.toDataURL(upiPayload, {
      width: 260,
      margin: 1,
      color: {
        dark: '#EA580C',
        light: '#0A0A0A'
      }
    })
      .then(url => {
        setQrDataUrl(url);
      })
      .catch(err => {
        console.error('QR code generation error:', err);
      });
  }, [finalAmount, initialLead]);

  if (!isOpen) return null;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(STUDIO_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyAccount = (text: string, type: 'acc' | 'ifsc') => {
    navigator.clipboard.writeText(text);
    if (type === 'acc') {
      setCopiedAcc(true);
      setTimeout(() => setCopiedAcc(false), 2000);
    } else {
      setCopiedIfsc(true);
      setTimeout(() => setCopiedIfsc(false), 2000);
    }
  };

  // Submit payment to backend
  const handleCompletePayment = async (mode: PaymentMethod, overrideUtr?: string) => {
    setError(null);

    if (!clientName.trim()) {
      setError('Please provide your Name for the payment receipt');
      return;
    }
    if (!clientWhatsapp.trim() || clientWhatsapp.length < 8) {
      setError('Please provide a valid WhatsApp number for confirmation receipt');
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        leadId: initialLead?.id,
        clientName: clientName.trim(),
        clientWhatsapp: clientWhatsapp.trim(),
        amount: finalAmount,
        paymentMethod: mode,
        paymentType,
        utrNumber: overrideUtr || utrNumber.trim() || undefined,
        packageTitle,
        notes: `Paid ${paymentType.replace('_', ' ')} for ${packageTitle}`
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to record payment');
      }

      setReceipt(data.payment);
      if (onPaymentSuccess) {
        onPaymentSuccess(data.payment);
      }

      // Trigger Confetti
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.55 }
      });
    } catch (err: any) {
      console.error('Payment submit error:', err);
      setError(err.message || 'Could not verify payment. Please try again or WhatsApp directly.');
    } finally {
      setIsProcessing(false);
      setOtpStep(false);
    }
  };

  const handleSimulatedCardPay = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
      setError('Please enter a valid 16-digit card number');
      return;
    }

    if (!cardExpiry || !cardCvv) {
      setError('Please enter card expiry and CVV');
      return;
    }

    // Move to simulated OTP step
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setOtpStep(true);
    }, 900);
  };

  const handleVerifyOtpAndPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 4) {
      setError('Please enter the 4 or 6-digit OTP code (e.g. 1234)');
      return;
    }
    const mockUtr = 'TXN-' + Math.floor(100000000000 + Math.random() * 900000000000);
    handleCompletePayment('card', mockUtr);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(STUDIO_UPI_ID)}&pn=${encodeURIComponent(
    STUDIO_PAYEE_NAME
  )}&am=${finalAmount}&cu=INR&tn=${encodeURIComponent('LCWebStudio-' + (initialLead?.id || 'Order'))}`;

  return (
    <div
      id="payment-portal-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-[#0F0F0F] border border-white/10 rounded-sm w-full max-w-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-sm flex items-center justify-center text-white font-bold text-xs">
              ₹
            </div>
            <div>
              <h3 className="font-bold text-white text-base uppercase tracking-tight flex items-center gap-2">
                <span>LC Web Studio — Secure Payment Desk</span>
                <span className="text-[9px] bg-orange-600/10 text-orange-400 border border-orange-600/30 px-2 py-0.5 rounded-sm font-mono uppercase tracking-wider font-bold">
                  Instant Verification
                </span>
              </h3>
              <p className="text-xs text-white/50 font-light">
                Pay milestone advance, slot booking token, or project balance with 0% hidden charges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-2 rounded-sm bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {receipt ? (
            /* ================= RECEIPT VIEW ================= */
            <div className="bg-[#0A0A0A] border border-orange-500/40 rounded-sm p-6 sm:p-8 animate-in zoom-in-95 duration-200">
              <div className="text-center max-w-md mx-auto mb-6">
                <div className="w-14 h-14 bg-orange-600/10 text-orange-500 border border-orange-600/30 rounded-sm flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif italic font-bold text-white text-2xl mb-1">
                  Payment Confirmed!
                </h4>
                <p className="text-xs text-white/60 font-light">
                  Thank you, <strong className="text-white">{receipt.clientName}</strong>. Your payment token has been registered in LC Web Studio's database.
                </p>
              </div>

              {/* Official Receipt Card */}
              <div className="bg-[#141414] border border-white/10 rounded-sm p-5 max-w-lg mx-auto mb-6 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-white/40 uppercase text-[10px]">Receipt ID:</span>
                  <span className="text-orange-400 font-bold">#{receipt.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Amount Received:</span>
                  <span className="text-xl font-bold text-white font-serif italic">₹{receipt.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Payment Type:</span>
                  <span className="text-white uppercase font-bold text-[11px] bg-white/5 px-2 py-0.5 rounded-sm">
                    {receipt.paymentType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Payment Method:</span>
                  <span className="text-white capitalize">{receipt.paymentMethod.replace('_', ' ')}</span>
                </div>
                {receipt.utrNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 uppercase text-[10px]">UTR / Ref ID:</span>
                    <span className="text-orange-300">{receipt.utrNumber}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-white/40 uppercase text-[10px]">Package / Commission:</span>
                  <span className="text-white">{receipt.packageTitle || packageTitle}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-2">
                  <span className="text-white/40 uppercase text-[10px]">Date & Time:</span>
                  <span className="text-white/70">{new Date(receipt.transactionDate).toLocaleString()}</span>
                </div>
              </div>

              {/* Next Steps Guide */}
              <div className="bg-[#0F0F0F] border border-white/5 rounded-sm p-4 max-w-lg mx-auto mb-6 text-xs text-white/70 font-light space-y-1.5">
                <div className="text-[10px] text-orange-400 uppercase tracking-wider font-bold mb-1">
                  ⚡ Project Kickoff Workflow:
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>Your delivery slot is secured. Work starts immediately.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>Staging preview link will be sent to your WhatsApp (+{receipt.clientWhatsapp}).</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
                <a
                  href={`https://wa.me/919999999999?text=Hello%20LC%20Web%20Studio!%20I%20have%20completed%20payment%20of%20₹${receipt.amount}%20(Receipt%20%23${receipt.id}%2C%20UTR%3A%20${receipt.utrNumber || 'N%2FA'}).%20Client%3A%20${encodeURIComponent(receipt.clientName)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify Studio on WhatsApp</span>
                </a>

                <button
                  onClick={handlePrintReceipt}
                  className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-sm border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto text-white/50 hover:text-white text-xs uppercase tracking-wider px-4 py-3 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* ================= CHECKOUT FLOW ================= */
            <>
              {error && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-sm text-red-300 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Client & Commission Info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0A0A0A] p-4 rounded-sm border border-white/10">
                <div>
                  <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-mono">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Lakshya Kumar"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-mono">
                    WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={clientWhatsapp}
                    onChange={(e) => setClientWhatsapp(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-mono">
                    Package / Project
                  </label>
                  <input
                    type="text"
                    value={packageTitle}
                    onChange={(e) => setPackageTitle(e.target.value)}
                    className="w-full bg-[#141414] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Payment Type Selection (Milestone vs Token vs Full) */}
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>Select Payment Plan:</span>
                  <span className="text-[10px] text-orange-400 font-mono">100% SECURE ESCROW</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  {/* Token */}
                  <button
                    type="button"
                    onClick={() => setPaymentType('token_299')}
                    className={`p-3 rounded-sm border text-left transition-all cursor-pointer relative ${
                      paymentType === 'token_299'
                        ? 'bg-orange-600/15 border-orange-500 text-white shadow-sm'
                        : 'bg-[#0A0A0A] border-white/10 hover:border-white/20 text-white/70'
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-wider font-bold text-orange-400 mb-0.5">
                      Fastest Slot Lock
                    </div>
                    <div className="font-serif italic font-bold text-lg text-white">₹299</div>
                    <div className="text-[10px] text-white/50 font-light">Token Advance Booking</div>
                  </button>

                  {/* 50% Advance */}
                  <button
                    type="button"
                    onClick={() => setPaymentType('advance_50')}
                    className={`p-3 rounded-sm border text-left transition-all cursor-pointer relative ${
                      paymentType === 'advance_50'
                        ? 'bg-orange-600/15 border-orange-500 text-white shadow-sm'
                        : 'bg-[#0A0A0A] border-white/10 hover:border-white/20 text-white/70'
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-wider font-bold text-orange-400 mb-0.5">
                      Standard Milestone
                    </div>
                    <div className="font-serif italic font-bold text-lg text-white">
                      ₹{Math.max(299, Math.round(customAmount * 0.5))}
                    </div>
                    <div className="text-[10px] text-white/50 font-light">50% Advance & Kickoff</div>
                  </button>

                  {/* Full Payment */}
                  <button
                    type="button"
                    onClick={() => setPaymentType('full')}
                    className={`p-3 rounded-sm border text-left transition-all cursor-pointer relative ${
                      paymentType === 'full'
                        ? 'bg-orange-600/15 border-orange-500 text-white shadow-sm'
                        : 'bg-[#0A0A0A] border-white/10 hover:border-white/20 text-white/70'
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-wider font-bold text-emerald-400 mb-0.5">
                      5% Instant Discount
                    </div>
                    <div className="font-serif italic font-bold text-lg text-white">
                      ₹{Math.max(499, Math.round(customAmount * 0.95))}
                    </div>
                    <div className="text-[10px] text-white/50 font-light">Full Project Total</div>
                  </button>

                  {/* Custom */}
                  <button
                    type="button"
                    onClick={() => setPaymentType('custom')}
                    className={`p-3 rounded-sm border text-left transition-all cursor-pointer relative ${
                      paymentType === 'custom'
                        ? 'bg-orange-600/15 border-orange-500 text-white shadow-sm'
                        : 'bg-[#0A0A0A] border-white/10 hover:border-white/20 text-white/70'
                    }`}
                  >
                    <div className="text-[9px] uppercase tracking-wider font-bold text-white/40 mb-0.5">
                      Custom Sum
                    </div>
                    <div className="font-serif italic font-bold text-lg text-white">Custom ₹</div>
                    <div className="text-[10px] text-white/50 font-light">Enter Any Quoted Amount</div>
                  </button>
                </div>

                {paymentType === 'custom' && (
                  <div className="mt-3 flex items-center gap-3 bg-[#0A0A0A] p-3 rounded-sm border border-white/10">
                    <span className="text-xs text-white/60">Enter custom amount to pay:</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 font-bold font-mono">₹</span>
                      <input
                        type="number"
                        min="100"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Number(e.target.value))}
                        className="bg-[#141414] border border-white/10 rounded-sm pl-7 pr-3 py-1.5 text-xs text-white font-mono font-bold w-32 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods Selection Tabs */}
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2.5">
                  Select Payment Method:
                </label>

                <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
                  {[
                    { id: 'upi', label: 'UPI & Instant QR Code', icon: QrCode },
                    { id: 'card', label: 'Debit / Credit Cards & NetBanking', icon: CreditCard },
                    { id: 'bank_transfer', label: 'Bank Transfer (IMPS / NEFT)', icon: Building2 }
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = selectedMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMethod(m.id as PaymentMethod)}
                        className={`px-4 py-2.5 rounded-sm text-xs uppercase tracking-wider font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600 text-white shadow-md'
                            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* METHOD 1: UPI & QR CODE */}
              {selectedMethod === 'upi' && (
                <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Left: Dynamic QR Code */}
                    <div className="flex flex-col items-center justify-center p-4 bg-[#141414] rounded-sm border border-white/10 text-center">
                      <div className="mb-2 text-[10px] uppercase font-mono tracking-widest text-orange-400 font-bold">
                        Scan via Google Pay / PhonePe / Paytm / BHIM
                      </div>

                      {qrDataUrl ? (
                        <div className="bg-black p-2 rounded-sm border border-orange-500/40 shadow-xl mb-3">
                          <img
                            src={qrDataUrl}
                            alt="LC Web Studio UPI Payment QR Code"
                            className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-48 h-48 bg-black flex items-center justify-center text-xs text-white/30">
                          Generating QR...
                        </div>
                      )}

                      <div className="text-xl font-serif italic font-bold text-white mb-1">
                        ₹{finalAmount}
                      </div>
                      <div className="text-[10px] text-white/40 font-mono">
                        Payee: LC Web Studio (Verified Merchant)
                      </div>
                    </div>

                    {/* Right: UPI Actions & UTR Submission */}
                    <div className="space-y-4">
                      {/* Mobile 1-Tap UPI Button */}
                      <a
                        href={upiDeepLink}
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-orange-600/20 md:hidden"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Tap to Open in UPI App</span>
                      </a>

                      {/* Copyable UPI ID */}
                      <div className="bg-[#141414] p-3 rounded-sm border border-white/10 space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-white/40 font-mono block">
                          Direct UPI ID:
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-xs font-mono font-bold text-orange-400 select-all">
                            {STUDIO_UPI_ID}
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="bg-white/5 hover:bg-white/10 text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Supported App Badges */}
                      <div className="text-[10px] text-white/50 font-mono uppercase tracking-wider">
                        Supported: <span className="text-white/80">Google Pay • PhonePe • Paytm • BHIM • Cred • Amazon Pay • Any Bank UPI</span>
                      </div>

                      {/* UTR Input Form */}
                      <div className="pt-2 border-t border-white/10 space-y-2">
                        <label className="block text-xs font-semibold text-white/90">
                          Payment kar diya? Enter 12-digit UTR / Reference No:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. 423899120033"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            className="flex-1 bg-[#141414] border border-white/10 rounded-sm px-3 py-2 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleCompletePayment('upi')}
                            className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                          >
                            {isProcessing ? 'Verifying...' : 'Confirm & Get Receipt'}
                          </button>
                        </div>
                        <p className="text-[10px] text-white/40 font-light">
                          * UPI app ke transaction summary mein 12-digit UPI Ref/UTR number mil jayega.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 2: CARDS & NETBANKING */}
              {selectedMethod === 'card' && (
                <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
                  {!otpStep ? (
                    <form onSubmit={handleSimulatedCardPay} className="space-y-4">
                      {/* Card Preview Visual */}
                      <div className="bg-gradient-to-tr from-[#1A1A1A] to-[#0A0A0A] border border-white/15 rounded-sm p-4 max-w-sm mx-auto shadow-xl text-white font-mono space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-orange-500 font-bold uppercase tracking-widest text-[10px]">LC STUDIO ESCROW</span>
                          <span className="text-white/40 font-serif italic text-sm">DEBIT / CREDIT</span>
                        </div>

                        <div className="tracking-[0.25em] text-sm sm:text-base font-bold text-white/90 pt-2">
                          {cardNumber || '•••• •••• •••• ••••'}
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-white/60 pt-1">
                          <div>
                            <span className="block text-[8px] uppercase text-white/30">Cardholder</span>
                            <span className="text-white uppercase font-bold">{cardHolder || clientName || 'YOUR NAME'}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-white/30">Expires</span>
                            <span className="text-white">{cardExpiry || 'MM/YY'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Input Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-mono">
                            Card Number *
                          </label>
                          <input
                            type="text"
                            maxLength={19}
                            placeholder="4532 8900 1234 5678"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9 ]/g, ''))}
                            className="w-full bg-[#141414] border border-white/10 rounded-sm px-3 py-2 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-mono">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Lakshya Kumar"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full bg-[#141414] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-mono">
                              Expiry *
                            </label>
                            <input
                              type="text"
                              maxLength={5}
                              placeholder="08/28"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full bg-[#141414] border border-white/10 rounded-sm px-3 py-2 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-mono">
                              CVV *
                            </label>
                            <input
                              type="password"
                              maxLength={4}
                              placeholder="123"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full bg-[#141414] border border-white/10 rounded-sm px-3 py-2 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-orange-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* NetBanking alternative select */}
                      <div className="pt-2">
                        <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1 font-mono">
                          Or Select NetBanking Bank:
                        </label>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full bg-[#141414] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="HDFC Bank">HDFC Bank (Instant)</option>
                          <option value="State Bank of India">State Bank of India (SBI)</option>
                          <option value="ICICI Bank">ICICI Bank</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                          <option value="Punjab National Bank">Punjab National Bank</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 disabled:opacity-50"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isProcessing ? 'Connecting to Gateway...' : `Proceed to Pay ₹${finalAmount}`}</span>
                      </button>
                    </form>
                  ) : (
                    /* OTP Simulator Step */
                    <form onSubmit={handleVerifyOtpAndPay} className="max-w-md mx-auto text-center space-y-4 py-3">
                      <div className="w-12 h-12 bg-orange-600/10 text-orange-500 border border-orange-600/30 rounded-sm flex items-center justify-center mx-auto">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h4 className="font-serif italic font-bold text-white text-xl">
                        Enter Bank Authentication OTP
                      </h4>
                      <p className="text-xs text-white/60 font-light">
                        A simulated verification OTP has been sent for payment authorization of <strong className="text-white">₹{finalAmount}</strong>.
                      </p>

                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter 4 or 6-digit OTP (e.g. 1234)"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-48 mx-auto text-center bg-[#141414] border border-orange-500 rounded-sm px-3 py-2.5 text-base text-white font-mono tracking-[0.3em] font-bold focus:outline-none"
                      />

                      <div className="flex gap-2 justify-center">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-sm transition-colors cursor-pointer"
                        >
                          {isProcessing ? 'Authorizing...' : 'Authorize Payment'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setOtpStep(false)}
                          className="bg-white/5 hover:bg-white/10 text-white/60 text-xs uppercase tracking-wider px-4 py-2.5 rounded-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* METHOD 3: DIRECT BANK TRANSFER */}
              {selectedMethod === 'bank_transfer' && (
                <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="text-xs text-white/60 font-light">
                    Directly transfer amount via IMPS, NEFT, or RTGS to LC Web Studio official current account:
                  </div>

                  <div className="bg-[#141414] border border-white/10 rounded-sm p-4 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-white/40 uppercase text-[10px]">Account Holder:</span>
                      <span className="text-white font-bold">Lakshya Kumar / LC Web Studio</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-white/40 uppercase text-[10px]">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 font-bold">50200088991122</span>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount('50200088991122', 'acc')}
                          className="text-white/40 hover:text-white p-1"
                        >
                          {copiedAcc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-white/40 uppercase text-[10px]">IFSC Code:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400 font-bold">HDFC0001234</span>
                        <button
                          type="button"
                          onClick={() => handleCopyAccount('HDFC0001234', 'ifsc')}
                          className="text-white/40 hover:text-white p-1"
                        >
                          {copiedIfsc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-white/40 uppercase text-[10px]">Bank & Branch:</span>
                      <span className="text-white">HDFC Bank, Connaught Place, New Delhi</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/40 uppercase text-[10px]">Account Type:</span>
                      <span className="text-white">Current Account</span>
                    </div>
                  </div>

                  {/* IMPS UTR Confirmation */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <label className="block text-xs font-semibold text-white/90">
                      Submit IMPS / NEFT Reference (UTR) Number:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. N12345678901"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="flex-1 bg-[#141414] border border-white/10 rounded-sm px-3 py-2 text-xs text-white font-mono placeholder-white/30 focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleCompletePayment('bank_transfer')}
                        className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {isProcessing ? 'Verifying...' : 'Submit Reference'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Security Badges */}
        <div className="p-3 bg-[#0A0A0A] border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[10px] text-white/40 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
            <span>256-Bit SSL Encrypted Escrow • 7-Day Moneyback Guarantee</span>
          </div>

          <div className="flex items-center gap-3 text-white/50">
            <span>Direct Coordinator: +91 99999-99999</span>
          </div>
        </div>
      </div>
    </div>
  );
};
