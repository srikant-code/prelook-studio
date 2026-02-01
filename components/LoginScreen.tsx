import React, { useState, useEffect } from 'react';
import { Scissors, ArrowRight, LockKeyhole, Store, Ticket, User as UserIcon, X, Plus, Sparkles } from 'lucide-react';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (name: string, email: string, phone: string, code?: string, type?: 'CUSTOMER' | 'PARTNER', avatar?: string) => void;
}

type LoginMode = 'CUSTOMER' | 'PARTNER';

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Zoe', 'Midnight', 'Bear', 'Tiger', 'Leo', 'Sky', 'Ginger', 'Max', 'Luna'];

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<LoginMode>('CUSTOMER');
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  
  // Customer State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [walkInCode, setWalkInCode] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  
  // Partner State
  const [adminId, setAdminId] = useState('');
  const [adminKey, setAdminKey] = useState('');

  // OTP State
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [pendingLoginUser, setPendingLoginUser] = useState<User | null>(null);

  useEffect(() => {
    setRecentUsers(StorageService.getRecentUsers());
    setSelectedAvatar(`https://api.dicebear.com/7.x/notionists/svg?seed=${AVATAR_SEEDS[0]}`);
  }, []);

  const handleQuickLogin = (user: User) => {
      setPendingLoginUser(user);
      setIsOtpStep(true);
      // Pre-fill for OTP context
      setPhone(user.phone || '');
      setName(user.name);
      setEmail(user.email);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'CUSTOMER') {
        if (name && email && phone) setIsOtpStep(true);
    } else {
        if (adminId && adminKey) onLogin("Admin", "admin@salon.com", "000", adminId, 'PARTNER');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
        // Use pending user data if quick login, else form data
        const finalName = pendingLoginUser?.name || name;
        const finalEmail = pendingLoginUser?.email || email;
        const finalPhone = pendingLoginUser?.phone || phone;
        const finalAvatar = pendingLoginUser?.avatar || selectedAvatar;
        
        // If it's a quick login, use the stored role. If new, use the current mode.
        const finalRole = pendingLoginUser?.role || mode;
        
        // For partners, we might re-verify code in a real app, but here we assume OTP is enough for quick login
        // If it's a new partner login, we pass the store ID code.
        const code = pendingLoginUser ? (pendingLoginUser.role === 'PARTNER' ? 'RE-AUTH' : undefined) : (walkInCode || undefined);

        onLogin(finalName, finalEmail, finalPhone, code, finalRole, finalAvatar);
    }
  };

  const removeUser = (e: React.MouseEvent, email: string) => {
      e.stopPropagation();
      StorageService.removeRecentUser(email);
      setRecentUsers(StorageService.getRecentUsers());
  };

  return (
    <div className="fixed inset-0 z-[60] bg-brand-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-3xl shadow-2xl border border-brand-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Branding */}
        <div className="bg-brand-900 p-8 text-center relative overflow-hidden shrink-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="relative z-10">
                <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <Scissors className="w-6 h-6 text-white" />
                </div>
                <h2 className="font-serif text-3xl text-white mb-1">Prelook Studio</h2>
                <p className="text-brand-200 text-sm">Virtual Hair Transformation</p>
            </div>
        </div>

        {/* Quick Login View */}
        {!isOtpStep && !showNewUserForm && recentUsers.length > 0 && (
            <div className="p-8 flex-1 overflow-y-auto">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-400 mb-4">Quick Sign In</h3>
                <div className="space-y-3">
                    {recentUsers.map(user => (
                        <div 
                            key={user.email} 
                            onClick={() => handleQuickLogin(user)}
                            className="flex items-center gap-4 p-3 rounded-2xl border border-brand-100 hover:border-brand-300 hover:bg-brand-50 cursor-pointer transition-all group relative overflow-hidden"
                        >
                            <img src={user.avatar} className="w-12 h-12 rounded-full bg-brand-100 object-cover" alt="Avatar" />
                            <div className="flex-1">
                                <h4 className="font-bold text-brand-900 flex items-center gap-2">
                                    {user.name}
                                    {user.role === 'PARTNER' && (
                                        <span className="px-1.5 py-0.5 bg-brand-900 text-white text-[9px] rounded uppercase tracking-wider">Partner</span>
                                    )}
                                </h4>
                                <p className="text-xs text-brand-500">{user.email}</p>
                            </div>
                            <button 
                                onClick={(e) => removeUser(e, user.email)}
                                className="p-2 text-brand-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all relative z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button 
                        onClick={() => setShowNewUserForm(true)}
                        className="w-full py-4 border-2 border-dashed border-brand-200 rounded-2xl text-brand-400 font-bold flex items-center justify-center gap-2 hover:border-brand-400 hover:text-brand-600 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Account
                    </button>
                </div>
            </div>
        )}

        {/* New User / Full Form */}
        {(isOtpStep || showNewUserForm || recentUsers.length === 0) && (
            <>
                 {/* Mode Toggles */}
                 {!isOtpStep && (
                    <div className="flex border-b border-brand-100 shrink-0">
                        <button 
                            onClick={() => { setMode('CUSTOMER'); setShowNewUserForm(true); }}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors
                                ${mode === 'CUSTOMER' ? 'bg-white text-brand-900 border-b-2 border-brand-900' : 'bg-brand-50 text-brand-400 hover:text-brand-600'}
                            `}
                        >
                            <UserIcon className="w-4 h-4" />
                            Customer
                        </button>
                        <button 
                            onClick={() => { setMode('PARTNER'); setShowNewUserForm(true); }}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors
                                ${mode === 'PARTNER' ? 'bg-white text-brand-900 border-b-2 border-brand-900' : 'bg-brand-50 text-brand-400 hover:text-brand-600'}
                            `}
                        >
                            <Store className="w-4 h-4" />
                            Partner
                        </button>
                    </div>
                )}

                <div className="p-8 flex-1 overflow-y-auto bento-scroll">
                    {!isOtpStep ? (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            {mode === 'CUSTOMER' ? (
                                <>
                                    {/* Avatar Picker */}
                                    <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-brand-400 mb-3 flex items-center gap-2">
                                            <Sparkles className="w-3 h-3 text-brand-500" /> Choose Style Avatar
                                        </label>
                                        <div className="flex gap-3 overflow-x-auto pb-2 bento-scroll snap-x">
                                            {AVATAR_SEEDS.map(seed => {
                                                const uri = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`;
                                                return (
                                                    <div 
                                                        key={seed} 
                                                        onClick={() => setSelectedAvatar(uri)}
                                                        className={`w-14 h-14 shrink-0 rounded-xl cursor-pointer transition-all snap-center relative overflow-hidden group
                                                            ${selectedAvatar === uri ? 'ring-2 ring-brand-900 scale-105 shadow-md' : 'hover:scale-105 opacity-70 hover:opacity-100'}
                                                        `}
                                                    >
                                                        <img src={uri} className="w-full h-full bg-white" alt={seed} />
                                                        {selectedAvatar === uri && (
                                                            <div className="absolute inset-0 bg-brand-900/10 flex items-center justify-center">
                                                                <div className="w-2 h-2 bg-brand-900 rounded-full"></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-brand-50 border border-brand-200 focus:border-brand-800 focus:ring-0 transition-all outline-none"
                                                placeholder="Your Name"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-brand-50 border border-brand-200 focus:border-brand-800 focus:ring-0 transition-all outline-none"
                                                    placeholder="555-0123"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl bg-brand-50 border border-brand-200 focus:border-brand-800 focus:ring-0 transition-all outline-none"
                                                    placeholder="you@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative pt-2">
                                        <div className={`p-4 rounded-xl border transition-all duration-300 ${walkInCode ? 'bg-green-50 border-green-200' : 'bg-brand-50 border-brand-100 border-dashed'}`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`p-2 rounded-full ${walkInCode ? 'bg-green-100 text-green-600' : 'bg-brand-200 text-brand-500'}`}>
                                                    <Ticket className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold uppercase tracking-widest text-brand-800 mb-1">
                                                        In-Salon Walk-in Code
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={walkInCode}
                                                        onChange={(e) => setWalkInCode(e.target.value.toUpperCase())}
                                                        className={`w-full px-3 py-2 rounded-lg text-sm font-mono tracking-widest outline-none border focus:ring-0 ${walkInCode ? 'bg-white border-green-300 text-green-800 font-bold' : 'bg-white border-brand-200'}`}
                                                        placeholder="CODE (Optional)"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {recentUsers.length > 0 && (
                                            <button 
                                                type="button" 
                                                onClick={() => setShowNewUserForm(false)}
                                                className="px-6 py-4 border border-brand-200 text-brand-500 rounded-xl font-bold uppercase hover:bg-brand-50"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="flex-1 bg-brand-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl"
                                        >
                                            Next <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3 mb-4">
                                        <LockKeyhole className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-yellow-800">
                                            Restricted area for Salon Managers.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">Store ID</label>
                                        <input
                                            type="text"
                                            value={adminId}
                                            onChange={(e) => setAdminId(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-brand-50 border border-brand-200 focus:border-brand-800 focus:ring-0 transition-all outline-none font-mono"
                                            placeholder="SALON-ID"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">Access Key</label>
                                        <input
                                            type="password"
                                            value={adminKey}
                                            onChange={(e) => setAdminKey(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-brand-50 border border-brand-200 focus:border-brand-800 focus:ring-0 transition-all outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        {recentUsers.length > 0 && (
                                            <button 
                                                type="button" 
                                                onClick={() => { setShowNewUserForm(false); setMode('CUSTOMER'); }}
                                                className="px-6 py-4 border border-brand-200 text-brand-500 rounded-xl font-bold uppercase hover:bg-brand-50"
                                            >
                                                Back
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className="flex-1 bg-brand-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl"
                                        >
                                            Login <Store className="w-4 h-4" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in py-4">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-2xl mx-auto mb-4 overflow-hidden border-2 border-brand-200 shadow-md">
                                     <img src={pendingLoginUser?.avatar || selectedAvatar} className="w-full h-full bg-brand-50" />
                                </div>
                                <h3 className="text-brand-900 font-bold text-lg mb-1">Welcome back, {pendingLoginUser?.name || name}</h3>
                                <p className="text-sm text-brand-500 mb-6">Enter code sent to {pendingLoginUser?.phone || phone}</p>
                                
                                <input
                                    type="text"
                                    maxLength={4}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-40 mx-auto text-center text-3xl font-serif font-bold tracking-[0.5em] px-4 py-3 rounded-xl bg-brand-50 border border-brand-200 focus:border-brand-800 focus:ring-0 transition-all outline-none"
                                    placeholder="0000"
                                    autoFocus
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-brand-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 mt-6 shadow-xl"
                            >
                                Enter Studio
                            </button>
                            <button type="button" onClick={() => setIsOtpStep(false)} className="w-full text-xs text-brand-400 hover:text-brand-800 underline">
                                Back
                            </button>
                        </form>
                    )}
                </div>
            </>
        )}
        
        <div className="bg-brand-50 p-4 text-center border-t border-brand-100 shrink-0">
            <p className="text-[10px] text-brand-400">By entering, you agree to our Terms of Service & Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};