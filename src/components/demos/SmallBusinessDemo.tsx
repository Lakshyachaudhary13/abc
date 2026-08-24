import React, { useState } from 'react';
import { Wrench, PhoneCall, Star, CheckCircle, Clock, ShieldCheck, MapPin, MessageSquare, ArrowRight } from 'lucide-react';

export const SmallBusinessDemo: React.FC<{ onSelectThisDemo?: () => void }> = ({ onSelectThisDemo }) => {
  const [selectedService, setSelectedService] = useState<string>('ac_repair');
  const [booked, setBooked] = useState(false);

  const services = [
    { id: 'ac_repair', title: 'AC Service & Gas Refill', price: '₹499', rating: 4.9, time: '45 mins', desc: 'Deep jet cleaning, gas pressure check & anti-bacterial foam wash.' },
    { id: 'electrical', title: 'Home Electrical & Wiring', price: '₹299', rating: 4.8, time: '30 mins', desc: 'Short circuit fix, MCB installation, fan & light fixture fittings.' },
    { id: 'plumbing', title: 'Plumbing & Pipe Repair', price: '₹349', rating: 4.9, time: '40 mins', desc: 'Leakage inspection, tap & shower fitting, drain unblocking.' },
    { id: 'appliance', title: 'Washing Machine / Refrigerator', price: '₹599', rating: 4.7, time: '60 mins', desc: 'Motor diagnostic, cooling issue repair, genuine spare parts.' },
  ];

  return (
    <div id="small-business-demo" className="bg-slate-900 text-slate-100 font-sans min-h-[600px] rounded-xl overflow-hidden border border-slate-800">
      {/* Top Bar */}
      <div className="bg-amber-600 px-6 py-2 text-slate-950 font-bold text-xs flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" /> Fast 30-Minute Doorstep Arrival in Your City
        </span>
        <span className="flex items-center gap-1">
          <PhoneCall className="w-3.5 h-3.5" /> Emergency Helpline: +91 98765-XXXXX
        </span>
      </div>

      {/* Main Header */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white">ProFix Home Services</span>
            <p className="text-[11px] text-amber-400">Certified Technicians • 30-Day Guarantee</p>
          </div>
        </div>

        {onSelectThisDemo && (
          <button
            onClick={onSelectThisDemo}
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            Get Business Site (₹2,499)
          </button>
        )}
      </div>

      {/* Hero */}
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 mb-3">
              <Star className="w-3 h-3 fill-amber-400" /> 4.9 Star Rated by 1,400+ Local Customers
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
              Reliable Home Repair & Maintenance at Transparent Prices
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
              No hidden charges. Verified background-checked mechanics with 30-day free rework warranty.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 30-Day Warranty</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-400" /> Verified Pros</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-400" /> 10km Area Coverage</span>
            </div>
          </div>
        </div>

        {/* Services & Booking Grid */}
        <div>
          <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
            <span>Select Service for Instant Booking</span>
            <span className="text-xs text-slate-400 font-normal">Click any card to calculate cost</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {services.map(s => {
              const isSelected = selectedService === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedService(s.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-md shadow-amber-500/10'
                      : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <h4 className="font-bold text-sm text-white">{s.title}</h4>
                    <span className="font-mono font-extrabold text-amber-400 text-sm">{s.price}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{s.desc}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/50">
                    <span className="flex items-center gap-1 text-amber-300 font-medium">
                      <Star className="w-3 h-3 fill-amber-300" /> {s.rating}
                    </span>
                    <span className="text-slate-400">⏱ {s.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Confirmation Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400">Selected Service:</span>
              <p className="font-bold text-white text-sm">
                {services.find(s => s.id === selectedService)?.title} — <span className="text-amber-400">{services.find(s => s.id === selectedService)?.price}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setBooked(true);
                  setTimeout(() => setBooked(false), 4000);
                }}
                className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Book Doorstep Visit
              </button>
            </div>
          </div>

          {booked && (
            <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-600/50 rounded-lg text-emerald-300 text-xs text-center animate-in fade-in">
              🎉 Booking received! Technician assigned for {services.find(s => s.id === selectedService)?.title}. Arriving in 30 minutes!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
