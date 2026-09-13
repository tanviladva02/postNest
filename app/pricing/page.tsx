import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Flame,
  Zap,
  ShieldCheck,
  CreditCard,
  Building2,
  Key,
  Layers,
  HelpCircle,
  Headphones,
  Check,
  Code2,
  Calendar,
  Clock,
  Send,
} from 'lucide-react';
import FaqAccordion from '@/components/FaqAccordion';
import PricingPlanCardAction from '@/components/PricingPlanCardAction';

export const metadata: Metadata = {
  title: 'Pricing Plans & Publishing Quotas | PostNest',
  description:
    'Transparent, developer-first pricing for technical writers, startups, SEO agencies, and enterprise brands. Start free with Early Bird 30 posts/mo, or scale with Standard and Premium automation.',
  keywords: [
    'PostNest pricing',
    'guest post pricing',
    'tech blogging plans',
    'developer blog subscription',
    'content syndication pricing',
  ],
  alternates: {
    canonical: 'https://www.postnest.in/pricing',
  },
  openGraph: {
    title: 'PostNest Pricing Plans | Modern SaaS Publishing',
    description:
      'Explore PostNest publishing tiers: Early Bird Free 30 posts/mo, Standard ₹299/mo, Premium ₹599/mo with REST API access, and Custom Enterprise solutions.',
    url: 'https://www.postnest.in/pricing',
    type: 'website',
  },
};

