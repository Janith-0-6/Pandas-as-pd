import { useEffect, useState } from 'react';
import LifestyleBalance from './LifestyleBalance';
import AIPlan from './AIPlan';
import PortfolioBuilder from './PortfolioBuilder';
import { Activity, ShieldCheck, LineChart, BrainCircuit, ArrowRight, Pencil, ChevronDown, SlidersHorizontal } from 'lucide-react';

const PORTFOLIO_STORAGE_KEY = 'futureyou.portfolio.allocations.v1';
const DEFAULT_ALLOCATIONS = [25, 25, 25, 25];
const BUCKET_RATES = [7, 12, 9, 15];

const readSavedAllocations = () => {
  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) return DEFAULT_ALLOCATIONS;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 4) return DEFAULT_ALLOCATIONS;

    return parsed.map((value) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return 0;
      return Math.max(0, Math.min(100, Math.round(numeric)));
    });
  } catch {
    return DEFAULT_ALLOCATIONS;
  }
};

const derivePortfolioMeta = (allocations) => {
  const totalAllocated = allocations.reduce((sum, item) => sum + item, 0);
  const blendedRate = totalAllocated > 0
    ? allocations.reduce((sum, weight, idx) => sum + (weight / totalAllocated) * BUCKET_RATES[idx], 0)
    : 0;

  return {
    blendedRate,
    allocatedPercentage: totalAllocated
  };
};

export default function Dashboard({ userProfile, onEditAnswers }) {
  const savedAllocations = readSavedAllocations();
  const initialPortfolioMeta = derivePortfolioMeta(savedAllocations);

  const [activeView, setActiveView] = useState('present');
  const [planRequested, setPlanRequested] = useState(false);
  const [investmentPercentage, setInvestmentPercentage] = useState(20);
  const [blendedRate, setBlendedRate] = useState(initialPortfolioMeta.blendedRate || 10.75);
  const [allocatedPercentage, setAllocatedPercentage] = useState(initialPortfolioMeta.allocatedPercentage || 100);
  const [portfolioAllocations, setPortfolioAllocations] = useState(savedAllocations);
  const [showEditMenu, setShowEditMenu] = useState(false);

  useEffect(() => {
    setActiveView('present');
    setPlanRequested(false);
    setInvestmentPercentage(20);
    setBlendedRate(10.75);
    setAllocatedPercentage(100);
  }, [userProfile]);

  const handlePortfolioRateChange = (rate, allocationPercent = 100, allocations = DEFAULT_ALLOCATIONS) => {
    setBlendedRate(rate);
    setAllocatedPercentage(allocationPercent);
    setPortfolioAllocations(allocations);
  };

  const showPlanPage = () => {
    setPlanRequested(true);
    setActiveView('plan');
  };

  const handleEditAnswersClick = () => {
    setShowEditMenu(false);
    onEditAnswers();
  };

  return (
    <div className="space-y-7 animate-fade-in pb-14 pt-3 md:pt-5">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-5 w-5 text-brand-success" />
            <span className="text-amber-100/90 font-semibold tracking-[0.2em] text-xs uppercase">FutureYou Capital</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-neutral-200 leading-tight">
            Welcome, <span className="font-semibold text-white">{userProfile.name}</span>.
          </h1>
          <p className="text-neutral-300/80 mt-3 text-sm tracking-wide max-w-xl">
            Your personalized strategy is calibrated to a {userProfile.risk.toLowerCase()} risk profile with focus on disciplined long-term compounding.
          </p>
        </div>
        
        <div className="flex gap-4 md:gap-4">
          <div className="flex bg-black/30 backdrop-blur-sm rounded-2xl p-4 items-center gap-5 border border-white/10 shadow-[0_14px_30px_rgba(4,8,16,0.3)]">
            <div className="p-3 bg-brand-accent/10 rounded-lg border border-brand-light/30">
              <Activity className="h-5 w-5 text-brand-light" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-300/70 font-bold uppercase tracking-[0.15em] mb-1">Monthly Cashflow</p>
              <p className="text-2xl font-mono text-white tracking-tight">INR {Number(userProfile.income).toLocaleString()}</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowEditMenu((prev) => !prev)}
              className="flex items-center gap-2 px-5 py-3 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-brand-light/40 text-neutral-300 hover:text-brand-light transition-all duration-300 shadow-[0_14px_30px_rgba(4,8,16,0.3)] font-medium"
              title="Edit profile or financial inputs"
            >
              <Pencil className="h-4 w-4" />
              <span className="hidden md:inline text-sm">Edit</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showEditMenu ? 'rotate-180' : ''}`} />
            </button>

            {showEditMenu ? (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-white/10 bg-slate-950/95 backdrop-blur-md shadow-2xl z-20 p-1.5">
                <button
                  type="button"
                  onClick={handleEditAnswersClick}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-neutral-200 hover:bg-white/10 transition"
                >
                  <SlidersHorizontal className="w-4 h-4 text-brand-light" />
                  Edit Plan Inputs
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      <section className="glass-card rounded-3xl p-3 md:p-4 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="inline-flex bg-black/35 rounded-2xl p-1.5 border border-white/10 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setActiveView('present')}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-[0.14em] font-semibold transition w-full md:w-auto flex items-center justify-center gap-2 ${
                activeView === 'present'
                  ? 'bg-brand-accent/15 text-brand-light border border-brand-light/35'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <LineChart className="w-4 h-4" />
              Present & Future
            </button>
            <button
              type="button"
              onClick={() => setActiveView('plan')}
              className={`px-4 py-2.5 rounded-xl text-xs uppercase tracking-[0.14em] font-semibold transition w-full md:w-auto flex items-center justify-center gap-2 ${
                activeView === 'plan'
                  ? 'bg-brand-accent/15 text-brand-light border border-brand-light/35'
                  : 'text-neutral-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              AI Plan
            </button>
          </div>

          {activeView === 'present' && (
            <button
              type="button"
              onClick={showPlanPage}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-300 text-slate-950 text-xs uppercase tracking-[0.12em] font-bold hover:brightness-110 transition"
            >
              Generate AI Plan
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      <div className={activeView === 'present' ? 'space-y-7' : 'hidden'}>
        <LifestyleBalance
          userProfile={userProfile}
          investmentPercentage={investmentPercentage}
          onInvestmentChange={setInvestmentPercentage}
          blendedRate={blendedRate}
          allocatedPercentage={allocatedPercentage}
        />

        <PortfolioBuilder
          monthlyInvestment={(Number(userProfile.income) || 0) * (investmentPercentage / 100)}
          onRateChange={handlePortfolioRateChange}
        />
      </div>

      <div className={activeView === 'plan' ? 'space-y-6' : 'hidden'}>
        <div className="glass-card rounded-3xl p-5 md:p-6 border border-white/10">
          <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 font-semibold mb-2">Strategic Advisory Desk</p>
          <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight">AI Financial Plan</h2>
          <p className="text-sm text-neutral-300 mt-2 max-w-3xl">
            This view is intentionally separated from the present and future simulator to keep analysis and recommendations focused.
          </p>
        </div>

        <AIPlan
          userProfile={userProfile}
          shouldGenerate={planRequested}
          allocations={portfolioAllocations}
          investmentPercentage={investmentPercentage}
        />
      </div>
    </div>
  );
}
