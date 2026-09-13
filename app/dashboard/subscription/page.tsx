'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Check,
  Zap,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Headphones,
  Mail,
  Calendar,
  Layers,
  Code2,
  CheckCircle2,
} from 'lucide-react';
import RazorpayCheckoutButton from '@/components/RazorpayCheckoutButton';

export default function SubscriptionPage() {
  const [activePlanName, setActivePlanName] = useState<string>('FREE');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const data = await res.json();
          if (data.limits?.planName) {
            if (data.limits.planName.toLowerCase().includes('premium')) setActivePlanName('PREMIUM');
            else if (data.limits.planName.toLowerCase().includes('standard')) setActivePlanName('STANDARD');
            else if (data.limits.planName.toLowerCase().includes('custom')) setActivePlanName('CUSTOM');
            else setActivePlanName('FREE');
          }
        }
      } catch (err) {
        console.error('Failed fetching user subscription:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const plans = [
    {
      id: 'FREE',
      name: 'Free Starter',
      price: 'Free',
      period: 'Initial Offer',
      badge: 'Popular for Starters',
      summary: 'Free: Up to 2 posts per day, with a maximum of 30 posts per month.',
      features: [
        'Up to 2 posts per day (30 max / month)',
        'Draft limit: Up to 10 drafts',
        'Real-time Blog Quality Inspector',
        'Google Schema.org SEO tags',
        'Company profile listing',
        'WYSIWYG live editor & local image upload',
      ],
      isCurrent: activePlanName === 'FREE' || activePlanName === 'EARLY_BIRD',
      cta: 'Current Plan',
      buttonStyle: 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default border border-slate-200 dark:border-slate-700',
    },
    {
      id: 'STANDARD',
      name: 'Standard Creator',
      price: '₹299',
      period: 'per month',
      badge: 'For SEO & Bloggers',
      summary: 'Standard: Up to 5 posts per day, with a maximum of 60 posts per month.',
      features: [
        'Up to 5 posts per day (60 max / month)',
        'Draft limit: Up to 50 drafts',
        'Scheduled posts auto-publisher',
        'Bulk CSV & JSON upload engine',
        'Company profile & verified logo',
        'Priority content quality review',
      ],
      isCurrent: activePlanName === 'STANDARD',
      cta: activePlanName === 'STANDARD' ? 'Current Plan' : 'Upgrade to Standard',
      buttonStyle: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20',
    },
    {
      id: 'PREMIUM',
      name: 'Premium Growth',
      price: '₹599',
      period: 'per month',
      badge: 'Best Value for Businesses',
      summary: 'Premium: Up to 10 posts per day, with a maximum of 100 posts per month.',
      features: [
        'Up to 10 posts per day (100 max / month)',
        'Unlimited drafts storage',
        'Scheduled posts auto-publisher',
        'Programmatic REST API Key Access',
        'Bulk CSV & JSON upload engine',
        'Verified Company Badge & priority SLA',
        'Advanced traffic & reader analytics',
      ],
      isCurrent: activePlanName === 'PREMIUM',
      cta: activePlanName === 'PREMIUM' ? 'Current Plan' : 'Upgrade to Premium',
      buttonStyle: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 text-white shadow-md shadow-orange-500/25',
    },
    {
      id: 'CUSTOM',
      name: 'Custom Enterprise',
      price: 'Custom',
      period: 'Tailored limits',
      badge: 'For High-Volume Brands',
      summary: 'Custom: Tailored high-volume daily & monthly posts for teams & agencies.',
      features: [
        'Custom daily & monthly post limits (50-500+/day)',
        'Unlimited drafts storage',
        'Scheduled posts auto-publisher',
        'Dedicated High-Rate REST API Access',
        'Dedicated editorial manager & custom SLA',
        'Multi-author company publications',
      ],
      isCurrent: activePlanName === 'CUSTOM',
      cta: 'Contact Us for Custom Plan',
      isCustom: true,
      buttonStyle: 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-md',
    },
  ];

  const handleUpgrade = (planId: string) => {
    alert(`Payment Gateway: Initiated ₹${planId === 'STANDARD' ? '299' : '599'} subscription for PostNest ${planId} Plan via UPI / Card.`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-2">
      <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible Monthly Plans • Scale Your Publishing Velocity</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Choose Your PostNest Publishing Tier</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Publish blog posts, build authority backlinks, upload in bulk, schedule future releases, and programmatically access our API.
        </p>
      </div>

      {/* 4-Column Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative bg-white dark:bg-slate-900/70 transition-all hover:shadow-lg ${
              p.id === 'PREMIUM'
                ? 'border-orange-500 shadow-orange-sm ring-1 ring-orange-500/30'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            {p.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
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

              {/* Exact Standardized Limits Phrasing */}
              <div className="p-3.5 rounded-2xl bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-500/20 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {p.summary}
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                {p.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {p.isCustom ? (
              <Link
                href="/contact?subject=Custom+Enterprise+Plan+Inquiry"
                className={`w-full py-3 rounded-xl font-semibold text-xs text-center flex items-center justify-center space-x-1.5 transition-all ${p.buttonStyle}`}
              >
                <span>{p.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : p.isCurrent ? (
              <button
                disabled
                className="w-full py-3 rounded-xl font-semibold text-xs bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default border border-slate-200 dark:border-slate-700"
              >
                Current Plan
              </button>
            ) : (
              <RazorpayCheckoutButton
                planName={p.id as 'STANDARD' | 'PREMIUM'}
                displayName={p.name}
                priceINR={p.id === 'STANDARD' ? 299 : 599}
                buttonText={`Upgrade to ${p.name}`}
                className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center space-x-2 transition-all ${p.buttonStyle}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Feature Comparison Table Callout */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Headphones className="w-4 h-4 text-orange-500" />
              <span>Need high publishing volume or custom API rate limits?</span>
            </h2>
            <p className="text-xs text-slate-500">
              Our engineering team can configure custom publishing pipelines, webhooks, and unlimited multi-seat authoring for your organization.
            </p>
          </div>
          <Link
            href="/contact?subject=Custom+Enterprise+Plan+Inquiry"
            className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shrink-0 shadow-md shadow-orange-500/20 transition-all flex items-center space-x-1.5"
          >
            <span>Talk to Enterprise Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
