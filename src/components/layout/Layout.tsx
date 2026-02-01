import React from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Scissors,
  DollarSign,
  Calendar,
  History,
  User,
  LogOut,
  Wallet,
} from "lucide-react";
import { User as UserType } from "../../types";
import { StorageService } from "../../../services/storage";
import { CreditService } from "../../services/appStorage";
import { Tooltip } from "../ui/Tooltip";
import { MusicPlayer } from "../shared/MusicPlayer";

interface LayoutProps {
  user: UserType | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [credits, setCredits] = React.useState({
    available: 0,
    total: 0,
    used: 0,
  });

  React.useEffect(() => {
    if (user) {
      setCredits({
        available: CreditService.getAvailableCredits(),
        total: CreditService.getTotalCredits(),
        used: CreditService.getUsedCredits(),
      });
    }
  }, [user, location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  // Nav items - different for salon partners vs customers
  const navItems = user
    ? user.role === "PARTNER"
      ? [
          { path: "/salon-dashboard", icon: Scissors, label: "Dashboard" },
          { path: "/studio", icon: Scissors, label: "Studio" },
          { path: "/appointments", icon: Calendar, label: "Appointments" },
          { path: "/pricing", icon: DollarSign, label: "Pricing" },
        ]
      : [
          { path: "/studio", icon: Scissors, label: "Studio" },
          { path: "/appointments", icon: Calendar, label: "Appointments" },
          { path: "/history", icon: History, label: "History" },
          { path: "/pricing", icon: DollarSign, label: "Pricing" },
        ]
    : [
        { path: "/", icon: Home, label: "Home" },
        { path: "/pricing", icon: DollarSign, label: "Pricing" },
      ];

  if (!user) {
    // Public layout with minimal navbar
    return (
      <div className="min-h-screen bg-brand-50">
        <nav className="bg-white border-b border-brand-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-brand-900 w-10 h-10 rounded-xl flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif text-xl font-bold text-brand-900">
                  Prelook Studio
                </span>
              </Link>

              {/* Public Nav Links */}
              <div className="flex items-center gap-4">
                <Link
                  to="/pricing"
                  className="text-brand-600 hover:text-brand-900 font-medium transition-colors"
                >
                  Pricing
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-brand-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-brand-900 w-10 h-10 rounded-xl flex items-center justify-center">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-brand-900 hidden sm:block">
                Prelook Studio
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium
                    ${
                      isActive(item.path)
                        ? "bg-brand-900 text-white"
                        : "text-brand-600 hover:bg-brand-100"
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </div>

            {/* User Info & Credits */}
            <div className="flex items-center gap-3">
              {/* Music Player - only show for logged in users */}
              <MusicPlayer />

              {/* Credits Display */}
              <Tooltip
                content={`${credits.available} credits available. Click to top up.`}
                side="bottom"
              >
                <Link
                  to="/pricing"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all
                    ${
                      credits.available <= 2
                        ? "bg-red-50 border-red-200 text-red-700"
                        : credits.available <= 5
                          ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                          : "bg-brand-50 border-brand-200 text-brand-700"
                    }`}
                >
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm font-bold">
                    {credits.available}/{credits.total}
                  </span>
                </Link>
              </Tooltip>

              {/* User Menu */}
              <div className="flex items-center gap-3">
                {/* Plan Badge */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-brand-100 border border-brand-300 rounded-full">
                  <span className="text-xs font-bold text-brand-700">
                    {user.tier}
                  </span>
                </div>

                {/* Avatar - clickable to profile */}
                <Tooltip content={user.name} side="bottom">
                  <button
                    onClick={() => navigate("/profile")}
                    className="focus:outline-none focus:ring-2 focus:ring-brand-400 rounded-full"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-brand-200 cursor-pointer hover:border-brand-400 transition-all"
                    />
                  </button>
                </Tooltip>

                {/* Logout */}
                <Tooltip content="Logout" side="bottom">
                  <button
                    onClick={onLogout}
                    className="p-2 text-brand-500 hover:text-brand-900 hover:bg-brand-100 rounded-lg transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-brand-200 z-50 safe-area-bottom">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all
                ${
                  isActive(item.path)
                    ? "bg-brand-900 text-white"
                    : "text-brand-500"
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};
