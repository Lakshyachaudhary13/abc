import { DemoWebsite } from '../types';

export const DEMO_WEBSITES: DemoWebsite[] = [
  {
    id: 'student-portfolio',
    title: '🎓 Student & Developer Portfolio',
    category: 'portfolio',
    tag: 'Student / Resume',
    icon: 'GraduationCap',
    description: 'Modern developer portfolio featuring skill badges, project filtering, interactive experience timeline, and one-click resume download.',
    techStack: ['React', 'Tailwind CSS', 'Lucide Icons', 'Vercel'],
    features: ['GitHub Repo Feed', 'Live Project Demos', 'Interactive Resume', 'Dark Accent Palette'],
    previewGradient: 'from-blue-600 via-indigo-600 to-purple-600'
  },
  {
    id: 'college-project',
    title: '🏫 Smart Campus & Library System',
    category: 'college_project',
    tag: 'Academic Submission',
    icon: 'BookOpen',
    description: 'Complete college academic project featuring student portal, digital book reservation, issue logs, and faculty approval dashboard.',
    techStack: ['React', 'State Engine', 'Search Filter', 'Responsive UI'],
    features: ['Search & Filter 50+ Books', 'Reserve Slot Simulation', 'Fine Calculator', 'Viva Ready Notes'],
    previewGradient: 'from-emerald-600 via-teal-600 to-cyan-600'
  },
  {
    id: 'small-business',
    title: '🏪 ProFix Home Services & Business',
    category: 'business',
    tag: 'Local Business',
    icon: 'Wrench',
    description: 'High-converting business portal for local repair & electrical services with instant pricing estimate, Google ratings, and WhatsApp booking.',
    techStack: ['React', 'WhatsApp API', 'Lead Engine', 'Mobile Optimized'],
    features: ['Instant Service Estimator', 'Customer Reviews Carousel', 'Click-to-Call / WhatsApp', 'Service Area Pin'],
    previewGradient: 'from-amber-600 via-orange-600 to-red-600'
  },
  {
    id: 'restaurant-cafe',
    title: '🍕 Urban Crust Cafe & Pizzeria',
    category: 'other',
    tag: 'Restaurant / Dining',
    icon: 'UtensilsCrossed',
    description: 'Vibrant culinary website with visual category menu (Veg/Non-Veg), live order cart, online table reservation, and chef specials.',
    techStack: ['React', 'Interactive Menu', 'Table Booking Form', 'Tailwind 4'],
    features: ['Interactive Category Filters', 'Real-Time Cart Drawer', 'VIP Table Booking', 'Special Offers Banner'],
    previewGradient: 'from-rose-600 via-red-600 to-amber-600'
  },
  {
    id: 'photographer-portfolio',
    title: '📸 LensCraft Luxury Visuals',
    category: 'personal',
    tag: 'Photography / Agency',
    icon: 'Camera',
    description: 'Sleek luxury dark-themed visual gallery with photography categories (Weddings, Portraits, Events), image lightbox, and package booking.',
    techStack: ['React', 'Masonry Grid', 'Modal Lightbox', 'High Contrast'],
    features: ['Categorized Photo Masonry', 'Enlarged Image Lightbox', 'Package Inquiry Form', 'Client Testimonials'],
    previewGradient: 'from-zinc-800 via-stone-900 to-neutral-950'
  },
  {
    id: 'mini-shop',
    title: '🛍️ ZapTrends Mini Fashion Shop',
    category: 'shop',
    tag: 'E-Commerce / Store',
    icon: 'ShoppingBag',
    description: 'Lightning-fast product catalog with size selection, discount tags, instant shopping bag, and one-tap WhatsApp checkout order builder.',
    techStack: ['React', 'Cart State', 'WhatsApp Checkout', 'Filterable Grid'],
    features: ['Instant Add to Cart', 'Size & Color Picker', 'Automatic WhatsApp Order Text', 'Coupon Discounts'],
    previewGradient: 'from-violet-600 via-fuchsia-600 to-pink-600'
  }
];
