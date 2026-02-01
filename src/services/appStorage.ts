import {
  Appointment,
  GenerationHistoryEntry,
  CreditTransaction,
  PlanChangeRequest,
  SubscriptionTier,
} from "../types";

const STORAGE_KEYS = {
  APPOINTMENTS: "prelook_appointments",
  GENERATION_HISTORY: "prelook_generation_history",
  CREDIT_TRANSACTIONS: "prelook_credit_transactions",
  PLAN_CHANGES: "prelook_plan_changes",
  TOTAL_CREDITS: "prelook_total_credits",
  USED_CREDITS: "prelook_used_credits",
} as const;

// Appointments Management
export class AppointmentsService {
  static getAll(): Appointment[] {
    const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : [];
  }

  static add(appointment: Omit<Appointment, "id" | "createdAt">): Appointment {
    const appointments = this.getAll();
    const newAppointment: Appointment = {
      ...appointment,
      id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
    };
    appointments.push(newAppointment);
    localStorage.setItem(
      STORAGE_KEYS.APPOINTMENTS,
      JSON.stringify(appointments),
    );
    return newAppointment;
  }

  static update(id: string, updates: Partial<Appointment>): boolean {
    const appointments = this.getAll();
    const index = appointments.findIndex((a) => a.id === id);
    if (index === -1) return false;

    appointments[index] = { ...appointments[index], ...updates };
    localStorage.setItem(
      STORAGE_KEYS.APPOINTMENTS,
      JSON.stringify(appointments),
    );
    return true;
  }

  static delete(id: string): boolean {
    const appointments = this.getAll();
    const filtered = appointments.filter((a) => a.id !== id);
    if (filtered.length === appointments.length) return false;

    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(filtered));
    return true;
  }

  static getUpcoming(): Appointment[] {
    const all = this.getAll();
    const now = new Date();
    return all
      .filter((a) => {
        const aptDate = new Date(a.date + " " + a.time);
        return aptDate > now && a.status === "UPCOMING";
      })
      .sort((a, b) => {
        const dateA = new Date(a.date + " " + a.time);
        const dateB = new Date(b.date + " " + b.time);
        return dateA.getTime() - dateB.getTime();
      });
  }
}

// Generation History Management
export class GenerationHistoryService {
  static getAll(): GenerationHistoryEntry[] {
    const data = localStorage.getItem(STORAGE_KEYS.GENERATION_HISTORY);
    return data ? JSON.parse(data) : [];
  }

  static add(
    entry: Omit<GenerationHistoryEntry, "id" | "timestamp">,
  ): GenerationHistoryEntry {
    const history = this.getAll();
    const newEntry: GenerationHistoryEntry = {
      ...entry,
      id: `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    // Keep only last 50 entries
    history.unshift(newEntry);
    if (history.length > 50) {
      history.splice(50);
    }

    localStorage.setItem(
      STORAGE_KEYS.GENERATION_HISTORY,
      JSON.stringify(history),
    );
    return newEntry;
  }

  static getById(id: string): GenerationHistoryEntry | null {
    const history = this.getAll();
    return history.find((h) => h.id === id) || null;
  }

  static delete(id: string): boolean {
    const history = this.getAll();
    const filtered = history.filter((h) => h.id !== id);
    if (filtered.length === history.length) return false;

    localStorage.setItem(
      STORAGE_KEYS.GENERATION_HISTORY,
      JSON.stringify(filtered),
    );
    return true;
  }

  static clear(): void {
    localStorage.setItem(STORAGE_KEYS.GENERATION_HISTORY, JSON.stringify([]));
  }
}

// Credit Management
export class CreditService {
  static getTotalCredits(): number {
    const data = localStorage.getItem(STORAGE_KEYS.TOTAL_CREDITS);
    return data ? parseInt(data, 10) : 10; // Default 10 credits
  }

  static getUsedCredits(): number {
    const data = localStorage.getItem(STORAGE_KEYS.USED_CREDITS);
    return data ? parseInt(data, 10) : 0;
  }

  static getAvailableCredits(): number {
    return this.getTotalCredits() - this.getUsedCredits();
  }

  static useCredits(amount: number): boolean {
    const available = this.getAvailableCredits();
    if (available < amount) return false;

    const used = this.getUsedCredits() + amount;
    localStorage.setItem(STORAGE_KEYS.USED_CREDITS, used.toString());

    // Log transaction
    this.logTransaction({
      amount: -amount,
      type: "USAGE",
      description: "Image generation",
      balance: this.getAvailableCredits(),
    });

    return true;
  }

  static addCredits(
    amount: number,
    description: string = "Credit purchase",
  ): void {
    const total = this.getTotalCredits() + amount;
    localStorage.setItem(STORAGE_KEYS.TOTAL_CREDITS, total.toString());

    // Log transaction
    this.logTransaction({
      amount,
      type: "PURCHASE",
      description,
      balance: this.getAvailableCredits(),
    });
  }

  static resetCredits(total: number): void {
    localStorage.setItem(STORAGE_KEYS.TOTAL_CREDITS, total.toString());
    localStorage.setItem(STORAGE_KEYS.USED_CREDITS, "0");
  }

  static getTransactions(): CreditTransaction[] {
    const data = localStorage.getItem(STORAGE_KEYS.CREDIT_TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  }

  private static logTransaction(
    tx: Omit<CreditTransaction, "id" | "timestamp">,
  ): void {
    const transactions = this.getTransactions();
    const newTx: CreditTransaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    transactions.unshift(newTx);
    // Keep only last 100 transactions
    if (transactions.length > 100) {
      transactions.splice(100);
    }

    localStorage.setItem(
      STORAGE_KEYS.CREDIT_TRANSACTIONS,
      JSON.stringify(transactions),
    );
  }
}

// Plan Management
export class PlanService {
  static requestPlanChange(
    from: SubscriptionTier,
    to: SubscriptionTier,
  ): PlanChangeRequest {
    const request: PlanChangeRequest = {
      from,
      to,
      timestamp: Date.now(),
      effectiveDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Next day
    };

    const requests = this.getPlanChangeRequests();
    requests.push(request);
    localStorage.setItem(STORAGE_KEYS.PLAN_CHANGES, JSON.stringify(requests));

    return request;
  }

  static getPlanChangeRequests(): PlanChangeRequest[] {
    const data = localStorage.getItem(STORAGE_KEYS.PLAN_CHANGES);
    return data ? JSON.parse(data) : [];
  }

  static clearPlanChangeRequests(): void {
    localStorage.setItem(STORAGE_KEYS.PLAN_CHANGES, JSON.stringify([]));
  }

  static getCreditsForTier(tier: SubscriptionTier): number {
    const creditsMap: Record<SubscriptionTier, number> = {
      FREE: 10,
      PRO: 100,
      ULTIMATE: 500,
    };
    return creditsMap[tier];
  }

  static getPriceForTier(tier: SubscriptionTier): number {
    const priceMap: Record<SubscriptionTier, number> = {
      FREE: 0,
      PRO: 29,
      ULTIMATE: 79,
    };
    return priceMap[tier];
  }
}
