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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300">
      <div className="relative max-w-lg w-full rounded-3xl border border-orange-500/30 bg-gradient-to-b from-white via-orange-50/20 to-white dark:from-[#0f1422] dark:via-[#090d16] dark:to-[#0f1422] shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none -ml-12 -mb-12" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-20"
          aria-label="Close Early Bird Offer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-amber-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400 text-[11px] font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-orange-500 animate-bounce" />
            <span>Limited Time: First 100 Creators Only</span>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Claim Lifetime <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent">Early Bird</span> Access
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Join the first 100 tech writers and companies on PostNest to lock in double publishing quotas and exclusive perks forever.
            </p>
          </div>

          {/* Early Bird vs Regular Comparison Box */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-orange-200 dark:border-orange-500/20 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-orange-500" />
                <span>Your Early Bird Exclusive Perks:</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                100% Free Forever
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">30 Posts / Month</p>
                  <p className="text-[10px] text-slate-500">(Regular free plan is 15 posts/mo)</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">2 Daily Uploads</p>
                  <p className="text-[10px] text-slate-500">Fast publishing pipeline</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">Priority SEO Indexing</p>
                  <p className="text-[10px] text-slate-500">Google-first rich schema</p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">10 Draft Slots</p>
                  <p className="text-[10px] text-slate-500">Keep ongoing WIP articles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-1">
            <Link
              href="/register?tier=early-bird"
              onClick={handleDismiss}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
            >
              <span>Claim Early Bird 30 Posts/Mo Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-slate-500">Already registered?</span>
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
