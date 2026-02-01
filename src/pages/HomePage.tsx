import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Scissors,
  Sparkles,
  Clock,
  Shield,
  Zap,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "../components/ui/Button";

interface HomePageProps {
  onGetStarted?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted(); // Show login modal
    } else {
      navigate("/studio"); // Fallback if already logged in
    }
  };

  const features = [
    {
      icon: Zap,
      title: "Instant Preview",
      description:
        "See your new hairstyle in seconds with AI-powered generation",
    },
    {
      icon: Shield,
      title: "Risk-Free",
      description: "Try before you commit - no scissors required",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Skip the guesswork and find your perfect style faster",
    },
  ];

  const stats = [
    { label: "Happy Users", value: "10,000+", icon: Users },
    { label: "Styles Generated", value: "50,000+", icon: Scissors },
    { label: "Satisfaction Rate", value: "98%", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-900/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-brand-900" />
            <span className="text-sm font-bold text-brand-900">
              AI-Powered Hair Transformation
            </span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-brand-900 mb-6">
            See Your Perfect
            <span className="block text-brand-700">Hairstyle Before</span>
            <span className="block text-brand-900">You Cut</span>
          </h1>

          <p className="text-xl text-brand-600 mb-8 max-w-2xl mx-auto">
            Transform your look with confidence. Upload your photo and instantly
            visualize hundreds of hairstyles before making any commitment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleGetStarted}
              className="w-full sm:w-auto shadow-xl"
            >
              <Scissors className="w-5 h-5" />
              Try Virtual Studio
              <ArrowRight className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/pricing")}
              className="w-full sm:w-auto"
            >
              View Pricing
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-16 max-w-3xl mx-auto">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-100 rounded-xl mb-3">
                  <stat.icon className="w-6 h-6 text-brand-900" />
                </div>
                <div className="font-serif text-3xl md:text-4xl font-bold text-brand-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-brand-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold text-brand-900 mb-4">
              Why Choose Prelook Studio?
            </h2>
            <p className="text-lg text-brand-600 max-w-2xl mx-auto">
              Professional-grade virtual hairstyling powered by cutting-edge AI
              technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-brand-50 p-8 rounded-3xl border border-brand-100 hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="w-14 h-14 bg-brand-900 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-brand-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-brand-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-relaxed">
              Ready to Transform Your Look?
            </h2>
            <p className="text-xl text-brand-200 mb-8 leading-relaxed">
              Join thousands of users who found their perfect hairstyle with
              Prelook Studio
            </p>

            <Button
              variant="primary"
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-brand-900 hover:bg-brand-50 shadow-2xl"
            >
              <Sparkles className="w-5 h-5" />
              Start Your Transformation
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
