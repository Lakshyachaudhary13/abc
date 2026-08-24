export type WebsiteCategory =
  | 'college_project'
  | 'portfolio'
  | 'business'
  | 'shop'
  | 'personal'
  | 'other';

export type BudgetRange =
  | '500-1000'
  | '1000-2500'
  | '2500-5000'
  | '5000+';

export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'in_progress'
  | 'completed'
  | 'archived';

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'bank_transfer' | 'qr_code';
export type PaymentType = 'full' | 'advance_50' | 'token_299' | 'custom';
export type PaymentStatus = 'pending' | 'verified' | 'failed';

export interface PaymentRecord {
  id: string;
  leadId?: string;
  clientName: string;
  clientWhatsapp: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  status: PaymentStatus;
  utrNumber?: string;
  transactionDate: string;
  packageTitle?: string;
  notes?: string;
}

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  category: WebsiteCategory;
  customCategory?: string;
  requirements: string;
  budget: BudgetRange;
  selectedPackage?: string;
  urgency?: 'standard' | 'urgent_24h' | 'flexible';
  referenceUrl?: string;
  createdAt: string;
  status: LeadStatus;
  notes?: string;
  quotedAmount?: number;
  paymentStatus?: 'unpaid' | 'advance_paid' | 'paid_full';
  paidAmount?: number;
  utrNumber?: string;
}

export interface PricingPackage {
  id: string;
  title: string;
  priceRange: string;
  minPrice: number;
  highlight?: boolean;
  popularTag?: string;
  deliveryTime: string;
  description: string;
  features: string[];
  bestFor: string;
  categoryMatch: WebsiteCategory;
}

export interface DemoWebsite {
  id: string;
  title: string;
  category: WebsiteCategory;
  tag: string;
  icon: string;
  description: string;
  techStack: string[];
  features: string[];
  previewGradient: string;
}

