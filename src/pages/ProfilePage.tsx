import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Camera,
  CreditCard,
  Calendar,
  History as HistoryIcon,
  ArrowLeft,
} from "lucide-react";
import { User as UserType } from "../types";
import { StorageService } from "../../services/storage";
import {
  AppointmentsService,
  GenerationHistoryService,
} from "../services/appStorage";

interface ProfilePageProps {
  user: UserType;
  onUpdateUser: (user: UserType) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  user,
  onUpdateUser,
}) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    avatar: user.avatar || "",
  });

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    onUpdateUser(updatedUser);
    StorageService.saveUser(updatedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      avatar: user.avatar || "",
    });
    setIsEditing(false);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "ULTIMATE":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "PRO":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white";
    }
  };

  const getTierBenefits = (tier: string) => {
    switch (tier) {
      case "ULTIMATE":
        return [
          "Unlimited generations",
          "Priority support",
          "Advanced features",
          "50% off premium",
        ];
      case "PRO":
        return [
          "50 credits/month",
          "Priority processing",
          "Premium styles",
          "20% off premium",
        ];
      default:
        return ["5 credits/month", "Basic styles", "Standard processing"];
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium">Back</span>
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <img
                  src={formData.avatar || user.avatar}
                  alt={user.name}
                  className="w-32 h-32 rounded-full border-4 border-brand-200 object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 bg-brand-500 text-white rounded-full hover:bg-brand-600 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                {user.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {user.role === "PARTNER" ? "Salon Partner" : "Customer"}
              </p>
            </div>

            {/* Membership Tier */}
            <div className={`rounded-xl p-4 mb-4 ${getTierColor(user.tier)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium opacity-90">
                  Membership
                </span>
                <CreditCard className="w-4 h-4 opacity-90" />
              </div>
              <h3 className="text-2xl font-bold">{user.tier}</h3>
            </div>

            {/* Credits */}
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-brand-600 font-medium">
                    Available Credits
                  </p>
                  <p className="text-3xl font-bold text-brand-700">
                    {user.credits}
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-brand-400" />
              </div>
              <button
                onClick={() => navigate("/pricing")}
                className="w-full mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium text-sm"
              >
                Top Up Credits
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Contact Information
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors font-medium text-sm"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {user.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {user.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-400 focus:border-brand-400 outline-none"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                    {user.phone || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Membership Benefits */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Membership Benefits
            </h3>
            <ul className="space-y-3">
              {getTierBenefits(user.tier).map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
            {user.tier === "FREE" && (
              <button
                onClick={() => navigate("/pricing")}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all font-semibold"
              >
                Upgrade Membership
              </button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600">Appointments</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {AppointmentsService.getUpcoming().length}
              </p>
              <button
                onClick={() => navigate("/appointments")}
                className="text-sm text-brand-600 hover:text-brand-700 mt-2 font-medium"
              >
                View all →
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <HistoryIcon className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-gray-600">Generations</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {GenerationHistoryService.getAll().length}
              </p>
              <button
                onClick={() => navigate("/history")}
                className="text-sm text-brand-600 hover:text-brand-700 mt-2 font-medium"
              >
                View history →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
