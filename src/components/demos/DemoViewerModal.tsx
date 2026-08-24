import React, { useState } from 'react';
import { DemoWebsite, WebsiteCategory } from '../../types';
import { DEMO_WEBSITES } from '../../data/demos';
import { StudentPortfolioDemo } from './StudentPortfolioDemo';
import { CollegeProjectDemo } from './CollegeProjectDemo';
import { SmallBusinessDemo } from './SmallBusinessDemo';
import { RestaurantDemo } from './RestaurantDemo';
import { PhotographerDemo } from './PhotographerDemo';
import { MiniShopDemo } from './MiniShopDemo';
import { Monitor, Tablet, Smartphone, X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DemoViewerModalProps {
  initialDemoId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectForForm: (category: WebsiteCategory, packageTitle: string) => void;
}

export const DemoViewerModal: React.FC<DemoViewerModalProps> = ({
  initialDemoId = 'student-portfolio',
  isOpen,
  onClose,
  onSelectForForm
}) => {
  const [activeDemoId, setActiveDemoId] = useState(initialDemoId);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const currentDemo = DEMO_WEBSITES.find(d => d.id === activeDemoId) || DEMO_WEBSITES[0];

  const handleChooseWebsite = () => {
    let pkgTitle = 'Custom';
    if (currentDemo.category === 'portfolio') pkgTitle = 'Portfolio Website (₹1,499)';
    else if (currentDemo.category === 'college_project') pkgTitle = 'Student Project Website (₹999)';
    else if (currentDemo.category === 'business') pkgTitle = 'Business Website (₹2,499)';
    else if (currentDemo.category === 'shop') pkgTitle = 'Advanced / Shop Website (₹5,000+)';
    else pkgTitle = 'Basic 1-Page Website (₹499)';

    onSelectForForm(currentDemo.category, pkgTitle);
    onClose();
  };

  const renderActiveDemoComponent = () => {
    switch (activeDemoId) {
      case 'student-portfolio':
        return <StudentPortfolioDemo onSelectThisDemo={handleChooseWebsite} />;
      case 'college-project':
        return <CollegeProjectDemo onSelectThisDemo={handleChooseWebsite} />;
      case 'small-business':
        return <SmallBusinessDemo onSelectThisDemo={handleChooseWebsite} />;
      case 'restaurant-cafe':
        return <RestaurantDemo onSelectThisDemo={handleChooseWebsite} />;
      case 'photographer-portfolio':
        return <PhotographerDemo onSelectThisDemo={handleChooseWebsite} />;
      case 'mini-shop':
        return <MiniShopDemo onSelectThisDemo={handleChooseWebsite} />;
      default:
        return <StudentPortfolioDemo onSelectThisDemo={handleChooseWebsite} />;
    }
  };

  const deviceContainerClass =
    deviceView === 'desktop'
      ? 'w-full max-w-5xl'
      : deviceView === 'tablet'
      ? 'w-full max-w-3xl'
      : 'w-full max-w-sm';

  return (
    <div id="demo-viewer-modal" className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="w-full max-w-6xl bg-[#0F0F0F] border border-white/10 rounded-sm p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 mb-4 shadow-2xl">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="font-bold text-xs uppercase tracking-wider text-white">Interactive Sandbox:</span>
            <span className="text-[10px] uppercase tracking-wider bg-orange-600/10 text-orange-400 font-mono px-2 py-0.5 rounded-sm border border-orange-600/30">
              {currentDemo.tag}
            </span>
          </div>

          <button
            onClick={onClose}
            className="md:hidden text-white/40 hover:text-white p-1 rounded-sm bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1 scrollbar-none">
          {DEMO_WEBSITES.map(demo => (
            <button
              key={demo.id}
              onClick={() => setActiveDemoId(demo.id)}
              className={`text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-sm whitespace-nowrap font-bold transition-all cursor-pointer ${
                activeDemoId === demo.id
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {demo.title.split(' ')[0]} {demo.tag}
            </button>
          ))}
        </div>

        {/* Device Switcher & Action */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex bg-[#0A0A0A] p-1 rounded-sm border border-white/10">
            <button
              onClick={() => setDeviceView('desktop')}
              title="Desktop View"
              className={`p-1.5 rounded-sm text-xs transition-colors cursor-pointer ${
                deviceView === 'desktop' ? 'bg-orange-600 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceView('tablet')}
              title="Tablet View"
              className={`p-1.5 rounded-sm text-xs transition-colors cursor-pointer ${
                deviceView === 'tablet' ? 'bg-orange-600 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              title="Mobile View"
              className={`p-1.5 rounded-sm text-xs transition-colors cursor-pointer ${
                deviceView === 'mobile' ? 'bg-orange-600 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleChooseWebsite}
            className="bg-orange-600 hover:bg-orange-500 text-white text-[11px] uppercase tracking-wider font-bold px-4 py-2 rounded-sm transition-all cursor-pointer shadow-md shadow-orange-600/20 flex items-center gap-1.5"
          >
            <span>Commission This Architecture</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="hidden md:flex text-white/40 hover:text-white p-2 rounded-sm bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demo Viewport Simulator Frame */}
      <div className={`transition-all duration-300 mx-auto my-auto ${deviceContainerClass} w-full`}>
        <div className="bg-[#0F0F0F] p-2 sm:p-3 rounded-sm border border-white/10 shadow-2xl">
          {/* Browser Address Bar Simulation */}
          <div className="bg-[#0A0A0A] px-4 py-2 rounded-sm border border-white/10 flex items-center justify-between text-xs text-white/40 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
              <span className="w-2 h-2 rounded-full bg-white/20" />
            </div>
            <div className="bg-[#141414] border border-white/10 px-4 py-0.5 rounded-sm text-[11px] font-mono text-white/70 flex items-center gap-1.5">
              <span className="text-orange-500 font-bold">🔒 https://</span>
              <span>demo-{currentDemo.id}.lcwebstudio.live</span>
            </div>
            <span className="text-[10px] font-mono text-white/30 uppercase">Interactive Mock</span>
          </div>

          {/* Interactive Component Frame */}
          <div className="rounded-sm overflow-hidden border border-white/10">
            {renderActiveDemoComponent()}
          </div>
        </div>
      </div>

      {/* Bottom Info Footer */}
      <div className="w-full max-w-4xl text-center py-3 text-[11px] text-white/40 font-light">
        <strong className="text-white font-medium">LC Web Studio Spec:</strong> All templates are fully customizable with your content, branding, payment gateways, and custom backend functionality.
      </div>
    </div>
  );
};
