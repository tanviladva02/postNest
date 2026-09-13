import { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  Target,
  Users,
  Globe2,
  TrendingUp,
  Cpu,
  ArrowRight,
  BookOpen,
  Link2,
  Search,
  Zap,
  BarChart3,
  Award,
  Flame,
  Check,
  HelpCircle,
} from 'lucide-react';
import FaqAccordion from '@/components/FaqAccordion';

export const metadata: Metadata = {
  title: 'About PostNest | High-Impact Guest Blogging & Backlink Platform',
  description:
    'PostNest is the premier SaaS guest posting and content syndication platform. Publish articles, build high-authority backlinks, gain massive impressions, and rank your website faster on Google.',
  keywords: [
    'PostNest',
    'guest posting platform',
    'upload blog backlink',
    'guest post website',
    'rank website on google',
    'seo backlink builder',
    'high impression guest blogging',
    'postnest about',
    'saas publishing suite',
  ],
  alternates: {
    canonical: 'https://www.postnest.in/about',
  },
  openGraph: {
    title: 'About PostNest - The Modern Guest Posting & Backlink Engine',
    description:
      'Boost your search rankings and gain verified backlinks. PostNest provides fast indexing, Google Schema markup, and high-traffic reader hubs for developers, marketers, and brands.',
    url: 'https://www.postnest.in/about',
    type: 'website',
  },
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About PostNest',
    url: 'https://www.postnest.in/about',
    description:
      'PostNest is a modern guest blogging and backlink platform designed to help writers, businesses, and SEO teams publish articles, earn authoritative backlinks, and rank higher on search engines.',
    publisher: {
      '@type': 'Organization',
      name: 'PostNest',
      url: 'https://www.postnest.in',
      logo: 'https://www.postnest.in/logo.png',
    },
  };


  const steps = [
    {
      step: '01',
      title: 'Craft & Upload Your Post',
      desc: 'Use our lightning-fast WYSIWYG & Markdown editor to draft high-quality articles. Add custom media, target keywords, and clean contextual backlinks.',
      icon: BookOpen,
    },
    {
      step: '02',
      title: 'Smart Quality & Spam Check',
      desc: 'Our real-time Blog Quality Inspector reviews your content for readability, plagiarism, and structural integrity, ensuring high editorial standards.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Instant Google Indexing & SSR',
      desc: 'Your published post is deployed on our high-speed Server-Side Rendered architecture with pre-configured BlogPosting schema and automated XML sitemaps.',
      icon: Zap,
    },
    {
      step: '04',
      title: 'Gain Impressions & Rank Higher',
      desc: 'Enjoy rapid search engine crawlability, organic impressions, and authority-passing backlinks that propel your domain to top search positions.',
      icon: TrendingUp,
    },
  ];

  const targetAudiences = [
    {
      title: 'For Startups & SaaS Founders',
      subtitle: 'Build Instant Domain Authority',
      desc: 'Launch product stories, explain technical solutions, and secure authoritative backlinks that signal trustworthiness to Google and industry buyers.',
      features: [
        'Dedicated Company Hub profile',
        'Direct link attribution to your product',
        'Fast brand discovery among tech readers',
      ],
      icon: Cpu,
    },
    {
      title: 'For SEOs & Growth Marketers',
      subtitle: 'High-Impression Backlink Engine',
      desc: 'Scale guest posting campaigns with clean do-follow backlinks, category-specific topic hubs, and schema-structured articles built for page-1 Google rankings.',
      features: [
        'High organic search impression potential',
        'Clean contextual anchor links',
        'Bulk CSV article submission available',
      ],
      icon: Search,
    },
    {
      title: 'For Technical Writers & Creators',
      subtitle: 'Distraction-Free Global Reach',
      desc: 'Share coding tutorials, system architectures, and engineering breakthroughs on a platform free from reader paywalls and popups.',
      features: [
        'Zero paywalls for your readers',
        'Rich code syntax highlighting',
        'Direct creator portfolio showcase',
      ],
      icon: Users,
    },
  ];

  const corePillars = [
    {
      title: 'Authoritative Backlink Architecture',
      desc: 'PostNest gives you clean, contextual backlinks embedded within rich, high-value editorial articles. Give your domain the authority signals search engines demand.',
      icon: Link2,
    },
    {
      title: 'Maximum Impression Velocity',
      desc: 'Our content directory is structured for maximum organic discovery, driving real targeted views, reader engagement, and search engine visibility to every post.',
      icon: BarChart3,
    },
    {
      title: 'Search-Engine First Engineering',
      desc: 'Built on Next.js Server-Side Rendering (SSR) with automated JSON-LD Schema.org tags, canonical URLs, and dynamic sitemaps for rapid Google crawling.',
      icon: Globe2,
    },
    {
      title: 'Human-Verified Quality Standards',
      desc: 'We maintain strict editorial guidelines and spam filtering to protect the domain authority and link integrity of every creator and brand on our platform.',
      icon: Award,
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-24 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-amber-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>The #1 SaaS Platform for Guest Posts & Backlinks</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Publish Guest Posts.{' '}
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
            Build Authority Backlinks. Rank Higher.
          </span>
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
          PostNest is an all-in-one publishing suite designed for modern founders, SEO specialists, developers, and tech brands. Upload articles, earn valuable contextual backlinks, capture massive organic search impressions, and elevate your website to top search engine positions.
        </p>

        {/* Hero CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <Link
            href="/dashboard/create-post"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Submit Your Guest Post</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/services"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-semibold text-sm transition-all flex items-center justify-center space-x-2 hover:scale-[1.01]"
          >
            <span>Explore Publishing Services</span>
          </Link>
        </div>
      </section>

      {/* 2. VALUE METRICS HIGHLIGHT */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-center space-y-1.5 shadow-sm bg-gradient-to-b from-orange-500/5 to-transparent">
          <div className="flex items-center justify-center space-x-1 text-orange-500">
            <Link2 className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">High Authority</p>
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400">Contextual Backlinks</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Boost your domain rating naturally</p>
        </div>

        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-center space-y-1.5 shadow-sm bg-gradient-to-b from-orange-500/5 to-transparent">
          <div className="flex items-center justify-center space-x-1 text-orange-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">High Impressions</p>
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400">Organic Reach</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Attract targeted industry traffic</p>
        </div>

        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-center space-y-1.5 shadow-sm bg-gradient-to-b from-orange-500/5 to-transparent">
          <div className="flex items-center justify-center space-x-1 text-orange-500">
            <Zap className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Instant Speed</p>
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400">Fast Google Crawl</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">SSR + Schema.org structured data</p>
        </div>

        <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-center space-y-1.5 shadow-sm bg-gradient-to-b from-orange-500/5 to-transparent">
          <div className="flex items-center justify-center space-x-1 text-orange-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">100% Verified</p>
          <p className="text-xs font-bold text-orange-600 dark:text-orange-400">Anti-Spam Standards</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Clean ecosystem for sustainable SEO</p>
        </div>
      </section>

      {/* 3. HOW IT WORKS: 4-STEP RANKING ENGINE */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Proven Growth Engine</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            How PostNest Helps You Rank on Google
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            From submitting your article to commanding top search positions, our streamlined platform takes care of technical optimization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-4 relative group hover:border-orange-500/40 transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    {item.step}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHO POSTNEST IS FOR: TAILORED AUDIENCES */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Built for Modern Digital Teams</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Designed for Creators, Brands & Growth Marketers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Whether you are launching your first SaaS product or scaling a multi-site SEO agency, PostNest gives you the edge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {targetAudiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-7 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 space-y-6 flex flex-col justify-between hover:border-orange-500/30 transition-all hover:shadow-xl"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{aud.title}</h3>
                    <p className="text-xs font-semibold text-orange-600 dark:text-orange-400 mt-0.5">{aud.subtitle}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {aud.desc}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {aud.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/dashboard/create-post"
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500 transition-colors"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. 4 CORE PILLARS OF POSTNEST */}
      <section className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Why PostNest Outperforms Traditional Guest Posting
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            No slow email outreach, no hidden paywalls, no broken redirects. Only pure SEO performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="flex items-start space-x-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-1">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto space-y-6 pt-2">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Learn more about uploading blogs, building backlinks, and ranking your site with PostNest.
          </p>
        </div>

        <FaqAccordion
          items={[
            {
              q: 'How does uploading guest posts on PostNest help rank my site?',
              a: 'When you publish an article on PostNest, you gain contextual backlinks from a clean, high-performance domain. Combined with our instant SSR speed and Google BlogPosting Schema, search engines crawl and pass link authority directly to your domain.',
            },
            {
              q: 'Are the backlinks do-follow and indexable by Google?',
              a: 'Yes. Published articles are fully indexable and public on the web. Our platform automatically generates XML sitemaps and schema markup so Google and other search engines can discover your content and backlinks rapidly.',
            },
            {
              q: 'Can I publish articles for free?',
              a: 'Absolutely! Our Early Bird free tier allows you to publish up to 30 posts per month (up to 2 posts per day) with zero upfront costs. You can also upgrade to higher tiers for bulk CSV uploads and higher publishing velocity.',
            },
            {
              q: 'What types of content are allowed on PostNest?',
              a: 'We welcome tutorials, product launches, case studies, engineering blogs, marketing breakdowns, and industry guides. All content undergoes automated quality and anti-spam inspection to keep the ecosystem reputable.',
            },
          ]}
          defaultOpenIndex={0}
        />
      </section>

      {/* 7. HIGH-CONVERTING BOTTOM CTA */}
      <section className="glass-panel p-8 sm:p-14 rounded-3xl border border-orange-500/30 text-center space-y-6 bg-gradient-to-b from-orange-500/15 via-orange-500/5 to-transparent shadow-xl">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span>Launch Offer: Early Bird Free Quota Available</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white max-w-2xl mx-auto">
          Start Uploading Your Guest Posts & Ranking on Google Today
        </h2>

        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-normal">
          Join thousands of developers, SEO agencies, and startup founders publishing on PostNest. Build verified backlinks and grow your impressions today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            href="/dashboard/create-post"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Your First Article Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/pricing"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-sm transition-all"
          >
            <span>View Pricing & Publishing Plans</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
