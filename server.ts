import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google GenAI with recommended telemetry header
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// In-memory / File-backed Leads Storage
interface LeadRecord {
  id: string;
  name: string;
  whatsapp: string;
  category: string;
  customCategory?: string;
  requirements: string;
  budget: string;
  selectedPackage?: string;
  urgency?: string;
  referenceUrl?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'archived';
  notes?: string;
  quotedAmount?: number;
  paymentStatus?: 'unpaid' | 'advance_paid' | 'paid_full';
  paidAmount?: number;
  utrNumber?: string;
}

interface PaymentRecord {
  id: string;
  leadId?: string;
  clientName: string;
  clientWhatsapp: string;
  amount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'bank_transfer' | 'qr_code';
  paymentType: 'full' | 'advance_50' | 'token_299' | 'custom';
  status: 'pending' | 'verified' | 'failed';
  utrNumber?: string;
  transactionDate: string;
  packageTitle?: string;
  notes?: string;
}

const LEADS_FILE = path.join(process.cwd(), 'leads_data.json');
const PAYMENTS_FILE = path.join(process.cwd(), 'payments_data.json');

const INITIAL_SAMPLE_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-101',
    leadId: 'lead-4',
    clientName: 'Suresh Kirana Store',
    clientWhatsapp: '9811223344',
    amount: 799,
    paymentMethod: 'upi',
    paymentType: 'full',
    status: 'verified',
    utrNumber: '423188992314',
    transactionDate: new Date(Date.now() - 1000 * 60 * 1400).toISOString(),
    packageTitle: 'Basic 1-Page Website',
    notes: 'Paid via Google Pay to LC Web Studio UPI.'
  },
  {
    id: 'pay-102',
    leadId: 'lead-3',
    clientName: 'Rohan Mehra',
    clientWhatsapp: '9988776655',
    amount: 950,
    paymentMethod: 'upi',
    paymentType: 'advance_50',
    status: 'verified',
    utrNumber: '423899120033',
    transactionDate: new Date(Date.now() - 1000 * 60 * 550).toISOString(),
    packageTitle: 'Portfolio Website',
    notes: '50% advance token paid. Balance ₹949 due after domain deployment.'
  },
  {
    id: 'pay-103',
    leadId: 'lead-1',
    clientName: 'Aman Sharma',
    clientWhatsapp: '9876543210',
    amount: 499,
    paymentMethod: 'qr_code',
    paymentType: 'token_299',
    status: 'pending',
    utrNumber: '424109887766',
    transactionDate: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    packageTitle: 'Student Project Website',
    notes: 'Advance slot booking token submitted. Pending bank statement cross-check.'
  }
];

const INITIAL_SAMPLE_LEADS: LeadRecord[] = [
  {
    id: 'lead-1',
    name: 'Aman Sharma',
    whatsapp: '9876543210',
    category: 'college_project',
    requirements: 'Need a Final Year BCA Smart Hospital & Doctor Booking Web App with complete report and presentation slides. Delivery in 3 days.',
    budget: '1000-2500',
    selectedPackage: 'Student Project Website',
    urgency: 'urgent_24h',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'new',
    notes: 'Urgent BCA viva on Friday. Ready to pay advance.',
    quotedAmount: 1499,
    paymentStatus: 'advance_paid',
    paidAmount: 499,
    utrNumber: '424109887766'
  },
  {
    id: 'lead-2',
    name: 'Pooja Verma (Skin Glow Clinic)',
    whatsapp: '9123456780',
    category: 'business',
    requirements: 'Cosmetology & Laser Clinic website with treatment price list, appointment booking form, Google Map location, and customer reviews.',
    budget: '2500-5000',
    selectedPackage: 'Business Website',
    urgency: 'standard',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    status: 'contacted',
    notes: 'Sent pricing catalog on WhatsApp. Customer will share clinic photos today.',
    quotedAmount: 3499,
    paymentStatus: 'unpaid'
  },
  {
    id: 'lead-3',
    name: 'Rohan Mehra',
    whatsapp: '9988776655',
    category: 'portfolio',
    requirements: 'React frontend developer portfolio with cool dark-mode animations, interactive project gallery, and PDF resume download for job applications.',
    budget: '1000-2500',
    selectedPackage: 'Portfolio Website',
    urgency: 'standard',
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    status: 'in_progress',
    notes: 'Draft v1 shared on staging domain. Working on experience timeline.',
    quotedAmount: 1899,
    paymentStatus: 'advance_paid',
    paidAmount: 950,
    utrNumber: '423899120033'
  },
  {
    id: 'lead-4',
    name: 'Suresh Kirana & General Store',
    whatsapp: '9811223344',
    category: 'shop',
    requirements: 'Single page online order catalogue where local colony residents can see grocery items and place orders directly to our WhatsApp number.',
    budget: '500-1000',
    selectedPackage: 'Basic 1-Page Website',
    urgency: 'standard',
    createdAt: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    status: 'completed',
    notes: 'Delivered and live on custom domain! Customer paid full ₹799 via UPI.',
    quotedAmount: 799,
    paymentStatus: 'paid_full',
    paidAmount: 799,
    utrNumber: '423188992314'
  }
];

