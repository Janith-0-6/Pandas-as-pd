import { useState, useEffect } from 'react';
import { Save, User, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ProfileSettings({ userProfile, onProfileUpdate }) {
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    dob: '',
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Fetch real email and dob from session
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setFormData(prev => ({
          ...prev,
          name: session.user.user_metadata?.full_name || userProfile?.name || '',
          email: session.user.email || '',
          dob: session.user.user_metadata?.dob || ''
        }));
      }
    };
    fetchSession();
  }, [userProfile]);

  const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0];

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Update Name & DOB in metadata
      if (formData.name || formData.dob) {
        const { error: metaError } = await supabase.auth.updateUser({
          data: {
            full_name: formData.name,
            dob: formData.dob
          }
        });
        if (metaError) throw metaError;
      }

      // Update Email
      const { data: { session } } = await supabase.auth.getSession();
      if (formData.email && formData.email !== session?.user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: formData.email });
        if (emailError) throw emailError;
        // Supabase sends a confirmation email natively when email changes.
      }

      // Update Password
      if (formData.password) {
        const { error: passError } = await supabase.auth.updateUser({ password: formData.password });
        if (passError) throw passError;
      }

      setSuccessMsg("Profile successfully updated!");
      
      // Notify parent to refresh userProfile context and dashboard metrics using the new DOB algorithm
      if (onProfileUpdate) onProfileUpdate();
      
      // Clear password field after save
      setFormData(prev => ({ ...prev, password: '' }));

    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto py-8 px-4 transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      
      <div className="mb-8 animate-reveal" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-3xl font-semibold tracking-tight text-white mb-2">Account Settings</h1>
        <p className="text-neutral-400 text-sm">Update your personal details and security credentials securely.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 glass-card p-6 md:p-8 rounded-3xl soft-outline animate-reveal" style={{ animationDelay: '0.2s' }}>
        
        {/* Alerts */}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{errorMsg}</p>
          </div>
        )}
        
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl flex items-start gap-3 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              {successMsg} <br/>
              <span className="opacity-80 mt-1 inline-block">If you changed your email, check your inbox for a verification link.</span>
            </p>
          </div>
        )}

        <div className="space-y-5">
          {/* Email */}
          <div className="group">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] mb-2 transition-colors group-focus-within:text-brand-light">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 transition-colors group-focus-within:text-brand-light" />
              <input 
                type="email" 
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light/50 transition placeholder-neutral-600"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1.5 ml-1">Supabase defaults to sending a verification link if you change this.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="group">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] mb-2 transition-colors group-focus-within:text-brand-light">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 transition-colors group-focus-within:text-brand-light" />
                <input 
                  type="text" 
                  className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light/50 transition placeholder-neutral-600"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* DOB */}
            <div className="group">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] mb-2 transition-colors group-focus-within:text-brand-light">Date of Birth</label>
              <input 
                type="date" 
                max={maxDate}
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light/50 transition [color-scheme:dark]"
                value={formData.dob}
                onChange={e => setFormData({...formData, dob: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Password Reset */}
          <div className="group pt-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] transition-colors group-focus-within:text-brand-light">New Password</label>
              <span className="text-[10px] text-neutral-500 italic">Leave blank to keep current</span>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 transition-colors group-focus-within:text-brand-light" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light/50 transition placeholder-neutral-600"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-white/5 mt-6">
          <button 
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-light hover:bg-teal-400 text-slate-900 font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)] hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] flex items-center justify-center gap-2 group ml-auto disabled:opacity-50"
          >
            <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
