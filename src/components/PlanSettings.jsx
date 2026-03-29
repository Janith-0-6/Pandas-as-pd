import { useEffect, useState } from 'react';
import { Save, SlidersHorizontal } from 'lucide-react';

const INTERESTS = [
  'Gaming', 'Music', 'Sports', 'Tech', 'Travel', 'Fashion', 'Food',
  'Anime', 'Crypto', 'Fitness', 'Content Creation', 'Streaming',
  'Photography', 'Skincare', 'Thrifting', 'Startups', 'Art & Design',
  'K-Pop', 'Sustainability', 'Mental Health', 'Podcasts', 'Sneakers',
  'Cooking', 'DIY / Crafts'
];

const RISK_LEVELS = ['Conservative (Low)', 'Balanced (Medium)', 'Aggressive (High)'];

const toDisplayRisk = (risk) => {
  if (!risk) return '';
  if (risk.includes('(')) return risk;
  const normalized = risk.toLowerCase();
  if (normalized.startsWith('conservative')) return 'Conservative (Low)';
  if (normalized.startsWith('balanced')) return 'Balanced (Medium)';
  if (normalized.startsWith('aggressive')) return 'Aggressive (High)';
  return risk;
};

export default function PlanSettings({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    income: '',
    expenses: '',
    interests: [],
    risk: ''
  });

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      income: initialData.income ? String(initialData.income) : '',
      expenses: initialData.expenses ? String(initialData.expenses) : '',
      interests: Array.isArray(initialData.interests) ? initialData.interests : [],
      risk: toDisplayRisk(initialData.risk)
    });
  }, [initialData]);

  useEffect(() => {
    if (!formData.income || !formData.expenses) return;
    const income = Number(formData.income);
    const expenses = Number(formData.expenses);
    if (expenses > income) {
      setFormData((prev) => ({ ...prev, expenses: String(income) }));
    }
  }, [formData.income, formData.expenses]);

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.income || !formData.expenses || !formData.risk || formData.interests.length === 0) return;

    const riskLevel = formData.risk.split(' ')[0];
    onSave({
      income: formData.income,
      expenses: formData.expenses,
      interests: formData.interests,
      risk: riskLevel
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 font-semibold mb-2">Plan Settings</p>
        <h1 className="text-3xl md:text-4xl font-light text-white tracking-tight mb-2">Edit Financial Plan Inputs</h1>
        <p className="text-sm text-neutral-300 max-w-2xl">
          Update your income, expenses, interests, and risk profile. These changes will refresh your dashboard projections and AI recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 glass-card p-6 md:p-8 rounded-3xl soft-outline">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="group">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] mb-2 transition-colors group-focus-within:text-brand-light">Monthly Income (INR)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-neutral-500 font-mono">₹</span>
              </div>
              <input
                type="number"
                min="0"
                placeholder="25,000"
                className="w-full bg-black/30 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-light focus:ring-2 focus:ring-brand-light/20 transition placeholder-neutral-500 font-mono"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] mb-2 transition-colors group-focus-within:text-rose-400">Monthly Essential Expenses</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-neutral-500 font-mono">₹</span>
              </div>
              <input
                type="number"
                min="0"
                max={formData.income ? Number(formData.income) : undefined}
                placeholder="10,000"
                className="w-full bg-black/30 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition placeholder-neutral-500 font-mono"
                value={formData.expenses}
                onChange={(e) => {
                  const val = e.target.value;
                  if (formData.income && Number(val) > Number(formData.income)) return;
                  setFormData({ ...formData, expenses: val });
                }}
                required
              />
              {formData.income ? (
                <p className="text-[11px] text-neutral-500 mt-1.5 pl-1">Max ₹{Number(formData.income).toLocaleString('en-IN')} (cannot exceed income)</p>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] mb-3">Core Interests <span className="normal-case text-neutral-500 font-normal italic tracking-normal ml-1">(Select all that apply)</span></label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const selected = formData.interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                    selected
                      ? 'bg-brand-accent/15 border-brand-light text-white shadow-[0_0_0_2px_rgba(20,184,166,0.1)]'
                      : 'bg-black/25 text-neutral-300 hover:bg-black/45 border-white/10 hover:border-white/25'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-400 uppercase tracking-[0.16em] mb-3">Investment Risk Profile</label>
          <div className="flex flex-col sm:flex-row gap-3">
            {RISK_LEVELS.map((level) => {
              const selected = formData.risk === level;
              return (
                <button
                  type="button"
                  key={level}
                  onClick={() => setFormData({ ...formData, risk: level })}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm text-left sm:text-center transition-all border ${
                    selected
                      ? 'bg-brand-accent/10 border-brand-light text-brand-light font-semibold shadow-inner'
                      : 'bg-black/25 border-white/10 text-neutral-300 hover:bg-black/45 hover:border-white/25'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-white/20 text-neutral-300 hover:text-white hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.income || !formData.expenses || !formData.risk || formData.interests.length === 0}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-light hover:bg-teal-400 text-slate-900 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Plan Changes
          </button>
        </div>
      </form>
    </div>
  );
}
