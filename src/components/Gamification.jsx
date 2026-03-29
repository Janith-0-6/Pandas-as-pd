import { useEffect, useMemo, useState } from 'react';
import { Medal, CheckCircle, Target, ShieldCheck, Zap, Layers, Globe, Star, Activity, Hexagon, Flame, Bitcoin, Dumbbell, Video, Tv, Camera, Sparkles, Recycle, Rocket, Palette, Music2, Leaf, Brain, Podcast, Footprints, ChefHat, Wrench } from 'lucide-react';

const GOAL_CONFIG = [
  { key: 'year1', wealthKey: 'year1', label: 'Year 1' },
  { key: 'year3', wealthKey: 'year3', label: 'Year 3' },
  { key: 'year5', wealthKey: 'year5', label: 'Year 5' },
  { key: 'year10', wealthKey: 'year10', label: 'Year 10' },
  { key: 'age60', wealthKey: 'atAge60', label: 'Age 60' }
];

export default function Gamification({ userProfile, investmentPercentage = 20, blendedRate = 12, allocatedPercentage = 100 }) {
  const [goalMode, setGoalMode] = useState('recommended');
  const [customGoals, setCustomGoals] = useState(null);

  const formatCompactINR = (value) => {
    const val = Number(value) || 0;
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1).replace('.0', '')}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1).replace('.0', '')}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const roundTo = (value, step) => Math.max(step, Math.round(value / step) * step);

  const interestMap = {
    // Original 7
    'Gaming':            { icon: <Activity className="w-3 h-3" />,    idea: 'Interactive Entertainment Index' },
    'Music':             { icon: <Layers className="w-3 h-3" />,      idea: 'Digital Media Portfolios' },
    'Sports':            { icon: <Target className="w-3 h-3" />,      idea: 'Athletic Apparel & Leisure ETFs' },
    'Tech':              { icon: <Zap className="w-3 h-3" />,         idea: 'Semiconductor & AI Funds' },
    'Travel':            { icon: <Globe className="w-3 h-3" />,       idea: 'Global Hospitality REITs' },
    'Fashion':           { icon: <Star className="w-3 h-3" />,        idea: 'Luxury Goods Conglomerates' },
    'Food':              { icon: <Hexagon className="w-3 h-3" />,     idea: 'Agri-Tech & FMCG Indices' },
    // New Gen Z interests
    'Anime':             { icon: <Flame className="w-3 h-3" />,       idea: 'Japanese Media & Entertainment ETFs' },
    'Crypto':            { icon: <Bitcoin className="w-3 h-3" />,     idea: 'Blockchain & DeFi Funds' },
    'Fitness':           { icon: <Dumbbell className="w-3 h-3" />,    idea: 'Health & Wellness REITs' },
    'Content Creation':  { icon: <Video className="w-3 h-3" />,       idea: 'Creator Economy Platforms' },
    'Streaming':         { icon: <Tv className="w-3 h-3" />,          idea: 'OTT & Streaming Media Index' },
    'Photography':       { icon: <Camera className="w-3 h-3" />,      idea: 'Imaging & Optics Tech' },
    'Skincare':          { icon: <Sparkles className="w-3 h-3" />,    idea: 'Beauty & Personal Care ETFs' },
    'Thrifting':         { icon: <Recycle className="w-3 h-3" />,     idea: 'Circular Economy Funds' },
    'Startups':          { icon: <Rocket className="w-3 h-3" />,      idea: 'Venture Capital Trusts' },
    'Art & Design':      { icon: <Palette className="w-3 h-3" />,     idea: 'Digital Art & NFT Index' },
    'K-Pop':             { icon: <Music2 className="w-3 h-3" />,      idea: 'Asian Entertainment Holdings' },
    'Sustainability':    { icon: <Leaf className="w-3 h-3" />,        idea: 'ESG & Green Energy Funds' },
    'Mental Health':     { icon: <Brain className="w-3 h-3" />,       idea: 'Digital Health & Wellbeing' },
    'Podcasts':          { icon: <Podcast className="w-3 h-3" />,     idea: 'Audio & Media Tech' },
    'Sneakers':          { icon: <Footprints className="w-3 h-3" />,  idea: 'Luxury Streetwear Portfolios' },
    'Cooking':           { icon: <ChefHat className="w-3 h-3" />,     idea: 'Food-Tech & D2C Brands' },
    'DIY / Crafts':      { icon: <Wrench className="w-3 h-3" />,      idea: 'Maker Economy & E-commerce' },
  };

  // Dynamic wealth projection (same formula as LifestyleBalance)
  const income = Number(userProfile.income) || 0;
  const age = userProfile.age || 22;
  const yearsTo60 = Math.max(1, 60 - age);
  const monthlyInvestment = (income * investmentPercentage) / 100;
  const annualIncome = income * 12;
  const annualInvestable = monthlyInvestment * 12;
  const r = (blendedRate / 100) / 12; // dynamic annual -> monthly
  const allocationShare = Math.min(Math.max(allocatedPercentage / 100, 0), 1);
  const investedMonthly = monthlyInvestment * allocationShare;
  const unallocatedMonthly = monthlyInvestment - investedMonthly;

  const projectedWealth = useMemo(() => {
    const calc = (years) => {
      const n = years * 12;
      if (n <= 0 || monthlyInvestment <= 0) return 0;

      let investedFv = 0;
      if (investedMonthly > 0) {
        investedFv = r > 0
          ? investedMonthly * ((Math.pow(1 + r, n) - 1) / r)
          : investedMonthly * n;
      }

      const idleFv = unallocatedMonthly > 0 ? unallocatedMonthly * n : 0;
      return investedFv + idleFv;
    };
    return {
      year1: calc(1),
      year3: calc(3),
      year5: calc(5),
      year10: calc(10),
      atAge60: calc(yearsTo60),
    };
  }, [monthlyInvestment, investedMonthly, unallocatedMonthly, yearsTo60, r]);

  const incomeDrivenTargets = useMemo(() => {
    return {
      year1: roundTo(Math.max(10000, annualIncome * 0.2), 1000),
      year3: roundTo(Math.max(75000, annualIncome * 0.9), 5000),
      year5: roundTo(Math.max(200000, annualIncome * 1.8), 10000),
      year10: roundTo(Math.max(500000, annualIncome * 3.5), 10000),
      age60: roundTo(Math.max(1500000, annualInvestable * yearsTo60 * 1.25), 50000)
    };
  }, [annualIncome, annualInvestable, yearsTo60]);

  useEffect(() => {
    setCustomGoals((prev) => prev ?? { ...incomeDrivenTargets });
  }, [incomeDrivenTargets]);

  const activeTargets = goalMode === 'custom' && customGoals ? customGoals : incomeDrivenTargets;

  const updateCustomGoal = (key, value) => {
    const numericValue = Number(value);
    setCustomGoals((prev) => ({
      ...(prev || incomeDrivenTargets),
      [key]: Number.isFinite(numericValue) && numericValue > 0 ? numericValue : 0
    }));
  };

  // Dynamic milestones that unlock as projected wealth grows
  const milestones = GOAL_CONFIG.map((goal) => {
    const targetValue = Number(activeTargets?.[goal.key] || 0);
    const achievedValue = Number(projectedWealth[goal.wealthKey] || 0);

    return {
      title: `${goal.label} Target: ${formatCompactINR(targetValue)}`,
      unlocked: achievedValue >= targetValue,
      detail: `${goal.label} → ₹${Math.round(achievedValue).toLocaleString('en-IN')}`
    };
  });

  const clearedCount = milestones.filter(m => m.unlocked).length;

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden group h-full">
      
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

      {/* Thematic Exposure */}
      <div className="mb-10 relative z-10">
        <h3 className="text-[10px] uppercase font-bold text-neutral-300 tracking-[0.2em] mb-4 flex items-center gap-2">
          <ShieldCheck className="text-neutral-400 h-4 w-4" /> Thematic Exposure
        </h3>
        
        <div className="flex flex-wrap gap-2.5">
          {userProfile.interests.map(interest => {
            const match = interestMap[interest];
            if (!match) return null;
            return (
              <div key={interest} className="flex items-center gap-2.5 bg-black/30 border border-white/10 px-3.5 py-2 rounded-lg text-xs font-medium text-neutral-200 hover:border-brand-accent/30 hover:bg-black/45 transition-colors">
                <span className="text-brand-light/80">{match.icon}</span>
                <span className="font-mono tracking-tight">{match.idea}</span>
              </div>
            );
          })}
          {userProfile.interests.length === 0 && (
            <p className="text-xs text-neutral-500 italic">Select interests during onboarding to see thematic exposure.</p>
          )}
        </div>
      </div>

      {/* Progression Metrics */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] uppercase font-bold text-neutral-300 tracking-[0.2em] flex items-center gap-2">
            <Medal className="text-neutral-400 h-4 w-4" /> Progression Metrics
          </h3>
          <span className="text-[10px] font-mono text-brand-light bg-brand-accent/10 px-2 py-1 rounded border border-brand-accent/20">
            {clearedCount}/{milestones.length} CLEARED
          </span>
        </div>

        <div className="mb-5 rounded-xl border border-white/10 bg-black/25 p-3">
          <div className="inline-flex bg-black/35 rounded-lg p-1 border border-white/10 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setGoalMode('recommended')}
              className={`px-3 py-1.5 rounded-md text-[10px] uppercase tracking-[0.12em] font-semibold transition ${
                goalMode === 'recommended'
                  ? 'bg-brand-accent/15 text-brand-light border border-brand-light/35'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Recommended
            </button>
            <button
              type="button"
              onClick={() => setGoalMode('custom')}
              className={`px-3 py-1.5 rounded-md text-[10px] uppercase tracking-[0.12em] font-semibold transition ${
                goalMode === 'custom'
                  ? 'bg-brand-accent/15 text-brand-light border border-brand-light/35'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              My Goals
            </button>
          </div>

          {goalMode === 'recommended' ? (
            <p className="text-[11px] text-neutral-500 mt-2">
              Recommended goals are auto-calculated from income, current investable cashflow, and years remaining to age 60.
            </p>
          ) : (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GOAL_CONFIG.map((goal) => (
                <label key={goal.key} className="text-[11px] text-neutral-400">
                  <span className="block mb-1">{goal.label} Goal (INR)</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={Number(customGoals?.[goal.key] || 0)}
                    onChange={(e) => updateCustomGoal(goal.key, e.target.value)}
                    className="w-full bg-black/35 border border-white/15 rounded-lg px-3 py-2 text-neutral-200 focus:outline-none focus:border-brand-light focus:ring-1 focus:ring-brand-light/30"
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-neutral-800 rounded-full mb-5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-light to-cyan-300 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(clearedCount / milestones.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3">
          {milestones.map((ms, idx) => (
            <div key={idx} className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border transition-all duration-300 ${
              ms.unlocked 
                ? 'bg-brand-success/5 border-brand-success/25' 
                : 'bg-black/25 border-white/10 opacity-70'
            }`}>
              <div className={`p-2 rounded-md shrink-0 ${ms.unlocked ? 'bg-brand-success/10 text-brand-success' : 'bg-neutral-900 text-neutral-600'}`}>
                {ms.unlocked ? <CheckCircle className="w-4 h-4" /> : <Target className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                    <p className={`text-[11px] uppercase tracking-[0.08em] font-semibold leading-snug ${ms.unlocked ? 'text-brand-success/90' : 'text-neutral-300/80'}`}>{ms.title}</p>
                  <p className={`text-[10px] font-mono px-2 py-1 rounded border shrink-0 ${
                    ms.unlocked 
                      ? 'text-brand-success bg-brand-success/10 border-brand-success/20' 
                      : 'text-neutral-300 bg-black/35 border-white/10'
                  }`}>{ms.unlocked ? 'CLEARED' : 'PENDING'}</p>
                </div>
                <p className="text-[10px] text-neutral-500 font-mono mt-1">{ms.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
