import React, { useState } from 'react';
import { Camera, Eye, Sparkles, Image as ImageIcon, Check, Calendar, ArrowUpRight } from 'lucide-react';

export const PhotographerDemo: React.FC<{ onSelectThisDemo?: () => void }> = ({ onSelectThisDemo }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'portrait' | 'wedding' | 'editorial'>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photos = [
    { id: '1', title: 'Golden Hour Silhouette', category: 'portrait', gradient: 'from-amber-700 via-orange-800 to-stone-900', location: 'Jaipur Fort' },
    { id: '2', title: 'The Royal Heritage Vows', category: 'wedding', gradient: 'from-rose-800 via-pink-900 to-neutral-900', location: 'Udaipur Palace' },
    { id: '3', title: 'Vogue Minimalist Editorial', category: 'editorial', gradient: 'from-zinc-700 via-neutral-800 to-black', location: 'Studio Mumbai' },
    { id: '4', title: 'Candid Monsoon Moments', category: 'portrait', gradient: 'from-blue-900 via-slate-800 to-stone-900', location: 'Old Delhi' },
    { id: '5', title: 'Grand Sangeet Celebrations', category: 'wedding', gradient: 'from-purple-900 via-violet-950 to-stone-900', location: 'Goa Beach Resort' },
    { id: '6', title: 'Urban Architecture Shadows', category: 'editorial', gradient: 'from-neutral-800 via-stone-800 to-zinc-950', location: 'Cyber Hub' },
  ];

  const filteredPhotos = activeCategory === 'all' 
    ? photos 
    : photos.filter(p => p.category === activeCategory);

  return (
    <div id="photographer-demo" className="bg-neutral-950 text-neutral-100 font-sans min-h-[600px] rounded-xl overflow-hidden border border-neutral-800">
      {/* Navigation */}
      <div className="bg-neutral-900/90 px-6 py-4 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-white">
            <Camera className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-wider uppercase text-white">LensCraft Visuals</span>
            <p className="text-[10px] text-neutral-400 font-mono">Luxury Wedding & Fashion Photographer</p>
          </div>
        </div>

        {onSelectThisDemo && (
          <button
            onClick={onSelectThisDemo}
            className="text-xs bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            Get Photography Site (₹1,999)
          </button>
        )}
      </div>

      {/* Hero */}
      <div className="px-6 py-8 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[11px] font-mono tracking-widest text-amber-400 uppercase">Visual Storytelling & Direction</span>
          <h2 className="text-2xl sm:text-3xl font-light text-white mt-1 mb-2 tracking-tight">
            Capturing Moments That Outlive Time
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Available worldwide for destination weddings, high-fashion editorials, and bespoke portraits.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-2 mb-6">
          {(['all', 'portrait', 'wedding', 'editorial'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-full capitalize transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-400 text-neutral-950 font-bold'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'All Galleries' : cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredPhotos.map(photo => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo.title)}
              className="group relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border border-neutral-800/80 bg-neutral-900"
            >
              <div className={`w-full h-full bg-gradient-to-br ${photo.gradient} transition-transform duration-500 group-hover:scale-105 flex items-center justify-center`}>
                <ImageIcon className="w-8 h-8 text-white/30" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <span className="text-[10px] text-amber-300 font-mono uppercase tracking-wider">{photo.location}</span>
                <h4 className="text-sm font-semibold text-white flex items-center justify-between">
                  {photo.title}
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 transition-colors" />
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Booking prompt modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 text-neutral-200 text-center relative">
            <h3 className="text-base font-bold text-white mb-2">{selectedPhoto}</h3>
            <p className="text-xs text-neutral-400 mb-5">High-resolution print available. Book your session slot today.</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  alert('Booking inquiry sent to photographer!');
                  setSelectedPhoto(null);
                }}
                className="flex-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Inquire Session Packages
              </button>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-4 bg-neutral-800 hover:bg-neutral-700 text-white text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
