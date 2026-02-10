import React, { useState, useEffect } from 'react';
import { Heart, Activity, Droplets, Thermometer, Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HealthMetric } from '../types';
import { format } from 'date-fns';

export const HealthMetrics: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    weight: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    bloodSugar: '',
    temperature: '',
  });

  useEffect(() => {
    loadMetrics();
  }, [user]);

  const loadMetrics = () => {
    const stored = localStorage.getItem(`healthMetrics_${user?.id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setMetrics(parsed.map((m: any) => ({ ...m, date: new Date(m.date) })));
    }
  };

  const saveMetric = () => {
    const newMetric: HealthMetric = {
      id: Date.now().toString(),
      userId: user?.id || '',
      date: new Date(),
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      bloodPressureSystolic: formData.bloodPressureSystolic
        ? parseInt(formData.bloodPressureSystolic)
        : undefined,
      bloodPressureDiastolic: formData.bloodPressureDiastolic
        ? parseInt(formData.bloodPressureDiastolic)
        : undefined,
      heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
      bloodSugar: formData.bloodSugar ? parseFloat(formData.bloodSugar) : undefined,
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
    };

    const updated = [newMetric, ...metrics];
    setMetrics(updated);
    localStorage.setItem(`healthMetrics_${user?.id}`, JSON.stringify(updated));

    setFormData({
      weight: '',
      bloodPressureSystolic: '',
      bloodPressureDiastolic: '',
      heartRate: '',
      bloodSugar: '',
      temperature: '',
    });
    setShowForm(false);
  };

  const latestMetric = metrics[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Health Metrics</h2>
          <p className="text-gray-600 mt-1">Track and monitor your vital health indicators</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Add New Reading
        </button>
      </div>

      {/* Latest Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          icon={Activity}
          title="Weight"
          value={latestMetric?.weight ? `${latestMetric.weight} kg` : 'No data'}
          color="from-blue-500 to-cyan-500"
        />
        <MetricCard
          icon={Heart}
          title="Blood Pressure"
          value={
            latestMetric?.bloodPressureSystolic
              ? `${latestMetric.bloodPressureSystolic}/${latestMetric.bloodPressureDiastolic} mmHg`
              : 'No data'
          }
          color="from-red-500 to-pink-500"
        />
        <MetricCard
          icon={Heart}
          title="Heart Rate"
          value={latestMetric?.heartRate ? `${latestMetric.heartRate} bpm` : 'No data'}
          color="from-purple-500 to-violet-500"
        />
        <MetricCard
          icon={Droplets}
          title="Blood Sugar"
          value={latestMetric?.bloodSugar ? `${latestMetric.bloodSugar} mg/dL` : 'No data'}
          color="from-orange-500 to-red-500"
        />
        <MetricCard
          icon={Thermometer}
          title="Temperature"
          value={latestMetric?.temperature ? `${latestMetric.temperature} °C` : 'No data'}
          color="from-green-500 to-emerald-500"
        />
        <MetricCard
          icon={TrendingUp}
          title="Total Records"
          value={metrics.length.toString()}
          color="from-indigo-500 to-purple-500"
        />
      </div>

      {/* Add Metric Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="70.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                value={formData.heartRate}
                onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="72"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Pressure - Systolic (mmHg)
              </label>
              <input
                type="number"
                value={formData.bloodPressureSystolic}
                onChange={(e) =>
                  setFormData({ ...formData, bloodPressureSystolic: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="120"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Pressure - Diastolic (mmHg)
              </label>
              <input
                type="number"
                value={formData.bloodPressureDiastolic}
                onChange={(e) =>
                  setFormData({ ...formData, bloodPressureDiastolic: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Sugar (mg/dL)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.bloodSugar}
                onChange={(e) => setFormData({ ...formData, bloodSugar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Temperature (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="36.6"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={saveMetric}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Save Reading
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

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">History</h3>
        <div className="space-y-3">
          {metrics.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No health metrics recorded yet. Add your first reading!
            </p>
          ) : (
            metrics.map((metric) => (
              <div
                key={metric.id}
                className="flex flex-wrap items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-[200px]">
                  <p className="font-semibold text-gray-900">
                    {format(metric.date, 'PPP')}
                  </p>
                  <p className="text-sm text-gray-600">{format(metric.date, 'p')}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {metric.weight && (
                    <div className="text-sm">
                      <span className="text-gray-600">Weight: </span>
                      <span className="font-semibold">{metric.weight} kg</span>
                    </div>
                  )}
                  {metric.heartRate && (
                    <div className="text-sm">
                      <span className="text-gray-600">HR: </span>
                      <span className="font-semibold">{metric.heartRate} bpm</span>
                    </div>
                  )}
                  {metric.bloodPressureSystolic && (
                    <div className="text-sm">
                      <span className="text-gray-600">BP: </span>
                      <span className="font-semibold">
                        {metric.bloodPressureSystolic}/{metric.bloodPressureDiastolic}
                      </span>
                    </div>
                  )}
                  {metric.bloodSugar && (
                    <div className="text-sm">
                      <span className="text-gray-600">Sugar: </span>
                      <span className="font-semibold">{metric.bloodSugar} mg/dL</span>
                    </div>
                  )}
                  {metric.temperature && (
                    <div className="text-sm">
                      <span className="text-gray-600">Temp: </span>
                      <span className="font-semibold">{metric.temperature} °C</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: string;
  color: string;
}> = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className={`bg-gradient-to-br ${color} p-3 rounded-lg w-fit mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <p className="text-gray-600 text-sm">{title}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);
