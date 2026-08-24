import React from 'react';
import { Rocket, ShieldCheck, Code, Smartphone, Cloud, Headset, CheckCircle2, Zap } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const benefits = [
    {
      icon: <Rocket className="w-5 h-5 text-orange-400" />,
      title: 'Superfast 24–48h Turnaround',
      desc: 'Urgent college submission ya sudden business launch? Hum express delivery provide karte hain bina kisi code quality compromise ke.'
    },
    {
      icon: <Code className="w-5 h-5 text-orange-400" />,
      title: 'Clean Source Code & Viva Guide',
      desc: 'Complete neat code with GitHub repository. College students ke liye viva preparation aur architecture explanation support.'
    },
    {
      icon: <Smartphone className="w-5 h-5 text-orange-400" />,
      title: '100% Mobile & Retina Ready',
      desc: 'Aapki website iPhone, Android, iPad aur Ultra-wide monitors par pixel-perfect and ultra-responsive layout ke saath run karegi.'
    },
    {
      icon: <Cloud className="w-5 h-5 text-orange-400" />,
      title: 'Free Hosting Setup & Live URL',
      desc: 'Zero complex server hassles. Hum Vercel/Netlify par blazing-fast hosting aur complimentary SSL certificate configure karte hain.'
    },
    {
      icon: <Headset className="w-5 h-5 text-orange-400" />,
      title: 'Direct WhatsApp Line',
      desc: 'No confusing ticket delays. Seedha lead developer se WhatsApp par live chat karein aur real-time revisions karwayein.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-orange-400" />,
      title: '100% Satisfaction Guarantee',
      desc: 'Pehle live interactive demo verify karein, requirements check karein, aur complete satisfaction ke baad hi deliver receive karein.'
    }
  ];

  return (
    <section id="services" className="py-20 bg-[#0A0A0A] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.25em] font-bold text-orange-500 uppercase mb-3">
            <Zap className="w-3 h-3" /> Core Capabilities
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif italic font-bold text-white tracking-tight mb-3">
            Why Partner With LC Web Studio?
          </h2>
          <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
            Market ki expensive traditional agencies ke mukable hum transparent pricing, direct WhatsApp communication aur handcrafted engineering dete hain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="bg-[#0F0F0F] border border-white/10 hover:border-orange-500/40 rounded-sm p-7 transition-all hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                {b.icon}
              </div>
              <h3 className="font-bold text-white text-base mb-2 uppercase tracking-tight">{b.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
