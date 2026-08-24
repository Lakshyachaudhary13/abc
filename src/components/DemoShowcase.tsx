import React from 'react';
import { DemoWebsite } from '../types';
import { DEMO_WEBSITES } from '../data/demos';
import { Play, Eye, Sparkles, GraduationCap, BookOpen, Wrench, UtensilsCrossed, Camera, ShoppingBag, ArrowRight } from 'lucide-react';

interface DemoShowcaseProps {
  onOpenDemoModal: (demoId: string) => void;
}

export const DemoShowcase: React.FC<DemoShowcaseProps> = ({ onOpenDemoModal }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-4 h-4 text-orange-400" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-orange-400" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-orange-400" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-4 h-4 text-orange-400" />;
      case 'Camera': return <Camera className="w-4 h-4 text-orange-400" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4 text-orange-400" />;
      default: return <Sparkles className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <section id="demos" className="py-20 bg-[#0A0A0A] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.25em] font-bold text-orange-500 uppercase mb-3">
            <Eye className="w-3 h-3" /> Interactive Showcase
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif italic font-bold text-white tracking-tight mb-3">
            Explore Demo Websites
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
            Har type ki website ke ready-to-test live prototypes hain. Click karke experience karein aur bilkul aisi website custom banwayein.
          </p>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_WEBSITES.map(demo => (
            <div
              key={demo.id}
              className="bg-[#0F0F0F] border border-white/10 hover:border-orange-500/50 rounded-sm p-6 flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-600/5 group"
            >
              <div>
                {/* Header with Icon and Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-orange-500/40 transition-colors">
                    {getIcon(demo.icon)}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-sm bg-white/5 text-orange-400 border border-white/10">
                    {demo.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight group-hover:text-orange-400 transition-colors">
                  {demo.title}
                </h3>
                <p className="text-xs text-white/50 mb-5 leading-relaxed line-clamp-2 font-light">
                  {demo.description}
                </p>

                {/* Features Pill List */}
                <div className="space-y-2 mb-6">
                  {demo.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                      <span className="w-1 h-1 bg-orange-500 rounded-none" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {demo.techStack.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[9px] bg-white/5 text-white/50 px-2 py-0.5 rounded-sm border border-white/5 font-mono uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>

                <button
                  id={`demo-card-btn-${demo.id}`}
                  onClick={() => onOpenDemoModal(demo.id)}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-[11px] uppercase tracking-[0.15em] font-bold px-3.5 py-2 rounded-sm transition-all cursor-pointer flex items-center gap-1.5 shadow-sm group-hover:shadow-md"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Test Demo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
