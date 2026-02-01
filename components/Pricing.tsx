import React from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { SubscriptionTier } from '../types';

interface PricingProps {
  onSelectTier: (tier: SubscriptionTier) => void;
  currentTier: SubscriptionTier;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectTier, currentTier }) => {
  const tiers = [
    {
      id: 'FREE' as SubscriptionTier,
      name: 'Starter',
      price: 'Free',
      icon: Star,
      features: ['1 Free Generation (4 Images)', 'Basic Styles', 'Standard Quality'],
      color: 'bg-brand-100',
      btnColor: 'bg-brand-800'
    },
    {
      id: 'PRO' as SubscriptionTier,
      name: 'Professional',
      price: '₹99',
      icon: Zap,
      features: ['10 Generations', 'Access All Styles', 'Priority Processing', 'HD Downloads'],
      popular: true,
      color: 'bg-brand-900 text-white',
      btnColor: 'bg-white text-brand-900'
    },
    {
      id: 'ULTIMATE' as SubscriptionTier,
      name: 'Ultimate',
      price: '₹169',
      icon: Crown,
      features: ['50 Generations', 'Commercial License', 'Priority Support', 'Strand Color Meter'],
      color: 'bg-accent text-white',
      btnColor: 'bg-white text-accent'
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-brand-50">
      <div className="text-center mb-10">
        <h2 className="font-serif text-4xl text-brand-900 mb-2">Upgrade Your Studio</h2>
        <p className="text-brand-500">Choose a plan to continue generating professional looks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          return (
            <div 
              key={tier.id}
              className={`relative rounded-3xl p-8 flex flex-col shadow-xl transition-transform hover:-translate-y-2 border border-brand-200 ${tier.color}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-xl bg-white/10`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg uppercase tracking-wider">{tier.name}</h3>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-serif font-bold">{tier.price}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm font-medium opacity-90">
                      <Check className="w-4 h-4" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onSelectTier(tier.id)}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 ${tier.btnColor}`}
              >
                {currentTier === tier.id ? 'Current Plan' : `Get ${tier.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};