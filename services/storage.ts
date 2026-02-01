import { User, HistorySession, SubscriptionTier, Booking } from '../types';

// Keys
const USER_KEY_PREFIX = 'prelook_user_';
const HISTORY_KEY_PREFIX = 'prelook_history_';
const BOOKING_KEY_PREFIX = 'prelook_bookings_';
const RECENT_USERS_KEY = 'prelook_recent_users';

export const StorageService = {
  getUser: (email: string): User | null => {
    const data = localStorage.getItem(`${USER_KEY_PREFIX}${email}`);
    if (data) return JSON.parse(data);
    return null;
  },

  saveUser: (user: User) => {
    localStorage.setItem(`${USER_KEY_PREFIX}${user.email}`, JSON.stringify(user));
    StorageService.addRecentUser(user);
  },

  // Recent Users for Quick Login
  getRecentUsers: (): User[] => {
    const data = localStorage.getItem(RECENT_USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  addRecentUser: (user: User) => {
    const recent = StorageService.getRecentUsers();
    // Remove if exists to re-add at top to update data
    const filtered = recent.filter(u => u.email !== user.email);
    // Keep max 3 for UI cleanliness
    const updated = [user, ...filtered].slice(0, 3);
    localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(updated));
  },

  removeRecentUser: (email: string) => {
    const recent = StorageService.getRecentUsers();
    const updated = recent.filter(u => u.email !== email);
    localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(updated));
  },

  getHistory: (email: string): HistorySession[] => {
    const data = localStorage.getItem(`${HISTORY_KEY_PREFIX}${email}`);
    if (data) return JSON.parse(data);
    return [];
  },

  saveHistorySession: (email: string, session: HistorySession) => {
    const current = StorageService.getHistory(email);
    const filtered = current.filter(s => s.id !== session.id);
    const updated = [session, ...filtered];
    localStorage.setItem(`${HISTORY_KEY_PREFIX}${email}`, JSON.stringify(updated));
  },

  getBookings: (email: string): Booking[] => {
    const data = localStorage.getItem(`${BOOKING_KEY_PREFIX}${email}`);
    if (data) return JSON.parse(data);
    return [];
  },

  saveBooking: (email: string, booking: Booking) => {
    const current = StorageService.getBookings(email);
    const updated = [booking, ...current];
    localStorage.setItem(`${BOOKING_KEY_PREFIX}${email}`, JSON.stringify(updated));
  },

  initUser: (name: string, email: string, phone?: string, avatar?: string, role: 'CUSTOMER' | 'PARTNER' = 'CUSTOMER'): User => {
    const existing = StorageService.getUser(email);
    if (existing) {
        // Update fields if provided
        let changed = false;
        if (avatar && existing.avatar !== avatar) { existing.avatar = avatar; changed = true; }
        if (role && existing.role !== role) { existing.role = role; changed = true; }
        
        if (changed) StorageService.saveUser(existing);
        return existing;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      avatar: avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${name}`,
      tier: 'FREE',
      credits: 2,
      role
    };
    StorageService.saveUser(newUser);
    return newUser;
  },

  applyWalkInPerks: (email: string) => {
      const user = StorageService.getUser(email);
      if (user) {
          user.tier = 'PRO';
          user.credits = Math.max(user.credits, 10);
          StorageService.saveUser(user);
          return user;
      }
      return null;
  },

  updateCredits: (email: string, amount: number) => {
    const user = StorageService.getUser(email);
    if (user) {
      user.credits = amount;
      StorageService.saveUser(user);
    }
  },

  upgradeTier: (email: string, tier: SubscriptionTier) => {
    const user = StorageService.getUser(email);
    if (user) {
      user.tier = tier;
      if (tier === 'PRO') user.credits += 15;
      if (tier === 'ULTIMATE') user.credits += 60;
      StorageService.saveUser(user);
      return user;
    }
    return null;
  },

  updateAvatar: (email: string, avatarUrl: string) => {
      const user = StorageService.getUser(email);
      if (user) {
          user.avatar = avatarUrl;
          StorageService.saveUser(user);
          return user;
      }
      return null;
  }
};