function loadLeads(): LeadRecord[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading leads file:', err);
  }
  return [...INITIAL_SAMPLE_LEADS];
}

function saveLeads(leads: LeadRecord[]) {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving leads file:', err);
  }
}

function loadPayments(): PaymentRecord[] {
  try {
    if (fs.existsSync(PAYMENTS_FILE)) {
      const data = fs.readFileSync(PAYMENTS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading payments file:', err);
  }
  return [...INITIAL_SAMPLE_PAYMENTS];
}

function savePayments(payments: PaymentRecord[]) {
  try {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify(payments, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving payments file:', err);
  }
}

let leadsDatabase: LeadRecord[] = loadLeads();
let paymentsDatabase: PaymentRecord[] = loadPayments();

// API ROUTES
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', studio: 'LC Web Studio', timestamp: new Date().toISOString() });
});

// Get all leads
app.get('/api/leads', (req: Request, res: Response) => {
  res.json({ success: true, count: leadsDatabase.length, leads: leadsDatabase });
});

// Create a new lead inquiry
app.post('/api/leads', (req: Request, res: Response) => {
  try {
    const { name, whatsapp, category, customCategory, requirements, budget, selectedPackage, urgency, referenceUrl } = req.body;

    if (!name || !whatsapp || !requirements) {
      return res.status(400).json({ success: false, error: 'Name, WhatsApp number and requirements are required' });
    }

    const newLead: LeadRecord = {
      id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: String(name).trim(),
      whatsapp: String(whatsapp).replace(/[^0-9+]/g, ''),
      category: category || 'other',
      customCategory: customCategory || '',
      requirements: String(requirements).trim(),
      budget: budget || '500-1000',
      selectedPackage: selectedPackage || '',
      urgency: urgency || 'standard',
      referenceUrl: referenceUrl || '',
      createdAt: new Date().toISOString(),
      status: 'new',
      notes: ''
    };

    leadsDatabase.unshift(newLead);
    saveLeads(leadsDatabase);

    // Format WhatsApp prefilled message for LC Web Studio owner
    const messageText = `*🚀 New Website Request - LC Web Studio*%0A%0A` +
      `*👤 Client Name:* ${encodeURIComponent(newLead.name)}%0A` +
      `*📱 WhatsApp:* ${encodeURIComponent(newLead.whatsapp)}%0A` +
      `*📂 Website Type:* ${encodeURIComponent(newLead.category.toUpperCase().replace('_', ' '))}%0A` +
      `*💰 Budget:* ₹${encodeURIComponent(newLead.budget)}%0A` +
      `*📦 Selected Package:* ${encodeURIComponent(newLead.selectedPackage || 'Custom')}%0A` +
      `*📝 Requirements:* ${encodeURIComponent(newLead.requirements)}`;

    const whatsappRedirectUrl = `https://wa.me/919999999999?text=${messageText}`;

    res.json({
      success: true,
      message: 'Lead submitted successfully',
      lead: newLead,
      whatsappRedirectUrl
    });
  } catch (err: any) {
    console.error('Error submitting lead:', err);
    res.status(500).json({ success: false, error: err?.message || 'Server error saving lead' });
  }
});

// Update lead status or notes
app.patch('/api/leads/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, quotedAmount } = req.body;

    const leadIndex = leadsDatabase.findIndex(l => l.id === id);
    if (leadIndex === -1) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    if (status !== undefined) leadsDatabase[leadIndex].status = status;
    if (notes !== undefined) leadsDatabase[leadIndex].notes = notes;
    if (quotedAmount !== undefined) leadsDatabase[leadIndex].quotedAmount = quotedAmount;

    saveLeads(leadsDatabase);

    res.json({ success: true, lead: leadsDatabase[leadIndex] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to update lead' });
  }
});

// Delete lead
app.delete('/api/leads/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    leadsDatabase = leadsDatabase.filter(l => l.id !== id);
    saveLeads(leadsDatabase);
    res.json({ success: true, message: 'Lead deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to delete lead' });
  }
});

