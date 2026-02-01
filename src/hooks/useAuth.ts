import { useState, useEffect, useCallback } from "react";
import { User, UserRole } from "../types";
import { StorageService } from "../services/storage";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on mount
    const recentUsers = StorageService.getRecentUsers();
    if (recentUsers.length > 0) {
      // Auto-login the most recent user (optional - could be disabled)
      // For now, just mark as loaded without auto-login
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    (
      name: string,
      email: string,
      phone: string,
      code?: string,
      role: UserRole = "CUSTOMER",
      avatar?: string,
    ): User => {
      let loggedInUser = StorageService.initUser(
        name,
        email,
        phone,
        avatar,
        role,
      );

      // Apply walk-in perks if code provided for customers
      if (code && code.length > 0 && role === "CUSTOMER") {
        const upgraded = StorageService.applyWalkInPerks(email);
        if (upgraded) loggedInUser = upgraded;
      }

      setUser(loggedInUser);
      return loggedInUser;
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateCredits = useCallback(
    (newCredits: number) => {
      if (user) {
        StorageService.updateCredits(user.email, newCredits);
        setUser((prev) => (prev ? { ...prev, credits: newCredits } : null));
      }
    },
    [user],
  );

  const updateAvatar = useCallback(
    (avatarUrl: string) => {
      if (user) {
        const updatedUser = StorageService.updateAvatar(user.email, avatarUrl);
        if (updatedUser) setUser(updatedUser);
      }
    },
    [user],
  );

  return {
    user,
    isLoading,
    login,
    logout,
    updateCredits,
    updateAvatar,
  };
};
