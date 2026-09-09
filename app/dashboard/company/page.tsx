'use client';

import { useState, useEffect } from 'react';
import { Building2, Save, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

export default function CompanyManagerPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    companyName: '',
    category: 'Technology',
    website: '',
    logo: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch('/api/user/companies');
        const data = await res.json();
        if (data.companies && data.companies.length > 0) {
          setCompanies(data.companies);
          const c = data.companies[0];
          setFormData({
            id: c.id,
            companyName: c.companyName,
            category: c.category || 'Technology',
            website: c.website || '',
            logo: c.logo || '',
            description: c.description || '',
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchCompanies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await fetch('/api/user/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update company.');

      setStatusMsg({ type: 'success', text: 'Company profile updated successfully!' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Building2 className="w-6 h-6 text-amber-400" />
          <span>Company Profile Manager</span>
        </h1>
        <p className="text-xs text-slate-400">Establish brand identity, link your official website, and show verification status.</p>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border flex items-center space-x-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Company Name</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g. Nexus AI Solutions"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Industry / Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-brand-500"
            >
              <option value="Technology">Technology</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Business">Business & Startups</option>
              <option value="Finance">Finance</option>
              <option value="Health & Lifestyle">Health & Lifestyle</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Official Website URL</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://nexusai.io"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Logo Image URL</label>
          <input
            type="url"
            value={formData.logo}
            onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Company Overview & Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            placeholder="Brief description of your products, mission, and services..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Changes...' : 'Save Company Profile'}</span>
        </button>
      </form>
    </div>
  );
}
