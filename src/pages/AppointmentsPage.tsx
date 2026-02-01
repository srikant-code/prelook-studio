import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  MapPin,
  Trash2,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Appointment } from "../types";
import { AppointmentsService } from "../services/appStorage";

export const AppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    duration: 30,
    location: "",
    notes: "",
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    setAppointments(AppointmentsService.getUpcoming());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    AppointmentsService.add({
      ...formData,
      status: "UPCOMING",
    });

    setFormData({
      title: "",
      date: "",
      time: "",
      duration: 30,
      location: "",
      notes: "",
    });
    setShowForm(false);
    loadAppointments(); // Reload appointments after adding
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this appointment?")) {
      AppointmentsService.delete(id);
      loadAppointments();
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-bold text-brand-900 mb-2">
              Appointments
            </h1>
            <p className="text-brand-600">
              Manage your upcoming salon appointments
            </p>
          </div>

          <Button variant="primary" onClick={() => setShowForm(!showForm)}>
            <Plus className="w-5 h-5" />
            Add Appointment
          </Button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-6 mb-6 border border-brand-200 shadow-lg">
            <h3 className="font-bold text-brand-900 mb-4">New Appointment</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none"
                  placeholder="Haircut at Salon XYZ"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-4 py-2 rounded-lg border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none"
                  placeholder="Salon address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg border border-brand-200 focus:border-brand-900 focus:ring-0 outline-none"
                  rows={3}
                  placeholder="Special requests, preferred stylist, etc."
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" variant="primary">
                  <Check className="w-4 h-4" />
                  Save Appointment
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border border-brand-200">
              <div className="flex flex-col items-center text-center">
                <CalendarIcon className="w-16 h-16 text-brand-300 mb-4" />
                <h3 className="font-bold text-xl text-brand-900 mb-2 leading-relaxed">
                  No upcoming appointments
                </h3>
                <p className="text-brand-600 mb-6 leading-relaxed">
                  Schedule your next salon visit
                </p>
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4" />
                  Add Your First Appointment
                </Button>
              </div>
            </div>
          ) : (
            appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-6 border border-brand-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-brand-900 mb-2">
                      {apt.title}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-brand-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(apt.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {apt.time} ({apt.duration}min)
                      </div>

                      {apt.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {apt.location}
                        </div>
                      )}
                    </div>

                    {apt.notes && (
                      <p className="text-sm text-brand-500 mt-3 italic">
                        {apt.notes}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
