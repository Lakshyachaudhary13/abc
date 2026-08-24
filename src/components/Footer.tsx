import React from 'react';
import { Sparkles, MessageSquare, Phone, Mail, MapPin, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onOpenDemos: () => void;
  onScrollToPricing: () => void;
  onScrollToForm: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToTop,
  onOpenDemos,
  onScrollToPricing,
  onScrollToForm
}) => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 pt-16 pb-12 text-white/50 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-sm bg-orange-600 flex items-center justify-center font-black text-white text-xs tracking-tight">
                LC
              </div>
              <span className="font-bold uppercase tracking-tight text-white text-base">LC Web Studio</span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed font-light">
              Bespoke web architecture tailored for college viva submissions, developer portfolios, creative studios & growing businesses.
            </p>
            <div className="text-orange-500 font-bold font-mono text-[11px] uppercase tracking-wider">
              Starting from ₹499 • 24H Turnaround
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-[0.2em] mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              <li><button onClick={onOpenDemos} className="hover:text-white transition-colors cursor-pointer font-light">Live Demo Websites</button></li>
              <li><button onClick={onScrollToPricing} className="hover:text-white transition-colors cursor-pointer font-light">Pricing Packages (₹499 - ₹5,000+)</button></li>
              <li><button onClick={onScrollToForm} className="hover:text-white transition-colors cursor-pointer font-light">Submit Project Brief</button></li>
              <li><a href="#services" className="hover:text-white transition-colors font-light">Core Capabilities</a></li>
            </ul>
          </div>

          {/* Website Categories */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-[0.2em] mb-4">Commission Types</h4>
            <ul className="space-y-2.5 text-white/50 font-light">
              <li>🎓 B.Tech / BCA Project Websites (₹999+)</li>
              <li>💼 Curated Portfolio Experiences (₹1,499)</li>
              <li>🏢 Business & Clinic Websites (₹2,499)</li>
              <li>🍕 Restaurant & Cafe Interactive Portals</li>
              <li>🛍️ Direct WhatsApp Ordering Stores</li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="font-bold text-white text-[11px] uppercase tracking-[0.2em] mb-4">Communications</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70">
                <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                <span>WhatsApp: +91 99999-99999</span>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                <span>lakshyakumar133456@gmail.com</span>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>New Delhi, India (Pan-India)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-wider text-white/40 font-mono">
          <p>© {new Date().getFullYear()} LC Web Studio. All rights reserved.</p>
          <button
            onClick={onScrollToTop}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer uppercase font-bold"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
