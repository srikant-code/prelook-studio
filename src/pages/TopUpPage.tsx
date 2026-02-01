import React, { useState } from "react";
import { CreditCard, Zap, Check, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { CreditService } from "../services/appStorage";
import { useNavigate } from "react-router-dom";

export const TopUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    { id: "small", credits: 25, price: 9, popular: false },
    { id: "medium", credits: 100, price: 29, popular: true, bonus: 10 },
    { id: "large", credits: 250, price: 59, popular: false, bonus: 50 },
    { id: "mega", credits: 500, price: 99, popular: false, bonus: 150 },
  ];

  const handlePurchase = () => {
    if (!selectedPackage) return;

    const pkg = packages.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    // Simulate purchase
    const totalCredits = pkg.credits + (pkg.bonus || 0);
    CreditService.addCredits(
      totalCredits,
      `Credit top-up: ${pkg.credits} credits + ${pkg.bonus || 0} bonus`,
    );

    alert(`Success! ${totalCredits} credits added to your account.`);
    navigate("/studio");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-5xl font-bold text-brand-900 mb-4">
            Top Up Credits
          </h1>
          <p className="text-xl text-brand-600">
            Get more credits to continue creating amazing hairstyles
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative bg-white rounded-3xl p-8 border-2 cursor-pointer transition-all hover:scale-105
                ${
                  selectedPackage === pkg.id
                    ? "border-brand-900 shadow-2xl"
                    : "border-brand-200 hover:border-brand-400"
                }
                ${pkg.popular ? "ring-4 ring-brand-300" : ""}
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-900 text-white px-4 py-1 rounded-full text-sm font-bold">
                  BEST VALUE
                </div>
              )}

              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="font-serif text-3xl font-bold text-brand-900 mb-2">
                    {pkg.credits} Credits
                  </div>
                  {pkg.bonus && (
                    <div className="text-sm text-green-600 font-bold">
                      + {pkg.bonus} Bonus Credits!
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-brand-900">
                    ${pkg.price}
                  </div>
                  <div className="text-xs text-brand-500">
                    ${(pkg.price / (pkg.credits + (pkg.bonus || 0))).toFixed(2)}
                    /credit
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center h-12">
                {selectedPackage === pkg.id && (
                  <div className="flex items-center gap-2 text-brand-900 font-bold">
                    <Check className="w-5 h-5" />
                    Selected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedPackage && (
          <div className="bg-white rounded-2xl p-8 border border-brand-200 shadow-lg">
            <h3 className="font-bold text-brand-900 mb-4">Payment</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-2">
                    Expiry
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={handlePurchase}
              className="w-full shadow-xl"
            >
              <CreditCard className="w-5 h-5" />
              Complete Purchase
              <ArrowRight className="w-5 h-5" />
            </Button>

            <p className="text-xs text-center text-brand-500 mt-4">
              🔒 Secure payment powered by Stripe. This is a demo - no real
              charges.
            </p>
          </div>
        )}

        <div className="mt-8 bg-brand-50 rounded-2xl p-6 border border-brand-200">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-brand-900 shrink-0" />
            <div>
              <h4 className="font-bold text-brand-900 mb-2">Why Top Up?</h4>
              <ul className="text-sm text-brand-600 space-y-1">
                <li>✓ Credits never expire</li>
                <li>✓ Use them whenever you want</li>
                <li>✓ Bigger packages = better value</li>
                <li>✓ Instant activation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
