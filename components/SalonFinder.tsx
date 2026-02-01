import React, { useState } from 'react';
import { MapPin, ExternalLink, Star, CheckCircle, ArrowLeft, Clock, Scissors, CreditCard, ChevronRight, User } from 'lucide-react';
import { Button } from './Button';
import { findNearbySalons } from '../services/geminiService';
import { Salon, SalonService } from '../types';
import { StorageService } from '../services/storage';

interface SalonFinderProps {
  onBookingComplete?: () => void;
  userEmail?: string;
}

type ViewStep = 'LIST' | 'PROFILE' | 'CHECKOUT' | 'SUCCESS';

export const SalonFinder: React.FC<SalonFinderProps> = ({ onBookingComplete, userEmail }) => {
  const [step, setStep] = useState<ViewStep>('LIST');
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  
  // Checkout State
  const [selectedService, setSelectedService] = useState<SalonService | null>(null);
  const [selectedStylist, setSelectedStylist] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const handleFindSalons = async () => {
    setLoading(true);
    setError(null);
    try {
        // We'll simulate fetching specific Bhubaneswar data here
        // In real world, we might use lat/lng, but the prompt asked for specific salons
        const results = await findNearbySalons(0, 0); 
        setSalons(results);
    } catch (err) {
        setError("Failed to fetch salons. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleViewSalon = (salon: Salon) => {
    setSelectedSalon(salon);
    // Reset booking state
    setSelectedService(null);
    setSelectedStylist('');
    setSelectedDate('');
    setSelectedTime('');
    setStep('PROFILE');
  };

  const handleBookService = (service: SalonService) => {
    setSelectedService(service);
    setStep('CHECKOUT');
  };

  const confirmBooking = () => {
    if (selectedSalon && userEmail && selectedDate && selectedTime && selectedService) {
      StorageService.saveBooking(userEmail, {
          id: Date.now().toString(),
          salonName: selectedSalon.title,
          service: selectedService.name,
          stylist: selectedStylist,
          date: selectedDate,
          time: selectedTime,
          price: `$${selectedService.price}`,
          status: 'CONFIRMED',
          timestamp: Date.now()
      });

      // Simulate Email Sending
      console.log(`Sending booking confirmation to manish.rath5240@gmail.com for booking at ${selectedSalon.title}`);
      
      // In a real app, this would be an API call. 
      // For frontend demo, we set the state to success immediately.
      setStep('SUCCESS');
      if (onBookingComplete) setTimeout(onBookingComplete, 4000); 
    }
  };

  // --- VIEWS ---

  // 4. Success View
  if (step === 'SUCCESS') {
    return (
        <div className="border-t border-brand-200 bg-brand-50 p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-3xl text-brand-900 mb-2">Booking Confirmed!</h3>
            <p className="text-brand-600 mb-4 max-w-md mx-auto">
                You are booked at <span className="font-bold">{selectedSalon?.title}</span> with <span className="font-bold">{selectedStylist || 'Next Available Stylist'}</span>.
            </p>
            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl max-w-md mx-auto text-sm mb-8">
                An email confirmation has been sent to <span className="font-bold underline">manish.rath5240@gmail.com</span>
            </div>
            <div className="flex justify-center">
                 <Button onClick={() => setStep('LIST')} variant="outline">Browse More Salons</Button>
            </div>
        </div>
    );
  }

  // 3. Checkout Page
  if (step === 'CHECKOUT' && selectedSalon && selectedService) {
      return (
        <div className="border-t border-brand-200 bg-brand-50 p-6 md:p-12 animate-fade-in min-h-[600px] mb-24">
             <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2 space-y-8">
                     <button onClick={() => setStep('PROFILE')} className="flex items-center gap-2 text-brand-500 hover:text-brand-900 text-sm font-bold uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Back to Store
                    </button>
                    
                    <div>
                        <h2 className="font-serif text-3xl text-brand-900 mb-2">Checkout</h2>
                        <p className="text-brand-500">Complete your booking details for {selectedSalon.title}.</p>
                    </div>

                    {/* Stylist Selection */}
                    <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm">
                        <h3 className="font-bold text-brand-900 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" /> Select Stylist
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                             <button 
                                onClick={() => setSelectedStylist("Any Expert")}
                                className={`p-3 rounded-xl text-sm font-medium border text-left transition-all ${selectedStylist === "Any Expert" || !selectedStylist ? 'bg-brand-900 text-white border-brand-900 shadow-md' : 'bg-brand-50 text-brand-700 border-brand-100'}`}
                             >
                                 <span className="block font-bold">Any Expert</span>
                                 <span className="text-[10px] opacity-70">First Available</span>
                             </button>
                             {selectedSalon.stylists?.map(stylist => (
                                 <button 
                                    key={stylist}
                                    onClick={() => setSelectedStylist(stylist)}
                                    className={`p-3 rounded-xl text-sm font-medium border text-left transition-all ${selectedStylist === stylist ? 'bg-brand-900 text-white border-brand-900 shadow-md' : 'bg-brand-50 text-brand-700 border-brand-100'}`}
                                 >
                                     <span className="block font-bold">{stylist}</span>
                                     <span className="text-[10px] opacity-70">Top Rated</span>
                                 </button>
                             ))}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm">
                        <h3 className="font-bold text-brand-900 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Select Date & Time
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-brand-400 mb-3">Date</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Today', 'Tomorrow', 'Sat'].map(day => (
                                        <button 
                                            key={day}
                                            onClick={() => setSelectedDate(day)}
                                            className={`p-3 rounded-xl text-sm font-medium border transition-all ${selectedDate === day ? 'bg-brand-900 text-white border-brand-900 shadow-md' : 'bg-brand-50 text-brand-700 border-brand-100 hover:border-brand-300'}`}
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                 <label className="block text-xs font-bold text-brand-400 mb-3">Time</label>
                                 <div className="grid grid-cols-2 gap-2">
                                    {['10:00 AM', '1:00 PM', '3:30 PM', '5:00 PM'].map(time => (
                                        <button 
                                            key={time}
                                            onClick={() => setSelectedTime(time)}
                                            className={`p-3 rounded-xl text-sm font-medium border transition-all ${selectedTime === time ? 'bg-brand-900 text-white border-brand-900 shadow-md' : 'bg-brand-50 text-brand-700 border-brand-100 hover:border-brand-300'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                 </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-brand-100 shadow-sm">
                        <h3 className="font-bold text-brand-900 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" /> Payment Method
                        </h3>
                        <div className="flex items-center gap-4 p-4 border border-brand-200 rounded-xl bg-brand-50/50">
                            <div className="w-10 h-6 bg-brand-800 rounded flex items-center justify-center">
                                <div className="w-6 h-6 rounded-full bg-white/20 translate-x-2"></div>
                                <div className="w-6 h-6 rounded-full bg-white/20 -translate-x-2"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-brand-900">•••• 4242</p>
                                <p className="text-xs text-brand-500">Expires 12/25</p>
                            </div>
                            <button className="text-xs font-bold text-brand-900 underline">Change</button>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-brand-900 text-white p-6 rounded-3xl shadow-xl sticky top-8">
                        <h3 className="font-serif text-xl mb-6">Order Summary</h3>
                        
                        <div className="space-y-4 border-b border-white/20 pb-6 mb-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-white">{selectedService.name}</p>
                                    <p className="text-xs text-brand-300">{selectedService.duration}</p>
                                </div>
                                <p className="font-bold">₹{selectedService.price}</p>
                            </div>
                             <div className="flex justify-between items-start">
                                <p className="text-sm text-brand-300">Stylist</p>
                                <p className="font-bold text-sm text-right">{selectedStylist || 'Any Expert'}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-end mb-8">
                            <p className="text-sm text-brand-300 uppercase tracking-widest">Total</p>
                            <p className="font-serif text-3xl font-bold">₹{selectedService.price}</p>
                        </div>

                        <Button 
                            onClick={confirmBooking} 
                            disabled={!selectedDate || !selectedTime}
                            className="w-full bg-white text-brand-900 hover:bg-brand-100"
                        >
                            Reserve & Notify
                        </Button>
                        <p className="text-[10px] text-center text-brand-400 mt-4">
                            Pay at salon. Cancellation policy applies.
                        </p>
                    </div>
                </div>
             </div>
        </div>
      );
  }

  // 2. Profile Page (Store Page)
  if (step === 'PROFILE' && selectedSalon) {
      return (
        <div className="border-t border-brand-200 bg-brand-50 animate-fade-in min-h-[600px] mb-24">
            {/* Hero Image */}
            <div className="h-64 md:h-80 w-full relative overflow-hidden">
                <img src={selectedSalon.imageUrl} className="w-full h-full object-cover" alt={selectedSalon.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 to-transparent"></div>
                <div className="absolute top-6 left-6 md:left-12">
                     <button onClick={() => setStep('LIST')} className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-bold uppercase tracking-widest bg-black/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-black/40 transition-all">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>
                <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 text-white max-w-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-widest">{selectedSalon.specialty}</span>
                        <div className="flex items-center gap-1 text-yellow-400">
                             <Star className="w-3 h-3 fill-current" />
                             <span className="text-xs font-bold">{selectedSalon.rating?.toFixed(1)}</span>
                        </div>
                    </div>
                    <h1 className="font-serif text-3xl md:text-5xl font-bold mb-2">{selectedSalon.title}</h1>
                    <p className="text-brand-100 flex items-center gap-2 text-sm"><MapPin className="w-4 h-4" /> {selectedSalon.address}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Info Column */}
                <div className="space-y-8">
                    <div>
                        <h3 className="font-bold text-brand-900 uppercase tracking-widest text-xs mb-4">About</h3>
                        <p className="text-brand-600 leading-relaxed text-sm">{selectedSalon.description}</p>
                    </div>
                    <div>
                         <h3 className="font-bold text-brand-900 uppercase tracking-widest text-xs mb-4">Top Stylists</h3>
                         <div className="flex flex-wrap gap-2">
                             {selectedSalon.stylists?.map(name => (
                                 <span key={name} className="px-3 py-1 bg-brand-100 text-brand-700 rounded-lg text-xs font-bold">{name}</span>
                             ))}
                         </div>
                    </div>
                    <div>
                         <h3 className="font-bold text-brand-900 uppercase tracking-widest text-xs mb-4">Hours</h3>
                         <div className="space-y-2 text-sm text-brand-600">
                             <div className="flex justify-between"><span>Mon - Fri</span> <span>10:00 AM - 9:00 PM</span></div>
                             <div className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 9:00 PM</span></div>
                             <div className="flex justify-between text-brand-400"><span>Sunday</span> <span>11:00 AM - 8:00 PM</span></div>
                         </div>
                    </div>
                </div>

                {/* Services Column */}
                <div className="lg:col-span-2">
                     <h3 className="font-bold text-brand-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                         <Scissors className="w-4 h-4" /> Service Menu
                     </h3>
                     <div className="grid grid-cols-1 gap-4">
                        {selectedSalon.services?.map(service => (
                            <div key={service.id} className="group flex items-center justify-between p-6 bg-white rounded-2xl border border-brand-100 hover:border-brand-300 hover:shadow-lg transition-all cursor-pointer" onClick={() => handleBookService(service)}>
                                <div>
                                    <h4 className="font-serif text-lg text-brand-900 font-bold group-hover:text-brand-700 transition-colors">{service.name}</h4>
                                    <p className="text-sm text-brand-400 mt-1 flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> {service.duration}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="font-serif text-xl font-bold text-brand-900">₹{service.price}</span>
                                    <div className="w-10 h-10 rounded-full bg-brand-50 group-hover:bg-brand-900 group-hover:text-white flex items-center justify-center transition-colors">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
      );
  }

  // 1. List View (Default)
  return (
    <div className="border-t border-brand-200 bg-brand-50 p-8 min-h-[600px] mb-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h3 className="font-serif text-3xl text-brand-900 mb-3">Partner Salons in Bhubaneswar</h3>
            <p className="text-brand-500 max-w-lg mx-auto">Book appointments with top-rated luxury salons including Looks, Toni & Guy, and Jawed Habib.</p>
        </div>
        
        {salons.length === 0 && !loading && (
            <div className="text-center py-12">
                 <Button onClick={handleFindSalons} variant="primary" className="min-w-[200px] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                    <MapPin className="w-4 h-4 mr-2" />
                    Show Nearby Salons
                </Button>
            </div>
        )}

        {loading && (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-900 rounded-full animate-spin mb-4"></div>
                <span className="text-brand-500 text-sm font-bold uppercase tracking-widest">Locating salons in Bhubaneswar...</span>
            </div>
        )}

        {error && (
             <div className="text-center py-8">
                <div className="text-red-500 text-sm mb-4 bg-red-50 inline-block px-4 py-2 rounded-full">{error}</div>
                <div>
                    <Button onClick={handleFindSalons} variant="outline">Try Again</Button>
                </div>
            </div>
        )}

        {salons.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up pb-12">
                {salons.map((salon) => (
                    <div key={salon.id} onClick={() => handleViewSalon(salon)} className="group bg-white rounded-3xl overflow-hidden border border-brand-100 hover:border-brand-300 hover:shadow-xl transition-all cursor-pointer flex flex-col h-full">
                        {/* Card Image */}
                        <div className="h-48 overflow-hidden relative">
                             <img src={salon.imageUrl} alt={salon.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                {salon.rating?.toFixed(1)}
                             </div>
                             <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                {salon.distance} away
                             </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="mb-4">
                                <h4 className="font-serif font-bold text-brand-900 text-xl line-clamp-1 mb-1 group-hover:text-brand-600 transition-colors">{salon.title}</h4>
                                <p className="text-xs text-brand-400 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {salon.address}
                                </p>
                            </div>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-xs border-b border-brand-50 pb-2">
                                    <span className="text-brand-400 uppercase tracking-wider">Price Range</span>
                                    <span className="font-bold text-brand-700">{salon.priceRange}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs border-b border-brand-50 pb-2">
                                    <span className="text-brand-400 uppercase tracking-wider">Availability</span>
                                    <span className="font-bold text-green-600">{salon.availableSlots} slots today</span>
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-4 flex gap-3">
                                 <button className="flex-1 py-3 bg-brand-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest group-hover:bg-black transition-colors">
                                    Book Now
                                 </button>
                                 <a href={salon.uri} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="p-3 border border-brand-200 rounded-xl hover:bg-brand-50 text-brand-400 hover:text-brand-900 transition-colors">
                                    <ExternalLink className="w-4 h-4" />
                                 </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};