// Reset seed leads
app.post('/api/leads/reset', (req: Request, res: Response) => {
  leadsDatabase = [...INITIAL_SAMPLE_LEADS];
  saveLeads(leadsDatabase);
  paymentsDatabase = [...INITIAL_SAMPLE_PAYMENTS];
  savePayments(paymentsDatabase);
  res.json({ success: true, leads: leadsDatabase, payments: paymentsDatabase });
});

// PAYMENT API ROUTES

// Get payment config and studio details
app.get('/api/payment-config', (req: Request, res: Response) => {
  res.json({
    success: true,
    config: {
      studioName: 'LC Web Studio',
      upiId: 'lakshyakumar133456@okaxis',
      secondaryUpiId: 'lcwebstudio@upi',
      merchantName: 'LC Web Studio',
      contactPhone: '+919999999999',
      bankDetails: {
        accountHolder: 'Lakshya Kumar / LC Web Studio',
        accountNumber: '50200088991122',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        branch: 'Connaught Place, New Delhi',
        accountType: 'Current Account'
      },
      milestonePolicy: {
        tokenAmount: 299,
        advancePercent: 50,
        fullPaymentDiscountPercent: 5,
        refundGuaranteeDays: 7
      },
      acceptedMethods: ['UPI (GPay / PhonePe / Paytm / BHIM)', 'Debit & Credit Cards', 'NetBanking (All Major Banks)', 'IMPS / NEFT Transfer']
    }
  });
});

// Get all recorded payments
app.get('/api/payments', (req: Request, res: Response) => {
  res.json({ success: true, count: paymentsDatabase.length, payments: paymentsDatabase });
});

// Create / Log a payment (Client token or UTR submission)
app.post('/api/payments', (req: Request, res: Response) => {
  try {
    const { leadId, clientName, clientWhatsapp, amount, paymentMethod, paymentType, utrNumber, packageTitle, notes } = req.body;

    if (!clientName || !clientWhatsapp || !amount) {
      return res.status(400).json({ success: false, error: 'Client name, WhatsApp, and amount are required' });
    }

    const newPayment: PaymentRecord = {
      id: 'pay-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      leadId: leadId || undefined,
      clientName: String(clientName).trim(),
      clientWhatsapp: String(clientWhatsapp).replace(/[^0-9+]/g, ''),
      amount: Number(amount),
      paymentMethod: paymentMethod || 'upi',
      paymentType: paymentType || 'advance_50',
      status: 'pending', // Verified by admin or automatically captured in mock gateway
      utrNumber: utrNumber ? String(utrNumber).trim() : 'AUTO-' + Math.floor(100000000000 + Math.random() * 900000000000),
      transactionDate: new Date().toISOString(),
      packageTitle: packageTitle || 'Custom Website Development',
      notes: notes || 'Submitted via LC Web Studio online payment portal'
    };

    paymentsDatabase.unshift(newPayment);
    savePayments(paymentsDatabase);

    // If leadId is provided or matches by WhatsApp, update lead's payment status
    if (leadId) {
      const targetLeadIndex = leadsDatabase.findIndex(l => l.id === leadId);
      if (targetLeadIndex !== -1) {
        leadsDatabase[targetLeadIndex].paymentStatus = (newPayment.paymentType === 'full' ? 'paid_full' : 'advance_paid');
        leadsDatabase[targetLeadIndex].paidAmount = (leadsDatabase[targetLeadIndex].paidAmount || 0) + newPayment.amount;
        leadsDatabase[targetLeadIndex].utrNumber = newPayment.utrNumber;
        saveLeads(leadsDatabase);
      }
    } else if (clientWhatsapp) {
      const cleanPhone = String(clientWhatsapp).replace(/[^0-9]/g, '').slice(-10);
      const targetLeadIndex = leadsDatabase.findIndex(l => l.whatsapp.includes(cleanPhone));
      if (targetLeadIndex !== -1) {
        newPayment.leadId = leadsDatabase[targetLeadIndex].id;
        leadsDatabase[targetLeadIndex].paymentStatus = (newPayment.paymentType === 'full' ? 'paid_full' : 'advance_paid');
        leadsDatabase[targetLeadIndex].paidAmount = (leadsDatabase[targetLeadIndex].paidAmount || 0) + newPayment.amount;
        leadsDatabase[targetLeadIndex].utrNumber = newPayment.utrNumber;
        saveLeads(leadsDatabase);
      }
    }

    res.json({
      success: true,
      message: 'Payment recorded successfully',
      payment: newPayment
    });
  } catch (err: any) {
    console.error('Error logging payment:', err);
    res.status(500).json({ success: false, error: err?.message || 'Server error saving payment' });
  }
});

