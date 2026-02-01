// App configuration
export const APP_CONFIG = {
  // Pricing discount configuration
  pricing: {
    discount: {
      enabled: true,
      percentage: 20, // 20% off
      endsAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(), // 72 hours from now
      label: "LAUNCH20",
    },
  },

  // Credit limits and warnings
  credits: {
    lowBalanceThreshold: 2,
    warningThreshold: 5,
  },

  // Appointment settings
  appointments: {
    maxFutureMonths: 3,
    slotDuration: 30, // minutes
    workingHours: {
      start: 9,
      end: 20,
    },
  },

  // History settings
  history: {
    maxEntries: 50,
    autoSave: true,
  },
};

export type AppConfig = typeof APP_CONFIG;
