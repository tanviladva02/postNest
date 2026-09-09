import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { FileText, PlusCircle, ExternalLink, Eye, Trash2, Edit3, ShieldAlert } from 'lucide-react';

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
          <h1 className="text-2xl font-bold text-white">My Published & Draft Articles</h1>
          <p className="text-xs text-slate-400">View performance stats, status, and manage your content.</p>
        </div>

        <Link
          href="/dashboard/create-post"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Blog Post</span>
        </Link>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-slate-300 text-sm font-medium">No posts found in your account.</p>
            <Link
              href="/dashboard/create-post"
              className="inline-block px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-semibold"
            >
              Write Your First Article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Views</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-medium text-slate-200">
                      <div className="space-y-0.5">
                        <p className="truncate max-w-sm text-sm text-white font-semibold">{post.title}</p>
                        {post.company && (
                          <span className="text-[10px] text-sky-400">{post.company.companyName}</span>
                        )}
                        {post.rejectionReason && (
                          <p className="text-[10px] text-rose-400 flex items-center space-x-1">
                            <ShieldAlert className="w-3 h-3" />
                            <span>Rejected: {post.rejectionReason}</span>
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{post.category.name}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : post.status === 'PENDING_REVIEW'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : post.status === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-300 font-mono">{post.views}</td>
                    <td className="p-4 text-slate-400">{new Date(post.updatedAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right space-x-3">
                      {post.status === 'PUBLISHED' && (
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      )}
                      <Link
                        href={`/dashboard/create-post?id=${post.id}`}
                        className="text-brand-400 hover:text-brand-300 font-semibold inline-flex items-center space-x-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
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
