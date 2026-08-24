import React, { useState, useEffect } from 'react';
import { WebsiteCategory, BudgetRange, Lead, PricingPackage, PaymentRecord } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DemoShowcase } from './components/DemoShowcase';
import { PricingSection } from './components/PricingSection';
import { RequestForm } from './components/RequestForm';
import { ServicesSection } from './components/ServicesSection';
import { DemoViewerModal } from './components/demos/DemoViewerModal';
import { AIEstimatorModal } from './components/AIEstimatorModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentModal } from './components/PaymentModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { Footer } from './components/Footer';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState('student-portfolio');
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Payment Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(499);
  const [paymentPackage, setPaymentPackage] = useState<string>('Website Development');
  const [paymentLead, setPaymentLead] = useState<Lead | null>(null);

  // Form prefill state
  const [formCategory, setFormCategory] = useState<WebsiteCategory>('college_project');
  const [formPackage, setFormPackage] = useState<string>('');

  // Fetch leads from server on load
  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const scrollToForm = () => {
    const el = document.getElementById('request-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDemoModal = (demoId?: string) => {
    if (demoId) setSelectedDemoId(demoId);
    setIsDemoModalOpen(true);
  };

  const handleSelectPackage = (pkg: PricingPackage) => {
    setFormCategory(pkg.categoryMatch);
    setFormPackage(`${pkg.title} (${pkg.priceRange})`);
    scrollToForm();
  };

  const handleOpenPaymentModal = (amount?: number, pkgName?: string, lead?: Lead | null) => {
    if (amount) setPaymentAmount(amount);
    if (pkgName) setPaymentPackage(pkgName);
    if (lead) {
      setPaymentLead(lead);
      if (lead.selectedPackage) setPaymentPackage(lead.selectedPackage);
      if (lead.quotedAmount) setPaymentAmount(lead.quotedAmount);
    } else {
      setPaymentLead(null);
    }
    setIsPaymentOpen(true);
  };

  const handleSelectFromDemo = (category: WebsiteCategory, packageTitle: string) => {
    setFormCategory(category);
    setFormPackage(packageTitle);
    scrollToForm();
  };

  const handleApplyFromAIEstimator = (
    category: WebsiteCategory,
    requirements: string,
    budget: BudgetRange,
    packageTitle: string
  ) => {
    setFormCategory(category);
    setFormPackage(packageTitle);
    scrollToForm();
  };

  const handleLeadSubmitted = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev.filter(l => l.id !== newLead.id)]);
  };

  const handlePaymentSuccess = (payment: PaymentRecord) => {
    fetchLeads();
  };

  const handleUpdateLeadStatus = async (id: string, status: any, notes?: string, quotedAmount?: number) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes, quotedAmount })
      });
      const data = await res.json();
      if (data.lead) {
        setLeads(prev => prev.map(l => l.id === id ? data.lead : l));
      }
    } catch (err) {
      console.error('Update lead error:', err);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error('Delete lead error:', err);
    }
  };

  const handleResetSampleLeads = async () => {
    try {
      const res = await fetch('/api/leads/reset', { method: 'POST' });
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Reset leads error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-orange-600 selection:text-white flex flex-col">
      {/* Navigation */}
      <Navbar
        onOpenDemos={() => handleOpenDemoModal()}
        onOpenEstimator={() => setIsEstimatorOpen(true)}
        onScrollToForm={scrollToForm}
        onScrollToPricing={scrollToPricing}
        onOpenPayment={() => handleOpenPaymentModal(499, 'General Project Advance')}
        isAdminOpen={isAdminOpen}
        setIsAdminOpen={setIsAdminOpen}
        leadCount={leads.filter(l => l.status === 'new').length}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onGetWebsite={scrollToForm}
          onViewDemos={() => handleOpenDemoModal()}
          onOpenEstimator={() => setIsEstimatorOpen(true)}
        />

        {/* Demo Websites Showcase */}
        <DemoShowcase
          onOpenDemoModal={handleOpenDemoModal}
        />

        {/* Pricing Packages */}
        <PricingSection
          onSelectPackage={handleSelectPackage}
          onOpenPayment={(amt, name) => handleOpenPaymentModal(amt, name)}
        />

        {/* Customer Request Form */}
        <RequestForm
          initialCategory={formCategory}
          initialPackage={formPackage}
          onLeadSubmitted={handleLeadSubmitted}
          onOpenEstimator={() => setIsEstimatorOpen(true)}
          onOpenPayment={(lead) => handleOpenPaymentModal(undefined, undefined, lead)}
        />

        {/* Services & Why Choose Us */}
        <ServicesSection />
      </main>

      {/* Footer */}
      <Footer
        onScrollToTop={scrollToTop}
        onOpenDemos={() => handleOpenDemoModal()}
        onScrollToPricing={scrollToPricing}
        onScrollToForm={scrollToForm}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppFloatingButton />

      {/* Interactive Demo Simulator Modal */}
      <DemoViewerModal
        initialDemoId={selectedDemoId}
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onSelectForForm={handleSelectFromDemo}
      />

      {/* AI Blueprint & Cost Estimator Modal */}
      <AIEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        onApplyToForm={handleApplyFromAIEstimator}
      />

      {/* Admin Studio Dashboard Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        leads={leads}
        onUpdateLeadStatus={handleUpdateLeadStatus}
        onDeleteLead={handleDeleteLead}
        onResetSampleLeads={handleResetSampleLeads}
      />

      {/* Secure Online Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        initialAmount={paymentAmount}
        initialPackage={paymentPackage}
        initialLead={paymentLead}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
