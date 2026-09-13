'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';

export interface StoryPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  views?: number;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
  company?: {
    id: string;
    companyName: string;
    isVerified: boolean;
  } | null;
}

export interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface LatestStoriesSectionProps {
  posts: StoryPost[];
  categories: CategoryOption[];
}

export default function LatestStoriesSection({
  posts,
  categories,
}: LatestStoriesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  // Filter and sort stories
  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return posts
      .filter((post) => {
        // Category Filter
        if (selectedCategory !== 'ALL' && post.category.id !== selectedCategory) {
          return false;
        }

        // Search Query Filter
        if (!query) return true;

        const titleMatch = post.title.toLowerCase().includes(query);
        const excerptMatch = post.excerpt?.toLowerCase().includes(query);
        const categoryMatch = post.category.name.toLowerCase().includes(query);
        const authorMatch = post.author.name.toLowerCase().includes(query);
        const companyMatch = post.company?.companyName?.toLowerCase().includes(query);

        return Boolean(
          titleMatch || excerptMatch || categoryMatch || authorMatch || companyMatch
        );
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.views || 0) - (a.views || 0);
        }
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA;
      });
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSortBy('newest');
  };

  return (
    <section id="stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover & Learn</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Latest Tech Stories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Fresh insights published directly by engineers, founders, and domain experts
          </p>
        </div>

        <Link
          href="/dashboard/create-post"
          className="inline-flex items-center self-start sm:self-auto space-x-1.5 px-4 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>+ Write an Article</span>
        </Link>
      </div>

      {/* 2. Interactive Search & Filter Bar */}
      <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm bg-gradient-to-b from-slate-50/50 dark:from-slate-900/50 to-transparent">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blog by title, keyword, topic, author, or company..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Sort:</span>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700/60 text-xs">
              <button
                type="button"
                onClick={() => setSortBy('newest')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  sortBy === 'newest'
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Newest
              </button>
              <button
                type="button"
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  sortBy === 'popular'
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Most Popular
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills & Result Counter */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1 mr-1">
              <Layers className="w-3 h-3" />
              <span>Topic:</span>
            </span>

            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === 'ALL'
                  ? 'bg-orange-500 text-white font-semibold shadow-xs shadow-orange-500/20'
                  : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Topics ({posts.length})
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = posts.filter((p) => p.category.id === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white font-semibold shadow-xs shadow-orange-500/20'
                      : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {cat.name} {count > 0 && <span className="opacity-75 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filteredPosts.length}</span> of{' '}
            {posts.length} articles
          </div>
        </div>
      </div>

      {/* 3. Post Grid or Empty State */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => {
            const wordCount = (post.content || '')
              .replace(/<[^>]+>/g, ' ')
              .trim()
              .split(/\s+/).length;
            const readMin = Math.max(1, Math.ceil(wordCount / 200));
            const formattedDate = new Date(
              post.publishedAt || post.createdAt
            ).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <article
                key={post.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group border border-slate-200 dark:border-slate-800/90 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 bg-white/70 dark:bg-slate-900/60"
              >
                <div>
                  {/* Article Thumbnail */}
                  <Link
                    href={`/blog/${post.slug}`}
                    prefetch={true}
                    className="block relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800"
                  >
                    <img
                      src={
                        post.featuredImage ||
                        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'
                      }
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-md text-orange-600 dark:text-orange-400 text-xs font-bold shadow-xs">
                        {post.category.name}
                      </span>
                    </div>
                  </Link>

                  {/* Article Metadata & Excerpt */}
                  <div className="p-5 space-y-3">
                    {post.company && (
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {post.company.companyName}
                        </span>
                        {post.company.isVerified && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        )}
                      </div>
                    )}

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`} prefetch={true}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center space-x-1.5 truncate mr-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {post.author.name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1 shrink-0">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{readMin} min read</span>
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    prefetch={true}
                    className="inline-flex items-center space-x-1 text-orange-600 dark:text-orange-400 font-bold hover:underline shrink-0"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel rounded-2xl p-10 sm:p-14 text-center space-y-4 border border-slate-200 dark:border-slate-800 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No matching tech stories found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {searchQuery
                ? `We couldn't find any articles matching "${searchQuery}". Try different keywords or reset your filters.`
                : 'No articles available in this topic category yet.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Clear Search & Filters</span>
          </button>
        </div>
      )}
    </section>
  );
}
