import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { FileText, PlusCircle } from 'lucide-react';
import UserPostsTable from '@/components/UserPostsTable';

export default async function MyPostsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: { category: true, company: true },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Articles</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">View performance stats, status, and manage your content.</p>
        </div>

        <Link
          href="/dashboard/create-post"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs flex items-center space-x-2 shadow-md shadow-orange-500/20 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Blog Post</span>
        </Link>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900/60 p-1 sm:p-2">
        {posts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">No posts found in your account.</p>
            <Link
              href="/dashboard/create-post"
              className="inline-block px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Write Your First Article
            </Link>
          </div>
        ) : (
          <UserPostsTable initialPosts={posts as any} />
        )}
      </div>
    </div>
  );
}

