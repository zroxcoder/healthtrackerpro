import React, { useState } from 'react';
import {
  Activity,
  Droplet,
  Pill,
  Heart,
  Calendar,
  TrendingUp,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { HealthMetrics } from './HealthMetrics';
import { MedicineTracker } from './MedicineTracker';
import { WaterTracker } from './WaterTracker';
import { ActivityLogger } from './ActivityLogger';
import { AppointmentManager } from './AppointmentManager';
import { Profile } from './Profile';

type Tab = 'overview' | 'metrics' | 'medicine' | 'water' | 'activity' | 'appointments' | 'profile';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'overview' as Tab, label: 'Overview', icon: TrendingUp },
    { id: 'metrics' as Tab, label: 'Health Metrics', icon: Heart },
    { id: 'medicine' as Tab, label: 'Medicines', icon: Pill },
    { id: 'water' as Tab, label: 'Water Intake', icon: Droplet },
    { id: 'activity' as Tab, label: 'Activities', icon: Activity },
    { id: 'appointments' as Tab, label: 'Appointments', icon: Calendar },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">HealthTracker</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Logo - Desktop */}
            <div className="hidden lg:flex items-center gap-3 p-6 border-b border-gray-200">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HealthTracker</h1>
                <p className="text-xs text-gray-600">Pro Version</p>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'metrics' && <HealthMetrics />}
          {activeTab === 'medicine' && <MedicineTracker />}
          {activeTab === 'water' && <WaterTracker />}
          {activeTab === 'activity' && <ActivityLogger />}
          {activeTab === 'appointments' && <AppointmentManager />}
          {activeTab === 'profile' && <Profile />}
        </main>
      </div>
    </div>
  );
};

const Overview: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h2>
        <p className="text-gray-600 mt-1">Here's your health summary for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Heart}
          title="Heart Rate"
          value="72 bpm"
          change="+2%"
          color="from-red-500 to-pink-500"
        />
        <StatCard
          icon={Droplet}
          title="Water Intake"
          value="6/8 glasses"
          change="75%"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Activity}
          title="Activity"
          value="45 min"
          change="+15%"
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={Pill}
          title="Medicines"
          value="2/3 taken"
          change="67%"
          color="from-purple-500 to-violet-500"
        />
      </div>

      {/* Features Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard
            icon={Heart}
            title="Health Metrics Tracking"
            description="Monitor blood pressure, heart rate, weight, and more"
          />
          <FeatureCard
            icon={Pill}
            title="Medicine Reminders"
            description="Never miss a dose with smart medication tracking"
          />
          <FeatureCard
            icon={Droplet}
            title="Hydration Tracking"
            description="Stay hydrated with daily water intake goals"
          />
          <FeatureCard
            icon={Activity}
            title="Activity Logging"
            description="Track your exercises and daily activities"
          />
          <FeatureCard
            icon={Calendar}
            title="Appointment Management"
            description="Keep track of all your doctor appointments"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Health Analytics"
            description="View trends and insights about your health"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: string;
  change: string;
  color: string;
}> = ({ icon: Icon, title, value, change, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`bg-gradient-to-br ${color} p-3 rounded-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-sm font-medium text-green-600">{change}</span>
    </div>
    <p className="text-gray-600 text-sm">{title}</p>
    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const FeatureCard: React.FC<{
  icon: React.ElementType;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg h-fit">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  </div>
);
