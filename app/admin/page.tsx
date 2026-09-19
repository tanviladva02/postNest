import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminOverviewClient from '@/components/AdminOverviewClient';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Concurrently fetch initial admin metrics
  const [
    totalUsers,
    totalPosts,
    publishedPosts,
    pendingPosts,
    totalCompanies,
    totalMessages,
    unreadMessages,
    standardSubs,
    premiumSubs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.company.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.subscription.count({ where: { plan: { name: 'STANDARD' }, status: 'ACTIVE' } }),
    prisma.subscription.count({ where: { plan: { name: 'PREMIUM' }, status: 'ACTIVE' } }),
  ]);

  const initialMetrics = {
    totalUsers,
    totalPosts,
    publishedPosts,
    pendingPosts,
    totalCompanies,
    totalMessages,
    unreadMessages,
    standardSubs,
    premiumSubs,
    freeSubs: totalUsers - (standardSubs + premiumSubs),
    estRevenue: standardSubs * 299 + premiumSubs * 599,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminOverviewClient initialMetrics={initialMetrics} />
    </div>
  );
}
