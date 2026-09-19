'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  Clock,
  ShieldCheck,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowRight,
  Info,
  Loader2,
} from 'lucide-react';

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('id');

  const featuredFileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [userCompanies, setUserCompanies] = useState<{ id: string; companyName: string }[]>([]);
  const [userLimits, setUserLimits] = useState<any>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageMode, setFeaturedImageMode] = useState<'upload' | 'url'>('upload');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [publishMode, setPublishMode] = useState<'immediate' | 'schedule'>('immediate');
  const [scheduledAt, setScheduledAt] = useState('');

  // Quality Inspector Drawer State
  const [showQualityDetails, setShowQualityDetails] = useState(false);
  const [qualityModalOpen, setQualityModalOpen] = useState(false);
  const [qualityErrors, setQualityErrors] = useState<string[]>([]);

  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [uploadingFeatured, setUploadingFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [publishingStep, setPublishingStep] = useState<number>(0);
  const [publishingAction, setPublishingAction] = useState<'publish' | 'schedule' | 'draft'>('publish');
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper to fetch fresh single-use CSRF token
  const fetchFreshCsrfToken = async (): Promise<string> => {
    try {
      const res = await fetch('/api/csrf');
      if (res.ok) {
        const data = await res.json();
        if (data.csrfToken) {
          setCsrfToken(data.csrfToken);
          return data.csrfToken;
        }
      }
    } catch (err) {
      console.error('Error fetching CSRF token:', err);
    }
    return '';
  };

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

  // Load Categories, Companies, Limits, CSRF Token, and Existing Post
  useEffect(() => {
    async function initData() {
      try {
        fetchFreshCsrfToken();

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

        const userRes = await fetch('/api/user/me');
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.limits) {
            setUserLimits(userData.limits);
          }
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
            if (postData.post.status === 'SCHEDULED' && postData.post.scheduledAt) {
              setPublishMode('schedule');
              const d = new Date(postData.post.scheduledAt);
              const pad = (n: number) => n.toString().padStart(2, '0');
              const localIso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
              setScheduledAt(localIso);
            }
          }
        }
      } catch (err) {
        console.error('Failed loading form data:', err);
      }
    }
    initData();
  }, [postId]);

  // Real-time Client-Side Quality Analysis
  const qualityStats = useMemo(() => {
    const cleanTitle = title.trim();
    const cleanExcerpt = excerpt.trim();
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = plainText ? plainText.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;

    const hasSubheading = /<h[2-4][^>]*>|^(#{2,4}\s+.+)/gim.test(content);
    const urlRegex = /href=["'](https?:\/\/[^"']+)["']/gi;
    const linkMatches = content.match(urlRegex) || [];
    const externalLinksCount = linkMatches.length;

    const titleValid = cleanTitle.length >= 10 && cleanTitle.length <= 150;
    const wordCountValid = wordCount >= 150;
    const excerptValid = cleanExcerpt.length >= 25;
    const linksValid = externalLinksCount <= 5;
    const hasImage = Boolean(featuredImage);

    let score = 0;
    if (titleValid) score += 20;
    else if (cleanTitle.length >= 5) score += 10;

    if (wordCount >= 300) score += 30;
    else if (wordCount >= 150) score += 25;
    else score += Math.round((wordCount / 150) * 15);

    if (hasSubheading) score += 20;
    if (excerptValid) score += 15;
    if (linksValid) score += 15;

    score = Math.min(100, Math.max(0, score));

    const errors: string[] = [];
    if (!titleValid) errors.push('Title must be between 10 and 150 characters.');
    if (!wordCountValid) errors.push(`Article content is too short (${wordCount} words). Minimum 150 words required.`);
    if (!hasSubheading) errors.push('Add at least one section subheading (H2 or H3) for readable structure.');
    if (!excerptValid) errors.push('Short summary / meta excerpt must be at least 25 characters.');
    if (!linksValid) errors.push(`Too many external links (${externalLinksCount} found). Maximum allowed is 5.`);

    return {
      score,
      wordCount,
      hasSubheading,
      externalLinksCount,
      titleValid,
      wordCountValid,
      excerptValid,
      linksValid,
      hasImage,
      errors,
      canPublish: errors.length === 0 && score >= 70,
    };
  }, [title, excerpt, content, featuredImage]);

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
    setQualityErrors([]);

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setStatusMsg({ type: 'error', text: 'Please fill in Title, Excerpt, and Blog Content.' });
      return;
    }

    // If publishing or scheduling, run quality check enforcement
    if (publish || publishMode === 'schedule') {
      if (!qualityStats.canPublish) {
        setQualityErrors(qualityStats.errors);
        setQualityModalOpen(true);
        return;
      }
    }

    const actionType = publish && publishMode === 'schedule' ? 'schedule' : publish ? 'publish' : 'draft';
    setPublishingAction(actionType);
    setPublishingStep(1);
    setLoading(true);

    try {
      // Step 1: Quality & SEO validation done
      await new Promise((res) => setTimeout(res, 400));
      setPublishingStep(2); // Step 2: Payload & content formatting

      let activeToken = csrfToken;
      if (!activeToken) {
        activeToken = await fetchFreshCsrfToken();
      }

      const payload: any = {
        id: postId || undefined,
        title,
        slug,
        categoryId,
        companyId: companyId || null,
        featuredImage,
        excerpt,
        content,
        tags,
        shouldPublish: publishMode === 'immediate' && publish,
        csrfToken: activeToken,
      };

      if (publish && publishMode === 'schedule') {
        if (!scheduledAt) {
          throw new Error('Please pick a date and time for scheduled publishing.');
        }
        payload.scheduledAt = new Date(scheduledAt).toISOString();
      }

      const res = await fetch('/api/posts/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-postnest-csrf-token': activeToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Fetch a new CSRF token for next attempt
        fetchFreshCsrfToken();
        if (data.qualityReport && data.qualityReport.errors) {
          setQualityErrors(data.qualityReport.errors);
          setQualityModalOpen(true);
        }
        throw new Error(data.error || 'Failed to process article.');
      }

      // Step 3: Registering sitemaps & API indexing
      setPublishingStep(3);
      await new Promise((res) => setTimeout(res, 600));

      // Step 4: Celebration completion
      setPublishingStep(4);

      setStatusMsg({
        type: 'success',
        text: data.message || 'Action completed successfully!',
      });

      setTimeout(() => {
        router.push('/dashboard/posts');
      }, 1200);
    } catch (err: any) {
      setPublishingStep(0);
      setLoading(false);
      setStatusMsg({ type: 'error', text: err.message });
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
            Publish high-ranking technical articles, product announcements, and company case studies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center space-x-1.5 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-50"
          >
            {loading && publishingAction === 'draft' ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                <span>Saving Draft...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
          >
            {loading && (publishingAction === 'publish' || publishingAction === 'schedule') ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{publishMode === 'schedule' ? 'Scheduling...' : 'Publishing...'}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{publishMode === 'schedule' ? 'Schedule Article' : 'Publish Article'}</span>
              </>
            )}
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

      {/* Real-Time Quality Inspector Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                qualityStats.score >= 75
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : qualityStats.score >= 50
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              }`}
            >
              {qualityStats.score}%
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Blog Quality Inspector</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    qualityStats.score >= 75
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : qualityStats.score >= 50
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  {qualityStats.score >= 75 ? 'Ready to Publish' : qualityStats.score >= 50 ? 'Needs Refinement' : 'Draft / Incomplete'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Word Count: <span className="font-semibold">{qualityStats.wordCount} / 150 min</span> • Links: <span className="font-semibold">{qualityStats.externalLinksCount}/5 max</span> • Subheadings: <span className="font-semibold">{qualityStats.hasSubheading ? 'Yes' : 'Missing'}</span>
              </p>
            </div>
          </div>

          
        </div>

        {/* Expandable Checklist Details */}
        {showQualityDetails && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              {qualityStats.titleValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className={qualityStats.titleValid ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}>
                Title Length (10-150 chars): {title.trim().length} chars
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {qualityStats.wordCountValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span className={qualityStats.wordCountValid ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}>
                Word Count (Min 150 words): {qualityStats.wordCount} words
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {qualityStats.hasSubheading ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className={qualityStats.hasSubheading ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}>
                Section Headings (H2 / H3 tags)
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {qualityStats.excerptValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span className={qualityStats.excerptValid ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}>
                Meta Excerpt (Min 25 chars): {excerpt.trim().length} chars
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {qualityStats.linksValid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              )}
              <span className={qualityStats.linksValid ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}>
                External Links Spam Guard (Max 5): {qualityStats.externalLinksCount}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {qualityStats.hasImage ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span className={qualityStats.hasImage ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}>
                Featured Cover Image {qualityStats.hasImage ? 'Set' : '(Recommended)'}
              </span>
            </div>
          </div>
        )}
      </div>

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

        {/* Company Selector & Publishing Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Publishing Mode: Immediate or Scheduled */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Publishing Schedule</span>
              {userLimits && !userLimits.hasScheduling && (
                <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Standard/Premium
                </span>
              )}
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setPublishMode('immediate')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  publishMode === 'immediate'
                    ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Publish Immediately
              </button>
              <button
                type="button"
                onClick={() => {
                  if (userLimits && !userLimits.hasScheduling && !userLimits.isUnlimited) {
                    alert('Post scheduling is available on Standard and Premium plans. Please upgrade to schedule posts.');
                    return;
                  }
                  setPublishMode('schedule');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center space-x-1.5 ${
                  publishMode === 'schedule'
                    ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Schedule for Later</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scheduled Date Picker if mode is schedule */}
        {publishMode === 'schedule' && (
          <div className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Select Target Publish Date & Time</span>
              </label>
              <span className="text-[11px] text-slate-500">Auto-publishes automatically</span>
            </div>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
        )}

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
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>Short Summary / Meta Excerpt</span>
            <span className={`text-[11px] ${excerpt.trim().length >= 25 ? 'text-emerald-500' : 'text-slate-400'}`}>
              {excerpt.trim().length} / 25 min chars
            </span>
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

      {/* Pre-Publish Quality Review Modal */}
      {qualityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-rose-500/30 bg-white dark:bg-slate-900 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Quality Inspection Required</h3>
                  <p className="text-xs text-slate-500">PostNest Quality Standards Score: {qualityStats.score}/100</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQualityModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              To guarantee maximum Google indexing and high reader engagement, please resolve the following quality items before publishing:
            </p>

            <ul className="space-y-2">
              {qualityErrors.map((err, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-700 dark:text-rose-300 flex items-start space-x-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{err}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setQualityModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs transition-colors shadow-md shadow-orange-500/20"
              >
                Return to Editor & Fix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Publishing Progress Loading Overlay Modal */}
      {loading && publishingStep > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-orange-500/30 bg-slate-900 text-white space-y-6 text-center shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-32 bg-orange-500/20 blur-3xl pointer-events-none -z-10" />

            {/* Icon Header */}
            <div className="relative inline-flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500/20 via-amber-500/20 to-orange-500/10 border border-orange-500/40 flex items-center justify-center shadow-lg">
                {publishingStep === 4 ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                ) : (
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                {publishingStep === 4
                  ? (publishingAction === 'schedule'
                      ? '🎉 Article Scheduled Successfully!'
                      : publishingAction === 'publish'
                      ? '🎉 Article Published Successfully!'
                      : '✅ Draft Saved!')
                  : (publishingAction === 'schedule'
                      ? 'Scheduling Your Article...'
                      : publishingAction === 'publish'
                      ? 'Publishing Your Article...'
                      : 'Saving Draft...')}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {publishingStep === 4
                  ? 'Redirecting to your articles dashboard...'
                  : 'Please keep this window open while we process your submission.'}
              </p>
            </div>

            {/* Smooth Fill Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  publishingStep === 4
                    ? 'bg-emerald-500 w-full'
                    : publishingStep === 3
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 w-4/5'
                    : publishingStep === 2
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 w-1/2'
                    : 'bg-orange-500 w-1/4'
                }`}
              />
            </div>

            {/* Live Progress Steps */}
            <div className="space-y-2 text-left text-xs pt-2 border-t border-slate-800/80">
              <div
                className={`flex items-center space-x-2.5 transition-colors ${
                  publishingStep >= 1 ? 'text-slate-200' : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    publishingStep >= 1
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {publishingStep > 1 ? '✓' : '1'}
                </div>
                <span className={publishingStep === 1 ? 'font-bold text-orange-400 animate-pulse' : ''}>
                  Analyzing SEO quality score & readability...
                </span>
              </div>

              <div
                className={`flex items-center space-x-2.5 transition-colors ${
                  publishingStep >= 2 ? 'text-slate-200' : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    publishingStep >= 2
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {publishingStep > 2 ? '✓' : '2'}
                </div>
                <span className={publishingStep === 2 ? 'font-bold text-orange-400 animate-pulse' : ''}>
                  Formatting HTML & optimizing cover images...
                </span>
              </div>

              <div
                className={`flex items-center space-x-2.5 transition-colors ${
                  publishingStep >= 3 ? 'text-slate-200' : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    publishingStep >= 3
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {publishingStep >= 4 ? '✓' : '3'}
                </div>
                <span className={publishingStep === 3 ? 'font-bold text-orange-400 animate-pulse' : ''}>
                  Syndicating to PostNest network & sitemaps...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
