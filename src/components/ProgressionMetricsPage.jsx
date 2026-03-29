import Gamification from './Gamification';
import { Medal } from 'lucide-react';

export default function ProgressionMetricsPage({ userProfile }) {
  return (
    <div className="space-y-6 animate-fade-in pb-14 pt-3 md:pt-5">
      <div className="glass-card rounded-3xl p-5 md:p-6 border border-white/10">
        <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400 font-semibold mb-2">Goal Progress Engine</p>
        <h2 className="text-2xl md:text-3xl font-light text-white tracking-tight flex items-center gap-2">
          <Medal className="w-6 h-6 text-brand-light" /> Progression Metrics
        </h2>
        <p className="text-sm text-neutral-300 mt-2 max-w-3xl">
          Track your milestone completion against recommended targets or your custom goals.
        </p>
      </div>

      <Gamification userProfile={userProfile} investmentPercentage={20} blendedRate={10.75} allocatedPercentage={100} />
    </div>
  );
}
