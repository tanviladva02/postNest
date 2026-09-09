'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FileText,
  Sparkles,
  Save,
  Send,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  Code,
  Quote,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [userCompanies, setUserCompanies] = useState<{ id: string; companyName: string }[]>([]);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-generate URL slug from title
  useEffect(() => {
    if (!postId) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setSlug(generatedSlug);
    }
  }, [title, postId]);

  // Load Categories & Companies & Existing Post if editing
  useEffect(() => {
    async function initData() {
      try {
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (catData.categories) {
          setCategories(catData.categories);
          if (catData.categories.length > 0) setCategoryId(catData.categories[0].id);
        }

        const compRes = await fetch('/api/user/companies');
        const compData = await compRes.json();
        if (compData.companies) {
          setUserCompanies(compData.companies);
        }

        if (postId) {
          const postRes = await fetch(`/api/posts/detail?id=${postId}`);
          const postData = await postRes.json();
          if (postData.post) {
            setTitle(postData.post.title);
            setSlug(postData.post.slug);
            setCategoryId(postData.post.categoryId);
            setCompanyId(postData.post.companyId || '');
            setFeaturedImage(postData.post.featuredImage || '');
            setExcerpt(postData.post.excerpt);
            setContent(postData.post.content);
          }
        }
      } catch (err) {
        console.error('Failed loading form data:', err);
      }
    }
    initData();
  }, [postId]);

  // Helper formatting shortcuts for Rich Editor
  const insertTag = (openTag: string, closeTag: string) => {
    setContent((prev) => `${prev}${openTag}Text content here${closeTag}`);
  };

  const handleSave = async (publish: boolean) => {
    setStatusMsg(null);
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setStatusMsg({ type: 'error', text: 'Please fill in Title, Excerpt, and Blog Content.' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/posts/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: postId || undefined,
          title,
          slug,
          categoryId,
          companyId: companyId || null,
          featuredImage,
          excerpt,
          content,
          tags,
          shouldPublish: publish,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save article.');
      }

      setStatusMsg({
        type: 'success',
        text: publish
          ? (data.status === 'PUBLISHED' ? 'Article published successfully!' : 'Article submitted for quality review!')
          : 'Draft saved successfully!',
      });

      setTimeout(() => {
        router.push('/dashboard/posts');
      }, 1500);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-brand-400" />
            <span>{postId ? 'Edit Blog Article' : 'Create Blog Article'}</span>
          </h1>
          <p className="text-xs text-slate-400">Write engaging stories, product guides, or company announcements.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center space-x-1.5 border border-slate-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl text-xs font-medium border flex items-center space-x-2 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Form Settings */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Blog Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Top 10 Developer Tools for Startups in 2026"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-base font-semibold focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* URL Slug & Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-300">URL Slug (SEO Friendly)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="top-10-developer-tools-2026"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-brand-500"
            >
              {categories.length === 0 && (
                <option value="">Loading categories...</option>
              )}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Selector & Featured Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Attach Company Profile (Optional)</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-brand-500"
            >
              <option value="">-- Personal / Independent Author --</option>
              {userCompanies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Featured Image URL</label>
            <input
              type="url"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Short Summary / Meta Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Brief summary displayed on article preview cards and Google search snippets..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Rich Text Editor Section */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Blog Body Content (HTML / Rich Text)</label>
            <span className="text-[10px] text-slate-500 font-mono">Use formatting toolbar to format headings & code</span>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-t-xl bg-slate-900 border border-slate-700 border-b-0">
            <button
              type="button"
              onClick={() => insertTag('<h2>', '</h2>')}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<h3>', '</h3>')}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<strong>', '</strong>')}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<em>', '</em>')}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<a href="https://targetwebsite.com" target="_blank">', '</a>')}
              className="p-1.5 rounded hover:bg-slate-800 text-sky-400 hover:text-sky-300"
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<ul>\n  <li>', '</li>\n</ul>')}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Unordered List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<pre><code>', '</code></pre>')}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTag('<blockquote>', '</blockquote>')}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder="Write your detailed blog post here using standard HTML tags or the toolbar above..."
            className="w-full px-4 py-3 rounded-b-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm font-mono focus:outline-none focus:border-brand-500 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}
