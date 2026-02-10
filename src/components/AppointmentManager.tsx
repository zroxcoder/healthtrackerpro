import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';
import { format } from 'date-fns';

export const AppointmentManager: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const loadAppointments = () => {
    const stored = localStorage.getItem(`appointments_${user?.id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setAppointments(
        parsed
          .map((a: any) => ({ ...a, date: new Date(a.date) }))
          .sort((a: Appointment, b: Appointment) => a.date.getTime() - b.date.getTime())
      );
    }
  };

  const saveAppointment = () => {
    if (!formData.doctorName || !formData.date || !formData.time) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      userId: user?.id || '',
      doctorName: formData.doctorName,
      specialty: formData.specialty,
      date: new Date(formData.date),
      time: formData.time,
      location: formData.location,
      notes: formData.notes,
    };

    const updated = [...appointments, newAppointment].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    setAppointments(updated);
    localStorage.setItem(`appointments_${user?.id}`, JSON.stringify(updated));

    setFormData({
      doctorName: '',
      specialty: '',
      date: '',
      time: '',
      location: '',
      notes: '',
    });
    setShowForm(false);
  };

  const deleteAppointment = (appointmentId: string) => {
    const updated = appointments.filter((a) => a.id !== appointmentId);
    setAppointments(updated);
    localStorage.setItem(`appointments_${user?.id}`, JSON.stringify(updated));
  };

  const upcomingAppointments = appointments.filter((a) => a.date >= new Date());
  const pastAppointments = appointments.filter((a) => a.date < new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Appointments</h2>
          <p className="text-gray-600 mt-1">Manage your doctor appointments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Appointment
        </button>
      </div>

      {/* Add Appointment Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Schedule New Appointment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor Name *
              </label>
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Dr. Smith"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialty
              </label>
              <input
                type="text"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Cardiologist"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="City Hospital, Room 301"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
                placeholder="Bring previous reports..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={saveAppointment}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Save Appointment
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Upcoming Appointments ({upcomingAppointments.length})
        </h3>
        <div className="space-y-3">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onDelete={deleteAppointment}
                isUpcoming
              />
            ))
          )}
        </div>
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Past Appointments ({pastAppointments.length})
          </h3>
          <div className="space-y-3">
            {pastAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onDelete={deleteAppointment}
                isUpcoming={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AppointmentCard: React.FC<{
  appointment: Appointment;
  onDelete: (id: string) => void;
  isUpcoming: boolean;
}> = ({ appointment, onDelete, isUpcoming }) => (
  <div
    className={`p-4 border-2 rounded-lg hover:shadow-md transition-all ${
      isUpcoming
        ? 'border-blue-200 bg-blue-50'
        : 'border-gray-200 bg-gray-50 opacity-75'
    }`}
  >
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="space-y-3 flex-1">
        <div className="flex items-start gap-3">
          <div
            className={`p-3 rounded-lg ${
              isUpcoming
                ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                : 'bg-gray-400'
            }`}
          >
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{appointment.doctorName}</h4>
            {appointment.specialty && (
              <p className="text-sm text-gray-600">{appointment.specialty}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4" />
            <span>{format(appointment.date, 'PPP')}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4" />
            <span>{appointment.time}</span>
          </div>
          {appointment.location && (
            <div className="flex items-center gap-2 text-gray-700 sm:col-span-2">
              <MapPin className="w-4 h-4" />
              <span>{appointment.location}</span>
            </div>
          )}
        </div>

        {appointment.notes && (
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 italic">{appointment.notes}</p>
          </div>
        )}
      </div>

      <button
        onClick={() => onDelete(appointment.id)}
        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors self-start"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </div>
);
