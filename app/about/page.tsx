import { Metadata } from 'next';
import Link from 'next/link';
import {
  Feather,
  Sparkles,
  ShieldCheck,
  Target,
  Users,
  Globe2,
  TrendingUp,
  Cpu,
  CheckCircle2,
  ArrowRight,
  HeartHandshake,
  BookOpen,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | PostNest.in - Publish Like a Pro',
  description:
    'Discover why thousands of developers, tech founders, and digital marketers trust PostNest.in to publish insightful articles, build domain authority, and connect with global audiences without paywalls.',
  keywords: [
    'about PostNest',
    'publish like a pro',
    'tech blogging platform',
    'developer publications',
    'company blog showcase',
    'hashnode alternative',
    'content marketing',
  ],
  openGraph: {
    title: 'About PostNest.in - Publish Like a Pro',
    description:
      'The modern home for engineering blogs, startup stories, and technical guides. Free of paywalls, built for organic Google search reach.',
    url: 'https://postnest.in/about',
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About PostNest.in',
    description: 'PostNest is a modern blog publishing platform for developers, tech writers, and companies.',
    publisher: {
      '@type': 'Organization',
      name: 'PostNest.in',
      url: 'https://postnest.in',
      logo: 'https://postnest.in/logo.png',
    },
  };

  return (
    <div className="space-y-20 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Story & Mission • Publish Like a Pro</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Blogging reimagined for <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            writers who build the future.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
          PostNest was created with a straightforward mission: give developers, founders, domain specialists, and high-growth companies a lightning-fast, distraction-free home to share authentic knowledge without paywalls or restrictive algorithms.
        </p>
      </section>

      {/* Stats Counter Bar */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-extrabold text-orange-500">12,000+</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Published Articles</p>
          <p className="text-[11px] text-slate-500">From AI to cloud architecture</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-extrabold text-orange-500">550K+</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Monthly Tech Readers</p>
          <p className="text-[11px] text-slate-500">Organic organic search audience</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-extrabold text-orange-500">1,400+</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Verified Companies</p>
          <p className="text-[11px] text-slate-500">Showcasing tech innovations</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center space-y-1">
          <p className="text-3xl sm:text-4xl font-extrabold text-orange-500">99.9%</p>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Uptime & SSR Speed</p>
          <p className="text-[11px] text-slate-500">Optimized Core Web Vitals</p>
        </div>
      </section>

      {/* Why We Built PostNest */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>The Problem We Solve</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-snug">
            Technical writing should belong to the open web, not walled gardens.
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            For years, tech writers faced an unfair dilemma: either spend months maintaining a self-hosted static site with zero built-in organic distribution, or publish on walled-garden platforms that force readers behind intrusive popups and membership paywalls.
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
            PostNest combines the best of both worlds: a world-class publishing suite inspired by platforms like Hashnode, backed by automated Google-friendly SEO, local media upload flexibility, canonical URLs, and zero reader paywalls.
          </p>

          <div className="space-y-3 pt-2">
            {[
              'Zero intrusive paywalls or popup blocks for your readers',
              'Built-in Google schema markup for fast organic indexing',
              'Upload images directly from your computer folder or paste links',
              'Dedicated company hubs with verified authority badges',
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 relative overflow-hidden bg-gradient-to-br from-orange-500/5 via-transparent to-transparent">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/25">
            <Feather className="w-7 h-7" />
          </div>
          <blockquote className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-100 italic leading-relaxed">
            &ldquo;When a developer solves a hard bug or a team ships a breakthrough product, the world needs to read that story without a paywall barrier. That is what PostNest stands for.&rdquo;
          </blockquote>
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <p className="font-bold text-slate-900 dark:text-white text-sm">PostNest Editorial Council</p>
            <p className="text-xs text-slate-500">Committed to human-verified, high-signal technical content</p>
          </div>
        </div>
      </section>

      {/* Our 4 Core Principles */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Core Publishing Principles</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Every feature on PostNest is engineered to uphold our commitment to authentic knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Publish Like a Pro</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Distraction-free Markdown & HTML editing, instant local file uploads, code syntax highlighting, and live rendering previews.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Search-First Architecture</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Server-Side Rendering, BlogPosting schema, OpenGraph previews, and automated XML sitemaps built to rank on page 1 of Google.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Anti-Spam & Human Quality</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every submitted post is scanned for plagiarism and spam. We champion human-written articles that deliver actionable, genuine value.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Company Authority</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Companies can build official brand publications, showcase products, and earn trusted editorial backlinks in their niche.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="glass-panel p-10 sm:p-14 rounded-3xl border border-orange-500/30 text-center space-y-6 bg-gradient-to-b from-orange-500/10 to-transparent">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Ready to publish your first article?
        </h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-base">
          Join thousands of developers, product managers, and founders sharing their insights on PostNest today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard/create-post"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2"
          >
            <Feather className="w-4 h-4" />
            <span>Publish Like a Pro</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/services"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-sm transition-all"
          >
            <span>Explore Services</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
