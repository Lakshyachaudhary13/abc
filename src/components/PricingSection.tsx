import React from 'react';
import { PRICING_PACKAGES } from '../data/packages';
import { CheckCircle2, Clock, Zap, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PricingPackage } from '../types';

interface PricingSectionProps {
  onSelectPackage: (pkg: PricingPackage) => void;
  onOpenPayment?: (amount?: number, pkgName?: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPackage, onOpenPayment }) => {
  return (
    <section id="pricing" className="py-20 bg-[#0A0A0A] border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.25em] font-bold text-orange-500 uppercase mb-3">
            <Zap className="w-3 h-3" /> Transparent Pricing & Payment
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif italic font-bold text-white tracking-tight mb-3">
            Website Packages & Rates
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
            Har requirement aur scale ke liye crystal-clear packages. Koi hidden fees nahi, transparent milestones aur express delivery.
          </p>
        </div>

        {/* Highlight Banner with Instant Pay Option */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-5 mb-12 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-sm bg-orange-600/10 text-orange-500 border border-orange-600/30 flex items-center justify-center font-bold text-base shrink-0 font-mono">
              ₹
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base uppercase tracking-tight">
                Starting at Just ₹499 – Designed for Students, Portfolios & Local Creators
              </h4>
              <p className="text-xs text-white/50 mt-0.5 font-light">
                Every tier includes Mobile-First Design, Cloud Deployment assistance, and Direct WhatsApp support.
              </p>
            </div>
          </div>

          {onOpenPayment && (
            <button
              onClick={() => onOpenPayment(299, 'Token Slot Booking')}
              className="bg-orange-600/10 hover:bg-orange-600/20 text-orange-400 border border-orange-600/30 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Lock Slot with ₹299 Token</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PRICING_PACKAGES.map((pkg) => {
            return (
              <div
                key={pkg.id}
                className={`rounded-sm p-6 flex flex-col justify-between transition-all relative ${
                  pkg.highlight
                    ? 'bg-[#111111] border-2 border-orange-500 shadow-2xl shadow-orange-600/10'
                    : 'bg-[#0F0F0F] border border-white/10 hover:border-white/20'
                }`}
              >
                {pkg.popularTag && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-sm shadow-md">
                    {pkg.popularTag}
                  </div>
                )}

                <div>
                  {/* Top */}
                  <div className="mb-5">
                    <h3 className="font-bold text-white text-lg mb-1 uppercase tracking-tight">{pkg.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed min-h-8 font-light">{pkg.description}</p>
                  </div>

                  {/* Price Block */}
                  <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-4 mb-5">
                    <div className="text-2xl sm:text-3xl font-serif italic font-bold text-white mb-1">
                      {pkg.priceRange}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-orange-400 font-medium">
                      <Clock className="w-3.5 h-3.5" /> Delivery: <strong className="text-white font-mono">{pkg.deliveryTime}</strong>
                    </div>
                  </div>

                  {/* Best For */}
                  <div className="mb-5 p-2.5 rounded-sm bg-white/5 border border-white/5 text-[11px] text-white/70 font-light">
                    <strong className="text-white font-medium uppercase tracking-wider text-[9px] block mb-0.5">Best Suited For:</strong> {pkg.bestFor}
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {pkg.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-white/70 font-light">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTAs */}
                <div className="space-y-2">
                  <button
                    id={`select-package-btn-${pkg.id}`}
                    onClick={() => onSelectPackage(pkg)}
                    className={`w-full font-bold text-xs uppercase tracking-[0.15em] py-3.5 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      pkg.highlight
                        ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-600/20'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/15'
                    }`}
                  >
                    <span>Commission {pkg.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {onOpenPayment && (
                    <button
                      onClick={() => onOpenPayment(pkg.minPrice, pkg.title)}
                      className="w-full text-center text-[10px] text-white/40 hover:text-orange-400 font-mono uppercase tracking-wider py-1 transition-colors cursor-pointer"
                    >
                      💳 Pay 50% Advance Token (₹{Math.round(pkg.minPrice * 0.5)})
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Accepted Payment Methods & Security Assurance Matrix */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-6 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-orange-500 font-mono text-[10px] uppercase font-bold tracking-widest">
                <ShieldCheck className="w-4 h-4" /> 100% Milestone Escrow Protected
              </div>
              <h4 className="text-white font-bold text-base uppercase tracking-tight">
                All Major Indian & Global Payment Methods Supported
              </h4>
              <p className="text-xs text-white/50 font-light">
                UPI Instant Dynamic QR, Google Pay, PhonePe, Paytm, BHIM, Visa, MasterCard, RuPay, NetBanking & Direct Bank IMPS.
              </p>
            </div>

            {onOpenPayment && (
              <button
                onClick={() => onOpenPayment(499, 'General Project Advance')}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-[0.15em] px-5 py-3 rounded-sm transition-all shadow-md shadow-orange-600/20 flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Open Payment Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Payment Method Badges */}
          <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-white/60">
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm">⚡ Google Pay</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm">🟣 PhonePe</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm">🔵 Paytm UPI</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm">🇮🇳 BHIM / UPI</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm">💳 Visa / MasterCard / RuPay</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm">🏛️ NetBanking (All Banks)</span>
            <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-sm">🏦 Direct IMPS / NEFT</span>
          </div>
        </div>
      </div>
    </section>
  );
};
