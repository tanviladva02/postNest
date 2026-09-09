'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Feather, User, Mail, Lock, Building2, Globe, Sparkles, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    companyName: '',
    companyCategory: 'Technology',
    companyWebsite: '',
    companyLogo: '',
    companyDescription: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl space-y-6 glass-panel p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Early Bird Offer: 30 Free Posts/Mo</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create your PostNest Account</h2>
          <p className="text-xs text-slate-400">Join businesses, SEO pros, and bloggers publishing quality content.</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Account Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                Step 1: Account Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="rahulsharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
              >
                <span>Continue to Company Profile (Optional)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Company Setup (Optional) */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                  Step 2: Company Profile Setup
                </h3>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-brand-400 hover:underline"
                >
                  ← Back to Step 1
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Nexus AI Solutions"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    name="companyCategory"
                    value={formData.companyCategory}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Business">Business & Startups</option>
                    <option value="Finance">Finance</option>
                    <option value="Health & Lifestyle">Health & Lifestyle</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Official Website</label>
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://companywebsite.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Company Description</label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Brief summary of your product, services, or brand..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Creating Account...' : 'Complete Account & Enter Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
