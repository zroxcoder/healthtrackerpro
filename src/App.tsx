import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { user } = useAuth();

  // Initialize demo user
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const demoUser = {
        id: 'demo-user',
        email: 'demo@health.com',
        password: 'demo123',
        name: 'Demo User',
      };
      localStorage.setItem('users', JSON.stringify([demoUser]));
    }
  }, []);

  return user ? <Dashboard /> : <Auth />;
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
