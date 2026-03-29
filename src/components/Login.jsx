import { useState } from 'react';
import { ArrowRight, Lock, UserPlus, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) throw error;
        setSuccessMsg('Account created! You are now logged in.');
        
        // Short delay to let user see success message before navigating
        setTimeout(() => {
          onLogin();
        }, 1500);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });

        if (error) throw error;
        onLogin();
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-20 px-4 animate-fade-in flex flex-col items-center justify-center min-h-[70vh]">
      
      <div className="text-center mb-8 animate-reveal" style={{ animationDelay: '0.1s' }}>
        <div className="inline-flex items-center justify-center p-4 bg-brand-accent/10 border border-brand-accent/20 rounded-full mb-6">
          <Lock className="w-8 h-8 text-brand-light" />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-white mb-2">
          Secure <span className="font-serif text-amber-100 italic font-medium">Access</span>
        </h1>
        <p className="text-neutral-400 text-sm font-medium tracking-wide">
          FutureYou Wealth Strategy Portal
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-5 glass-card p-6 md:p-8 rounded-3xl animate-reveal soft-outline" style={{ animationDelay: '0.2s' }}>
        
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl flex items-start gap-3 text-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl flex items-start gap-3 text-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{successMsg}</p>
          </div>
        )}

        <div className="group">
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] mb-2 transition-colors group-focus-within:text-brand-light">Email Address</label>
          <input 
            type="email" 
            placeholder="investor@future.com"
            className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 transition placeholder-neutral-500"
            value={credentials.email}
            onChange={e => setCredentials({...credentials, email: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="group">
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] mb-2 transition-colors group-focus-within:text-brand-light">Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 transition placeholder-neutral-500"
            value={credentials.password}
            onChange={e => setCredentials({...credentials, password: e.target.value})}
            required
            disabled={loading}
          />
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button 
            type="submit"
            disabled={!credentials.email || !credentials.password || loading}
            onClick={() => setIsSignUp(false)}
            className={`flex-1 group relative flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
              !isSignUp ? 'bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950' : 'bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Log In
          </button>

          <button 
            type="submit"
            disabled={!credentials.email || !credentials.password || loading}
            onClick={() => setIsSignUp(true)}
            className={`flex-1 group relative flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
              isSignUp ? 'bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950' : 'bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </div>

      </form>
    </div>
  );
}

// Add the missing icon to the file top inside the scope of the rewrite. Wait, I didn't import CheckCircle2.
