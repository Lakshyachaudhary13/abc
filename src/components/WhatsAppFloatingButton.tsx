import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const defaultPhone = '919999999999';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = userMsg.trim() || 'Hello LC Web Studio! I want to get a website made.';
    const url = `https://wa.me/${defaultPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setIsOpen(false);
    setUserMsg('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat Popup Bubble */}
      {isOpen && (
        <div className="bg-[#0F0F0F] border border-white/10 rounded-sm shadow-2xl p-4 mb-3 w-80 text-white animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-sm bg-orange-600 flex items-center justify-center font-black text-white text-[11px]">
                LC
              </div>
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider">LC Web Studio Support</h4>
                <p className="text-[9px] text-orange-400 font-mono">● LIVE DESK (Replies in 5m)</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white p-1 rounded-sm cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat bubble body */}
          <div className="bg-[#0A0A0A] p-3 rounded-sm border border-white/10 text-xs text-white/70 mb-3 space-y-1 font-light">
            <p className="font-semibold text-white">Namaste! 🙏</p>
            <p>Aapko kaunsi website banwani hai? (College project, Portfolio, Business ya Shop?)</p>
            <p className="text-[10px] text-orange-400 font-mono font-bold">Special packages starting from ₹499!</p>
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-1 mb-3">
            {[
              'College Project chahiye',
              'Portfolio Website enquiry',
              'Business Website quote'
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => setUserMsg(prompt)}
                className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 px-2 py-1 rounded-sm cursor-pointer transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="flex gap-1.5">
            <input
              type="text"
              placeholder="Apna message likhein..."
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-sm px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 text-white p-2 rounded-sm transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        id="floating-whatsapp-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-2xl shadow-emerald-500/30 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
        title="Chat with LC Web Studio on WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-black" />
      </button>
    </div>
  );
};
