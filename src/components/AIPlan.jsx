import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, BrainCircuit, Target, Lightbulb, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function AIPlan({ userProfile, shouldGenerate = false }) {
  const [loading, setLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!shouldGenerate) {
      setLoading(false);
      setIsRegenerating(false);
      return undefined;
    }

    const controller = new AbortController();

    async function fetchPlan() {
      const refreshingExistingPlan = Boolean(plan);
      if (refreshingExistingPlan) {
        setIsRegenerating(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await fetch(`${API_BASE}/api/plan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          signal: controller.signal,
          body: JSON.stringify({
            age: userProfile.age,
            income: userProfile.income,
            expenses: userProfile.expenses,
            interests: userProfile.interests,
            risk: userProfile.risk
          })
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.error || 'Failed to generate financial plan.');
        }

        setPlan(payload.plan);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }

        console.error(err);
        if (!plan) {
          setPlan(null);
        }
        setError(err.message || 'Failed to initialize AI allocation model.');
      } finally {
        setLoading(false);
        setIsRegenerating(false);
      }
    }

    fetchPlan();

    return () => controller.abort();
  }, [userProfile, requestVersion, shouldGenerate]);

  const triggerRegenerate = () => {
    if (loading || isRegenerating) {
      return;
    }
    setRequestVersion((version) => version + 1);
  };

  if (!shouldGenerate) {
    return (
      <div className="glass-card rounded-3xl p-10 flex flex-col items-center justify-center min-h-[340px] text-center border border-white/10">
        <BrainCircuit className="h-8 w-8 text-neutral-400 mb-4" />
        <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold mb-2">AI Advisory</p>
        <h3 className="text-xl font-light text-neutral-100 mb-3">Plan generation is on standby.</h3>
        <p className="text-sm text-neutral-400 max-w-xl">
          Generate the plan from the Present & Future page whenever you want to run a fresh recommendation.
        </p>
      </div>
    );
  }

  if (loading && !plan) {
    return (
      <div className="glass-card rounded-3xl p-10 flex flex-col items-center justify-center min-h-[400px] text-center border-white/10">
        <Loader2 className="h-8 w-8 text-neutral-400 animate-spin mb-6" />
        <h3 className="text-xl font-light text-neutral-200 tracking-wide animate-pulse">
          Synthesizing Portfolio Strategy
        </h3>
        <p className="text-neutral-400 mt-3 text-sm font-mono uppercase tracking-[0.1em]">Processing demographic and risk variables...</p>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="bg-black/60 rounded-3xl border border-red-500/20 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <Target className="h-8 w-8 text-red-400 mb-4" />
        <p className="text-red-400/80 mb-2 font-mono uppercase text-xs tracking-widest">System Error</p>
        <p className="text-sm text-neutral-400 text-center">{error}</p>
        <button
          type="button"
          onClick={triggerRegenerate}
          className="mt-6 px-5 py-2 rounded-lg border border-red-400/40 text-red-300 text-xs font-mono uppercase tracking-widest hover:bg-red-500/10 transition"
        >
          Retry Plan Generation
        </button>
        <div className="mt-4 p-4 bg-red-950/20 border border-red-500/10 rounded-lg text-[10px] font-mono text-red-400 w-full text-center">
          AI REQUEST FAILED
        </div>
      </div>
    );
  }

  if (!plan) return null;

  // Protect against malformed JSON structure causing React to crash (White Screen)
  const budget = plan.monthly_budget || {};
  const ideas = plan.investment_ideas || [];

  return (
    <div className="glass-card rounded-3xl overflow-hidden relative group">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-accent/60 via-amber-200/50 to-transparent"></div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-xs uppercase tracking-[0.2em] font-semibold flex items-center gap-2 text-neutral-300">
            <BrainCircuit className="text-brand-light h-4 w-4" /> Advisory Engine
          </h2>

          <button
            type="button"
            onClick={triggerRegenerate}
            disabled={loading || isRegenerating}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg border border-white/20 text-[10px] uppercase tracking-[0.12em] font-semibold text-neutral-200 hover:border-brand-light/50 hover:text-brand-light transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isRegenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
            {isRegenerating ? 'Regenerating...' : 'Regenerate Plan'}
          </button>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-500/25 bg-red-950/25 px-4 py-3 text-xs text-red-200">
            Last regenerate failed: {error}
          </div>
        ) : null}

        <div className="bg-black/35 border-l-2 border-brand-light p-5 mb-8 rounded-r-xl">
          <div className="flex gap-3">
            <Lightbulb className="text-brand-accent h-4 w-4 shrink-0 mt-1" />
            <p className="text-neutral-200 text-sm md:text-base font-light tracking-wide leading-relaxed">
              "{plan.key_insight}"
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-[0.15em] mb-4">Capital Allocation Protocol</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-black/30 rounded-lg p-2 border border-white/10 gap-2">
            <div className="flex-1 px-4 py-2 text-center group/item hover:bg-white/5 transition rounded-l-md">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Needs</p>
              <p className="text-lg font-mono text-neutral-100">{budget.needs_percentage || 50}%</p>
            </div>
            <div className="flex-1 px-4 py-2 text-center group/item hover:bg-white/5 transition">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Wants</p>
              <p className="text-lg font-mono text-neutral-100">{budget.wants_percentage || 30}%</p>
            </div>
            <div className="flex-1 px-4 py-2 text-center group/item hover:bg-white/5 transition">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-1">Liquidity</p>
              <p className="text-lg font-mono text-neutral-100">{budget.savings_percentage || 10}%</p>
            </div>
            <div className="flex-1 px-4 py-2 text-center bg-brand-accent/10 border border-brand-accent/30 rounded-md">
              <p className="text-[10px] uppercase tracking-wider text-brand-light font-bold mb-1">Assets</p>
              <p className="text-lg font-mono text-brand-light font-semibold">{budget.investment_percentage || 10}%</p>
            </div>
          </div>
        </div>

        {/* Missing Output Rendered: Life at 60 Comparison */}
        {(plan.life_at_60_with_investing || plan.life_at_60_without_investing) && (
          <div className="mb-10">
            <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-[0.15em] mb-4">Life at 60 Projection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Without Investing</p>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">{plan.life_at_60_without_investing || "Standard retirement timeline with high inflation vulnerability."}</p>
              </div>
              <div className="p-4 bg-brand-accent/5 rounded-xl border border-brand-accent/20">
                <p className="text-[10px] font-bold text-brand-light uppercase tracking-widest mb-2">With Strategy</p>
                <p className="text-xs text-neutral-200 leading-relaxed font-light">{plan.life_at_60_with_investing || "Early financial independence and robust wealth accumulation."}</p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-[10px] uppercase font-bold text-neutral-400 tracking-[0.15em] mb-4">Recommended Vehicles</h3>
          <div className="space-y-3">
            {ideas.map((idea, idx) => (
              <div key={idx} className="p-5 bg-black/25 rounded-xl border border-white/10 hover:border-brand-accent/40 transition-all hover:bg-black/40 group/card cursor-default">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <span className="font-semibold text-neutral-100 text-sm group-hover/card:text-brand-light transition">{idea.name}</span>
                  <span className="bg-brand-success/10 border border-brand-success/30 text-[10px] px-2 py-1 rounded text-brand-success font-mono shrink-0 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {idea.expected_annual_return} Target
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed mb-4 font-light">{idea.why_suits_user}</p>
                <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  <ChevronRight className="w-3 h-3 text-brand-accent" /> Entry: <span className="text-neutral-200 font-mono ml-1">{idea.min_monthly_amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
