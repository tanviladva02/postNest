import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Shield, Users, FileText, DollarSign, AlertCircle, Settings, CheckCircle, MessageSquare } from 'lucide-react';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // System Stats
  const totalUsers = await prisma.user.count();
  const totalPosts = await prisma.post.count();
  const publishedPosts = await prisma.post.count({ where: { status: 'PUBLISHED' } });
  const pendingPosts = await prisma.post.count({ where: { status: 'PENDING_REVIEW' } });
  const totalCompanies = await prisma.company.count();

  // Contact Inquiries
  const totalMessages = await prisma.contactMessage.count();
  const unreadMessages = await prisma.contactMessage.count({ where: { status: 'UNREAD' } });

  // Subscriptions
  const standardSubs = await prisma.subscription.count({ where: { plan: { name: 'STANDARD' }, status: 'ACTIVE' } });
  const premiumSubs = await prisma.subscription.count({ where: { plan: { name: 'PREMIUM' }, status: 'ACTIVE' } });
  const estRevenue = standardSubs * 299 + premiumSubs * 599;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PostNest Admin Control Center</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Platform overview, moderation queue, user inquiries, and dynamic limit configs.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/messages"
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inquiries ({unreadMessages})</span>
          </Link>

          <Link
            href="/admin/moderation"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Moderation Queue ({pendingPosts})</span>
          </Link>

          <Link
            href="/admin/settings"
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white font-semibold text-xs flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Plan Limit Configs</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalUsers}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Contact Inquiries</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{totalMessages}</p>
            {unreadMessages > 0 && (
              <span className="text-xs font-bold text-amber-500">({unreadMessages} new)</span>
            )}
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Published Articles</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{publishedPosts}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Pending Review</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{pendingPosts}</p>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-1 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Est. Monthly Revenue</span>
            <DollarSign className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-3xl font-extrabold text-orange-600 dark:text-orange-400">₹{estRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Subscription breakdown */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white dark:bg-slate-900/60">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Subscription Breakdown</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">Early Bird / Free Users</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-200">{totalUsers - (standardSubs + premiumSubs)}</p>
          </div>
          <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-slate-900 border border-orange-200 dark:border-orange-500/30">
            <p className="text-xs text-orange-600 dark:text-orange-300">Standard Plan (₹299/mo)</p>
            <p className="text-xl font-bold text-orange-600 dark:text-white">{standardSubs}</p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-slate-900 border border-amber-200 dark:border-amber-500/30">
            <p className="text-xs text-amber-700 dark:text-amber-300">Premium Plan (₹599/mo)</p>
            <p className="text-xl font-bold text-amber-700 dark:text-white">{premiumSubs}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
