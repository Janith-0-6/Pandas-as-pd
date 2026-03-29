import { PieChart, User, LogOut, ReceiptIndianRupee, Medal } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function TopNav({ currentScreen, onNavigate, onSignOut }) {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  return (
    <nav className="glass-card sticky top-4 z-50 mb-6 mx-auto w-full rounded-2xl border border-white/10 px-4 py-3 flex items-center justify-between shadow-xl animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)] shrink-0">
          <PieChart className="w-4 h-4 text-slate-900" />
        </div>
        <span className="font-bold text-white tracking-wide text-sm sm:text-base hidden xs:inline-block">Future<span className="text-teal-400">You</span></span>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            currentScreen === 'dashboard' 
              ? 'bg-brand-accent/20 text-brand-light' 
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            currentScreen === 'profile' 
              ? 'bg-amber-400/20 text-amber-300' 
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Profile</span>
        </button>

        <button
          onClick={() => onNavigate('expenses')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            currentScreen === 'expenses'
              ? 'bg-cyan-400/20 text-cyan-300'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ReceiptIndianRupee className="w-4 h-4" />
          <span className="hidden sm:inline">Expenses</span>
        </button>

        <button
          onClick={() => onNavigate('progression')}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            currentScreen === 'progression'
              ? 'bg-emerald-400/20 text-emerald-300'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Medal className="w-4 h-4" />
          <span className="hidden sm:inline">Progression</span>
        </button>

        <div className="w-px h-5 bg-white/15 mx-1"></div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-rose-400/80 hover:text-rose-400 hover:bg-rose-400/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}
