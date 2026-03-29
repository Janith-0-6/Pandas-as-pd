import { useState, useEffect } from 'react';
import { Layers, ShieldCheck, TrendingUp, Anchor, CheckCircle } from 'lucide-react';

const BUCKETS = [
  { id: 0, title: "Safe & Steady (Digital FDs)", risk: "Low", rate: 7, icon: ShieldCheck, color: "text-blue-400" },
  { id: 1, title: "Wealth Building (Index Funds)", risk: "Medium", rate: 12, icon: TrendingUp, color: "text-brand-success" },
  { id: 2, title: "Diversifier (Digital Gold)", risk: "Low/Medium", rate: 9, icon: Anchor, color: "text-amber-400" },
  { id: 3, title: "Experimenting (Direct Equity)", risk: "High", rate: 15, icon: Layers, color: "text-rose-400" }
];

export default function PortfolioBuilder({ monthlyInvestment, onRateChange }) {
  const [allocations, setAllocations] = useState([25, 25, 25, 25]);
  const [showModal, setShowModal] = useState(false);

  // Trigger parent rate change on allocation updates
  useEffect(() => {
    const totalAllocated = allocations.reduce((acc, value) => acc + value, 0);
    const blendedRate = totalAllocated > 0
      ? allocations.reduce((acc, weight, idx) => acc + (weight / totalAllocated) * BUCKETS[idx].rate, 0)
      : 0;
    onRateChange(blendedRate, totalAllocated);
  }, [allocations, onRateChange]);

  const handleAllocationChange = (index, newValueStr) => {
    let newValue = Number(newValueStr);
    if (newValue < 0) newValue = 0;
    if (newValue > 100) newValue = 100;

    setAllocations(prev => {
      const othersTotal = prev.reduce((sum, value, i) => (i === index ? sum : sum + value), 0);
      const maxAllowedForBucket = Math.max(0, 100 - othersTotal);
      const clamped = Math.min(newValue, maxAllowedForBucket);

      if (clamped === prev[index]) return prev;

      const newAllocations = [...prev];
      newAllocations[index] = clamped;
      return newAllocations;
    });
  };

  const handleTargetStart = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const roundedTotal = Math.round(monthlyInvestment);
  const totalAllocatedPercent = allocations.reduce((acc, value) => acc + value, 0);
  const blendedRate = totalAllocatedPercent > 0
    ? allocations.reduce((acc, weight, idx) => acc + (weight / totalAllocatedPercent) * BUCKETS[idx].rate, 0).toFixed(2)
    : '0.00';
  const remainingPercent = Math.max(0, 100 - totalAllocatedPercent);
  const allocatedAmount = Math.round((totalAllocatedPercent / 100) * monthlyInvestment);
  const remainingAmount = Math.max(0, roundedTotal - allocatedAmount);

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 mt-7 relative overflow-hidden group">
      <div className="mb-8">
        <h2 className="text-sm tracking-[0.2em] font-semibold uppercase flex items-center gap-2 text-neutral-300">
          <Layers className="text-brand-light h-4 w-4" /> Gen Z Portfolio Builder
        </h2>
        <p className="text-xs text-neutral-400 mt-2 max-w-2xl leading-relaxed">
          Allocate your ₹{roundedTotal.toLocaleString()} monthly investment across beginner-friendly buckets. 
          Your blended baseline return is currently <span className="text-brand-light font-mono font-bold">{blendedRate}%</span>.
          Adjust the sliders below to see your future charts react instantly.
        </p>
        <p className="text-[11px] text-neutral-500 mt-2 font-mono">
          Allocated: ₹{allocatedAmount.toLocaleString('en-IN')} ({Math.round(totalAllocatedPercent)}%) | Remaining: ₹{remainingAmount.toLocaleString('en-IN')} ({Math.round(remainingPercent)}%)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {BUCKETS.map((bucket, i) => {
          const allocVal = allocations[i];
          const otherTotal = allocations.reduce((sum, value, idx) => (idx === i ? sum : sum + value), 0);
          const maxForThisBucket = Math.max(0, 100 - otherTotal);
          const rupeeVal = Math.round((allocVal / 100) * monthlyInvestment);
          const Icon = bucket.icon;

          return (
            <div key={bucket.id} className="bg-black/30 border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-md bg-white/5 border border-white/10 ${bucket.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Risk: {bucket.risk}</span>
                </div>
                <h3 className="text-sm text-neutral-200 font-semibold mb-1 leading-tight">{bucket.title}</h3>
                <p className="text-xs text-brand-light/80 mb-4 font-mono font-medium">{bucket.rate}% Expected</p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xl font-light text-white tracking-tight">{Math.round(allocVal)}%</span>
                  <span className="text-xs text-neutral-400 font-mono">₹{rupeeVal.toLocaleString('en-IN')}/mo</span>
                </div>
                <input 
                  type="range" 
                  min="0" max={maxForThisBucket} step="1"
                  value={allocVal}
                  onChange={e => handleAllocationChange(i, e.target.value)}
                  className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer hover:bg-neutral-700 transition focus:outline-none focus:ring-1 focus:ring-brand-light/40"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <button 
          onClick={handleTargetStart}
          disabled={monthlyInvestment <= 0}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-300 hover:brightness-110 text-slate-950 text-sm font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start My ₹{roundedTotal.toLocaleString('en-IN')} SIP Today
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="glass-card rounded-2xl p-8 max-w-sm w-full border border-white/20 shadow-2xl relative text-center">
            <div className="mx-auto bg-brand-success/10 w-16 h-16 rounded-full flex items-center justify-center mb-5 border border-brand-success/20">
              <CheckCircle className="w-8 h-8 text-brand-success" />
            </div>
            <h3 className="text-xl text-white font-semibold mb-2">Awesome!</h3>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              Your first micro-investment of ₹{roundedTotal.toLocaleString('en-IN')} is processing. You've just taken step one toward financial freedom.
            </p>
            <button 
              onClick={handleCloseModal}
              className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl py-3 text-sm font-semibold transition"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
