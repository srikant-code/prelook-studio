import React, { useState, useEffect } from "react";
import { AppView } from "./types";
import { useAuth, useHistory } from "./hooks";
import { StorageService } from "./services/storage";

// Containers (Pages)
import LoginScreen from "./containers/LoginScreen";
import StudioPage from "./pages/StudioPage";
import PricingPage from "./containers/PricingPage";
import UserDashboardPage from "./containers/UserDashboardPage";
import SalonDashboardPage from "./containers/SalonDashboardPage";
import SalonFinderPage from "./containers/SalonFinderPage";
import LandingPage from "./pages/LandingPage";

export default function App() {
  const { user, login, logout, updateCredits, updateAvatar } = useAuth();
  const {
    history,
    saveSession,
    updateSession,
    loadSession,
    clearHistory,
    setCurrentSessionId,
  } = useHistory(user?.email || null);

  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [salonCode, setSalonCode] = useState<string | null>(null);

  // Check if user exists on mount - auto-show login for quick access
  useEffect(() => {
    const recentUsers = StorageService.getRecentUsers();
    if (recentUsers.length === 0) {
      // New user - go directly to landing with login prompt
      setView(AppView.LOGIN);
    } else {
      // Existing user - show login screen for quick login
      setView(AppView.LOGIN);
    }
  }, []);

  const handleLogin = (
    name: string,
    email: string,
    phone: string,
    code?: string,
    type: "CUSTOMER" | "PARTNER" = "CUSTOMER",
    avatar?: string,
  ) => {
    const loggedInUser = login(name, email, phone, code, type, avatar);

    if (type === "PARTNER") {
      setSalonCode(code || "STORE-001");
      setView(AppView.SALON_DASHBOARD);
    } else {
      // Customer - go to landing to start creating
      setView(AppView.LANDING);
    }
  };

  const handleLogout = () => {
    logout();
    setSalonCode(null);
    clearHistory();
    setView(AppView.LOGIN);
  };

  const handleViewChange = (newView: AppView) => {
    setView(newView);
  };

  return (
    <div className="min-h-screen bg-brand-50">
      {view === AppView.LOGIN && <LoginScreen onLogin={handleLogin} />}

      {view === AppView.LANDING && user && (
        <LandingPage
          user={user}
          onNavigate={handleViewChange}
          onLogout={handleLogout}
        />
      )}

      {view === AppView.STUDIO && user && (
        <StudioPage
          user={user}
          history={history}
          onNavigate={handleViewChange}
          onLogout={handleLogout}
          onUpdateCredits={updateCredits}
          onSaveSession={saveSession}
          onUpdateSession={updateSession}
          onLoadSession={loadSession}
          setCurrentSessionId={setCurrentSessionId}
        />
      )}

      {view === AppView.PRICING && user && (
        <PricingPage
          user={user}
          onSelectTier={(tier) => {
            const upgraded = StorageService.upgradeTier(user.email, tier);
            if (upgraded) {
              login(
                upgraded.name,
                upgraded.email,
                upgraded.phone || "",
                undefined,
                upgraded.role,
                upgraded.avatar,
              );
            }
            setView(AppView.STUDIO);
          }}
          onClose={() => setView(AppView.STUDIO)}
        />
      )}

      {view === AppView.USER_DASHBOARD && user && (
        <UserDashboardPage
          user={user}
          onClose={() => setView(AppView.STUDIO)}
          onUpdateAvatar={updateAvatar}
        />
      )}

      {view === AppView.SALON_DASHBOARD && user && salonCode && (
        <SalonDashboardPage
          user={user}
          salonCode={salonCode}
          onLogout={handleLogout}
        />
      )}

      {view === AppView.SALON_FINDER && (
        <SalonFinderPage onClose={() => setView(AppView.STUDIO)} />
      )}
    </div>
  );
}