export default function PricingPage() {
  const primaryPlans = [
    {
      id: 'FREE',
      name: 'Starter Free',
      badge: 'Starter',
      price: '₹0',
      period: 'forever',
      highlight: false,
      tagline: 'For occasional writers, hobbyists & personal tech blogs.',
      monthlyLimit: '15 posts / month',
      dailyLimit: '1 post / day',
      draftLimit: '5 draft slots',
      summary: 'Up to 1 post per day, maximum 15 posts per month.',
      features: [
        '15 posts per month',
        'Up to 1 post per day',
        '5 draft slots storage',
        'Real-time Blog Quality Inspector',
        'Standard Google SEO & Schema.org tags',
        'Company hub profile listing',
        'WYSIWYG editor & local image uploads',
      ],
      cta: 'Get Started Free',
      ctaLink: '/register',
      ctaStyle:
        'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700',
    },
    {
      id: 'STANDARD',
      name: 'Standard Creator',
      badge: 'Most Popular',
      price: '₹299',
      period: 'per month',
      highlight: false,
      tagline: 'For consistent technical writers, SEO specialists & growing brands.',
      monthlyLimit: '60 posts / month',
      dailyLimit: '5 posts / day',
      draftLimit: '50 draft slots',
      summary: 'Up to 5 posts per day, maximum 60 posts per month.',
      features: [
        '60 posts per month',
        'Up to 5 posts per day',
        '50 draft slots storage',
        'Scheduled posts auto-publisher',
        'Bulk CSV & JSON upload engine',
        'Verified Company Hub & logo',
        'Priority quality moderation review',
        'Full contextual backlink attribution',
      ],
      cta: 'Choose Standard',
      ctaLink: '/register?plan=standard',
      ctaStyle: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20',
    },
    {
      id: 'PREMIUM',
      name: 'Premium Growth',
      badge: 'Best Value • Full Automation',
      price: '₹599',
      period: 'per month',
      highlight: true,
      tagline: 'For high-growth SaaS, scaling marketing agencies & developer platforms.',
      monthlyLimit: '100 posts / month',
      dailyLimit: '10 posts / day',
      draftLimit: 'Unlimited drafts',
      summary: 'Up to 10 posts per day, maximum 100 posts per month.',
      features: [
        '100 posts per month',
        'Up to 10 posts per day',
        'Unlimited draft storage',
        'Programmatic Headless REST API Keys',
        'Scheduled posts auto-publisher',
        'Bulk CSV & JSON upload engine',
        'Verified Company Badge & priority SLA',
        'Advanced reader analytics & impressions',
      ],
      cta: 'Choose Premium',
      ctaLink: '/register?plan=premium',
      ctaStyle:
        'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30',
    },
  ];

  const comparisonRows = [
    { name: 'Monthly Published Posts', early: '30 posts', free: '15 posts', standard: '60 posts', premium: '100 posts', custom: 'Tailored (500+)' },
    { name: 'Daily Publishing Limit', early: '2 / day', free: '1 / day', standard: '5 / day', premium: '10 / day', custom: 'Custom / High Rate' },
    { name: 'Draft Storage Slots', early: '10 drafts', free: '5 drafts', standard: '50 drafts', premium: 'Unlimited', custom: 'Unlimited' },
    { name: 'Scheduled Post Publishing', early: false, free: false, standard: true, premium: true, custom: true },
    { name: 'CSV & JSON Bulk Upload Engine', early: false, free: false, standard: true, premium: true, custom: true },
    { name: 'Headless REST API Key Access', early: false, free: false, standard: false, premium: true, custom: true },
    { name: 'Automated Blog Quality Inspector', early: true, free: true, standard: true, premium: true, custom: true },
    { name: 'Google Schema.org Rich Metadata', early: true, free: true, standard: true, premium: true, custom: true },
    { name: 'Verified Company Hub Profile', early: true, free: true, standard: true, premium: true, custom: true },
    { name: 'Dedicated Support & Custom SLA', early: false, free: false, standard: false, premium: false, custom: true },
  ];

  const faqs = [
    {
      q: 'What is the Early Bird Free Plan benefit?',
      a: 'The first 100 registered creators and businesses receive our Early Bird plan free for life! This includes 30 published posts per month (double the regular free quota of 15/month), up to 2 daily uploads, priority Google SEO indexing, and an exclusive Early Adopter profile badge.',
    },
    {
      q: 'How does the automated Blog Quality Inspector work?',
      a: 'Before any article is published, our inspector checks for minimum word count (>= 150 words), structural section headings (H2/H3), title length, meta excerpt, and prevents spammy link stuffing. This ensures maximum search engine ranking and reader retention.',
    },
    {
      q: 'Can I schedule articles to go live automatically?',
      a: 'Yes! Post scheduling is available on our Standard, Premium, and Custom Enterprise plans. You can specify the exact future date and time for automatic publication.',
    },
    {
      q: 'Who gets access to the REST API endpoints?',
      a: 'Programmatic API publishing and secret key management are exclusive to Premium and Custom Enterprise subscribers. It allows engineering teams to publish content directly from their CI/CD workflows or CMS headless stacks.',
    },
    {
      q: 'How do I request a Custom Enterprise Plan?',
      a: 'Simply click "Contact Us for Custom Plan" or navigate to our Contact page with your inquiry details. Our solutions team will configure custom volume limits, webhooks, and multi-seat authoring tailored to your brand.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-20 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* 1. Hero Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Transparent, Developer-First Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Publish like a pro with{' '}
          <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent">
            predictable pricing
          </span>
          .
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          From independent engineers to fast-growing SaaS startups and enterprise agencies, choose the plan that accelerates your technical brand authority and Google search impressions.
        </p>
      </section>

      {/* 2. Special Early Bird Launch Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-orange-200 dark:border-orange-500/35 bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-white dark:from-[#131724] dark:via-[#101420] dark:to-[#0b0e17] p-6 sm:p-9 shadow-md dark:shadow-2xl shadow-orange-500/5 dark:shadow-orange-950/20 transition-colors">
        {/* Ambient Corner Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
              <Flame className="w-3.5 h-3.5" />
              <span>Limited Launch Offer • First 100 Creators</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Get the Early Bird Tier Free Forever (30 Posts/mo)
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Double the free monthly quota, 2 uploads per day, priority Google SEO indexing, and an exclusive &ldquo;Early Adopter&rdquo; badge on your profile.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0 pt-1 md:pt-0">
            <Link
              href="/register?tier=early-bird"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <span>Claim Early Bird Free Access</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Primary 3-Tier Modern Pricing Cards Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {primaryPlans.map((plan) => (
          <div
            key={plan.id}
            className={`glass-panel p-7 sm:p-8 rounded-3xl border flex flex-col justify-between space-y-6 relative transition-all duration-300 hover:shadow-2xl ${
              plan.highlight
                ? 'border-orange-500/80 bg-white dark:bg-slate-900/90 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/40 lg:-translate-y-2'
                : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            {plan.badge && (
              <div
                className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap ${
                  plan.highlight
                    ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 text-white'
                    : 'bg-slate-800 text-slate-200 dark:bg-slate-700'
                }`}
              >
                {plan.badge}
              </div>
            )}

            <div className="space-y-5 pt-2">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[34px] leading-relaxed">
                  {plan.tagline}
                </p>

                <div className="flex items-baseline space-x-2 pt-3">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/{plan.period}</span>
                </div>
              </div>

              {/* Standardized Quota Highlight Pill */}
              <div className="p-4 rounded-2xl bg-orange-50/80 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-500/20 space-y-1">
                <p className="text-xs font-bold text-orange-900 dark:text-orange-300">
                  ⚡ Quota: {plan.monthlyLimit}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {plan.dailyLimit} • {plan.draftLimit}
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  What&apos;s included:
                </p>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <PricingPlanCardAction
                planId={plan.id}
                planName={plan.name}
                priceINR={plan.id === 'STANDARD' ? 299 : plan.id === 'PREMIUM' ? 599 : 0}
                ctaText={plan.cta}
                ctaLink={plan.ctaLink}
                ctaStyle={plan.ctaStyle}
              />
            </div>
          </div>
        ))}
      </section>

      {/* 4. Dedicated Enterprise & Custom Solution Showcase (Full-Width Card) */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0d121f] to-slate-950 text-white shadow-2xl p-8 sm:p-10 transition-colors">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold uppercase tracking-wider border border-orange-500/30 shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Enterprise & Media Agencies</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Custom Enterprise & High-Volume Solutions
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              Publishing hundreds of articles monthly across multiple client brands? Get tailored daily and monthly limits, dedicated high-rate REST API endpoints, webhooks, and multi-author team collaboration.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 flex items-center space-x-2.5 text-xs text-slate-100 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom high-volume (500+ posts/mo)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 flex items-center space-x-2.5 text-xs text-slate-100 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dedicated REST API & Webhooks</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 flex items-center space-x-2.5 text-xs text-slate-100 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-author team management</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/10 flex items-center space-x-2.5 text-xs text-slate-100 font-medium">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dedicated account manager & SLA</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
            <Link
              href="/contact?subject=Custom+Enterprise+Plan+Inquiry"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <Headphones className="w-4 h-4" />
              <span>Contact Us for Custom Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Comprehensive Feature Comparison Table */}
      <section className="space-y-6 pt-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Detailed Plan Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Compare limits, developer features, and automation capabilities across all tiers.
          </p>
        </div>

        <div className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300 min-w-[700px]">
              <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white uppercase font-bold text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-4 sm:p-5">Feature / Capability</th>
                  <th className="p-4 text-orange-600 dark:text-orange-400">Early Bird Free</th>
                  <th className="p-4">Starter Free</th>
                  <th className="p-4">Standard (₹299)</th>
                  <th className="p-4 text-orange-600 dark:text-orange-400">Premium (₹599)</th>
                  <th className="p-4">Custom</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">{row.name}</td>

                    <td className="p-4 font-bold text-orange-600 dark:text-orange-400">
                      {typeof row.early === 'boolean' ? (
                        row.early ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />
                      ) : row.early}
                    </td>

                    <td className="p-4">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />
                      ) : row.free}
                    </td>

                    <td className="p-4 font-medium">
                      {typeof row.standard === 'boolean' ? (
                        row.standard ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />
                      ) : row.standard}
                    </td>

                    <td className="p-4 font-bold text-orange-600 dark:text-orange-400">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />
                      ) : row.premium}
                    </td>

                    <td className="p-4 font-semibold text-slate-900 dark:text-white">
                      {typeof row.custom === 'boolean' ? (
                        row.custom ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-slate-400" />
                      ) : row.custom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. Smooth Animated FAQ Accordion */}
      <section className="space-y-6 pt-4 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-2">
            <HelpCircle className="w-6 h-6 text-orange-500" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Got questions about publishing limits, API access, or subscription billing? We have answers.
          </p>
        </div>

        <FaqAccordion items={faqs} defaultOpenIndex={0} />
      </section>

      {/* 7. Bottom High-Impact Enterprise CTA */}
      <section className="pt-4">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to scale your publication with PostNest?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Join thousands of developers, founders, and tech authors building their digital footprint and domain authority today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/register?tier=early-bird"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>Claim Early Bird Free Access</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact?subject=Custom+Enterprise+Plan+Inquiry"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center space-x-2"
            >
              <Headphones className="w-4 h-4 text-orange-500" />
              <span>Contact Enterprise Sales</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
