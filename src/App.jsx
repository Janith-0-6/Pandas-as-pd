import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Check if user is already logged in on page load
    const checkActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        window.history.replaceState({ screen: 'onboarding', isLoggedIn: true }, '', '/setup');
      }
    };
    checkActiveSession();

    const handlePopState = (event) => {
      const state = event.state;
      if (state?.screen === 'dashboard' && state?.userProfile) {
        setIsLoggedIn(true);
        setUserProfile(state.userProfile);
        return;
      }
      if (state?.screen === 'onboarding' && state?.isLoggedIn) {
        setIsLoggedIn(true);
        setUserProfile(null);
        return;
      }

      setIsLoggedIn(false);
      setUserProfile(null);
    };

    window.addEventListener('popstate', handlePopState);
    if (!window.history.state) {
      window.history.replaceState({ screen: 'login' }, '', '/');
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    window.history.pushState({ screen: 'onboarding', isLoggedIn: true }, '', '/setup');
  };

  const handleComplete = (profile) => {
    setUserProfile(profile);
    window.history.pushState({ screen: 'dashboard', userProfile: profile }, '', '/dashboard');
  };

  const handleReset = () => {
    setUserProfile(null);
    window.history.pushState({ screen: 'onboarding', isLoggedIn: true }, '', '/setup');
  };

  return (
    <div className="min-h-screen bg-atmosphere text-slate-100 font-sans relative overflow-x-hidden">
      <div className="pointer-events-none absolute -top-20 right-[8%] h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute top-[28%] -left-20 h-56 w-56 rounded-full bg-amber-200/10 blur-3xl animate-float-slow" />

      <main className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-10 relative z-10">
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : !userProfile ? (
          <Onboarding onComplete={handleComplete} />
        ) : (
          <Dashboard userProfile={userProfile} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}

export default App;
