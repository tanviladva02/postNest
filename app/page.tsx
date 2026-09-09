import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  Eye,
  Calendar,
  CheckCircle2,
  Cpu,
  Briefcase,
  DollarSign,
  Heart,
  Search,
  BookOpen,
  PlusCircle,
} from 'lucide-react';

export const revalidate = 60; // Revalidate every 60s

export default async function HomePage() {
  // Query Published Posts
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      author: true,
      company: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 9,
  });

  // Query Categories
  const categories = await prisma.category.findMany({
    take: 6,
  });

  // Query Companies
  const companies = await prisma.company.findMany({
    where: { isVerified: true },
    take: 4,
  });

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section with Glassmorphism & Micro-animations */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-brand-600/15 via-sky-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Early Bird Strategy Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-brand-500/30 shadow-lg shadow-brand-500/10">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-slate-200">
              Early Bird Offer: <span className="text-brand-300">Publish 30 Posts / Month Free</span>
            </span>
            <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-mono uppercase">Limited</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover, Publish & <span className="bg-gradient-to-r from-brand-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">Grow Your Audience</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Publish your stories, showcase your products, build backlinks, and reach wider audiences on PostNest.in — the all-in-one publishing & content marketing ecosystem.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="#explore"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-semibold text-base shadow-lg shadow-brand-500/25 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Explore Articles</span>
            </Link>

            <Link
              href="/dashboard/create-post"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border border-slate-700 font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-5 h-5 text-sky-400" />
              <span>Add Your Blog</span>
            </Link>
          </div>

          {/* Quick Value Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 max-w-4xl mx-auto">
            <div className="text-center p-3">
              <p className="text-2xl font-bold text-white">30 / Mo</p>
              <p className="text-xs text-slate-400">Early Bird Free Posts</p>
            </div>
            <div className="text-center p-3">
              <p className="text-2xl font-bold text-white">₹299</p>
              <p className="text-xs text-slate-400">Standard Plan / Mo</p>
            </div>
            <div className="text-center p-3">
              <p className="text-2xl font-bold text-white">Bulk CSV</p>
              <p className="text-xs text-slate-400">Fast Upload System</p>
            </div>
            <div className="text-center p-3">
              <p className="text-2xl font-bold text-white">REST API</p>
              <p className="text-xs text-slate-400">Programmatic Publishing</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Article Banner */}
      {featuredPost && (
        <section id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>Featured Spotlight</span>
            </h2>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-800">
            <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[400px]">
              <img
                src={featuredPost.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                alt={featuredPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-brand-500 text-white text-xs font-semibold uppercase tracking-wider">
                  {featuredPost.category.name}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {featuredPost.company && (
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Building2 className="w-4 h-4 text-sky-400" />
                    <span className="text-slate-200 font-medium">{featuredPost.company.companyName}</span>
                    {featuredPost.company.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white hover:text-brand-300 transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-slate-200">{featuredPost.author.name}</span>
                  <span>•</span>
                  <span>{new Date(featuredPost.publishedAt || featuredPost.createdAt).toLocaleDateString()}</span>
                </div>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="text-brand-400 font-semibold flex items-center space-x-1 hover:text-brand-300"
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
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-sky-400" />
          <span>Browse Trending Categories</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="glass-card p-4 rounded-xl flex flex-col items-center text-center space-y-2 group hover:border-brand-500/40"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-brand-400 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-200 group-hover:text-white">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Google AdSense Placement Slot (Non-Intrusive Banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full py-4 px-6 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center flex flex-col items-center justify-center space-y-1">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Advertisement</span>
          <div className="h-12 w-full flex items-center justify-center text-xs text-slate-400 font-mono border border-dashed border-slate-700/50 rounded-lg bg-slate-950/40">
            [ Google AdSense Responsive Leaderboard Banner Spot ]
          </div>
        </div>
      </section>

      {/* 5. Latest Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white mb-8">Latest Articles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <article key={post.id} className="glass-card rounded-xl overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={post.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-sky-400 text-xs font-semibold">
                      {post.category.name}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  {post.company && (
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-brand-400" />
                      <span className="font-medium text-slate-300">{post.company.companyName}</span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-slate-100 hover:text-brand-300 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/60 mt-4">
                <span>By {post.author.name}</span>
                <Link href={`/blog/${post.slug}`} className="text-brand-400 font-semibold hover:underline">
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Featured Companies */}
      <section id="companies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-brand-400" />
                <span>Featured Companies on PostNest</span>
              </h2>
              <p className="text-xs text-slate-400">Discover top startups and businesses publishing industry knowledge.</p>
            </div>
            <Link href="/register" className="text-xs text-brand-400 hover:underline font-semibold">
              Add Your Company →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {companies.map((comp) => (
              <Link
                key={comp.id}
                href={`/company/${comp.slug}`}
                className="glass-card p-4 rounded-xl flex items-center space-x-3 group"
              >
                <img
                  src={comp.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
                  alt={comp.companyName}
                  className="w-10 h-10 rounded-lg object-cover bg-slate-800"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-slate-200 group-hover:text-brand-300">{comp.companyName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-slate-400">{comp.category || 'Tech Business'}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Newsletter Subscription Box */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="glass-panel p-8 sm:p-10 rounded-2xl border border-brand-500/20 text-center space-y-4 bg-gradient-to-b from-brand-900/20 to-slate-900/80">
          <h3 className="text-2xl font-bold text-white">Subscribe to PostNest Digest</h3>
          <p className="text-slate-300 text-sm max-w-lg mx-auto">
            Get top curated articles, product reviews, and digital marketing insights delivered directly to your inbox.
          </p>

          <form className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-brand-500"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold text-sm transition-colors whitespace-nowrap"
            >
              Subscribe Free
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
