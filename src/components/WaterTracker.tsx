import React, { useState, useEffect } from 'react';
import { Droplet, Plus, Minus, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WaterIntake } from '../types';
import { format } from 'date-fns';

export const WaterTracker: React.FC = () => {
  const { user } = useAuth();
  const [waterData, setWaterData] = useState<WaterIntake | null>(null);
  const [goal, setGoal] = useState(8);
  const [showGoalEdit, setShowGoalEdit] = useState(false);

  useEffect(() => {
    loadWaterData();
  }, [user]);

  const loadWaterData = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const stored = localStorage.getItem(`water_${user?.id}_${today}`);
    if (stored) {
      setWaterData(JSON.parse(stored));
      setGoal(JSON.parse(stored).goal);
    } else {
      const newData: WaterIntake = {
        id: Date.now().toString(),
        userId: user?.id || '',
        date: today,
        glasses: 0,
        goal: 8,
      };
      setWaterData(newData);
    }
  };

  const updateWater = (change: number) => {
    if (!waterData) return;

    const newGlasses = Math.max(0, waterData.glasses + change);
    const updated = { ...waterData, glasses: newGlasses };
    setWaterData(updated);

    const today = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem(`water_${user?.id}_${today}`, JSON.stringify(updated));
  };

  const updateGoal = (newGoal: number) => {
    if (!waterData) return;

    const updated = { ...waterData, goal: newGoal };
    setWaterData(updated);
    setGoal(newGoal);

    const today = format(new Date(), 'yyyy-MM-dd');
    localStorage.setItem(`water_${user?.id}_${today}`, JSON.stringify(updated));
    setShowGoalEdit(false);
  };

  const percentage = waterData ? Math.min(100, (waterData.glasses / waterData.goal) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Water Intake Tracker</h2>
        <p className="text-gray-600 mt-1">Stay hydrated throughout the day</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Tracker */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Today's Progress</h3>
            <Droplet className="w-8 h-8" />
          </div>

          {/* Water Level Visualization */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="10"
                strokeDasharray={`${percentage * 2.827} 283`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold">{waterData?.glasses || 0}</div>
              <div className="text-sm opacity-90">of {waterData?.goal || 8} glasses</div>
              <div className="text-2xl font-semibold mt-1">{Math.round(percentage)}%</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => updateWater(-1)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-xl transition-all"
            >
              <Minus className="w-6 h-6" />
            </button>
            <button
              onClick={() => updateWater(1)}
              className="bg-white text-blue-500 hover:bg-white/90 p-4 rounded-xl transition-all shadow-lg"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <p className="text-center mt-6 text-sm opacity-90">
            {percentage >= 100
              ? '🎉 Great job! You reached your goal!'
              : percentage >= 50
              ? '👍 Keep it up! You\'re halfway there!'
              : '💧 Start drinking to reach your goal!'}
          </p>
        </div>

        {/* Info & Settings */}
        <div className="space-y-6">
          {/* Daily Goal */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Daily Goal</h3>
                  <p className="text-sm text-gray-600">{goal} glasses per day</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoalEdit(!showGoalEdit)}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
              >
                Edit
              </button>
            </div>

            {showGoalEdit && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Set your daily goal (glasses)
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={goal}
                  onChange={(e) => setGoal(parseInt(e.target.value) || 8)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={() => updateGoal(goal)}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all"
                >
                  Save Goal
                </button>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Benefits of Staying Hydrated</h3>
            <ul className="space-y-3">
              <BenefitItem text="Improves physical performance" />
              <BenefitItem text="Boosts energy and brain function" />
              <BenefitItem text="Helps maintain healthy skin" />
              <BenefitItem text="Aids in digestion and weight management" />
              <BenefitItem text="Regulates body temperature" />
            </ul>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-3">💡 Hydration Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Drink a glass of water first thing in the morning</li>
              <li>• Keep a water bottle with you throughout the day</li>
              <li>• Set reminders to drink water regularly</li>
              <li>• Drink before you feel thirsty</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quick Add</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAddButton amount={1} onClick={() => updateWater(1)} />
          <QuickAddButton amount={2} onClick={() => updateWater(2)} />
          <QuickAddButton amount={3} onClick={() => updateWater(3)} />
          <QuickAddButton amount={4} onClick={() => updateWater(4)} />
        </div>
      </div>
    </div>
  );
};

const BenefitItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-2">
    <Droplet className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
    <span className="text-gray-700">{text}</span>
  </li>
);

const QuickAddButton: React.FC<{ amount: number; onClick: () => void }> = ({
  amount,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center gap-2 p-4 border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all"
  >
    <Plus className="w-5 h-5 text-blue-600" />
    <span className="font-semibold text-gray-900">{amount} glass{amount > 1 ? 'es' : ''}</span>
  </button>
);
