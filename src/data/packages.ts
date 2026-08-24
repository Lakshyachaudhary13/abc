import { PricingPackage } from '../types';

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'basic-1page',
    title: 'Basic 1-Page Website',
    priceRange: '₹499 – ₹799',
    minPrice: 499,
    deliveryTime: '24 Hours',
    description: 'Perfect starter website for quick online presence, events, single product showcase, or personal bio.',
    highlight: true,
    popularTag: 'Best Value for Starters',
    bestFor: 'Personal Bio, Landing Pages, Event Launch & Link-in-bio replacement',
    categoryMatch: 'personal',
    features: [
      'Single High-Converting Page',
      '100% Mobile & Tablet Responsive',
      'Direct WhatsApp & Call Click-to-Chat',
      'Fast 24-Hour Express Delivery',
      'Free Hosting Setup on Vercel/Netlify',
      'Clean Modern Animations',
      'Social Media & Contact Links Integration'
    ]
  },
  {
    id: 'student-project',
    title: 'Student Project Website',
    priceRange: '₹999 – ₹1,499',
    minPrice: 999,
    deliveryTime: '24 - 48 Hours',
    description: 'College minor/major project with proper clean code, documentation, PPT notes & viva explanation guide.',
    popularTag: 'Most Popular for Students',
    bestFor: 'B.Tech, BCA, MCA, Diploma final year & semester college submissions',
    categoryMatch: 'college_project',
    features: [
      '3 to 5 Complete Connected Pages',
      'Interactive UI (Forms, Filters, State)',
      'Complete Clean Source Code + GitHub repo',
      'Project Synopsis & Viva Guidance Sheet',
      'Database / LocalStorage Data Flow',
      'Free Setup & Live Demo Link for Faculty',
      '1-on-1 WhatsApp code walkthrough'
    ]
  },
  {
    id: 'portfolio-site',
    title: 'Portfolio Website',
    priceRange: '₹1,499 – ₹2,499',
    minPrice: 1499,
    deliveryTime: '2 - 3 Days',
    description: 'Stand out from the crowd with a jaw-dropping developer, designer, or creator portfolio that gets interviews.',
    popularTag: 'Career Booster',
    bestFor: 'Engineers, Designers, Photographers, Freelancers & Job Seekers',
    categoryMatch: 'portfolio',
    features: [
      'Interactive Project Showcase & Filter',
      'One-Click Resume PDF Download',
      'Experience Timeline & Skill Badges',
      'Dark/Light Mode Theme Support',
      'Direct Contact Form to Email / WhatsApp',
      'SEO Optimized for Google Search by Name',
      'Custom Domain Connection Assistance'
    ]
  },
  {
    id: 'business-site',
    title: 'Business Website',
    priceRange: '₹2,499 – ₹4,999',
    minPrice: 2499,
    deliveryTime: '3 - 5 Days',
    description: 'Full-fledged commercial website for local business, coaching center, clinic, gym, or agency.',
    popularTag: 'High Conversion',
    bestFor: 'Local Shops, Agencies, Clinics, Salons, Real Estate & Consultants',
    categoryMatch: 'business',
    features: [
      '5 to 8 Custom Designed Pages',
      'Google Maps Location & Review Embed',
      'Customer Lead Capture & WhatsApp Alerts',
      'Services Catalog with Pricing Table',
      'Custom Domain & Professional Email Setup',
      'Speed & On-Page SEO Optimization',
      '1 Month Free Maintenance & Edits'
    ]
  },
  {
    id: 'advanced-site',
    title: 'Advanced / E-Commerce Website',
    priceRange: '₹5,000+',
    minPrice: 5000,
    deliveryTime: '5 - 7 Days',
    description: 'Custom web application, shop with product catalog, booking engine, custom dashboard or API integration.',
    popularTag: 'Full Custom Stack',
    bestFor: 'Online Stores, Custom Web Apps, SaaS MVPs & Multi-feature Portals',
    categoryMatch: 'shop',
    features: [
      'Full Product Catalog / Service Booking',
      'Shopping Cart & WhatsApp Checkout Engine',
      'Admin Dashboard to Manage Content',
      'Payment Gateway Integration (UPI / Razorpay)',
      'Custom Database & User Authentication',
      'Automated Email / SMS Notifications',
      '3 Months Tech Support & Backup'
    ]
  }
];
