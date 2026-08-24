import React from 'react';
import { Sparkles, ArrowRight, Play, CheckCircle2, ShieldCheck, Clock, Award, Users, Code, Zap } from 'lucide-react';

interface HeroProps {
  onGetWebsite: () => void;
  onViewDemos: () => void;
  onOpenEstimator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onGetWebsite,
  onViewDemos,
  onOpenEstimator
}) => {
  return (
    <div className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-white/10 bg-[#0A0A0A]">
      {/* Background Architectural Grid & Subtle Orange Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Editorial Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-white/5 border border-white/10 text-white/80 text-[11px] font-mono tracking-[0.2em] uppercase mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <span className="flex h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span>Starting ₹499 <span className="text-orange-500 font-bold">•</span> 24H Turnaround</span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="hidden sm:inline text-white/60">Projects • Portfolio • Business</span>
        </div>

        {/* Primary Main Headline - Editorial Serif */}
        <div className="max-w-4xl mx-auto mb-6">
          <span className="block text-[11px] uppercase tracking-[0.3em] text-orange-500 font-bold mb-2">
            The Digital Atelier
          </span>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif italic font-bold text-white tracking-tight leading-[1.08]">
            Website Banwani Hai?
          </h1>
        </div>

        {/* Secondary Subtitle */}
        <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto font-light leading-relaxed mb-9">
          Apne <span className="text-white font-medium underline decoration-orange-500/50 underline-offset-4">business</span>, <span className="text-white font-medium underline decoration-orange-500/50 underline-offset-4">college project</span>, <span className="text-white font-medium underline decoration-orange-500/50 underline-offset-4">portfolio</span> ya <span className="text-white font-medium underline decoration-orange-500/50 underline-offset-4">personal use</span> ke liye bespoke web experiences banwayein.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md sm:max-w-xl mx-auto mb-10">
          <button
            id="hero-get-website-btn"
            onClick={onGetWebsite}
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-[0.2em] px-8 py-4 rounded-sm shadow-lg shadow-orange-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Get Your Website</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-view-demos-btn"
            onClick={onViewDemos}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-[0.2em] px-7 py-4 rounded-sm border border-white/15 shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>Explore Demos</span>
          </button>
        </div>

        {/* AI Assist Link */}
        <div className="mb-14">
          <button
            onClick={onOpenEstimator}
            className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white bg-[#0F0F0F] hover:bg-[#141414] border border-white/10 px-4 py-2.5 rounded-sm transition-all cursor-pointer font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Need blueprint & budget advice? <strong className="text-orange-400 font-semibold underline underline-offset-2">Try AI Cost Estimator</strong></span>
            <ArrowRight className="w-3.5 h-3.5 text-white/40" />
          </button>
        </div>

        {/* Stats Grid - Editorial Architectural Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 max-w-5xl mx-auto border border-white/10">
          <div className="bg-[#0A0A0A] p-5 sm:p-6 text-left hover:bg-[#0F0F0F] transition-colors">
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-white mb-1">₹499</div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-orange-500 font-bold">Starting Package</div>
            <p className="text-xs text-white/50 mt-1.5 leading-snug">Affordable pricing for students & early creators</p>
          </div>

          <div className="bg-[#0A0A0A] p-5 sm:p-6 text-left hover:bg-[#0F0F0F] transition-colors">
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-white mb-1">24–48h</div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-orange-500 font-bold">Turnaround</div>
            <p className="text-xs text-white/50 mt-1.5 leading-snug">Guaranteed quick launch ready for submissions</p>
          </div>

          <div className="bg-[#0A0A0A] p-5 sm:p-6 text-left hover:bg-[#0F0F0F] transition-colors">
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-white mb-1">100%</div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-orange-500 font-bold">Responsive</div>
            <p className="text-xs text-white/50 mt-1.5 leading-snug">Impeccable layout across iOS, Android & desktop</p>
          </div>

          <div className="bg-[#0A0A0A] p-5 sm:p-6 text-left hover:bg-[#0F0F0F] transition-colors">
            <div className="text-2xl sm:text-3xl font-serif italic font-bold text-white mb-1">Direct</div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-orange-500 font-bold">WhatsApp Line</div>
            <p className="text-xs text-white/50 mt-1.5 leading-snug">Direct consultation with lead developers</p>
          </div>
        </div>
      </div>
    </div>
  );
};
