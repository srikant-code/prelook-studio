import React from "react";
import { User, Booking } from "../../types";
import {
  Calendar,
  Wallet,
  Users,
  TrendingUp,
  Scissors,
  Search,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface SalonDashboardProps {
  user: User; // The user object acting as the salon admin
  salonCode: string;
  onLogout: () => void;
}

export const SalonDashboard: React.FC<SalonDashboardProps> = ({
  user,
  salonCode,
  onLogout,
}) => {
  // Mock Data for the dashboard
  const stats = [
    {
      label: "Weekly Bookings",
      value: "24",
      icon: Calendar,
      color: "text-brand-900",
    },
    {
      label: "Revenue (Est.)",
      value: "$1,840",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "AI Sessions Used",
      value: "45",
      icon: Scissors,
      color: "text-brand-600",
    },
    {
      label: "Salon Credits",
      value: "120",
      icon: Wallet,
      color: "text-accent",
    },
  ];

  const recentBookings: Booking[] = [
    {
      id: "1",
      salonName: "Studio",
      service: "Balayage & Cut",
      date: "Today",
      time: "2:00 PM",
      price: "$120",
      status: "CONFIRMED",
      timestamp: 123,
    },
    {
      id: "2",
      salonName: "Studio",
      service: "Mens Fade",
      date: "Today",
      time: "3:30 PM",
      price: "$45",
      status: "CONFIRMED",
      timestamp: 124,
    },
    {
      id: "3",
      salonName: "Studio",
      service: "Consultation",
      date: "Tomorrow",
      time: "10:00 AM",
      price: "$0",
      status: "CONFIRMED",
      timestamp: 125,
    },
    {
      id: "4",
      salonName: "Studio",
      service: "Full Color",
      date: "Tomorrow",
      time: "11:30 AM",
      price: "$150",
      status: "CANCELLED",
      timestamp: 126,
    },
  ];

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col">
      {/* Admin Header */}
      <div className="bg-white border-b border-brand-200 p-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-brand-900 text-white w-10 h-10 rounded-xl flex items-center justify-center">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl text-brand-900 font-bold">
                Luxe Salon Admin
              </h1>
              <p className="text-xs text-brand-500 uppercase tracking-wider">
                ID: {salonCode}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-brand-900">{user.name}</p>
              <p className="text-xs text-brand-500">Manager</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-brand-100 hover:bg-brand-200 text-brand-800 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-brand-100 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase text-brand-400 tracking-widest">
                    {stat.label}
                  </span>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-3xl font-serif text-brand-900 font-medium">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking List */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-brand-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-brand-100 flex items-center justify-between">
                <h3 className="font-serif text-xl text-brand-900">
                  Incoming Appointments
                </h3>
                <button className="p-2 hover:bg-brand-50 rounded-full text-brand-400">
                  <Search className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-50 text-brand-500 font-bold uppercase text-xs tracking-widest">
                    <tr>
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-100">
                    {recentBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-brand-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-brand-900">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-200 flex items-center justify-center text-brand-600 text-xs">
                              {booking.id === "1" ? "JD" : "MK"}
                            </div>
                            Guest #{booking.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-brand-600">
                          {booking.service}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-brand-800">
                            <Clock className="w-4 h-4 text-brand-400" />
                            {booking.date}, {booking.time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                                    ${booking.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                                                 `}
                          >
                            {booking.status === "CONFIRMED" ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-brand-400 hover:text-brand-900 text-xs underline font-bold">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions / AI Usage */}
            <div className="space-y-6">
              <div className="bg-brand-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Scissors className="w-32 h-32 transform rotate-12" />
                </div>
                <h3 className="font-serif text-2xl mb-2 relative z-10">
                  In-Salon AI Mode
                </h3>
                <p className="text-brand-300 text-sm mb-6 relative z-10 max-w-[80%]">
                  Use salon credits to generate styles for walk-in clients
                  without them needing an account.
                </p>
                <button className="w-full py-4 bg-white text-brand-900 rounded-xl font-bold uppercase tracking-widest hover:bg-brand-100 transition-colors relative z-10">
                  Start New Session
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-brand-100 p-6 shadow-sm">
                <h3 className="font-bold text-brand-900 uppercase tracking-widest text-xs mb-4">
                  Verification Requests
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-brand-50 rounded-xl border border-brand-100">
                    <div>
                      <p className="font-bold text-brand-900 text-sm">
                        Booking #B-921
                      </p>
                      <p className="text-xs text-brand-500">Checking in now</p>
                    </div>
                    <button className="px-3 py-1.5 bg-brand-900 text-white rounded-lg text-xs font-bold">
                      Verify
                    </button>
                  </div>
                  <p className="text-center text-xs text-brand-400 mt-2">
                    No other pending requests
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
