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
  Calendar,
  Layers,
  HelpCircle,
  Headphones,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing Plans & Features | PostNest.in - Publish Like a Pro',
  description: 'Choose the ideal publication plan for your engineering team, tech startup, or personal blog. Early Bird Free 30 posts/mo for first 100 creators, Standard, Premium, and Custom Enterprise tiers.',
  openGraph: {
    title: 'PostNest.in Pricing Plans | Transparent SaaS Publishing',
    description: 'Explore PostNest publishing plans: Early Bird 30 posts/mo, Standard ₹299/mo, Premium ₹599/mo with REST API access, and Custom Enterprise plans.',
    url: 'https://postnest.in/pricing',
    type: 'website',
  },
};

export default function PricingPage() {
  const plans = [
    {
      id: 'EARLY_BIRD',
      name: 'Early Bird Free',
      badge: '🔥 First 100 Creators Only',
      price: '₹0',
      period: 'Free Forever',
      highlight: true,
      tagline: 'Special launch offer for early tech builders',
      summary: 'Free: Up to 2 posts per day, with a maximum of 30 posts per month.',
      features: [
        '30 posts per month (Double regular free quota)',
        'Up to 2 posts per day',
        '10 Draft slots storage',
        'Real-time Blog Quality Inspector',
        'Priority Google SEO & Schema.org tags',
        'Exclusive "Early Adopter" creator badge',
        'WYSIWYG editor & direct image uploads',
      ],
      cta: 'Claim Early Bird Access',
      ctaLink: '/register?tier=early-bird',
      ctaStyle: 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25',
    },
    {
      id: 'FREE',
      name: 'Regular Free Tier',
      badge: 'Starter',
      price: '₹0',
      period: 'Forever',
      highlight: false,
      tagline: 'For occasional writers & hobbyists',
      summary: 'Free: Up to 1 post per day, with a maximum of 15 posts per month.',
      features: [
        '15 posts per month',
        'Up to 1 post per day',
        '5 Draft slots storage',
        'Real-time Blog Quality Inspector',
        'Standard Google SEO indexing',
        'Company hub profile listing',
        'WYSIWYG live reader preview',
      ],
      cta: 'Get Started Free',
      ctaLink: '/register',
      ctaStyle: 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700',
    },
    {
      id: 'STANDARD',
      name: 'Standard Creator',
      badge: 'Most Popular',
      price: '₹299',
      period: 'per month',
      highlight: false,
      tagline: 'For consistent technical writers & SEO teams',
      summary: 'Standard: Up to 5 posts per day, with a maximum of 60 posts per month.',
      features: [
        '60 posts per month',
        'Up to 5 posts per day',
        '50 Draft slots storage',
        'Scheduled posts auto-publisher',
        'Bulk CSV & JSON upload engine',
        'Verified Company Hub & logo',
        'Priority quality moderation review',
      ],
      cta: 'Choose Standard',
      ctaLink: '/register?plan=standard',
      ctaStyle: 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20',
    },
    {
      id: 'PREMIUM',
      name: 'Premium Growth',
      badge: 'Full Automation',
      price: '₹599',
      period: 'per month',
      highlight: true,
      tagline: 'For high-growth SaaS, agencies & developer platforms',
      summary: 'Premium: Up to 10 posts per day, with a maximum of 100 posts per month.',
      features: [
        '100 posts per month',
        'Up to 10 posts per day',
        'Unlimited draft storage',
        'Programmatic REST API Key Access',
        'Scheduled posts auto-publisher',
        'Bulk CSV & JSON upload engine',
        'Verified Company Badge & priority SLA',
        'Advanced reader analytics & metrics',
      ],
      cta: 'Choose Premium',
      ctaLink: '/register?plan=premium',
      ctaStyle: 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30',
    },
    {
      id: 'CUSTOM',
      name: 'Custom Enterprise',
      badge: 'Tailored Scale',
      price: 'Custom',
      period: 'Tailored limits',
      highlight: false,
      tagline: 'For large agencies, media hubs & enterprises',
      summary: 'Custom: Tailored high-volume daily & monthly posts for teams & agencies.',
      features: [
        'Custom post volume (50-500+ posts/day)',
        'Unlimited draft storage',
        'Dedicated High-Rate REST API & Webhooks',
        'Multi-author team collaboration',
        'Dedicated editorial account manager',
        'Custom invoicing & enterprise SLA',
      ],
      cta: 'Contact Us for Custom Plan',
      ctaLink: '/contact?subject=Custom+Enterprise+Plan+Inquiry',
      ctaStyle: 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow-md',
    },
  ];

  const comparisonRows = [
    { name: 'Monthly Published Posts', early: '30 posts', free: '15 posts', standard: '60 posts', premium: '100 posts', custom: 'Tailored (500+)' },
    { name: 'Daily Publishing Limit', early: '2 / day', free: '1 / day', standard: '5 / day', premium: '10 / day', custom: 'Unlimited / Custom' },
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
    <div className="space-y-16 pb-20 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          From independent engineers to fast-growing SaaS startups and enterprise agencies, choose the plan that accelerates your technical brand authority.
        </p>
      </section>

      {/* 2. Pricing Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between space-y-6 relative transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
              plan.highlight
                ? 'border-orange-500 bg-white dark:bg-slate-900/80 shadow-orange-sm ring-1 ring-orange-500/30'
                : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50'
            }`}
          >
            {plan.badge && (
              <div
                className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap ${
                  plan.id === 'EARLY_BIRD'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                    : plan.id === 'PREMIUM'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-800 text-slate-200 dark:bg-slate-700'
                }`}
              >
                {plan.badge}
              </div>
            )}

            <div className="space-y-4 pt-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-xs text-slate-500 min-h-[32px] mt-1">{plan.tagline}</p>
                <div className="flex items-baseline space-x-1.5 pt-3">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                  <span className="text-xs text-slate-500">{plan.period}</span>
                </div>
              </div>

              {/* Exact Standardized Limits Phrasing */}
              <div className="p-3.5 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-500/20 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                {plan.summary}
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={plan.ctaLink}
              className={`w-full py-3.5 rounded-xl font-bold text-xs text-center flex items-center justify-center space-x-1.5 transition-all ${plan.ctaStyle}`}
            >
              <span>{plan.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </section>

      {/* 3. Comprehensive Feature Comparison Table */}
      <section className="space-y-6 pt-8">
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
                  <th className="p-4">Regular Free</th>
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

      {/* 4. Frequently Asked Questions */}
      <section className="space-y-6 pt-8 max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-2">
            <HelpCircle className="w-6 h-6 text-orange-500" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Got questions about publishing limits, API access, or subscription billing? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2 shadow-xs"
            >
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{faq.q}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom High-Impact Enterprise CTA */}
      <section className="pt-8">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent text-center space-y-4 shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to scale your publication with PostNest?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Join thousands of developers, founders, and tech authors building their digital footprint today.
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
