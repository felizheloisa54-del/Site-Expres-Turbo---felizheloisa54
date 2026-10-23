export type ArchetypeId = 'gastronomia' | 'servicos' | 'produtos';

export interface CredentialItem {
  label: string;
  value: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  actionText?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  unit?: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  initials: string;
  rating: number; // 4 or 5 only
  date: string;
  comment: string;
  avatarColor: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  slug: string;
  archetype: ArchetypeId;
  category: string;
  city: string;
  state: string;
  address: string;
  neighborhood: string;
  zipCode: string;
  phone: string;
  whatsapp: string;
  mapsUrl: string;
  wazeUrl: string;
  rating: number;
  reviewCount: number;
  openingHours: string;
  isOpenNow: boolean;
  coverImage: string;
  secondaryImage: string;
  doctorOrFounderImage?: string;
  galleryImages: string[];
  
  // Copywriting & Content
  eyebrowText: string;
  headline: string;
  highlightWord: string;
  subheadline: string;
  shortBio: string;
  aboutStory: string;
  ctaText: string;
  ctaWhatsappMessage: string;
  secondaryCtaText: string;
  
  // Structured blocks
  credentials: CredentialItem[];
  features: FeatureItem[];
  catalogItems: CatalogItem[];
  categories: string[];
  reviews: ReviewItem[];
  faq: FaqItem[];
  
  // Modular sections
  promoBanner: {
    enabled: boolean;
    title: string;
    subtitle: string;
    oldPrice: number;
    promoPrice: number;
    hoursRemaining: number;
    badge: string;
  };
  videoSection: {
    enabled: boolean;
    title: string;
    subtitle: string;
    videoUrl: string;
    posterUrl: string;
    aspectRatio?: '16:9' | '9:16';
    badge?: string;
  };

  // Visual layout configurations
  heroLayout?: 'boxed' | 'fullscreen' | 'centered' | 'split-reversed';
  imageEffects?: {
    brightness: number;
    contrast: number;
    filter: 'none' | 'vibrant' | 'warm' | 'cool' | 'cinematic';
    objectFit: 'cover' | 'contain';
  };
  reviewsAutoplay?: boolean;

  // Subscription and Client Portal Management
  activationDate?: string;
  expirationDate?: string;
  clientEmail?: string;
  clientPassword?: string;
  clientContactName?: string;
  annualFee?: number;
  
  // Brand Logo configuration
  logoUrl?: string;
  logoHeight?: number;
  manualCreated?: boolean;

  // Status and administrative
  status: 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export type AppScreen = 'login' | 'dashboard' | 'studio';
export type ThemeMode = 'light' | 'dark';

export interface SaaSUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'creator';
  status: 'active' | 'blocked';
  createdAt: string;
  planName?: string;
  maxSites?: number;
  phone?: string;
}

export interface SectionToggle {
  id: string;
  label: string;
  enabled: boolean;
}

export interface MarketingConfig {
  metaPixelId: string;
  googleAdsId: string;
  googleAdsLabel: string;
  gtmId: string;
  ga4Id: string;
  searchConsoleCode: string;
  customMetaTitle: string;
  customMetaDescription: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  fontFamily: 'Plus Jakarta Sans' | 'Playfair Display' | 'Inter' | 'Cormorant Garamond' | 'Outfit' | 'Montserrat';
  buttonStyle: 'elevated' | 'shimmer' | 'pulse' | 'outline';
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface SelectedElementInspect {
  type: 'button' | 'image' | 'text';
  id?: string;
  label?: string;
  text?: string;
  url?: string;
  customMessage?: string;
  fieldPath?: string;
}
