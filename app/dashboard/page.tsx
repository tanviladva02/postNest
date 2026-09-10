import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkUserPublishingLimits } from '@/lib/publishing-limits';
import {
  FileText,
  PlusCircle,
  Clock,
  Zap,
  TrendingUp,
  Building2,
  Key,
  Shield,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export default async function DashboardOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const limits = await checkUserPublishingLimits(user.id);

  // Calculate percentages
  const dailyPercentage = limits.dailyLimit > 0
    ? Math.min(100, Math.round((limits.currentDailyCount / limits.dailyLimit) * 100))
    : 0;

  const monthlyPercentage = Math.min(
    100,
    Math.round((limits.currentMonthlyCount / limits.monthlyLimit) * 100)
  );

  // Query Recent Posts
  const recentPosts = await prisma.post.findMany({
    where: { authorId: user.id },
    take: 5,
    orderBy: { updatedAt: 'desc' },
    include: { category: true },
  });

  const totalPostsCount = await prisma.post.count({ where: { authorId: user.id } });
  const publishedCount = await prisma.post.count({ where: { authorId: user.id, status: 'PUBLISHED' } });
  const draftCount = await prisma.post.count({ where: { authorId: user.id, status: 'DRAFT' } });
  const pendingCount = await prisma.post.count({ where: { authorId: user.id, status: 'PENDING_REVIEW' } });

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white dark:bg-slate-900/60">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Welcome back, {user.name}!</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your publishing quotas, companies, and article performance.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/create-post"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 shadow-md shadow-orange-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Blog</span>
          </Link>
        </div>
      </div>

      {/* Plan Limits Progress Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Quota Gauge */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Publishing Limit</h3>
            </div>
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">
              {limits.currentDailyCount} / {limits.dailyLimit} Posts Today
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${dailyPercentage}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500">
            Current Tier: <span className="text-slate-800 dark:text-slate-200 font-semibold">{limits.planName}</span>. Resets every 24 hours.
          </p>
        </div>

        {/* Monthly Quota Gauge */}
        <div className="glass-card p-6 rounded-2xl space-y-4 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Monthly Plan Quota</h3>
            </div>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              {limits.currentMonthlyCount} / {limits.monthlyLimit} Posts
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-900 overflow-hidden border border-slate-200 dark:border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${monthlyPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Need more capacity?</span>
            <Link href="/dashboard/subscription" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center space-x-1">
              <span>Upgrade Plan</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-xl space-y-1 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">Total Posts</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalPostsCount}</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">Published</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{publishedCount}</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">Drafts</p>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{draftCount}</p>
        </div>

        <div className="glass-card p-4 rounded-xl space-y-1 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">Pending Review</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</p>
        </div>
      </div>

      {/* Recent Posts Activity */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900/60">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Articles Activity</h2>
          <Link href="/dashboard/posts" className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold">
            View All Posts →
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <FileText className="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
            <p className="text-slate-500 text-xs">You haven&apos;t created any articles yet.</p>
            <Link
              href="/dashboard/create-post"
              className="inline-block px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Create Your First Blog Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-3 font-semibold">Title</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">{post.title}</td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{post.category.name}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                            : post.status === 'PENDING_REVIEW'
                            ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{new Date(post.updatedAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <Link
                        href={post.status === 'PUBLISHED' ? `/blog/${post.slug}` : `/dashboard/create-post?id=${post.id}`}
                        className="text-orange-600 dark:text-orange-400 hover:underline font-semibold"
                      >
                        {post.status === 'PUBLISHED' ? 'View' : 'Edit'}
                      </Link>
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
