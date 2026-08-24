import React, { useState } from 'react';
import { WebsiteCategory, BudgetRange, Lead } from '../types';
import confetti from 'canvas-confetti';
import { Send, Sparkles, CheckCircle2, MessageSquare, Phone, User, DollarSign, Clock, Layers, ArrowRight, ExternalLink } from 'lucide-react';

interface RequestFormProps {
  initialCategory?: WebsiteCategory;
  initialPackage?: string;
  onLeadSubmitted: (lead: Lead) => void;
  onOpenEstimator: () => void;
  onOpenPayment?: (lead: Lead) => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({
  initialCategory = 'college_project',
  initialPackage = '',
  onLeadSubmitted,
  onOpenEstimator,
  onOpenPayment
}) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [category, setCategory] = useState<WebsiteCategory>(initialCategory);
  const [customCategory, setCustomCategory] = useState('');
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState<BudgetRange>('500-1000');
  const [urgency, setUrgency] = useState<'standard' | 'urgent_24h' | 'flexible'>('standard');
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);

  const [loading, setLoading] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Sync props if changed
  React.useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
  }, [initialCategory]);

  React.useEffect(() => {
    if (initialPackage) setSelectedPackage(initialPackage);
  }, [initialPackage]);

  const categories: { id: WebsiteCategory; label: string; icon: string; desc: string }[] = [
    { id: 'college_project', label: 'College Project', icon: '🎓', desc: 'B.Tech, BCA, MCA Viva & Major/Minor project' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼', desc: 'Developer, Designer, Creator or Job Resume' },
    { id: 'business', label: 'Business', icon: '🏢', desc: 'Local shop, clinic, agency, services & coaching' },
    { id: 'shop', label: 'Shop / Store', icon: '🛍️', desc: 'Product catalogue, WhatsApp ordering & mini e-com' },
    { id: 'personal', label: 'Personal', icon: '👤', desc: 'Bio link, wedding invite, personal brand or blog' },
    { id: 'other', label: 'Other', icon: '🌐', desc: 'Custom unique requirement or startup MVP' },
  ];

  const budgetOptions: { id: BudgetRange; label: string; tag: string }[] = [
    { id: '500-1000', label: '₹500 – ₹1,000', tag: 'Basic / Starter' },
    { id: '1000-2500', label: '₹1,000 – ₹2,500', tag: 'Standard / Project' },
    { id: '2500-5000', label: '₹2,500 – ₹5,000', tag: 'Business / Advanced' },
    { id: '5000+', label: '₹5,000+', tag: 'Full Custom App' },
  ];

  const quickRequirementPrompts = [
    'Need a 1-page modern responsive website with WhatsApp button',
    'Final year BCA college project with login, search & viva report',
    'Developer portfolio with GitHub links, live projects & resume PDF',
    'Local business website with Google Maps location and review section',
    'Online food menu with cart and WhatsApp order sending'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!whatsapp.trim() || whatsapp.length < 8) {
      setError('Please enter a valid 10-digit WhatsApp number');
      return;
    }
    if (!requirements.trim()) {
      setError('Please describe what you need in your website');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          whatsapp: whatsapp.trim(),
          category,
          customCategory: category === 'other' ? customCategory : '',
          requirements: requirements.trim(),
          budget,
          selectedPackage,
          urgency
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setSubmittedLead(data.lead);
      setWhatsappLink(data.whatsappRedirectUrl);
      onLeadSubmitted(data.lead);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Server error. Please try again or WhatsApp directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="request-form" className="py-20 bg-[#0A0A0A] border-b border-white/10 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Form Container */}
        <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.25em] font-bold text-orange-500 uppercase mb-3">
              <MessageSquare className="w-3 h-3" /> Commission / Request Form
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif italic font-bold text-white tracking-tight mb-2">
              Send Your Project Brief
            </h2>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">
              Submit your project details below. Your brief is routed directly to our studio dashboard and we will connect with you via WhatsApp to finalize specifications.
            </p>
          </div>

          {submittedLead ? (
            /* Success State */
            <div className="bg-[#0A0A0A] border border-orange-500/40 rounded-sm p-6 sm:p-8 text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-sm bg-orange-600/10 text-orange-500 border border-orange-600/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <h3 className="text-xl sm:text-2xl font-serif italic font-bold text-white mb-2">
                Inquiry Logged, {submittedLead.name}!
              </h3>
              <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto mb-6 font-light">
                Aapki website inquiry LC Web Studio ke Admin Dashboard par receive ho chuki hai. Instant conversation ke liye niche button se WhatsApp par chat shuru karein.
              </p>

              {/* Inquiry Summary Box */}
              <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-4 text-left max-w-md mx-auto mb-6 text-xs space-y-2 font-mono">
                <div className="text-orange-500 font-bold uppercase tracking-wider">Ref ID: #{submittedLead.id}</div>
                <div className="text-white/70">Category: <span className="text-white capitalize">{submittedLead.category.replace('_', ' ')}</span></div>
                <div className="text-white/70">Budget: <span className="text-orange-400 font-bold">₹{submittedLead.budget}</span></div>
                <div className="text-white/70">WhatsApp: <span className="text-white">{submittedLead.whatsapp}</span></div>
                <div className="text-white/50 pt-1 border-t border-white/10 line-clamp-2">Brief: {submittedLead.requirements}</div>
              </div>

              <div className="flex flex-col gap-3 justify-center max-w-md mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    id="whatsapp-chat-now-btn"
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-[0.15em] px-4 py-3.5 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-orange-600/20"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>WhatsApp Chat</span>
                  </a>

                  {onOpenPayment && (
                    <button
                      type="button"
                      id="pay-token-advance-btn"
                      onClick={() => onOpenPayment(submittedLead)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-[0.15em] px-4 py-3.5 rounded-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <span>💳 Pay Slot Token</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setSubmittedLead(null)}
                  className="bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-xs uppercase tracking-[0.15em] px-5 py-2.5 rounded-sm border border-white/10 transition-colors cursor-pointer"
                >
                  Submit Another Project Brief
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 rounded-sm text-red-300 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Name & WhatsApp Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-orange-500" />
                    <span>Aapka Naam (Full Name) *</span>
                  </label>
                  <input
                    id="input-customer-name"
                    type="text"
                    required
                    placeholder="e.g. Lakshya Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 focus:border-orange-500 rounded-sm px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-orange-500" />
                    <span>WhatsApp Number (Direct Chat) *</span>
                  </label>
                  <input
                    id="input-customer-whatsapp"
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-white/10 focus:border-orange-500 rounded-sm px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Website Type / Purpose (Requirement from prompt) */}
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-orange-500" />
                    <span>Website kis liye chahiye? *</span>
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">SELECT ONE</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {categories.map(cat => {
                    const isSelected = category === cat.id;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-3.5 rounded-sm border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600/15 border-orange-500 text-white shadow-sm'
                            : 'bg-[#0A0A0A] border-white/10 hover:border-white/20 text-white/70'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{cat.icon}</span>
                          <span className="text-xs font-bold uppercase tracking-tight">{cat.label}</span>
                        </div>
                        <p className="text-[10px] text-white/40 leading-tight font-light">{cat.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {category === 'other' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Specify your website type (e.g. Real Estate, Event Booking, NGO)..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 focus:border-orange-500 rounded-sm px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Requirements Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                    <span>Website mein kya-kya chahiye? (Requirements) *</span>
                  </label>

                  <button
                    type="button"
                    onClick={onOpenEstimator}
                    className="text-[10px] uppercase tracking-[0.15em] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" /> AI Blueprint Estimator
                  </button>
                </div>

                <textarea
                  id="input-customer-requirements"
                  rows={4}
                  required
                  placeholder="Website mein kitne pages hone chahiye? Kya features chahiye? (e.g. Gallery, Contact Form, WhatsApp button, Payment gateway, Student attendance system, etc.)..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 focus:border-orange-500 rounded-sm p-4 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none transition-colors"
                />

                {/* Quick Prompts */}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider mr-1 self-center">Suggestions:</span>
                  {quickRequirementPrompts.slice(0, 3).map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRequirements(prompt)}
                      className="text-[10px] bg-white/5 border border-white/10 hover:border-orange-500/40 text-white/60 hover:text-white px-2.5 py-1 rounded-sm transition-colors cursor-pointer"
                    >
                      + {prompt.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Selector (Requirement from prompt) */}
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                  <span>Aapka Budget Kitna Hai? *</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {budgetOptions.map(b => {
                    const isSelected = budget === b.id;
                    return (
                      <button
                        type="button"
                        key={b.id}
                        onClick={() => setBudget(b.id)}
                        className={`p-3.5 rounded-sm border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600/15 border-orange-500 text-white shadow-sm'
                            : 'bg-[#0A0A0A] border-white/10 hover:border-white/20 text-white/70'
                        }`}
                      >
                        <div className="font-mono font-bold text-xs sm:text-sm text-white">{b.label}</div>
                        <div className="text-[9px] text-orange-400 uppercase tracking-wider mt-0.5">{b.tag}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Urgency / Delivery Preference */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xs text-white/70">Turnaround Speed:</span>
                  <div className="flex gap-1.5">
                    {(['standard', 'urgent_24h', 'flexible'] as const).map(u => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUrgency(u)}
                        className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-sm border transition-all cursor-pointer ${
                          urgency === u
                            ? 'bg-orange-600 text-white border-orange-500 font-bold'
                            : 'bg-[#0A0A0A] text-white/50 border-white/10 hover:text-white'
                        }`}
                      >
                        {u === 'urgent_24h' ? '⚡ 24h Express' : u === 'standard' ? 'Standard (2-3 Days)' : 'Flexible'}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPackage && (
                  <span className="text-[11px] bg-white/5 border border-white/10 text-orange-400 px-3 py-1 rounded-sm uppercase tracking-wider font-mono">
                    Tier: <strong>{selectedPackage}</strong>
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <button
                id="submit-request-form-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm uppercase tracking-[0.2em] py-4 rounded-sm shadow-xl shadow-orange-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Logging Brief & Connecting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Request (Instant WhatsApp Connect)</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
