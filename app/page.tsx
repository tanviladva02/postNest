import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import LatestStoriesSection from '@/components/LatestStoriesSection';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  Cpu,
  BookOpen,
  PlusCircle,
} from 'lucide-react';

export const revalidate = 60; // Revalidate every 60s

export default async function HomePage() {
  // Query Published Posts (Fetch recent published articles for rich search catalog)
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      author: true,
      company: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 30,
  });

  // Query Categories
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  // Query Companies
  const companies = await prisma.company.findMany({
    where: { isVerified: true },
    take: 4,
  });

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section with Hashnode-Inspired Aesthetics */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800/80">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-slate-900 border border-orange-200 dark:border-orange-500/30 shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              The Modern Tech Publication Platform • <span className="text-orange-600 dark:text-orange-400 font-bold">Publish like a pro</span>
            </span>
            <span className="text-[10px] bg-orange-500/15 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded-full font-mono uppercase font-semibold">
              Free 30 Posts
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Where developers & tech teams <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-orange-700 via-orange-700 to-amber-600 bg-clip-text text-transparent">
              publish like a pro.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Distraction-free blogging, zero paywalls for readers, automated Google-first SEO, and verified company hubs. Share your engineering stories and product guides with thousands of readers worldwide.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard/create-post"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base shadow-lg shadow-orange-500/25 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Write an Article</span>
            </Link>

            <Link
              href="#explore"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5 text-orange-500" />
              <span>Explore Articles</span>
            </Link>
          </div>

          {/* Quick Value Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto">
            <div className="text-center p-3">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">30 / Mo</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Early Bird Free Posts</p>
            </div>
            <div className="text-center p-3">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">Zero Paywalls</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Open-Web Readers</p>
            </div>
            <div className="text-center p-3">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">Folder Upload</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG, WebP, URLs</p>
            </div>
            <div className="text-center p-3">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">REST API</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Headless Publishing</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Article Spotlight */}
      {featuredPost && (
        <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span>Featured Spotlight</span>
            </h2>
            <span className="text-xs font-medium text-slate-500">Curated by PostNest Editors</span>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-200 dark:border-slate-800">
            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[400px] bg-slate-100 dark:bg-slate-900">
              <img
                src={featuredPost.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-semibold uppercase tracking-wider shadow-sm">
                  {featuredPost.category.name}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {featuredPost.company && (
                  <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                    <Building2 className="w-4 h-4 text-orange-500" />
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{featuredPost.company.companyName}</span>
                    {featuredPost.company.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{featuredPost.author.name}</span>
                  <span>•</span>
                  <span>{new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="text-orange-600 dark:text-orange-400 font-semibold flex items-center space-x-1 hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Trending Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span>Browse Topics & Categories</span>
          </h2>
          <Link href="/services" className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline">
            View All Services →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="glass-card p-4 rounded-xl flex flex-col items-center text-center space-y-2 group hover:border-orange-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-slate-800 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-white">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Interactive Latest Articles Grid with Real-Time Search & Filters */}
      <LatestStoriesSection posts={posts} categories={categories} />

      {/* 7. Newsletter Digest Subscription */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-orange-200 dark:border-orange-500/20 text-center space-y-4 bg-gradient-to-b from-orange-500/5 dark:from-orange-950/20 to-transparent">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Subscribe to the PostNest Digest
          </h3>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-lg mx-auto">
            Get top curated technical guides, engineering case studies, and developer insights delivered directly to your inbox. Zero spam, unsubscribe anytime.
          </p>

          <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-orange-500 transition-colors"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors whitespace-nowrap shadow-md shadow-orange-500/20"
            >
              Subscribe Free
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
