'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  FileText,
  DollarSign,
  AlertCircle,
  Settings,
  MessageSquare,
  ExternalLink,
  Search,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  UserCheck,
  Crown,
  Sparkles,
  Eye,
  Filter,
  X,
  Send,
} from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  planName: 'FREE' | 'STANDARD' | 'PREMIUM' | string;
  planDisplayName: string;
  postCount: number;
  createdAt: string;
}

interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  status: 'PUBLISHED' | 'PENDING_REVIEW' | 'DRAFT' | 'REJECTED' | string;
  views: number;
  createdAt: string;
  publishedAt?: string | null;
  liveUrl: string;
  relativeUrl: string;
  authorName: string;
  authorEmail: string;
  categoryName: string;
  companyName?: string | null;
}

interface AdminOverviewClientProps {
  initialMetrics: {
    totalUsers: number;
    totalPosts: number;
    publishedPosts: number;
    pendingPosts: number;
    totalCompanies: number;
    totalMessages: number;
    unreadMessages: number;
    standardSubs: number;
    premiumSubs: number;
    freeSubs: number;
    estRevenue: number;
  };
}

export default function AdminOverviewClient({ initialMetrics }: AdminOverviewClientProps) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [allUsers, setAllUsers] = useState<UserItem[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<'ALL' | 'FREE' | 'STANDARD' | 'PREMIUM'>('ALL');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const [postStatusFilter, setPostStatusFilter] = useState<string>('ALL');
  const [postSearchQuery, setPostSearchQuery] = useState('');

  // User detail modal state
  const [selectedUserModal, setSelectedUserModal] = useState<UserItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics || initialMetrics);
        setAllUsers(data.allUsers || []);
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch admin overview data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [initialMetrics]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered users list based on active plan filter & search query
  const filteredUsers = allUsers.filter((user) => {
    // 1. Plan filter
    if (selectedPlanFilter === 'FREE' && user.planName !== 'FREE') return false;
    if (selectedPlanFilter === 'STANDARD' && user.planName !== 'STANDARD') return false;
    if (selectedPlanFilter === 'PREMIUM' && user.planName !== 'PREMIUM') return false;

    // 2. Search query filter
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      const matchName = user.name.toLowerCase().includes(q);
      const matchEmail = user.email.toLowerCase().includes(q);
      const matchUsername = user.username?.toLowerCase().includes(q);
      return matchName || matchEmail || matchUsername;
    }

    return true;
  });

  // Filtered posts list based on status & search query
  const filteredPosts = posts.filter((post) => {
    // 1. Status filter
    if (postStatusFilter !== 'ALL' && post.status !== postStatusFilter) return false;

    // 2. Search query
    if (postSearchQuery.trim()) {
      const q = postSearchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchAuthor = post.authorName.toLowerCase().includes(q) || post.authorEmail.toLowerCase().includes(q);
      const matchSlug = post.slug.toLowerCase().includes(q);
      return matchTitle || matchAuthor || matchSlug;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              PostNest Admin Control Center
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live subscription tracking, user management, and blog directory with direct article links.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-orange-500 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/newsletter"
            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Newsletter Center</span>
          </Link>

          <Link
            href="/admin/messages"
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Inquiries ({metrics.unreadMessages})</span>
          </Link>

          <Link
            href="/admin/moderation"
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Moderation ({metrics.pendingPosts})</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.totalUsers}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Blogs Uploaded</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{metrics.totalPosts}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Published Articles</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{metrics.publishedPosts}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Pending Moderation</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{metrics.pendingPosts}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Est. Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">₹{metrics.estRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Interactive Subscription Breakdown (Clickable Cards) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 bg-white/80 dark:bg-slate-900/80 shadow-xl">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>Interactive Subscription & User Filter</span>
            </h2>
            <span className="text-xs text-slate-400">Click any plan card below to view users</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Click on any plan card to filter and inspect the exact list of users on that plan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Card 1: All Users */}
          <button
            type="button"
            onClick={() => setSelectedPlanFilter('ALL')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              selectedPlanFilter === 'ALL'
                ? 'bg-slate-900 dark:bg-slate-800 text-white border-orange-500 ring-2 ring-orange-500/30 shadow-lg'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-orange-500/40 text-slate-900 dark:text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">All Platform Users</span>
              <Users className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-3xl font-extrabold">{metrics.totalUsers}</p>
            <p className="text-[11px] opacity-70 mt-1 flex items-center space-x-1">
              <span>View all registered accounts</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </p>
          </button>

          {/* Card 2: Free Users */}
          <button
            type="button"
            onClick={() => setSelectedPlanFilter('FREE')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              selectedPlanFilter === 'FREE'
                ? 'bg-slate-900 dark:bg-slate-800 text-white border-orange-500 ring-2 ring-orange-500/30 shadow-lg'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-orange-500/40 text-slate-900 dark:text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Free / Early Bird
              </span>
              <UserCheck className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold">{metrics.freeSubs}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1">
              <span>30 monthly post quota</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </p>
          </button>

          {/* Card 3: Standard Plan */}
          <button
            type="button"
            onClick={() => setSelectedPlanFilter('STANDARD')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              selectedPlanFilter === 'STANDARD'
                ? 'bg-orange-600 text-white border-orange-400 ring-2 ring-orange-500/30 shadow-lg'
                : 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:border-orange-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Standard Plan (₹299/mo)</span>
              <Sparkles className="w-4 h-4 text-orange-500" />
            </div>
            <p className="text-3xl font-extrabold">{metrics.standardSubs}</p>
            <p className="text-[11px] opacity-80 mt-1 flex items-center space-x-1">
              <span>60 monthly post quota + API</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </p>
          </button>

          {/* Card 4: Premium Plan */}
          <button
            type="button"
            onClick={() => setSelectedPlanFilter('PREMIUM')}
            className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
              selectedPlanFilter === 'PREMIUM'
                ? 'bg-amber-600 text-white border-amber-400 ring-2 ring-amber-500/30 shadow-lg'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:border-amber-500'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Premium Plan (₹599/mo)</span>
              <Crown className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-extrabold">{metrics.premiumSubs}</p>
            <p className="text-[11px] opacity-80 mt-1 flex items-center space-x-1">
              <span>100 monthly post quota + Priority</span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </p>
          </button>
        </div>

        {/* Users Table */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Filtered User List ({filteredUsers.length})
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-extrabold uppercase">
                Filter: {selectedPlanFilter}
              </span>
            </div>

            {/* User Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-400 text-xs">Loading platform users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
              No users match the selected plan filter ({selectedPlanFilter}) or search query.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Active Plan</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Posts Uploaded</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        {u.planName === 'PREMIUM' ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 font-bold text-[10px] border border-amber-500/30 flex items-center space-x-1 w-max">
                            <Crown className="w-3 h-3" />
                            <span>PREMIUM (₹599)</span>
                          </span>
                        ) : u.planName === 'STANDARD' ? (
                          <span className="px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-300 font-bold text-[10px] border border-orange-500/30 flex items-center space-x-1 w-max">
                            <Sparkles className="w-3 h-3" />
                            <span>STANDARD (₹299)</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px] border border-slate-300 dark:border-slate-700 w-max inline-block">
                            FREE / EARLY BIRD
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {u.role === 'ADMIN' ? (
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px] border border-rose-500/20">
                            ADMIN
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">USER</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {u.postCount} post(s)
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Articles Directory Section with Live URLs */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 bg-white/80 dark:bg-slate-900/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              <span>Uploaded Blogs & Articles Directory</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Inspect all published articles, draft posts, live URLs, author names, and views.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Status Selector */}
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setPostStatusFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  postStatusFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({posts.length})
              </button>
              <button
                type="button"
                onClick={() => setPostStatusFilter('PUBLISHED')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  postStatusFilter === 'PUBLISHED'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setPostStatusFilter('PENDING_REVIEW')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  postStatusFilter === 'PENDING_REVIEW'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setPostStatusFilter('DRAFT')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  postStatusFilter === 'DRAFT'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Drafts
              </button>
            </div>

            {/* Post Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={postSearchQuery}
                onChange={(e) => setPostSearchQuery(e.target.value)}
                placeholder="Search blog title or author..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-orange-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Posts Table */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading uploaded blog directory...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            No articles found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Article Title & Live Link</th>
                  <th className="py-3.5 px-4">Author (User)</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Views</th>
                  <th className="py-3.5 px-4">Uploaded Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 max-w-xs sm:max-w-md">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">{post.title}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {post.excerpt}
                      </div>

                      {/* Live URL Link */}
                      <a
                        href={post.relativeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-orange-600 dark:text-orange-400 hover:underline mt-1"
                      >
                        <span>View Live Blog</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{post.authorName}</div>
                      <div className="text-[11px] text-slate-500">{post.authorEmail}</div>
                      {post.companyName && (
                        <span className="inline-block text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-0.5">
                          🏢 {post.companyName}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {post.categoryName}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      {post.status === 'PUBLISHED' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                          PUBLISHED
                        </span>
                      ) : post.status === 'PENDING_REVIEW' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] border border-amber-500/20">
                          PENDING
                        </span>
                      ) : post.status === 'DRAFT' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px]">
                          DRAFT
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px]">
                          {post.status}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      {post.views.toLocaleString()}
                    </td>

                    <td className="py-4 px-4 text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
