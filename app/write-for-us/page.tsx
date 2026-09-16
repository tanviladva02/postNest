import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { SEO_LANDING_PAGES } from '@/lib/seo-landing-data';
import SeoLandingTemplate from '@/components/seo/SeoLandingTemplate';
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  FileCheck,
  ShieldCheck,
  PenTool,
  Brain,
  Zap,
  Target,
  ArrowRight,
  UserCheck,
  Search,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const revalidate = 60;

const pageData = SEO_LANDING_PAGES['write-for-us'];

export function generateMetadata(): Metadata {
  return {
    title: pageData.metaTitle,
    description: pageData.metaDescription,
    keywords: pageData.keywords,
    alternates: {
      canonical: pageData.canonicalUrl,
    },
    openGraph: {
      title: pageData.metaTitle,
      description: pageData.metaDescription,
      url: pageData.canonicalUrl,
      type: 'website',
      siteName: 'PostNest',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageData.metaTitle,
      description: pageData.metaDescription,
    },
  };
}

export default async function WriteForUsPage() {
  let recentPosts: any[] = [];
  let categories: any[] = [];

  try {
    const [postsData, categoriesData] = await Promise.all([
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          publishedAt: true,
          createdAt: true,
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { name: true, image: true } },
        },
        orderBy: { publishedAt: 'desc' },
        take: 6,
      }),
      prisma.category.findMany({
        select: { id: true, name: true, slug: true },
        take: 8,
        orderBy: { name: 'asc' },
      }),
    ]);
    recentPosts = postsData;
    categories = categoriesData;
  } catch (error) {
    console.error('Error loading live data for Write For Us page:', error);
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#08090d] text-slate-900 dark:text-slate-100">
      {/* Primary Landing Hero & Core Sections using SeoLandingTemplate */}
      <SeoLandingTemplate
        data={pageData}
        recentPosts={recentPosts}
        categories={categories}
      />

      {/* Extended Guidelines Section for Natural Human Writing & High SEO Ranking */}
      <section id="guidelines" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200 dark:border-slate-800/80 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <PenTool className="w-4 h-4" />
            <span>Detailed Editorial Standards</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Blueprint for Writing <span className="text-orange-500">High-Ranking Natural</span> Content
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Search engine algorithms have evolved. Content that ranks #1 today requires genuine human experience, high structural readability, and zero automated filler.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1: Human Language & Voice */}
          <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-orange-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              1. Authentic Natural Human Language
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Write like a real subject matter expert talking to another human being. Avoid generic AI introductory clichés like <i>"In today's fast-paced digital world"</i> or <i>"Let's delve into the tapestry of..."</i>. Use active voice, conversational flow, and clear logical transitions.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Use first-person / second-person perspective when appropriate</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Share personal insights, lessons learned, and real anecdotes</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Maintain short, readable paragraphs (2-4 sentences max)</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: Google E-E-A-T Integration */}
          <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-orange-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              2. Google E-E-A-T & Value Density
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Google rewards content built on <b>Experience, Expertise, Authoritativeness, and Trustworthiness</b>. Provide actionable solutions, code snippets, original screenshots, or step-by-step frameworks that directly answer the searcher's intent.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Include practical code samples, benchmarks, or diagrams</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Address specific problem statements directly in the first 200 words</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Cite accurate references and reputable technical documentation</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: On-Page SEO Formatting */}
          <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-orange-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              3. SEO Architecture & Intent Matching
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Format your article with a logical heading structure (H1 for title, H2 for main topics, H3 for sub-points). Target primary and secondary LSI keywords naturally without keyword stuffing or repetitive text loops.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Use descriptive subheadings that answer search queries</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Add bulleted lists and tables for quick scanning</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Include a compelling, action-oriented meta summary</span>
              </li>
            </ul>
          </div>

          {/* Pillar 4: Formatting & Multimedia */}
          <div className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 hover:border-orange-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              4. Length, Formatting & Hyperlinks
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              We recommend comprehensive posts between 800 and 2,000+ words. Make use of Markdown elements (blockquotes, bold callouts, syntax-highlighted code blocks) and link out naturally to authoritative sources.
            </p>
            <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Minimum 800+ words of well-researched original text</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Up to 2 contextual links to relevant high-quality sites</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Complete author profile with custom profile picture & bio</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Do's and Don'ts Comparison Table */}
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              What We Accept vs. What We Reject
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Review this quick checklist before submitting your draft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* DO's */}
            <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>What We Love & Accept</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>100% original, human-written content with unique perspectives</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Practical step-by-step tutorials, code examples, & frameworks</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Actionable marketing strategies, SEO breakdowns, & SaaS insights</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Clean Markdown layout with descriptive headings & short paragraphs</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Authentic personal experience and verifiable case study data</span>
                </li>
              </ul>
            </div>

            {/* DON'Ts */}
            <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-4">
              <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold text-base">
                <XCircle className="w-5 h-5" />
                <span>What Will Be Rejected</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Raw, unedited AI-generated text or spin-rewritten content</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Spammy anchor text or excessive, irrelevant outbound promotional links</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Articles previously published elsewhere on the internet (Plagiarism)</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Thin content (&lt; 600 words) with zero practical depth or takeaways</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-500 font-bold">✗</span>
                  <span>Misleading title tags, clickbait, or unverified claims</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA Card */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Ready to Share Your Article with Thousands of Readers?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Create your free author account today and publish up to 30 articles every month with instant Google sitemap indexing and zero paywalls.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/register"
              className="px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <span>Submit Your Article Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
