import React, { useState, useEffect } from 'react';
import { Activity as ActivityIcon, Plus, Trash2, Timer, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Activity } from '../types';
import { format } from 'date-fns';

export const ActivityLogger: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    duration: '',
    calories: '',
    notes: '',
  });

  const activityTypes = [
    { name: 'Running', caloriesPerMin: 10 },
    { name: 'Walking', caloriesPerMin: 4 },
    { name: 'Cycling', caloriesPerMin: 8 },
    { name: 'Swimming', caloriesPerMin: 11 },
    { name: 'Yoga', caloriesPerMin: 3 },
    { name: 'Gym Workout', caloriesPerMin: 7 },
    { name: 'Dancing', caloriesPerMin: 6 },
    { name: 'Sports', caloriesPerMin: 8 },
  ];

  useEffect(() => {
    loadActivities();
  }, [user]);

  const loadActivities = () => {
    const stored = localStorage.getItem(`activities_${user?.id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setActivities(parsed.map((a: any) => ({ ...a, date: new Date(a.date) })));
    }
  };

  const saveActivity = () => {
    if (!formData.type || !formData.duration) return;

    const selectedType = activityTypes.find((t) => t.name === formData.type);
    const duration = parseInt(formData.duration);
    const estimatedCalories = selectedType
      ? selectedType.caloriesPerMin * duration
      : parseInt(formData.calories) || 0;

    const newActivity: Activity = {
      id: Date.now().toString(),
      userId: user?.id || '',
      date: new Date(),
      type: formData.type,
      duration,
      calories: parseInt(formData.calories) || estimatedCalories,
      notes: formData.notes,
    };

    const updated = [newActivity, ...activities];
    setActivities(updated);
    localStorage.setItem(`activities_${user?.id}`, JSON.stringify(updated));

    setFormData({ type: '', duration: '', calories: '', notes: '' });
    setShowForm(false);
  };

  const deleteActivity = (activityId: string) => {
    const updated = activities.filter((a) => a.id !== activityId);
    setActivities(updated);
    localStorage.setItem(`activities_${user?.id}`, JSON.stringify(updated));
  };

  const totalMinutesToday = activities
    .filter((a) => format(a.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
    .reduce((sum, a) => sum + a.duration, 0);

  const totalCaloriesToday = activities
    .filter((a) => format(a.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
    .reduce((sum, a) => sum + (a.calories || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Activity Logger</h2>
          <p className="text-gray-600 mt-1">Track your exercises and daily activities</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Log Activity
        </button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Timer className="w-8 h-8" />
            <span className="text-sm opacity-90">Today</span>
          </div>
          <p className="text-4xl font-bold">{totalMinutesToday} min</p>
          <p className="text-sm opacity-90 mt-1">Total Duration</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-8 h-8" />
            <span className="text-sm opacity-90">Today</span>
          </div>
          <p className="text-4xl font-bold">{totalCaloriesToday}</p>
          <p className="text-sm opacity-90 mt-1">Calories Burned</p>
        </div>
      </div>

      {/* Add Activity Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Log New Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Select activity</option>
                {activityTypes.map((type) => (
                  <option key={type.name} value={type.name}>
                    {type.name}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories Burned (optional)
              </label>
              <input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Auto-calculated"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Felt great!"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={saveActivity}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Save Activity
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

      {/* Activity History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Activity History</h3>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <ActivityIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No activities logged yet. Start tracking!</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-lg">
                    <ActivityIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{activity.type}</h4>
                    <p className="text-sm text-gray-600">
                      {format(activity.date, 'PPP')} at {format(activity.date, 'p')}
                    </p>
                    {activity.notes && (
                      <p className="text-sm text-gray-500 italic mt-1">{activity.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Timer className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{activity.duration} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold">{activity.calories || 0} cal</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
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
