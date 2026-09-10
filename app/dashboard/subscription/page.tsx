'use client';

import { useState } from 'react';
import { Sparkles, Check, Zap, Shield, CreditCard, ArrowRight } from 'lucide-react';

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'EARLY_BIRD',
      name: 'Early Bird Special',
      price: 'Free',
      period: 'Initial Offer',
      badge: 'Popular for Starters',
      limits: '30 Posts / Month',
      dailyLimit: 'Max 5 posts / day',
      features: [
        '30 blog posts per month',
        'Company profile listing',
        'SEO URL slug generator',
        'Draft & publish controls',
      ],
      cta: 'Current Plan',
      isCurrent: true,
      buttonStyle: 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default',
    },
    {
      id: 'STANDARD',
      name: 'Standard Creator',
      price: '₹299',
      period: 'per month',
      badge: 'For SEO & Bloggers',
      limits: '2 Posts / Day',
      dailyLimit: 'Max 2 posts / day',
      features: [
        '2 blog posts per day',
        'Bulk CSV & JSON upload system',
        'Company profile & verified logo',
        'Faster publishing workflow',
        'Blog management dashboard',
      ],
      cta: 'Upgrade to Standard',
      isCurrent: false,
      buttonStyle: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20',
    },
    {
      id: 'PREMIUM',
      name: 'Premium Growth',
      price: '₹599',
      period: 'per month',
      badge: 'Best Value for Businesses',
      limits: '3 Posts / Day + API',
      dailyLimit: 'Max 3 posts / day',
      features: [
        '3 blog posts per day',
        'Programmatic REST API Key Access',
        'Bulk CSV & JSON upload system',
        'Priority content moderation',
        'Verified Company Badge',
        'Advanced analytics dashboard',
      ],
      cta: 'Upgrade to Premium',
      isCurrent: false,
      buttonStyle: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white shadow-md shadow-orange-500/20',
    },
  ];

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId);
    alert(`Payment Gateway: Initiated ₹${planId === 'STANDARD' ? '299' : '599'} subscription for PostNest ${planId} Plan via UPI / Card.`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible Monthly Plans • Publish like a pro</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Choose Your PostNest Publishing Tier</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Publish blog posts, build authority backlinks, upload in bulk, and programmatically access our API.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative bg-white dark:bg-slate-900/60 ${
              p.id === 'PREMIUM'
                ? 'border-orange-500/40 shadow-orange-sm'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            {p.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                {p.badge}
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{p.name}</h3>
                <div className="flex items-baseline space-x-1 pt-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{p.price}</span>
                  <span className="text-xs text-slate-500">{p.period}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-semibold text-orange-600 dark:text-orange-400">{p.limits}</p>
                <p className="text-[11px] text-slate-500">{p.dailyLimit}</p>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                {p.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => !p.isCurrent && handleUpgrade(p.id)}
              disabled={p.isCurrent}
              className={`w-full py-3 rounded-xl font-semibold text-xs transition-all ${p.buttonStyle}`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
