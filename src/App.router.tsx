import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LoginScreen } from "./components/auth/LoginScreen";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/routing/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { StudioPage } from "./pages/StudioPage";
import { PricingPage } from "./pages/PricingPage";
import { AppointmentsPage } from "./pages/AppointmentsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { TopUpPage } from "./pages/TopUpPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SalonDashboard } from "./components/dashboard/SalonDashboard";
import { User } from "./types";
import { StorageService } from "../services/storage";
import { CreditService } from "./services/appStorage";

// Login Modal Wrapper Component
const LoginModalWrapper: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onLogin: (
    name: string,
    email: string,
    phone: string,
    code?: string,
    type?: "CUSTOMER" | "PARTNER",
    avatar?: string,
  ) => void;
}> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-brand-50 z-10"
        >
          <span className="sr-only">Close</span>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <LoginScreen onLogin={onLogin} />
      </div>
    </div>
  );
};

// Routes Component with access to navigation context
const AppRoutes: React.FC<{
  user: User | null;
  onLogout: () => void;
  onShowLogin: () => void;
  onUpdateUser: (user: User) => void;
}> = ({ user, onLogout, onShowLogin, onUpdateUser }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we should show login modal from navigation state
  useEffect(() => {
    if (location.state?.showLogin) {
      onShowLogin();
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, onShowLogin, navigate]);

  // Redirect logged-in users from home to studio
  const HomeRedirect = () => {
    if (user) {
      return <Navigate to="/studio" replace />;
    }
    return <HomePage onGetStarted={onShowLogin} />;
  };

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} onLogout={onLogout} />}>
        <Route index element={<HomeRedirect />} />
        <Route
          path="studio"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <StudioPage />
            </ProtectedRoute>
          }
        />
        <Route path="pricing" element={<PricingPage currentUser={user} />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <ProfilePage user={user!} onUpdateUser={onUpdateUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="salon-dashboard"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <SalonDashboard
                user={user!}
                salonCode={user?.id || "SALON-001"}
                onLogout={onLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointments"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="history"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="topup"
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <TopUpPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default function RouterApp() {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check for existing users and auto-login the most recent
    const recentUsers = StorageService.getRecentUsers();
    if (recentUsers.length > 0) {
      // Auto-login the most recent user
      const mostRecentUser = recentUsers[0];
      setUser(mostRecentUser);

      // Initialize credits if needed
      const currentCredits = CreditService.getTotalCredits();
      if (currentCredits === 0) {
        CreditService.resetCredits(10); // Start with 10 free credits
      }
    }
    setIsInitializing(false);
  }, []);

  const handleLogin = (
    name: string,
    email: string,
    phone: string,
    code?: string,
    type: "CUSTOMER" | "PARTNER" = "CUSTOMER",
    avatar?: string,
  ) => {
    // Initialize or retrieve user
    const loggedInUser = StorageService.initUser(
      name,
      email,
      phone,
      avatar,
      type,
    );

    // Initialize credits if needed
    const currentCredits = CreditService.getTotalCredits();
    if (currentCredits === 0) {
      CreditService.resetCredits(10); // Start with 10 free credits
    }

    setUser(loggedInUser);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowLoginModal(false);
  };

  const handleShowLogin = () => {
    setShowLoginModal(true);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <LoginModalWrapper
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
      <AppRoutes
        user={user}
        onLogout={handleLogout}
        onShowLogin={handleShowLogin}
        onUpdateUser={setUser}
      />
    </BrowserRouter>
  );
}
