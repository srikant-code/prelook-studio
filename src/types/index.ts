export type SubscriptionTier = "FREE" | "PRO" | "ULTIMATE";
export type UserRole = "CUSTOMER" | "PARTNER";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  tier: SubscriptionTier;
  credits: number;
  role: UserRole;
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
  unlockedAngles: boolean;
}

export interface GenerationConfig {
  gender: string;
  style: string;
  color: string;
  highlightIntensity: number;
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

export interface Booking {
  id: string;
  salonName: string;
  service: string;
  date: string;
  time: string;
  price?: string;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
  timestamp: number;
}

export enum AppView {
  LOGIN = "LOGIN",
  LANDING = "LANDING",
  STUDIO = "STUDIO",
  PRICING = "PRICING",
  USER_DASHBOARD = "USER_DASHBOARD",
  SALON_DASHBOARD = "SALON_DASHBOARD",
  SALON_FINDER = "SALON_FINDER",
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
  priceRange: string;
  specialty: string;
  availableSlots: number;
  distance: string;
  rating: number;
  address: string;
  description: string;
  imageUrl: string;
  stylists: string[];
  services: SalonService[];
}

// Appointment types
export interface Appointment {
  id: string;
  title: string;
  date: string; // ISO string
  time: string;
  duration: number; // minutes
  location?: string;
  notes?: string;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  createdAt: number;
  salonId?: string;
  serviceId?: string;
}

// Generation history with full config
export interface GenerationHistoryEntry {
  id: string;
  timestamp: number;
  originalImage?: string;
  resultImages: GeneratedImages;
  config: GenerationConfig;
  prompt: string;
  unlockedAngles: boolean;
  creditsUsed: number;
}

// Credit transaction
export interface CreditTransaction {
  id: string;
  amount: number;
  type: "PURCHASE" | "USAGE" | "REFUND" | "BONUS";
  description: string;
  timestamp: number;
  balance: number; // Balance after transaction
}

// Plan change request
export interface PlanChangeRequest {
  from: SubscriptionTier;
  to: SubscriptionTier;
  timestamp: number;
  effectiveDate: string;
}
