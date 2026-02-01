export type SubscriptionTier = 'FREE' | 'PRO' | 'ULTIMATE';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  tier: SubscriptionTier;
  credits: number;
  role: 'CUSTOMER' | 'PARTNER'; // Added role
}

export interface PresetStyle {
  id: string;
  label: string;
  gender: string;
  category: string;
  style: string;
  color: string;
  description: string;
}

export interface GeneratedImages {
  front: string | null;
  left: string | null;
  right: string | null;
  back: string | null;
}

export interface GenerationState {
  isLoading: boolean;
  isUnlocking?: boolean;
  error: string | null;
  resultImages: GeneratedImages;
  unlockedAngles: boolean; // false = front only, true = all
}

export interface GenerationConfig {
  gender: string;
  style: string;
  color: string;
  highlightIntensity: number; // 0 to 100
}

export interface HistorySession {
  id: string;
  timestamp: number;
  originalImage: string;
  resultImages: GeneratedImages;
  promptSummary: string;
  config: GenerationConfig;
  unlockedAngles: boolean;
}

export enum AppView {
  LANDING = 'LANDING',
  PRICING = 'PRICING',
  STUDIO = 'STUDIO',
  DASHBOARD = 'DASHBOARD',
  SALON_DASHBOARD = 'SALON_DASHBOARD'
}

export interface SalonService {
  id: string;
  name: string;
  duration: string;
  price: number;
}

export interface Salon {
  id: string;
  title: string;
  uri: string;
  rating?: number;
  address?: string;
  priceRange: string;
  specialty: string;
  availableSlots: number;
  distance: string;
  description?: string;
  imageUrl?: string;
  services?: SalonService[];
  stylists?: string[]; 
}

export interface Booking {
  id: string;
  salonName: string;
  service: string;
  stylist?: string;
  date: string;
  time: string;
  price: string;
  status: 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  timestamp: number;
}

export interface StyleCategory {
  [key: string]: string[];
}