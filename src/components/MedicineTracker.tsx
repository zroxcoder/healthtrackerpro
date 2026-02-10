import React, { useState, useEffect } from 'react';
import { Pill, Plus, Check, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Medicine } from '../types';
import { format } from 'date-fns';

export const MedicineTracker: React.FC = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    loadMedicines();
  }, [user]);

  const loadMedicines = () => {
    const stored = localStorage.getItem(`medicines_${user?.id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setMedicines(
        parsed.map((m: any) => ({
          ...m,
          startDate: new Date(m.startDate),
          endDate: m.endDate ? new Date(m.endDate) : undefined,
        }))
      );
    }
  };

  const saveMedicine = () => {
    if (!formData.name || !formData.dosage || !formData.frequency) return;

    const newMedicine: Medicine = {
      id: Date.now().toString(),
      userId: user?.id || '',
      name: formData.name,
      dosage: formData.dosage,
      frequency: formData.frequency,
      time: formData.time.split(',').map((t) => t.trim()),
      startDate: new Date(),
      notes: formData.notes,
      taken: [],
    };

    const updated = [...medicines, newMedicine];
    setMedicines(updated);
    localStorage.setItem(`medicines_${user?.id}`, JSON.stringify(updated));

    setFormData({ name: '', dosage: '', frequency: '', time: '', notes: '' });
    setShowForm(false);
  };

  const markAsTaken = (medicineId: string) => {
    const updated = medicines.map((med) => {
      if (med.id === medicineId) {
        return {
          ...med,
          taken: [
            ...med.taken,
            {
              date: format(new Date(), 'yyyy-MM-dd'),
              time: format(new Date(), 'HH:mm'),
            },
          ],
        };
      }
      return med;
    });
    setMedicines(updated);
    localStorage.setItem(`medicines_${user?.id}`, JSON.stringify(updated));
  };

  const deleteMedicine = (medicineId: string) => {
    const updated = medicines.filter((med) => med.id !== medicineId);
    setMedicines(updated);
    localStorage.setItem(`medicines_${user?.id}`, JSON.stringify(updated));
  };

  const isTakenToday = (medicine: Medicine) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return medicine.taken.some((t) => t.date === today);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Medicine Tracker</h2>
          <p className="text-gray-600 mt-1">Never miss a dose with smart reminders</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Medicine
        </button>
      </div>

      {/* Add Medicine Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Medicine</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicine Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Aspirin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage *
              </label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="100mg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency *
              </label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Every 4 hours">Every 4 hours</option>
                <option value="Every 6 hours">Every 6 hours</option>
                <option value="As needed">As needed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time(s) (comma separated)
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="09:00, 21:00"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                rows={3}
                placeholder="Take with food..."
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={saveMedicine}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Save Medicine
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

      {/* Medicine List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medicines.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No medicines added yet. Add your first one!</p>
          </div>
        ) : (
          medicines.map((medicine) => (
            <div
              key={medicine.id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{medicine.name}</h3>
                    <p className="text-sm text-gray-600">{medicine.dosage}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMedicine(medicine.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{medicine.frequency}</span>
                </div>
                {medicine.time.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {medicine.time.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {medicine.notes && (
                  <p className="text-sm text-gray-600 italic">{medicine.notes}</p>
                )}
              </div>

              <button
                onClick={() => markAsTaken(medicine.id)}
                disabled={isTakenToday(medicine)}
                className={`w-full py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  isTakenToday(medicine)
                    ? 'bg-green-50 text-green-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                }`}
              >
                {isTakenToday(medicine) ? (
                  <>
                    <Check className="w-4 h-4" />
                    Taken Today
                  </>
                ) : (
                  'Mark as Taken'
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
