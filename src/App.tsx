import { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import Dashboard from './components/Dashboard';
import { checkAndNotifyJobs } from './utils/notifications';

export default function App() {
  const [view, setView] = useState<'welcome' | 'dashboard'>(() => {
    // Check if user has seen welcome before
    return localStorage.getItem('hasSeenWelcome') === 'true' ? 'dashboard' : 'welcome';
  });

  useEffect(() => {
    if (view === 'dashboard') {
      checkAndNotifyJobs();
    }
  }, [view]);

  const handleStart = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setView('dashboard');
  };

  return (
    <div className="bg-slate-200 min-h-screen">
      {view === 'welcome' ? (
        <WelcomeScreen onGetStarted={handleStart} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
