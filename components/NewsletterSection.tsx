'use client';

import { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

interface NewsletterSectionProps {
  source?: string;
}

export default function NewsletterSection({ source = 'HOMEPAGE' }: NewsletterSectionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing to PostNest Digest!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-4">
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-orange-200 dark:border-orange-500/20 text-center space-y-5 bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent relative overflow-hidden shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-orange-500/10 blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PostNest Developer Digest</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Subscribe to PostNest Best Free Blogging Platform Updates
        </h3>

        <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
          Join thousands of developers, tech writers, and SEO professionals. Get weekly curated technical guides, free guest post alerts, and engineering updates delivered straight to your inbox. 100% spam-free, unsubscribe anytime.
        </p>

        {status === 'success' ? (
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center space-x-3 text-sm font-semibold animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <div className="relative w-full">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-xs"
                required
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm transition-all whitespace-nowrap shadow-md shadow-orange-500/25 flex items-center justify-center space-x-2 disabled:opacity-60"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe Free</span>
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div className="max-w-md mx-auto p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center justify-center space-x-2 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-center space-x-4">
          <span>✓ Zero Spam</span>
          <span>•</span>
          <span>✓ Free Guest Post Site</span>
          <span>•</span>
          <span>✓ 100% Forever Free</span>
        </div>
      </div>
    </section>
  );
}
