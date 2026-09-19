'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Edit3, Trash2, AlertTriangle, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';

interface PostItem {
  id: string;
  title: string;
  slug: string;
  status: string;
  scheduledAt?: string | Date | null;
  publishedAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt: string | Date;
  rejectionReason?: string | null;
  views: number;
  category?: { name: string } | null;
  company?: { companyName: string } | null;
}

export default function UserPostsTable({ initialPosts }: { initialPosts: PostItem[] }) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmPost, setConfirmPost] = useState<PostItem | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleDelete = async () => {
    if (!confirmPost) return;
    const postId = confirmPost.id;
    setDeletingId(postId);

    try {
      const res = await fetch(`/api/posts/detail?id=${postId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete article.');
      }

      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setNotification({ type: 'success', message: `"${confirmPost.title}" was deleted successfully.` });
      setConfirmPost(null);
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Error deleting article.' });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-[11px] underline hover:opacity-80 ml-4 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Views</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-4 font-medium text-slate-800 dark:text-slate-200">
                  <div className="space-y-0.5">
                    <p className="truncate max-w-sm text-sm text-slate-900 dark:text-white font-semibold">
                      {post.title}
                    </p>
                    {post.company && (
                      <span className="text-[10px] text-orange-600 dark:text-orange-400">
                        {post.company.companyName}
                      </span>
                    )}
                    {post.rejectionReason && (
                      <p className="text-[10px] text-rose-500 flex items-center space-x-1">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Rejected: {post.rejectionReason}</span>
                      </p>
                    )}
                  </div>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300">{post.category?.name || 'General'}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      post.status === 'PUBLISHED'
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                        : post.status === 'SCHEDULED'
                        ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20'
                        : post.status === 'PENDING_REVIEW'
                        ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                        : post.status === 'REJECTED'
                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {post.status === 'SCHEDULED' && post.scheduledAt
                      ? `SCHEDULED (${new Date(post.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })})`
                      : post.status}
                  </span>
                </td>
                <td className="p-4 text-slate-700 dark:text-slate-300 font-mono">{post.views}</td>
                <td className="p-4 text-slate-500 dark:text-slate-400">
                  {new Date(post.publishedAt || post.createdAt || post.updatedAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2.5">
                    {post.status === 'PUBLISHED' && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                        title="View Live Blog"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    )}

                    <Link
                      href={`/dashboard/create-post?id=${post.id}`}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                      title="Edit Article"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setConfirmPost(post)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {confirmPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-rose-500/30 bg-white dark:bg-slate-900 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Article?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 dark:text-white">&ldquo;{confirmPost.title}&rdquo;</strong>?
              {confirmPost.status === 'PUBLISHED' && (
                <span className="block mt-1 text-rose-600 dark:text-rose-400 font-semibold">
                  This published post will be removed from Google and reader feeds.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmPost(null)}
                disabled={Boolean(deletingId)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={Boolean(deletingId)}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-rose-500/20 transition-all disabled:opacity-50"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
