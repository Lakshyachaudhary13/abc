import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, PaymentRecord } from '../types';
import { 
  Users, MessageSquare, Phone, Search, Filter, Clock, CheckCircle2, 
  Trash2, Sparkles, ExternalLink, RefreshCw, Send, DollarSign, X, Check, Edit3,
  CreditCard, QrCode, ShieldCheck, ArrowRight, Copy, AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  onUpdateLeadStatus: (id: string, status: LeadStatus, notes?: string, quotedAmount?: number) => void;
  onDeleteLead: (id: string) => void;
  onResetSampleLeads: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  leads,
  onUpdateLeadStatus,
  onDeleteLead,
  onResetSampleLeads
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'payments'>('leads');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingQuote, setEditingQuote] = useState<number | ''>('');
  
  // Payments state
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // AI reply states
  const [generatingReply, setGeneratingReply] = useState(false);
  const [generatedReply, setGeneratedReply] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedPayLink, setCopiedPayLink] = useState(false);

  // Fetch payments list
  const fetchPayments = async () => {
    setLoadingPayments(true);
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPayments();
    }
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (selectedLead) {
      setEditingNotes(selectedLead.notes || '');
      setEditingQuote(selectedLead.quotedAmount || '');
      setGeneratedReply(null);
    }
  }, [selectedLead]);

  if (!isOpen) return null;

  const handleVerifyPayment = async (paymentId: string) => {
    setVerifyingId(paymentId);
    try {
      const res = await fetch(`/api/payments/${paymentId}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' })
      });
      const data = await res.json();
      if (data.success) {
        setPayments(prev => prev.map(p => (p.id === paymentId ? { ...p, status: 'verified' } : p)));
      }
    } catch (err) {
      console.error('Failed to verify payment:', err);
    } finally {
      setVerifyingId(null);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.whatsapp.includes(search) ||
      lead.requirements.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalVerifiedRevenue = payments
    .filter(p => p.status === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPendingPayments = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return <span className="bg-orange-600/20 text-orange-400 border border-orange-600/30 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold font-mono">New Inquiry</span>;
      case 'contacted':
        return <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold font-mono">Contacted</span>;
      case 'in_progress':
        return <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold font-mono">In Progress</span>;
      case 'completed':
        return <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-bold font-mono">Completed</span>;
      case 'archived':
        return <span className="bg-white/5 text-white/40 border border-white/10 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm font-mono">Archived</span>;
    }
  };

  const handleGenerateAIReply = async (lead: Lead) => {
    setGeneratingReply(true);
    setGeneratedReply(null);
    setCopied(false);

    try {
      const res = await fetch('/api/ai/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: lead.name,
          requirements: lead.requirements,
          category: lead.category,
          budget: lead.budget,
          quotedAmount: editingQuote || 999
        })
      });

      const data = await res.json();
      setGeneratedReply(data.replyText);
    } catch (err) {
      console.error(err);
      setGeneratedReply(`Namaste ${lead.name}! Lakshya from LC Web Studio here. We can build your ${lead.category} website within 24-48 hours. Let's discuss details!`);
    } finally {
      setGeneratingReply(false);
    }
  };

  const handleSaveNotes = () => {
    if (!selectedLead) return;
    onUpdateLeadStatus(
      selectedLead.id,
      selectedLead.status,
      editingNotes,
      editingQuote ? Number(editingQuote) : undefined
    );
    setSelectedLead({
      ...selectedLead,
      notes: editingNotes,
      quotedAmount: editingQuote ? Number(editingQuote) : undefined
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div id="admin-dashboard-modal" className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="w-full max-w-7xl mx-auto bg-[#0F0F0F] border border-white/10 rounded-sm p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-4 shadow-2xl">
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-sm bg-orange-600 flex items-center justify-center text-white font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif italic font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <span>LC Web Studio — Admin Operations Desk</span>
                <span className="text-[10px] bg-orange-600/20 text-orange-400 font-mono px-2 py-0.5 rounded-sm border border-orange-600/30 uppercase tracking-wider font-bold">
                  {leads.length} Leads • ₹{totalVerifiedRevenue} Revenue
                </span>
              </h2>
              <p className="text-xs text-white/50 font-light">Client pipeline control, pricing confirmation, UTR verification and payment records</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden text-white/40 hover:text-white p-2 rounded-sm bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Tabs & Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap">
          <div className="flex bg-[#0A0A0A] p-1 rounded-sm border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-3 py-1.5 rounded-sm uppercase tracking-wider font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'leads'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Inquiries Pipeline ({leads.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-3 py-1.5 rounded-sm uppercase tracking-wider font-bold text-[10px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'payments'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payments & UTR ({payments.length})</span>
            </button>
          </div>

          <button
            onClick={async () => {
              onResetSampleLeads();
              await fetchPayments();
            }}
            className="text-[11px] uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white/70 px-3.5 py-2 rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 border border-white/10 font-bold"
            title="Reset sample leads and payment records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Sample Data</span>
          </button>

          <button
            onClick={onClose}
            className="hidden md:flex text-white/40 hover:text-white p-2 rounded-sm bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* TAB 1: LEADS PIPELINE */}
      {activeTab === 'leads' && (
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
          {/* Left 2 Cols: Lead List */}
          <div className="lg:col-span-2 bg-[#0F0F0F] border border-white/10 rounded-sm p-4 sm:p-5 flex flex-col">
            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search leads by name, phone or requirements..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto p-1 bg-[#0A0A0A] rounded-sm border border-white/10 text-xs">
                {(['all', 'new', 'contacted', 'in_progress', 'completed'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-sm uppercase tracking-wider text-[10px] whitespace-nowrap transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-orange-600 text-white font-bold'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'All' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table / Cards List */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[560px] pr-1">
              {filteredLeads.length === 0 ? (
                <div className="text-center py-16 text-xs text-white/40 font-mono">
                  No matching inquiries found. Try clearing filters.
                </div>
              ) : (
                filteredLeads.map(lead => {
                  const isSelected = selectedLead?.id === lead.id;
                  const cleanPhone = lead.whatsapp.replace(/[^0-9]/g, '');
                  const directWaLink = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=Namaste%20${encodeURIComponent(lead.name)}!%20Main%20LC%20Web%20Studio%20se%20baat%20kar%20raha%20hoon%20regarding%20your%20website%20request.`;

                  return (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-4 rounded-sm border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-orange-600/10 border-orange-500 shadow-md'
                          : 'bg-[#0A0A0A] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm uppercase tracking-tight">{lead.name}</span>
                          {getStatusBadge(lead.status)}
                          {lead.paymentStatus === 'advance_paid' && (
                            <span className="bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono px-1.5 py-0.5 rounded-sm uppercase">
                              ₹ Paid Advance
                            </span>
                          )}
                          {lead.paymentStatus === 'paid_full' && (
                            <span className="bg-emerald-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-sm uppercase font-bold">
                              ✓ Paid Full
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-white/50 font-mono">
                          <span className="text-orange-400">📱 {lead.whatsapp}</span>
                          <span>•</span>
                          <span className="capitalize text-white/80">📂 {lead.category.replace('_', ' ')}</span>
                          <span>•</span>
                          <span className="text-white font-bold">₹{lead.budget}</span>
                        </div>

                        <p className="text-xs text-white/70 line-clamp-1 max-w-lg mt-1 font-light">
                          "{lead.requirements}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <a
                          href={directWaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-orange-600 hover:bg-orange-500 text-white text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-sm flex items-center gap-1.5 shadow-sm"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat WhatsApp</span>
                        </a>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete inquiry from ${lead.name}?`)) {
                              onDeleteLead(lead.id);
                              if (selectedLead?.id === lead.id) setSelectedLead(null);
                            }
                          }}
                          className="text-white/40 hover:text-red-400 p-1.5 rounded-sm hover:bg-white/5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Col: Selected Lead Details & Actions */}
          <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-4 sm:p-5 flex flex-col justify-between">
            {selectedLead ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white text-base uppercase tracking-tight">{selectedLead.name}</h3>
                    {getStatusBadge(selectedLead.status)}
                  </div>
                  <p className="text-[11px] text-white/40 font-mono">ID: #{selectedLead.id} • {new Date(selectedLead.createdAt).toLocaleString()}</p>
                </div>

                {/* Status Update Pipeline */}
                <div className="bg-[#0A0A0A] p-3 rounded-sm border border-white/10">
                  <span className="text-[10px] text-white/50 uppercase tracking-wider font-bold block mb-2">Update Pipeline Status:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {(['new', 'contacted', 'in_progress', 'completed'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => {
                          onUpdateLeadStatus(selectedLead.id, st, selectedLead.notes, selectedLead.quotedAmount);
                          setSelectedLead({ ...selectedLead, status: st });
                        }}
                        className={`py-1.5 px-2 rounded-sm uppercase tracking-wider font-mono text-[10px] transition-all cursor-pointer ${
                          selectedLead.status === st
                            ? 'bg-orange-600 text-white font-bold'
                            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Client Info & Requirement */}
                <div className="bg-[#0A0A0A] p-3.5 rounded-sm border border-white/10 space-y-2 text-xs">
                  <div>
                    <span className="text-white/50 uppercase tracking-wider text-[10px]">📱 WhatsApp:</span>
                    <span className="text-white font-mono ml-1.5 font-bold">{selectedLead.whatsapp}</span>
                  </div>
                  <div>
                    <span className="text-white/50 uppercase tracking-wider text-[10px]">📂 Category:</span>
                    <span className="text-white capitalize ml-1.5">{selectedLead.category.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-white/50 uppercase tracking-wider text-[10px]">💰 Budget:</span>
                    <span className="text-orange-400 font-mono ml-1.5 font-bold">₹{selectedLead.budget}</span>
                  </div>
                  {selectedLead.paymentStatus && (
                    <div>
                      <span className="text-white/50 uppercase tracking-wider text-[10px]">💳 Payment State:</span>
                      <span className="text-emerald-400 font-mono ml-1.5 uppercase font-bold">
                        {selectedLead.paymentStatus.replace('_', ' ')} {selectedLead.paidAmount ? `(₹${selectedLead.paidAmount})` : ''}
                      </span>
                    </div>
                  )}
                  {selectedLead.selectedPackage && (
                    <div>
                      <span className="text-white/50 uppercase tracking-wider text-[10px]">📦 Package:</span>
                      <span className="text-white ml-1.5">{selectedLead.selectedPackage}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-white/50 block mb-1 font-semibold uppercase tracking-wider text-[10px]">Client Requirement:</span>
                    <p className="text-white/80 bg-[#141414] p-2.5 rounded-sm border border-white/10 leading-relaxed max-h-28 overflow-y-auto font-light">
                      {selectedLead.requirements}
                    </p>
                  </div>
                </div>

                {/* Internal Notes & Quoted Amount */}
                <div className="bg-[#0A0A0A] p-3 rounded-sm border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 uppercase tracking-wider text-[10px] font-bold">Quoted Final Price (₹):</span>
                    <input
                      type="number"
                      placeholder="e.g. 1499"
                      value={editingQuote}
                      onChange={(e) => setEditingQuote(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-24 bg-[#141414] border border-white/10 rounded-sm px-2 py-1 text-right text-orange-400 font-mono font-bold focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <span className="text-white/50 block mb-1 uppercase tracking-wider text-[10px]">Admin Notes:</span>
                    <textarea
                      rows={2}
                      placeholder="Add internal notes about client meeting, advance payment, etc..."
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      className="w-full bg-[#141414] border border-white/10 rounded-sm p-2 text-xs text-white/80 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveNotes}
                    className="w-full bg-white/5 hover:bg-white/10 text-white/80 text-[11px] uppercase tracking-wider font-bold py-2 rounded-sm border border-white/10 transition-colors cursor-pointer"
                  >
                    Save Notes & Quote
                  </button>
                </div>

                {/* Send WhatsApp UPI Payment Link Shortcut */}
                <div className="bg-[#0A0A0A] border border-orange-500/30 p-3 rounded-sm space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5" /> Send UPI Payment Request
                    </span>
                    <span className="text-[10px] text-white/40 font-mono">lakshyakumar133456@okaxis</span>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`https://wa.me/${selectedLead.whatsapp.replace(/[^0-9]/g, '')}?text=Namaste%20${encodeURIComponent(
                        selectedLead.name
                      )}!%20Aapke%20website%20project%20ka%20advance%20booking%20amount%20₹${editingQuote ? Math.round(Number(editingQuote) * 0.5) : 499}%20niche%20diye%20gaye%20UPI%20ID%20par%20pay%20karein%3A%0A%0AUPI%20ID%3A%20lakshyakumar133456@okaxis%0APayee%3A%20LC%20Web%20Studio%0AAmount%3A%20₹${editingQuote ? Math.round(Number(editingQuote) * 0.5) : 499}%0A%0APayment%20hone%20ke%20baat%20screenshot%20ya%20UTR%20number%20share%20karein.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-sm text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Payment Request</span>
                    </a>
                  </div>
                </div>

                {/* AI Pitch Generator */}
                <div className="bg-[#0A0A0A] border border-orange-500/30 p-3 rounded-sm space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI WhatsApp Pitch
                    </span>
                    <button
                      onClick={() => handleGenerateAIReply(selectedLead)}
                      disabled={generatingReply}
                      className="bg-orange-600 hover:bg-orange-500 text-white px-2.5 py-1 rounded-sm text-[10px] uppercase tracking-wider font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {generatingReply ? 'Writing...' : 'Generate Pitch'}
                    </button>
                  </div>

                  {generatedReply && (
                    <div className="space-y-2 animate-in fade-in">
                      <textarea
                        readOnly
                        rows={4}
                        value={generatedReply}
                        className="w-full bg-[#141414] border border-white/10 rounded-sm p-2 text-[11px] text-white/90 font-mono"
                      />
                      <button
                        onClick={() => copyToClipboard(generatedReply)}
                        className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-sm text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Pitch'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-xs text-white/40 font-mono">
                Select any lead inquiry on the left to view full details, update notes, or generate tailored AI WhatsApp replies.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS & TRANSACTIONS */}
      {activeTab === 'payments' && (
        <div className="w-full max-w-7xl mx-auto space-y-4 flex-1">
          {/* Revenue Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-4">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-1">
                Verified Collected Revenue
              </div>
              <div className="font-serif italic font-bold text-2xl sm:text-3xl text-emerald-400">
                ₹{totalVerifiedRevenue}
              </div>
              <div className="text-[10px] text-white/50 mt-1 font-light">
                {payments.filter(p => p.status === 'verified').length} verified transactions
              </div>
            </div>

            <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-4">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-1">
                Pending Verification
              </div>
              <div className="font-serif italic font-bold text-2xl sm:text-3xl text-orange-400">
                ₹{totalPendingPayments}
              </div>
              <div className="text-[10px] text-white/50 mt-1 font-light">
                {payments.filter(p => p.status === 'pending').length} token UTRs awaiting bank cross-check
              </div>
            </div>

            <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-4">
              <div className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-1">
                Active UPI Gateway
              </div>
              <div className="font-mono font-bold text-xs text-orange-400 truncate">
                lakshyakumar133456@okaxis
              </div>
              <div className="text-[10px] text-white/50 mt-1 font-light">
                HDFC Bank Current Account • 0% Platform Deductions
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-[#0F0F0F] border border-white/10 rounded-sm p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-base uppercase tracking-tight flex items-center gap-2">
                <span>Recent Client Transactions & Token Submissions</span>
                <span className="text-[10px] bg-white/5 text-white/60 font-mono px-2 py-0.5 rounded-sm">
                  {payments.length} Total
                </span>
              </h3>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[500px]">
              {payments.length === 0 ? (
                <div className="text-center py-16 text-xs text-white/40 font-mono">
                  No payment records recorded yet.
                </div>
              ) : (
                payments.map(payment => (
                  <div
                    key={payment.id}
                    className="p-4 bg-[#0A0A0A] border border-white/10 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm uppercase tracking-tight">
                          {payment.clientName}
                        </span>
                        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-sm font-mono uppercase text-orange-400 font-bold">
                          {payment.paymentType.replace('_', ' ')}
                        </span>
                        {payment.status === 'verified' ? (
                          <span className="bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-mono px-2 py-0.5 rounded-sm font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Verified
                          </span>
                        ) : (
                          <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-[10px] uppercase font-mono px-2 py-0.5 rounded-sm font-bold">
                            Pending Verification
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-white/50 font-mono flex-wrap">
                        <span className="text-white font-bold font-serif italic text-base">₹{payment.amount}</span>
                        <span>•</span>
                        <span className="text-orange-400">📱 {payment.clientWhatsapp}</span>
                        <span>•</span>
                        <span className="capitalize text-white/80">Method: {payment.paymentMethod.replace('_', ' ')}</span>
                        {payment.utrNumber && (
                          <>
                            <span>•</span>
                            <span className="text-white/90">UTR: <code>{payment.utrNumber}</code></span>
                          </>
                        )}
                      </div>

                      <div className="text-[11px] text-white/40 font-mono">
                        {payment.packageTitle} • Ref ID: #{payment.id} • {new Date(payment.transactionDate).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {payment.status !== 'verified' && (
                        <button
                          onClick={() => handleVerifyPayment(payment.id)}
                          disabled={verifyingId === payment.id}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-sm transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{verifyingId === payment.id ? 'Verifying...' : 'Approve & Verify'}</span>
                        </button>
                      )}

                      <a
                        href={`https://wa.me/${payment.clientWhatsapp.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                          payment.clientName
                        )}!%20We%20have%20received%20your%20payment%20of%20₹${payment.amount}%20(UTR%3A%20${payment.utrNumber || 'N%2FA'}).%20Thank%20you%20for%20choosing%20LC%20Web%20Studio!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider px-3 py-2 rounded-sm border border-white/10 flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                        <span>WhatsApp Receipt</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
