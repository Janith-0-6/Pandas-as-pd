import { useState } from 'react';
import { ArrowRight, Lock } from 'lucide-react';

export default function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      onLogin(); // Mock login bypassing real auth
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

      <form onSubmit={handleSubmit} className="w-full space-y-6 glass-card p-6 md:p-8 rounded-3xl animate-reveal soft-outline" style={{ animationDelay: '0.2s' }}>
        
        <div className="group">
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] mb-2 transition-colors group-focus-within:text-brand-light">Username</label>
          <input 
            type="text" 
            placeholder="investor@future.com"
            className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 transition placeholder-neutral-500"
            value={credentials.username}
            onChange={e => setCredentials({...credentials, username: e.target.value})}
            required
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
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={!credentials.username || !credentials.password}
            className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-teal-500 to-cyan-400 hover:brightness-110 text-slate-950 font-semibold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">Authorize Portal <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></span>
          </button>
        </div>

      </form>
    </div>
  );
}
