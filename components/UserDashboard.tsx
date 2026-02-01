import React from 'react';
import { User, HistorySession, Booking } from '../types';
import { Clock, Calendar, Wallet, CheckCircle } from 'lucide-react';
import { StorageService } from '../services/storage';

interface UserDashboardProps {
  user: User;
  onClose: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onClose }) => {
  const bookings = StorageService.getBookings(user.email);
  const history = StorageService.getHistory(user.email);

  return (
    <div className="flex-1 flex flex-col bg-brand-50 overflow-hidden">
        <div className="bg-white border-b border-brand-200 p-8">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
                <div>
                    <h1 className="font-serif text-3xl text-brand-900 mb-1">Hello, {user.name}</h1>
                    <p className="text-brand-500">Manage your style journey.</p>
                </div>
                <button onClick={onClose} className="text-sm font-bold uppercase tracking-wider text-brand-400 hover:text-brand-900">
                    Back to Studio
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Stats / Wallet */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-brand-400">
                            <Wallet className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Wallet</span>
                        </div>
                        <div className="text-5xl font-serif text-brand-900 mb-2">{user.credits}</div>
                        <p className="text-sm text-brand-500 mb-6">Available Credits</p>
                        <button onClick={onClose} className="w-full py-3 bg-brand-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">
                            Top Up Credits
                        </button>
                    </div>

                    <div className="bg-brand-900 text-white p-6 rounded-3xl shadow-xl">
                        <div className="flex items-center gap-3 mb-4 opacity-70">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Membership</span>
                        </div>
                        <h3 className="text-2xl font-serif mb-1">{user.tier} Plan</h3>
                        <p className="text-sm opacity-70 mb-4">Active since {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Bookings & History */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Bookings */}
                    <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm">
                         <div className="flex items-center gap-3 mb-6 text-brand-400">
                            <Calendar className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Upcoming Appointments</span>
                        </div>
                        
                        {bookings.length > 0 ? (
                            <div className="space-y-4">
                                {bookings.map(booking => (
                                    <div key={booking.id} className="flex items-center justify-between p-4 bg-brand-50 rounded-2xl border border-brand-100">
                                        <div>
                                            <h4 className="font-bold text-brand-900">{booking.service}</h4>
                                            <p className="text-sm text-brand-500">{booking.salonName} • {booking.date} at {booking.time}</p>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                                            {booking.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-brand-400 italic text-sm">No upcoming bookings.</p>
                        )}
                    </div>

                    {/* Style History */}
                    <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm">
                         <div className="flex items-center gap-3 mb-6 text-brand-400">
                            <Clock className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Generation History</span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {history.slice(0, 8).map(session => (
                                <div key={session.id} className="aspect-[3/4] rounded-xl overflow-hidden relative group">
                                     <img src={session.resultImages.front || session.originalImage} className="w-full h-full object-cover" />
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <span className="text-white text-[10px] font-bold uppercase">{session.config.style}</span>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
  );
};