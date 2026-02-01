import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultView } from './components/ResultView';
import { Controls } from './components/Controls';
import { SalonFinder } from './components/SalonFinder';
import { HistoryBar } from './components/HistoryBar';
import { LoginScreen } from './components/LoginScreen';
import { Pricing } from './components/Pricing';
import { UserDashboard } from './components/UserDashboard';
import { SalonDashboard } from './components/SalonDashboard';
import { MusicPlayer } from './components/MusicPlayer';
import { generateFrontView, generateRemainingViews } from './services/geminiService';
import { StorageService } from './services/storage';
import { AppView, GenerationState, HistorySession, User, GeneratedImages, SubscriptionTier, GenerationConfig } from './types';
import { Scissors, LogOut, Crown, Star, Zap, User as UserIcon, Info } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [user, setUser] = useState<User | null>(null);
  
  // Salon State
  const [salonCode, setSalonCode] = useState<string | null>(null);

  // Original Upload
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  // Undo/Redo Stack
  const [historyStack, setHistoryStack] = useState<GeneratedImages[]>([]);
  const [currentStackIndex, setCurrentStackIndex] = useState<number>(-1);

  // Persistent Session History (Sidebar)
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>();

  // Config State to track what the user selected
  const [lastConfig, setLastConfig] = useState<GenerationConfig | null>(null);

  const [generationState, setGenerationState] = useState<GenerationState>({
    isLoading: false,
    isUnlocking: false,
    error: null,
    resultImages: { front: null, left: null, right: null, back: null },
    unlockedAngles: false
  });

  const handleLogin = (name: string, email: string, phone: string, code?: string, type: 'CUSTOMER' | 'PARTNER' = 'CUSTOMER', avatar?: string) => {
    // initialize User (Created in storage if new, retrieved if existing)
    let loggedInUser = StorageService.initUser(name, email, phone, avatar, type);

    // Flow 1: Partner Login (Salon Admin) or Quick Login as Partner
    if (type === 'PARTNER') {
        // In a real app, 'code' here would be the Salon ID/Key validation
        // For quick login, we might pass a special code or trust the stored session context
        const isValid = (code && code.length > 2) || (loggedInUser.role === 'PARTNER');
        
        if (isValid) {
            setSalonCode(code || 'STORE-001'); // Fallback for quick login simulation
            setUser(loggedInUser);
            setView(AppView.SALON_DASHBOARD);
            return;
        }
    } 
    
    // Flow 2: Customer Login (New User OR Walk-in)
    if (code && code.length > 0 && type === 'CUSTOMER') {
        // Upgrade user perks for the session if walk-in code provided
        const upgraded = StorageService.applyWalkInPerks(email);
        if (upgraded) loggedInUser = upgraded;
    }

    // Set User & Load History
    setUser(loggedInUser);
    const savedHistory = StorageService.getHistory(email);
    setHistory(savedHistory);
    
    // Customers always go to Landing to generate
    setView(AppView.LANDING);
  };

  const handleLogout = () => {
    setUser(null);
    setSalonCode(null);
    resetApp();
  };

  const handleUpdateAvatar = (url: string) => {
      if (user) {
          const updatedUser = StorageService.updateAvatar(user.email, url);
          if (updatedUser) setUser(updatedUser);
      }
  };

  const handleImageSelect = (base64: string) => {
    setOriginalImage(base64);
    setView(AppView.STUDIO);
    
    // Reset Stack
    setHistoryStack([]);
    setCurrentStackIndex(-1);
    
    setGenerationState({ 
        isLoading: false, 
        error: null, 
        resultImages: { front: null, left: null, right: null, back: null },
        unlockedAngles: false
    });
    setCurrentSessionId(undefined);
  };

  const handleGenerate = async (prompt: string, config: GenerationConfig) => {
    if (!originalImage || !user) return;

    if (user.credits <= 0) {
      setView(AppView.PRICING);
      return;
    }

    setLastConfig(config);
    setGenerationState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Step 1: Generate Front Only (Free/Default)
      const results = await generateFrontView(originalImage, prompt);
      
      const newStack = historyStack.slice(0, currentStackIndex + 1);
      newStack.push(results);
      setHistoryStack(newStack);
      setCurrentStackIndex(newStack.length - 1);

      const newSession: HistorySession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        originalImage,
        resultImages: results,
        promptSummary: prompt,
        config,
        unlockedAngles: false
      };
      
      setHistory(prev => [newSession, ...prev]);
      StorageService.saveHistorySession(user.email, newSession);
      
      // Deduct 1 Credit for generation
      const newCredits = user.credits - 1;
      StorageService.updateCredits(user.email, newCredits);
      setUser(prev => prev ? ({ ...prev, credits: newCredits }) : null);

      setCurrentSessionId(newSession.id);
      
      setGenerationState({
        isLoading: false,
        error: null,
        resultImages: results,
        unlockedAngles: false
      });
    } catch (err: any) {
      setGenerationState(prev => ({
        ...prev,
        isLoading: false,
        error: err.message || "Something went wrong. Please try again.",
      }));
    }
  };

  const handleUnlock360 = async () => {
    if (!originalImage || !user || !currentSessionId || !lastConfig) return;
    
    // Check credits (Upsell cost: 2 credits)
    if (user.credits < 2) {
        setView(AppView.PRICING);
        return;
    }

    setGenerationState(prev => ({ ...prev, isUnlocking: true, error: null }));

    try {
        // Construct prompt again
        let colorPrompt = "";
        if (lastConfig.color !== 'Keep Natural') {
             colorPrompt = `Dye hair color ${lastConfig.color}.`;
        } else {
             colorPrompt = "Keep original hair color.";
        }
        const prompt = `A ${lastConfig.gender} hairstyle. ${lastConfig.style} cut. ${colorPrompt} Professional salon look.`;

        const remainingViews = await generateRemainingViews(originalImage, prompt);
        
        const fullResults: GeneratedImages = {
            ...generationState.resultImages,
            left: remainingViews.left || null,
            right: remainingViews.right || null,
            back: remainingViews.back || null
        };

        // Update Session
        const currentSession = history.find(s => s.id === currentSessionId);
        if (currentSession) {
            currentSession.resultImages = fullResults;
            currentSession.unlockedAngles = true;
            StorageService.saveHistorySession(user.email, currentSession);
            setHistory(StorageService.getHistory(user.email)); // Refresh
        }

        // Deduct Credits
        const newCredits = user.credits - 2;
        StorageService.updateCredits(user.email, newCredits);
        setUser(prev => prev ? ({ ...prev, credits: newCredits }) : null);

        setGenerationState(prev => ({
            ...prev,
            isUnlocking: false,
            resultImages: fullResults,
            unlockedAngles: true
        }));

    } catch (err: any) {
        setGenerationState(prev => ({
            ...prev,
            isUnlocking: false,
            error: "Failed to unlock views. Credits not deducted.",
        }));
    }
  };

  const handleUndo = () => {
    if (currentStackIndex > 0) {
      const prevIndex = currentStackIndex - 1;
      setCurrentStackIndex(prevIndex);
      setGenerationState(prev => ({ ...prev, resultImages: historyStack[prevIndex], unlockedAngles: false }));
    }
  };

  const handleRedo = () => {
    if (currentStackIndex < historyStack.length - 1) {
      const nextIndex = currentStackIndex + 1;
      setCurrentStackIndex(nextIndex);
      setGenerationState(prev => ({ ...prev, resultImages: historyStack[nextIndex] }));
    }
  };

  const loadSession = (session: HistorySession) => {
    setOriginalImage(session.originalImage);
    setLastConfig(session.config);
    setGenerationState({
        isLoading: false,
        error: null,
        resultImages: session.resultImages,
        unlockedAngles: session.unlockedAngles
    });
    setHistoryStack([session.resultImages]);
    setCurrentStackIndex(0);
    setCurrentSessionId(session.id);
    setView(AppView.STUDIO);
  };

  const resetApp = () => {
    setView(AppView.LANDING);
    setOriginalImage(null);
    setHistoryStack([]);
    setCurrentStackIndex(-1);
    setGenerationState({ 
        isLoading: false, 
        error: null, 
        resultImages: { front: null, left: null, right: null, back: null },
        unlockedAngles: false
    });
  };

  const handleTierSelect = (tier: SubscriptionTier) => {
    if (user) {
      const updatedUser = StorageService.upgradeTier(user.email, tier);
      if (updatedUser) {
        setUser(updatedUser);
        setView(AppView.STUDIO);
      }
    }
  };

  // Render Logic
  if (!user) {
    return (
      <div className="min-h-screen bg-brand-50 font-sans text-brand-900">
         <header className="bg-white/80 backdrop-blur-md border-b border-brand-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-brand-900 text-white p-2 rounded-lg">
                <Scissors className="w-5 h-5" />
                </div>
                <span className="font-serif text-2xl font-bold tracking-tight text-brand-900">Prelook Studio</span>
            </div>
            </div>
        </header>
        <LoginScreen onLogin={handleLogin} />
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center"></div>
      </div>
    );
  }

  // Salon Admin View
  if (view === AppView.SALON_DASHBOARD && salonCode) {
    return <SalonDashboard user={user} salonCode={salonCode} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-brand-50 font-sans text-brand-900 flex flex-col selection:bg-brand-200 selection:text-brand-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-brand-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo - Left */}
          <div className="flex items-center gap-3 cursor-pointer group flex-shrink-0" onClick={() => setView(AppView.LANDING)}>
            <div className="bg-brand-900 text-white p-2 rounded-lg transition-transform group-hover:rotate-6 shadow-md">
              <Scissors className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-900 hidden sm:block">Prelook Studio</span>
          </div>
          
          {/* Center - Music Player */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
             <MusicPlayer />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
             {/* Credits Badge */}
             <div onClick={() => setView(AppView.PRICING)} className="cursor-pointer bg-brand-100 hover:bg-brand-200 px-3 py-1 rounded-full flex items-center gap-2 transition-colors">
                <div className="bg-brand-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {user.credits}
                </div>
                <span className="text-xs font-bold uppercase text-brand-800 tracking-wider hidden sm:inline">Credits</span>
             </div>

             <div onClick={() => setView(AppView.DASHBOARD)} className="hidden md:flex items-center gap-3 cursor-pointer hover:opacity-70 border-l border-brand-200 pl-4">
                <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-900">{user.name}</p>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-brand-500">
                       {user.tier === 'PRO' && <Zap className="w-3 h-3 text-yellow-600" fill="currentColor" />}
                       {user.tier === 'ULTIMATE' && <Crown className="w-3 h-3 text-yellow-600" fill="currentColor" />}
                       {user.tier === 'FREE' && <Star className="w-3 h-3 text-brand-400" />}
                       {user.tier} Plan
                    </div>
                </div>
                <div className="w-9 h-9 rounded-full border border-brand-200 p-0.5">
                    <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full bg-brand-100" />
                </div>
             </div>
             
             <div onClick={() => setView(AppView.DASHBOARD)} className="md:hidden p-2 text-brand-900">
                 <UserIcon className="w-5 h-5" />
             </div>

             <button onClick={handleLogout} className="p-2 hover:bg-brand-100 rounded-full text-brand-400 hover:text-brand-900 transition-colors">
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {view === AppView.DASHBOARD && (
            <UserDashboard user={user} onClose={() => setView(AppView.STUDIO)} />
        )}

        {view === AppView.PRICING && (
           <Pricing onSelectTier={handleTierSelect} currentTier={user.tier} />
        )}

        {view === AppView.LANDING && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-brand-50">
            <div className="max-w-4xl mx-auto space-y-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-600 text-xs font-bold uppercase tracking-widest border border-brand-200">
                AI Powered Styling
              </span>
              
              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-brand-900 leading-[0.95]">
                Discover Your<br />
                <span className="text-brand-500 italic font-light">Perfect Look</span>
              </h1>
              
              <p className="text-lg text-brand-600 max-w-lg mx-auto leading-relaxed">
                The modern way to visualize your next hairstyle. Instant, photorealistic, and personalized.
              </p>

              <div className="max-w-xl mx-auto mt-12 shadow-2xl rounded-3xl overflow-hidden border-4 border-white">
                <ImageUploader onImageSelect={handleImageSelect} />
              </div>
            </div>
            
            {/* Show recent history on landing if exists */}
            {history.length > 0 && (
                <div className="mt-12 w-full max-w-7xl px-4">
                     <h3 className="text-left font-serif text-xl mb-4 text-brand-800">Your Recent Styles</h3>
                     <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {history.slice(0, 6).map(session => (
                            <div key={session.id} onClick={() => loadSession(session)} className="cursor-pointer group relative aspect-[3/4] rounded-xl overflow-hidden">
                                <img src={session.resultImages.front || session.originalImage} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                            </div>
                        ))}
                     </div>
                </div>
            )}
          </div>
        )}

        {view === AppView.STUDIO && (
          <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
            
            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 relative md:mr-20"> 
                     <ResultView 
                        originalImage={originalImage!}
                        resultImages={generationState.resultImages}
                        isLoading={generationState.isLoading}
                        isUnlocking={generationState.isUnlocking}
                        unlockedAngles={generationState.unlockedAngles}
                        onUnlock={handleUnlock360}
                        currentStyleName={lastConfig?.style}
                        onBookNow={() => {
                            // Scroll to Salon Finder
                            const finder = document.getElementById('salon-finder');
                            finder?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        onSetAvatar={handleUpdateAvatar}
                    />
                    
                    {!generationState.isLoading && generationState.resultImages.front && (
                        <div id="salon-finder" className="bg-brand-50 border-t border-brand-200 pb-32">
                            <div className="max-w-7xl mx-auto">
                                <SalonFinder 
                                    userEmail={user.email} 
                                    onBookingComplete={() => setView(AppView.DASHBOARD)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <HistoryBar 
                    sessions={history} 
                    onLoadSession={loadSession}
                    currentSessionId={currentSessionId}
                />
            </div>
            
            {generationState.error && (
               <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-50 text-red-600 px-6 py-3 rounded-full shadow-lg border border-red-100 text-sm flex items-center gap-2 animate-fade-in">
                 <Info className="w-4 h-4" />
                 {generationState.error}
               </div>
            )}

            <Controls 
              onGenerate={handleGenerate} 
              isLoading={generationState.isLoading || generationState.isUnlocking || false}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={currentStackIndex >= 0}
              canRedo={currentStackIndex < historyStack.length - 1}
            />
          </div>
        )}
      </main>
    </div>
  );
}