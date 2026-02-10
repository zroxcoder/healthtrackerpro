export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  weight?: number; // in kg
}

export interface HealthMetric {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  bloodSugar?: number;
  temperature?: number;
}

export interface Medicine {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  startDate: Date;
  endDate?: Date;
  notes?: string;
  taken: { date: string; time: string }[];
}

export interface WaterIntake {
  id: string;
  userId: string;
  date: string;
  glasses: number;
  goal: number;
}

export interface Activity {
  id: string;
  userId: string;
  date: Date;
  type: string;
  duration: number; // in minutes
  calories?: number;
  notes?: string;
}

export interface Appointment {
  id: string;
  userId: string;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  location: string;
  notes?: string;
}
