import { Metadata } from 'next';
import Link from 'next/link';
import {
  Feather,
  Sparkles,
  Building2,
  Code2,
  Search,
  UploadCloud,
  Layers,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  HelpCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Publishing Services & Solutions | PostNest.in',
  description:
    'Explore PostNest publishing services: Developer Blogging, Verified Company Publications, REST API Headless Syndication, Bulk CSV publishing, and SEO Acceleration.',
  keywords: [
    'publishing services',
    'developer blogging platform',
    'company blog showcase',
    'headless CMS publishing API',
    'bulk blog upload',
    'SEO content marketing',
    'PostNest',
  ],
  openGraph: {
    title: 'PostNest Publishing Services & Solutions - Publish Like a Pro',
    description:
      'Everything you need to write, publish, syndicate, and rank technical content on Google.',
    url: 'https://postnest.in/services',
  },
};

export default function ServicesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'PostNest Publishing Platform',
    provider: {
      '@type': 'Organization',
      name: 'PostNest.in',
      url: 'https://postnest.in',
    },
    description: 'Modern blog publishing and content syndication platform for tech writers and companies.',
  };

  return (
    <div className="space-y-20 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5" />
          <span>Publishing Services & Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Everything you need to <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            publish like a pro.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Whether you are an independent engineer sharing architecture breakdowns, or a scaling tech company building domain authority, PostNest provides the modular tools to make your voice heard.
        </p>
      </section>

      {/* Four Core Solutions Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Solution 1: Developer Publishing Suite */}
        <div className="glass-card p-8 rounded-3xl space-y-5 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Feather className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            1. Pro Creator & Technical Blogger Suite
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Craft beautiful technical stories with a distraction-free environment. Support for both raw image URL pasting and direct computer folder uploads, code blocks, and real-time live preview.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Hybrid Markdown & HTML editing with instant preview</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Local computer folder image uploads (PNG, JPG, WebP)</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Automated reading time calculation and clean author cards</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Zero paywalls, zero reader login gates</span>
            </li>
          </ul>
        </div>

        {/* Solution 2: Company Publication Hubs */}
        <div className="glass-card p-8 rounded-3xl space-y-5 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            2. Verified Company Hubs & Brand Authority
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Elevate your brand beyond generic press releases. Publish engineering case studies, feature announcements, and tutorials linked directly to your verified company profile.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Official verified badge for company legitimacy</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Featured placement on the PostNest homepage and category pages</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Contextual dofollow brand attribution and website links</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Multi-author publications under unified corporate branding</span>
            </li>
          </ul>
        </div>

        {/* Solution 3: Developer API & Bulk Upload */}
        <div className="glass-card p-8 rounded-3xl space-y-5 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Code2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            3. Programmatic API & Bulk Migration Engine
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Automate your publishing pipeline. Use our secure REST API to publish articles directly from your CI/CD pipelines, Git repositories, or headless CMS setups.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Secure API Keys with granular access controls</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Bulk CSV importer for migrating existing article libraries</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Daily and monthly programmatic rate-limiting safety guards</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Webhooks and automated RSS syndication</span>
            </li>
          </ul>
        </div>

        {/* Solution 4: Google Organic SEO Acceleration */}
        <div className="glass-card p-8 rounded-3xl space-y-5 border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            4. Google Organic SEO Acceleration Engine
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Stop waiting months for Google to notice your blog. PostNest implements technical SEO best practices out of the box so your content ranks quickly.
          </p>
          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Automated Schema.org BlogPosting JSON-LD on all articles</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Sub-second Server-Side Rendering (SSR) for green Core Web Vitals</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Dynamic XML sitemaps updated instantly upon publication</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Clean canonical URLs preventing duplicate content penalties</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Pricing Plans Summary */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Transparent Publisher Plans</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Start completely free with our Early Bird offer or scale your publishing velocity with pro capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1: Early Bird Free */}
          <div className="glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between border-2 border-orange-500/40 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase rounded-full tracking-wider">
              Most Popular
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Early Bird Free</h3>
                <p className="text-xs text-slate-500">Perfect for indie hackers & developers</p>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹0</span>
                <span className="text-xs text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>30 Posts per Month Free</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Local folder image & URL uploads</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Google Schema SEO tags</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Community profile & reader feedback</span>
                </li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold text-center shadow-md transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Plan 2: Standard Plan */}
          <div className="glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between border border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Standard Pro</h3>
                <p className="text-xs text-slate-500">For agencies & active content creators</p>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹299</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>60 Posts per Month (2/day)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Bulk CSV Article Upload Engine</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Company profile verification</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Priority human quality moderation</span>
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard/subscription"
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold text-center transition-colors"
            >
              Upgrade to Standard
            </Link>
          </div>

          {/* Plan 3: Premium Business */}
          <div className="glass-card p-8 rounded-3xl space-y-6 flex flex-col justify-between border border-slate-200 dark:border-slate-800">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Premium Enterprise</h3>
                <p className="text-xs text-slate-500">For startups & engineering teams</p>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">₹599</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>90 Posts per Month (3/day)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Full REST API Access with live tokens</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Bulk CSV & automated ingestion</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Dedicated editorial review SLA</span>
                </li>
              </ul>
            </div>
            <Link
              href="/dashboard/subscription"
              className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold text-center transition-colors"
            >
              Get Premium Access
            </Link>
          </div>
        </div>
      </section>

      {/* Services FAQ */}
      <section className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Everything you need to know about publishing on PostNest.</p>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-6 rounded-2xl space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Can I syndicate articles that I already published on my personal blog?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! You can syndicate your articles on PostNest. We encourage you to include a note referencing the original piece, and our platform automatically protects your author authority.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              How does local image upload work?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              When creating an article, you can click &ldquo;Choose Image File from Folder&rdquo; or &ldquo;Upload Image to Body&rdquo; to pick any image from your computer. PostNest safely stores it and generates a fast, CDN-ready URL inserted right into your post.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What are the guidelines for corporate and affiliate links?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We require transparency. When publishing commercial recommendations or product showcases, our automated system prompts for affiliate disclosure boxes to maintain strict compliance with Google search policies.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="glass-panel p-10 rounded-3xl border border-orange-500/30 text-center space-y-4 bg-gradient-to-b from-orange-500/10 to-transparent">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Start Publishing Like a Pro Today
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Create an account in under 30 seconds and publish your first article to our global tech community.
        </p>
        <Link
          href="/dashboard/create-post"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-md transition-colors"
        >
          <span>Create Free Article</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
