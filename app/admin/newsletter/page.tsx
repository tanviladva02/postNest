'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Send,
  Users,
  UserCheck,
  UserX,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Code,
  Loader2,
  FileText,
  Paperclip,
} from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  source?: string | null;
  createdAt: string;
}

interface RecentPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string | null;
  createdAt: string;
}

const DEFAULT_NEWSLETTER_TEMPLATE = `<h2>🔥 Top Developer Stories of the Week</h2>
<p>Here are the latest handpicked engineering guides and articles published on PostNest:</p>

<div style="background-color: #1e293b; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #334155;">
  <h3 style="margin-top: 0; color: #f97316;">🚀 How to Scale Web Applications in 2026</h3>
  <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 14px;">Discover modern patterns for building high-concurrency Node.js and Next.js applications without losing performance.</p>
  <a href="https://www.postnest.in" style="background-color: #f97316; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 13px;">Read Full Article →</a>
</div>

<div style="background-color: #1e293b; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #334155;">
  <h3 style="margin-top: 0; color: #f97316;">📝 Free Technical Writing & Guest Posting</h3>
  <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 14px;">Did you know you can publish your developer tutorials on PostNest completely free? Share your knowledge with thousands of readers today.</p>
  <a href="https://www.postnest.in/dashboard/create-post" style="background-color: #f97316; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 13px;">Start Writing Now →</a>
</div>

<p>Stay curious & keep building,<br/><strong>The PostNest Team</strong></p>`;

