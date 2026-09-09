import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Shield, CheckCircle, XCircle, Eye, AlertTriangle } from 'lucide-react';
import AdminModerationActions from '@/components/AdminModerationActions';

export default async function AdminModerationPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') redirect('/dashboard');

  const pendingPosts = await prisma.post.findMany({
    where: { status: 'PENDING_REVIEW' },
    include: { author: true, company: true, category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Shield className="w-6 h-6 text-amber-400" />
            <span>Content Moderation Queue ({pendingPosts.length})</span>
          </h1>
          <p className="text-xs text-slate-400">Inspect articles flagged for external link counts, spam patterns, or duplicate text.</p>
        </div>
        <Link href="/admin" className="text-xs text-brand-400 hover:underline">← Back to Admin Panel</Link>
      </div>

      {pendingPosts.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-2">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
          <p className="text-white font-semibold">Moderation Queue is Clean!</p>
          <p className="text-slate-400 text-xs">No pending articles awaiting review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingPosts.map((post) => (
            <div key={post.id} className="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">{post.category.name}</span>
                  <h3 className="text-lg font-bold text-white">{post.title}</h3>
                  <p className="text-xs text-slate-400">
                    By {post.author.name} ({post.author.email}) {post.company ? `• ${post.company.companyName}` : ''}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold self-start sm:self-center">
                  External Links: {post.externalLinksCount}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {post.excerpt}
              </p>

              <AdminModerationActions postId={post.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
