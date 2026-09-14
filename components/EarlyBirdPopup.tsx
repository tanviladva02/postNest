'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  ArrowRight,
  Flame,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface EarlyBirdPopupProps {
  isLoggedIn: boolean;
}

export default function EarlyBirdPopup({ isLoggedIn }: EarlyBirdPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // If user is already authenticated, never show popup
    if (isLoggedIn) return;

    // Check if user already dismissed in this browser session
    const isDismissed = sessionStorage.getItem('pn_early_bird_dismissed');
    if (isDismissed) return;

    // 1-minute timer (60,000 milliseconds)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 60000);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('pn_early_bird_dismissed', 'true');
  };

  if (!isOpen || isLoggedIn) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full rounded-3xl border border-orange-300 dark:border-orange-500/40 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200 ring-1 ring-orange-500/10">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 dark:bg-orange-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-12 -mb-12" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors z-20 shadow-sm"
          aria-label="Close Early Bird Offer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 space-y-6">
          {/* Top Badge */}
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/80 border border-orange-300 dark:border-orange-500/40 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wide">
              <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
              <span>Limited Offer: First 100 Creators Only</span>
            </div>
          </div>

          {/* High-Contrast Readability Heading */}
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
              Claim Lifetime{' '}
              <span className="text-orange-600 dark:text-orange-400 font-extrabold underline decoration-orange-400/50 decoration-2 underline-offset-4">
                Early Bird
              </span>{' '}
              Perks
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              Lock in double publishing quotas, zero reader paywalls, and priority search indexation before early access spots fill up.
            </p>
          </div>

          {/* High Contrast Perks Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 shadow-inner space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Included Early Bird Privileges:</span>
              </span>
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/60">
                100% Free Forever
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-slate-100">30 Posts / Month</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">(Standard plan: 15 posts/mo)</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-slate-100">Fast Upload Pipeline</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">2 daily posts allowance</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-slate-100">Google SEO Indexing</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Automated XML sitemap</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-slate-100">10 Draft Slots</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Draft articles anytime</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-1">
            <Link
              href="/register?tier=early-bird"
              onClick={handleDismiss}
              className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              <span>Claim Early Bird 30 Posts/Mo Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-between text-xs px-1 pt-1">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Already have an account?</span>
              <Link
                href="/login"
                onClick={handleDismiss}
                className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
              >
                Sign In to Account →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
