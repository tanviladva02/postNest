'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatBlogContent } from '@/lib/formatContent';
import TipTapEditor from '@/components/editor/TipTapEditor';
import {
  FileText,
  Sparkles,
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Edit3,
  X,
  Link2,
  UploadCloud,
} from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const featuredFileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [userCompanies, setUserCompanies] = useState<{ id: string; companyName: string }[]>([]);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageMode, setFeaturedImageMode] = useState<'upload' | 'url'>('upload');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [uploadingFeatured, setUploadingFeatured] = useState(false);

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
            if (postData.post.featuredImage) {
              setFeaturedImageMode(postData.post.featuredImage.startsWith('/uploads/') ? 'upload' : 'url');
            }
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

  // Upload file to /api/upload
  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to upload image');
    }

    return data.url;
  };

  // Handle Featured Image File Upload
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFeatured(true);
      setStatusMsg(null);
      const url = await uploadFile(file);
      setFeaturedImage(url);
      setStatusMsg({ type: 'success', text: 'Featured cover image uploaded successfully!' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setUploadingFeatured(false);
      if (featuredFileInputRef.current) featuredFileInputRef.current.value = '';
    }
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
      {/* Hidden file input for featured image upload */}
      <input
        type="file"
        ref={featuredFileInputRef}
        onChange={handleFeaturedImageUpload}
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-orange-500" />
            <span>{postId ? 'Edit Blog Article' : 'Create Blog Article'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish like a pro: write engaging stories, product guides, engineering blogs, or announcements.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
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
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
              : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
          }`}
        >
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 bg-white dark:bg-slate-900/60">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Blog Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Building Scalable Microservices with Node.js and Next.js in 2026"
            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* URL Slug & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">URL Slug (SEO Friendly)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="building-scalable-microservices-2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-colors"
            >
              {categories.length === 0 && <option value="">Loading categories...</option>}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Company Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Publish as Company (Optional)</label>
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-colors"
          >
            <option value="">-- Personal / Independent Author --</option>
            {userCompanies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.companyName}
              </option>
            ))}
          </select>
        </div>

        {/* Featured Cover Image Section (Local Upload OR Paste URL) */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Featured Cover Image
            </label>
            <div className="flex items-center space-x-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setFeaturedImageMode('upload')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  featuredImageMode === 'upload'
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Upload from Computer
              </button>
              <button
                type="button"
                onClick={() => setFeaturedImageMode('url')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  featuredImageMode === 'url'
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Paste Image URL
              </button>
            </div>
          </div>

          {featuredImageMode === 'upload' ? (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => featuredFileInputRef.current?.click()}
                disabled={uploadingFeatured}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 bg-slate-50 dark:bg-slate-950 flex items-center justify-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors disabled:opacity-50"
              >
                <UploadCloud className="w-4 h-4 text-orange-500" />
                <span>{uploadingFeatured ? 'Uploading...' : 'Choose Image File from Folder'}</span>
              </button>
              <span className="text-[11px] text-slate-500">Supports PNG, JPG, WebP, GIF (Max 5MB)</span>
            </div>
          ) : (
            <div className="relative">
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          )}

          {/* Image Preview if set */}
          {featuredImage && (
            <div className="relative mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 max-h-48 w-full max-w-md bg-slate-100 dark:bg-slate-950">
              <img src={featuredImage} alt="Featured cover" className="w-full h-48 object-cover" />
              <button
                type="button"
                onClick={() => setFeaturedImage('')}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white transition-colors"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Short Summary / Meta Excerpt */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Short Summary / Meta Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Brief summary displayed on article preview cards, Hashnode-style feeds, and Google search snippets..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Rich Text Editor Section with Write / Live Preview */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-orange-500" />
                <span>Article Body</span>
              </label>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                WYSIWYG
              </span>
            </div>
            <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => setEditorMode('write')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                  editorMode === 'write'
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('preview')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                  editorMode === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>
            </div>
          </div>

          {/* Editor Body */}
          {editorMode === 'write' ? (
            <TipTapEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your article... Use the toolbar above for H1-H6 headings, formatting, links, and direct ImageKit CDN upload."
            />
          ) : (
            <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-[380px] shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Live Reader Preview</span>
                </div>
                <span className="text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">WYSIWYG Mode</span>
              </div>
              <div
                className="blog-prose"
                dangerouslySetInnerHTML={{ __html: formatBlogContent(content || '<p class="text-slate-400 italic">Start writing in Write mode to see live rendered preview...</p>') }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