// Verify payment status (Admin action)
app.patch('/api/payments/:id/verify', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const paymentIndex = paymentsDatabase.findIndex(p => p.id === id);
    if (paymentIndex === -1) {
      return res.status(404).json({ success: false, error: 'Payment record not found' });
    }

    paymentsDatabase[paymentIndex].status = status || 'verified';
    savePayments(paymentsDatabase);

    // Sync with corresponding lead if exists
    if (paymentsDatabase[paymentIndex].leadId) {
      const targetLeadIndex = leadsDatabase.findIndex(l => l.id === paymentsDatabase[paymentIndex].leadId);
      if (targetLeadIndex !== -1 && status === 'verified') {
        leadsDatabase[targetLeadIndex].status = 'in_progress';
        saveLeads(leadsDatabase);
      }
    }

    res.json({ success: true, payment: paymentsDatabase[paymentIndex] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Failed to update payment status' });
  }
});

// AI Requirement Estimator & Proposal Builder
app.post('/api/ai/estimate', async (req: Request, res: Response) => {
  try {
    const { category, requirements, budget, extraDetails } = req.body;

    if (!requirements && !category) {
      return res.status(400).json({ success: false, error: 'Please provide requirements or category' });
    }

    const ai = getAIClient();
    const prompt = `You are the lead technical consultant and senior architect at "LC Web Studio", an affordable, fast, and high-quality web development agency in India that builds websites for college students, small businesses, freelancers, shops, and startups (packages start from ₹499 - ₹4999+).

Analyze this customer's inquiry:
- Category: ${category || 'General / Not specified'}
- Customer Budget: ${budget || 'Flexible'}
- Customer Requirements: ${requirements || 'Standard modern website'}
- Additional Details: ${extraDetails || 'None'}

Provide an accurate, friendly, and structured project breakdown in JSON format.
Make sure to include realistic estimates, suggested pages, recommended LC Web Studio package, tech stack, and key highlights.

Return ONLY a valid JSON object matching this structure:
{
  "projectTitle": "Clear descriptive title of the website",
  "recommendedPackage": "Basic 1-Page (₹499-₹799) | Student Project (₹999-₹1499) | Portfolio (₹1499-₹2499) | Business (₹2499-₹4999) | Advanced (₹5000+)",
  "estimatedPriceRange": "e.g. ₹999 - ₹1,499",
  "estimatedDelivery": "e.g. 24-48 Hours",
  "recommendedPages": ["Home", "About / Services", "Gallery / Projects", "Contact & WhatsApp"],
  "keyFeatures": [
    "Feature 1 with clear benefit",
    "Feature 2 with clear benefit",
    "Feature 3 with clear benefit",
    "Feature 4 with clear benefit"
  ],
  "recommendedTechStack": ["React", "Tailwind CSS", "Vercel Fast Hosting", "WhatsApp API"],
  "freeBonuses": [
    "100% Mobile Responsive Design",
    "Free Hosting Setup on Cloud",
    "Click-to-WhatsApp Chat Integration"
  ],
  "consultantAdviceHindi": "A brief 2-3 sentence encouraging explanation in natural friendly Hinglish (Hindi + English) explaining why this plan is perfect and how LC Web Studio will deliver it quickly."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    const parsedData = JSON.parse(responseText);

    res.json({
      success: true,
      analysis: parsedData
    });
  } catch (err: any) {
    console.error('AI Estimation error:', err);
    // Return friendly fallback if API key is not configured yet or rate limited
    res.json({
      success: true,
      analysis: {
        projectTitle: 'Custom Responsive Web Solution',
        recommendedPackage: 'Student Project / Business Starter',
        estimatedPriceRange: '₹999 – ₹1,999',
        estimatedDelivery: '24 – 48 Hours',
        recommendedPages: ['Home Page', 'Key Features / Services', 'Interactive Demo / Portfolio', 'Direct WhatsApp Contact'],
        keyFeatures: [
          'High-speed mobile optimized UI',
          'Interactive forms with WhatsApp auto-lead',
          'Free cloud deployment with live shareable link',
          'Clean modular source code'
        ],
        recommendedTechStack: ['React', 'Tailwind CSS', 'Lucide Icons', 'Cloud Hosting'],
        freeBonuses: [
          'Free SSL Certificate & Hosting',
          '1-on-1 WhatsApp Support',
          'Custom domain linking assistance'
        ],
        consultantAdviceHindi: 'Aapki requirement ke hisaab se yeh website 24 se 48 ghante mein ready ho jayegi. Sabhi features fully functional aur mobile friendly honge.'
      }
    });
  }
});

// AI Wireframe / Screenshot / Sketch Analyzer
app.post('/api/ai/analyze-sketch', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, userNotes } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Base64 image is required' });
    }

    const ai = getAIClient();
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/png'
            }
          },
          {
            text: `You are the lead UI/UX architect at "LC Web Studio". Analyze this uploaded sketch, wireframe, or reference website screenshot.
User Notes: ${userNotes || 'Analyze this layout and tell me how LC Web Studio can build this.'}

Extract the UI structure and return a JSON object with:
{
  "detectedType": "e.g. Portfolio / E-Commerce / College System / Landing Page",
  "layoutStructure": "Brief description of the observed sections (Hero, Navigation, Cards, Form, etc.)",
  "detectedComponents": ["Component 1", "Component 2", "Component 3"],
  "estimatedBudget": "e.g. ₹999 - ₹1,499",
  "suggestedPackage": "LC Web Studio Package name",
  "turnaroundTime": "e.g. 24 - 48 Hours",
  "developerNotes": "Practical technical notes on how LC Web Studio will craft this cleanly in React & Tailwind."
}`
          }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ success: true, result: parsed });
  } catch (err: any) {
    console.error('Image analysis error:', err);
    res.json({
      success: true,
      result: {
        detectedType: 'Custom Modern Web Layout',
        layoutStructure: 'Clean hero with navigation header, feature cards section, and call-to-action contact block.',
        detectedComponents: ['Header Navbar', 'Hero Banner with CTA', 'Interactive Grid', 'WhatsApp Contact Button'],
        estimatedBudget: '₹999 – ₹1,999',
        suggestedPackage: 'Student Project / Business Starter',
        turnaroundTime: '24 – 48 Hours',
        developerNotes: 'We can build this exact layout in React + Tailwind with smooth animations and responsive mobile view.'
      }
    });
  }
});

// AI WhatsApp Reply Generator for Admin
app.post('/api/ai/generate-reply', async (req: Request, res: Response) => {
  try {
    const { clientName, requirements, category, budget, quotedAmount } = req.body;

    const ai = getAIClient();
    const prompt = `Generate a polite, professional, and friendly WhatsApp sales reply in Hinglish (Hindi + English) from "Lakshya / LC Web Studio Team" to a customer named "${clientName}".

Inquiry Details:
- Category: ${category}
- Requirement: ${requirements}
- Customer's Budget: ${budget}
- Quoted Price: ₹${quotedAmount || '999'}

Include:
1. Warm greeting with their name
2. Clear confirmation that LC Web Studio can deliver this within 24-48 hours with top quality
3. Exact quote and what free bonuses are included (Free hosting, mobile responsive, clean code, revisions)
4. A friendly call-to-action asking when they would like to begin.
Keep it crisp, formatting with WhatsApp bold markers (*bold*), bullet points, and emojis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt
    });

    res.json({ success: true, replyText: response.text || '' });
  } catch (err: any) {
    const fallbackText = `Namaste ${req.body.clientName || 'Ji'}! 🙏\n\nMain Lakshya baat kar raha hoon *LC Web Studio* se. Aapki website requirement (${req.body.requirements || 'Website'}) humne review kar li hai.\n\n✅ *Aapko kya-kya milega:*\n• 100% Mobile & Tablet Responsive Design\n• Superfast 24-48 Hours Delivery\n• Free Hosting & Live Link Setup\n• Direct WhatsApp Click-to-Chat Button\n• Complete Clean Source Code\n\n💰 *Special Package Price:* ₹${req.body.quotedAmount || 999}/- only (No hidden charges)\n\nKya hum aaj hi is par kaam shuru karein? Aap mujhe content aur details bhej dijiye! 🚀`;
    res.json({ success: true, replyText: fallbackText });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 LC Web Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
