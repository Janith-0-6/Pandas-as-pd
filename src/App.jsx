import { useEffect, useState } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

const DEFAULT_ONBOARDING_DRAFT = {
  name: '',
  age: 22,
  income: '',
  interests: [],
  risk: ''
};

const getViewFromLocation = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get('view') === 'dashboard' ? 'dashboard' : 'onboarding';
};

const setViewInUrl = (view, mode = 'push') => {
  const url = new URL(window.location.href);

  if (view === 'dashboard') {
    url.searchParams.set('view', 'dashboard');
  } else {
    url.searchParams.delete('view');
  }

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  if (mode === 'replace') {
    window.history.replaceState(null, '', nextUrl);
    return;
  }
  window.history.pushState(null, '', nextUrl);
};

function App() {
  const [view, setView] = useState(() => getViewFromLocation());
  const [userProfile, setUserProfile] = useState(null);
  const [onboardingDraft, setOnboardingDraft] = useState(DEFAULT_ONBOARDING_DRAFT);

  useEffect(() => {
    const handlePopState = () => {
      setView(getViewFromLocation());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!userProfile && view === 'dashboard') {
      setView('onboarding');
      setViewInUrl('onboarding', 'replace');
    }
  }, [userProfile, view]);

  const handleComplete = (profile, draft) => {
    setUserProfile(profile);
    setOnboardingDraft(draft);
    setView('dashboard');
    setViewInUrl('dashboard');
  };

  const handleReset = () => {
    setView('onboarding');
    setViewInUrl('onboarding');
  };

  return (
    <div className="min-h-screen bg-atmosphere text-slate-100 font-sans relative overflow-x-hidden">
      <div className="pointer-events-none absolute -top-20 right-[8%] h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute top-[28%] -left-20 h-56 w-56 rounded-full bg-amber-200/10 blur-3xl animate-float-slow" />

      <main className="container mx-auto max-w-6xl p-4 sm:p-6 lg:p-10 relative z-10">
        {view === 'dashboard' && userProfile ? (
          <Dashboard userProfile={userProfile} onReset={handleReset} />
        ) : (
          <Onboarding
            onComplete={handleComplete}
            initialData={onboardingDraft}
            onDraftChange={setOnboardingDraft}
          />
        )}
      </main>
    </div>
  );
}

export default App;