export default function AdminNewsletterPage() {
  const [metrics, setMetrics] = useState({
    totalCount: 0,
    activeCount: 0,
    unsubscribedCount: 0,
  });
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Form State
  const [subject, setSubject] = useState('🔥 PostNest Developer Digest: Top Articles & Tech Insights');
  const [previewText, setPreviewText] = useState('Check out this week\'s handpicked developer tutorials and publishing updates on PostNest.');
  const [contentHtml, setContentHtml] = useState(DEFAULT_NEWSLETTER_TEMPLATE);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Broadcast & Test Modal States
  const [testEmail, setTestEmail] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchNewsletterData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin/newsletter');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics || { totalCount: 0, activeCount: 0, unsubscribedCount: 0 });
        setSubscribers(data.subscribers || []);
        setRecentPosts(data.recentPosts || []);
      }
    } catch (error) {
      console.error('Failed to load newsletter data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsletterData();
  }, [fetchNewsletterData]);

  // Insert post snippet into template
  const handleInsertPost = (post: RecentPost) => {
    const postSnippet = `
<div style="background-color: #1e293b; border-radius: 12px; padding: 20px; margin: 20px 0; border: 1px solid #334155;">
  <h3 style="margin-top: 0; color: #f97316;">${post.title}</h3>
  <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 14px;">${post.excerpt || 'Read the full story on PostNest.'}</p>
  <a href="https://www.postnest.in/posts/${post.slug}" style="background-color: #f97316; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 13px;">Read Full Article →</a>
</div>`;

    setContentHtml((prev) => prev + postSnippet);
    setStatusMessage({ type: 'success', text: `Inserted "${post.title}" into newsletter content!` });
  };

  // Send Test Email
  const handleSendTestEmail = async () => {
    if (!subject.trim() || !contentHtml.trim()) {
      setStatusMessage({ type: 'error', text: 'Subject and HTML content are required to send a test.' });
      return;
    }

    setSendingTest(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/newsletter/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          previewText,
          contentHtml,
          testOnly: true,
          testEmail: testEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({ type: 'success', text: data.message || 'Test email sent successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to send test email.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error sending test email.' });
    } finally {
      setSendingTest(false);
    }
  };

  // Broadcast to all active subscribers
  const handleBroadcast = async () => {
    setShowConfirmModal(false);
    setBroadcasting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/newsletter/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          previewText,
          contentHtml,
          testOnly: false,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `🎉 ${data.message || 'Newsletter broadcast completed successfully!'}`,
        });
        fetchNewsletterData();
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Broadcast failed. Please check server logs.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error processing newsletter broadcast.' });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/admin" className="hover:text-orange-500 transition-colors flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Center</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold">Newsletter Broadcast</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-3">
            <span>Newsletter Broadcast Center</span>
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-500/20">
              Live Dispatch
            </span>
          </h1>
        </div>

        <button
          onClick={fetchNewsletterData}
          disabled={refreshing}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-orange-500 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Subscribers</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics.activeCount}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Subscriptions</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics.totalCount}</p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 flex items-center space-x-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center shrink-0">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Unsubscribed</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{metrics.unsubscribedCount}</p>
          </div>
        </div>
      </div>

      {/* Global Status Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center space-x-3 text-sm font-semibold border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Composer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form & Editor (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-orange-500" />
                  <span>Compose Newsletter</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Draft subject line, preview text, and HTML body for your broadcast.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                    activeTab === 'edit'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-orange-500" />
                  <span>Edit Content</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                    activeTab === 'preview'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-orange-500" />
                  <span>Live Email Preview</span>
                </button>
              </div>
            </div>

            {/* Subject Line Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Email Subject Line *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. 🔥 Weekly Tech Digest: Top 5 Developer Guides on PostNest"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>

            {/* Preheader Text Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Preview Text (Preheader)
              </label>
              <input
                type="text"
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                placeholder="Snippets visible in email inbox previews (optional)"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>

            {/* Editor vs Preview Tab View */}
            {activeTab === 'edit' ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    HTML Newsletter Body *
                  </label>
                  <button
                    type="button"
                    onClick={() => setContentHtml(DEFAULT_NEWSLETTER_TEMPLATE)}
                    className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Reset to Default Template</span>
                  </button>
                </div>
                <textarea
                  rows={14}
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  placeholder="Enter HTML layout for your newsletter..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all leading-relaxed"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Live Email Render Preview
                </label>
                <div className="rounded-2xl border border-slate-800 bg-[#080c14] overflow-hidden p-4 sm:p-8">
                  {/* Outer Frame Wrapper mimicking email container */}
                  <div className="max-w-[560px] mx-auto bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-200">
                    <div className="p-6 text-center border-b border-slate-800 bg-gradient-to-b from-orange-500/10 to-transparent">
                      <p className="text-xl font-extrabold text-white tracking-tight">
                        Post<span className="text-orange-500">Nest</span>
                      </p>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
                        Developer & Tech Digest
                      </p>
                    </div>
                    <div
                      className="p-6 text-sm text-slate-300 leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                    <div className="p-4 bg-[#090d16] border-t border-slate-800 text-center text-[10px] text-slate-500">
                      © {new Date().getFullYear()} PostNest.in • Publish Like a Pro.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Test Email Section */}
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="Test recipient email (optional)"
                  className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-orange-500 w-full sm:w-60"
                />
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={sendingTest || broadcasting}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-all whitespace-nowrap disabled:opacity-50 flex items-center space-x-1.5 shrink-0"
                >
                  {sendingTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Paperclip className="w-3.5 h-3.5" />}
                  <span>Send Test Email</span>
                </button>
              </div>

              {/* Live Broadcast Trigger */}
              <button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                disabled={broadcasting || metrics.activeCount === 0}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm transition-all shadow-md shadow-orange-500/25 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {broadcasting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Broadcasting to Subscribers...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Broadcast to {metrics.activeCount} Subscriber(s)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Article Picker Sidebar (1 col wide) */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Insert Recent Articles</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any published article below to append an email card to your newsletter draft:
            </p>

            {recentPosts.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No published articles found.</p>
            ) : (
              <div className="space-y-2.5">
                {recentPosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => handleInsertPost(post)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 text-left transition-all space-y-1 group"
                  >
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-200 group-hover:text-orange-500 transition-colors line-clamp-1">
                      {post.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug">
                      {post.excerpt || 'No description preview available.'}
                    </p>
                    <span className="inline-block text-[10px] font-semibold text-orange-500 group-hover:underline pt-0.5">
                      + Insert Card into Editor
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscribers Table Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-500" />
              <span>Subscriber Directory</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              List of users who subscribed to PostNest Developer Digest.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            Total: {subscribers.length}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400 flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
            <span>Loading subscribers...</span>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            No newsletter subscribers registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{sub.email}</td>
                    <td className="py-3.5 px-4">
                      {sub.status === 'ACTIVE' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                          Active
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-[10px] border border-rose-500/20">
                          Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{sub.source || 'HOMEPAGE'}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(sub.createdAt).toLocaleDateString(undefined, {
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

      {/* Safety Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-orange-500/30 bg-slate-900 text-white space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/30 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold">Confirm Broadcast Dispatch</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                You are about to broadcast this newsletter email to <strong>{metrics.activeCount} active subscriber(s)</strong>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-slate-400">Subject Line:</p>
              <p className="text-white font-bold truncate">{subject}</p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBroadcast}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs shadow-md shadow-orange-500/25 transition-all"
              >
                Yes, Send Broadcast Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
