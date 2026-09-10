'use client';

import { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';

export default function PlanLimitEditorForm({ initialPlans }: { initialPlans: any[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (id: string, field: string, val: any) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plans }),
      });
      if (res.ok) {
        setMsg('Subscription plan limits updated in database!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {msg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      <div className="space-y-4">
        {plans.map((p) => (
          <div key={p.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">{p.displayName} ({p.name})</h3>
              <span className="text-xs font-bold text-orange-400">₹{p.priceINR}/mo</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Monthly Post Quota</label>
                <input
                  type="number"
                  value={p.monthlyPostLimit}
                  onChange={(e) => handleChange(p.id, 'monthlyPostLimit', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Daily Post Limit (0 = Unlimited up to monthly)</label>
                <input
                  type="number"
                  value={p.dailyPostLimit}
                  onChange={(e) => handleChange(p.id, 'dailyPostLimit', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        <span>{loading ? 'Saving to Database...' : 'Save All Quota Configs'}</span>
      </button>
    </form>
  );
}
