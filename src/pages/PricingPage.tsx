import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  X,
  Zap,
  Star,
  ArrowRight,
  Clock,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { SubscriptionTier, User } from "../types";
import { CreditService, PlanService } from "../services/appStorage";
import { APP_CONFIG } from "../config/app.config";

interface PricingPageProps {
  currentUser?: User;
}

export const PricingPage: React.FC<PricingPageProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Get or initialize user's timer
  useEffect(() => {
    const userTimerKey = currentUser
      ? `timer_${currentUser.email}`
      : "timer_guest";
    let timerEnd = localStorage.getItem(userTimerKey);

    if (!timerEnd) {
      // Create timer for this user (72 hours from now)
      const endTime = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
      localStorage.setItem(userTimerKey, endTime);
      timerEnd = endTime;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(timerEnd!).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("EXPIRED");
        clearInterval(timer);
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentUser]);

  // Pricing with incremental discounts
  // PRO: 20% off -> ₹99 final (original ₹123.75)
  // ULTIMATE: 50% off -> ₹149 final (original ₹298)
  const plans = [
    {
      tier: "FREE" as SubscriptionTier,
      name: "Free Trial",
      originalPrice: 0,
      finalPrice: 0,
      discountPercent: 0,
      credits: 10,
      features: [
        { text: "10 AI generations", included: true },
        { text: "Basic hairstyles", included: true },
        { text: "Front view only", included: true },
        { text: "Community support", included: true },
        { text: "All hairstyle library", included: false },
        { text: "Multi-angle views", included: false },
        { text: "Priority support", included: false },
        { text: "Download high-res", included: false },
        { text: "Custom colors", included: false },
        { text: "Salon finder integration", included: false },
        { text: "Appointment booking", included: false },
        { text: "VIP support", included: false },
        { text: "Early access features", included: false },
      ],
      popular: false,
    },
    {
      tier: "PRO" as SubscriptionTier,
      name: "Pro",
      originalPrice: 124, // Calculated backwards: 99 / (1 - 0.20) = 123.75 ≈ 124
      finalPrice: 99,
      discountPercent: 20,
      credits: 100,
      features: [
        { text: "100 AI generations", included: true },
        { text: "Basic hairstyles", included: true },
        { text: "Front view only", included: true },
        { text: "Community support", included: true },
        { text: "All hairstyle library", included: true },
        { text: "Multi-angle views", included: true },
        { text: "Priority support", included: true },
        { text: "Download high-res", included: true },
        { text: "Custom colors", included: true },
        { text: "Salon finder integration", included: false },
        { text: "Appointment booking", included: false },
        { text: "VIP support", included: false },
        { text: "Early access features", included: false },
      ],
      popular: true,
    },
    {
      tier: "ULTIMATE" as SubscriptionTier,
      name: "Ultimate",
      originalPrice: 298, // Calculated backwards: 149 / (1 - 0.50) = 298
      finalPrice: 149,
      discountPercent: 50,
      credits: 500,
      features: [
        { text: "500 AI generations", included: true },
        { text: "Basic hairstyles", included: true },
        { text: "Front view only", included: true },
        { text: "Community support", included: true },
        { text: "All hairstyle library", included: true },
        { text: "Multi-angle views", included: true },
        { text: "Priority support", included: true },
        { text: "Download high-res", included: true },
        { text: "Custom colors", included: true },
        { text: "Salon finder integration", included: true },
        { text: "Appointment booking", included: true },
        { text: "VIP support", included: true },
        { text: "Early access features", included: true },
      ],
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "How do credits work?",
      answer:
        "Each image generation uses 1 credit. Multi-angle views use 4 credits (one per angle). Credits never expire and roll over.",
    },
    {
      question: "Can I change my plan later?",
      answer:
        "Yes! You can upgrade or downgrade anytime. Changes take effect immediately, and you keep unused credits.",
    },
    {
      question: "What if I run out of credits?",
      answer:
        "You can top up credits anytime or upgrade to a higher tier. We'll never charge without your permission.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "14-day money-back guarantee, no questions asked. Just contact support if you're not satisfied.",
    },
    {
      question: "How accurate are the AI generations?",
      answer:
        "Our AI is trained on millions of hairstyle images with 95%+ accuracy. Results may vary based on photo quality.",
    },
  ];

  const handleSelectPlan = (tier: SubscriptionTier) => {
    if (currentUser) {
      // Save plan change to localStorage silently
      PlanService.requestPlanChange(currentUser.tier, tier);
    } else {
      navigate("/studio");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-brand-900 mb-4 leading-relaxed">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-brand-600 max-w-2xl mx-auto leading-relaxed">
            Start free, upgrade anytime. No contracts, cancel whenever you want.
          </p>
        </div>

        {/* Discount Banner */}
        {timeLeft !== "EXPIRED" && (
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl p-6 mb-12 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8" />
                <div>
                  <div className="font-bold text-2xl mb-1 leading-relaxed">
                    Limited Time Launch Special!
                  </div>
                  <div className="text-sm opacity-90 leading-relaxed">
                    Get up to 50% OFF on premium plans
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-6 py-3 rounded-xl backdrop-blur">
                <Clock className="w-5 h-5" />
                <div className="font-mono text-xl font-bold">{timeLeft}</div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const isCurrentPlan = currentUser?.tier === plan.tier;

            return (
              <div
                key={plan.tier}
                className={`relative bg-white rounded-3xl p-8 border-2 transition-all hover:scale-105 hover:shadow-2xl flex flex-col
                  ${
                    plan.popular
                      ? "border-brand-900 shadow-xl"
                      : "border-brand-200"
                  }
                  ${isCurrentPlan ? "ring-4 ring-brand-300" : ""}
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-900 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Star className="w-4 h-4" fill="currentColor" />
                    MOST POPULAR
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    CURRENT PLAN
                  </div>
                )}

                {plan.discountPercent > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {plan.discountPercent}% OFF
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-serif text-2xl font-bold text-brand-900 mb-2 leading-relaxed">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    {plan.discountPercent > 0 && (
                      <span className="text-2xl text-brand-400 line-through">
                        ₹{plan.originalPrice}
                      </span>
                    )}
                    <span className="text-5xl font-bold text-brand-900">
                      ₹{plan.finalPrice}
                    </span>
                    <span className="text-brand-500">/month</span>
                  </div>
                  <div className="text-sm text-brand-600 mt-2 leading-relaxed">
                    {plan.credits} credits included
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`leading-relaxed ${feature.included ? "text-brand-700" : "text-brand-400 line-through"}`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Button
                    variant={plan.popular ? "primary" : "outline"}
                    size="lg"
                    onClick={() => handleSelectPlan(plan.tier)}
                    disabled={isCurrentPlan}
                    className="w-full"
                  >
                    {isCurrentPlan ? "Current Plan" : "Get Started"}
                    {!isCurrentPlan && <ArrowRight className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-brand-900 text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-brand-200 overflow-hidden hover:shadow-lg transition-all"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === idx ? null : idx)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-500 shrink-0 mt-1" />
                    <span className="font-bold text-brand-900 leading-relaxed">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-500 transition-transform ${
                      expandedFaq === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFaq === idx && (
                  <div className="px-6 pb-6 text-brand-600 animate-slide-up leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 bg-brand-50 rounded-3xl border border-brand-200">
          <div className="flex flex-col items-center text-center">
            <h3 className="font-serif text-3xl font-bold text-brand-900 mb-4 leading-relaxed">
              Still not sure? Start free!
            </h3>
            <p className="text-brand-600 mb-6 max-w-xl leading-relaxed">
              Try Prelook Studio risk-free with 10 free generations. No credit
              card required.
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate("/studio")}
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
