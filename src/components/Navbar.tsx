import React from 'react';
import { Sparkles, Code2, Layout, Layers, Shield, MessageCircle, Phone, ArrowRight, UserCheck, CreditCard } from 'lucide-react';

interface NavbarProps {
  onOpenDemos: () => void;
  onOpenEstimator: () => void;
  onScrollToForm: () => void;
  onScrollToPricing: () => void;
  onOpenPayment?: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  leadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenDemos,
  onOpenEstimator,
  onScrollToForm,
  onScrollToPricing,
  onOpenPayment,
  isAdminOpen,
  setIsAdminOpen,
  leadCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-orange-600 text-white font-black flex items-center justify-center rounded-sm shadow-md shadow-orange-600/20 group-hover:bg-orange-500 transition-colors text-sm tracking-tight">
              LC
            </div>
            <div>
              <span className="font-black text-white text-base tracking-tighter uppercase group-hover:text-orange-400 transition-colors">
                LC Web Studio
              </span>
              <span className="block text-[9px] font-mono text-orange-500 font-bold tracking-[0.2em] uppercase">
                Starting ₹499 • 24H Delivery
              </span>
            </div>
          </a>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/60">
          <button
            onClick={onOpenDemos}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Layout className="w-3.5 h-3.5 text-orange-500" />
            <span>Demo Websites</span>
            <span className="text-[9px] bg-orange-600/15 text-orange-400 font-bold px-1.5 py-0.5 rounded-sm border border-orange-600/30">
              6 Live
            </span>
          </button>

          <button
            onClick={onScrollToPricing}
            className="hover:text-white transition-colors cursor-pointer py-1"
          >
            Pricing Packages
          </button>

          {onOpenPayment && (
            <button
              onClick={onOpenPayment}
              className="hover:text-white text-orange-400 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
            >
              <CreditCard className="w-3.5 h-3.5 text-orange-500" />
              <span>Pay Online</span>
            </button>
          )}

          <button
            onClick={onOpenEstimator}
            className="hover:text-white text-orange-500 transition-colors flex items-center gap-1.5 cursor-pointer py-1 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span>AI Cost Estimator</span>
          </button>

          <a
            href="https://wa.me/919999999999?text=Hello%20LC%20Web%20Studio!%20I%20want%20to%20get%20a%20website%20made."
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Us</span>
          </a>
        </nav>

        {/* Right CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Pay Icon Button on Mobile */}
          {onOpenPayment && (
            <button
              onClick={onOpenPayment}
              className="md:hidden p-2 rounded-sm bg-orange-600/15 text-orange-400 border border-orange-600/30 hover:bg-orange-600/25 transition-colors cursor-pointer"
              title="Pay Online"
            >
              <CreditCard className="w-4 h-4" />
            </button>
          )}

          {/* Admin Toggle */}
          <button
            id="admin-dashboard-toggle-btn"
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className={`relative flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] font-bold px-3 py-2 rounded-sm transition-all border cursor-pointer ${
              isAdminOpen
                ? 'bg-orange-600 border-orange-500 text-white shadow-md shadow-orange-600/30'
                : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/20'
            }`}
            title="Studio Owner Dashboard (View Leads & Messages)"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin Studio</span>
            {leadCount > 0 && (
              <span className="bg-orange-500 text-black font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {leadCount}
              </span>
            )}
          </button>

          {/* Get Website CTA */}
          <button
            id="nav-get-website-btn"
            onClick={onScrollToForm}
            className="bg-orange-600 hover:bg-orange-500 text-white font-bold uppercase text-xs tracking-[0.2em] px-4 py-2 rounded-sm shadow-md shadow-orange-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
