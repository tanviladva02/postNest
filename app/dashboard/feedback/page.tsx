'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  Bug,
  Lightbulb,
  AlertTriangle,
  Send,
  CheckCircle2,
  Loader2,
  Clock,
  ThumbsUp,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: 'FEEDBACK' | 'REVIEW' | 'SUGGESTION' | 'ISSUE' | 'BUG';
  rating?: number | null;
  subject?: string | null;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

const CATEGORIES = [
  { id: 'REVIEW', label: 'Review & Rating', icon: Star, color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  { id: 'SUGGESTION', label: 'Feature Suggestion', icon: Lightbulb, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30' },
  { id: 'BUG', label: 'Report a Bug', icon: Bug, color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
  { id: 'ISSUE', label: 'Technical Issue', icon: AlertTriangle, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
  { id: 'FEEDBACK', label: 'General Feedback', icon: MessageSquare, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
];

export default function FeedbackPage() {
  const [type, setType] = useState<string>('REVIEW');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingHistory, setFetchingHistory] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [history, setHistory] = useState<FeedbackItem[]>([]);

  // Fetch past feedbacks submitted by the user
  const fetchFeedbackHistory = async () => {
    try {
      setFetchingHistory(true);
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (res.ok && data.feedbacks) {
        setHistory(data.feedbacks);
      }
    } catch (err) {
      console.error('Error fetching feedback history:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchFeedbackHistory();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!message || message.trim().length < 5) {
      setError('Please provide a detailed description (at least 5 characters).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          rating: type === 'REVIEW' || type === 'FEEDBACK' ? rating : null,
          subject: subject.trim() || null,
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit feedback.');
      }

      setSuccessMsg('Thank you! Your feedback has been recorded and submitted to our dev team.');
      setMessage('');
      setSubject('');
      
      // Refresh history list
      fetchFeedbackHistory();
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>User Feedback & Support</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Help Us Make PostNest Better
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Have a review, feature request, suggestion, or encountered a bug? We read every single message to build a top-tier publishing platform for you.
        </p>
      </div>

      {/* Main Feedback Form Card */}
      <div className="bg-white dark:bg-[#0e1422] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800/80 shadow-sm relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Category Type Selector */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Select Category <span className="text-orange-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = type === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setType(cat.id)}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-center transition-all duration-200 ${
                      isSelected
                        ? `${cat.color} font-bold shadow-sm ring-2 ring-orange-500/30 scale-[1.02]`
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5 shrink-0" />
                    <span className="text-xs font-semibold leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Star Rating for Reviews / Feedback */}
          {(type === 'REVIEW' || type === 'FEEDBACK') && (
            <div className="space-y-2 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Your Rating (1 to 5 Stars)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-amber-400 transition-transform hover:scale-125 focus:outline-none"
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-xs font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {hoverRating || rating} / 5 Stars
                </span>
              </div>
            </div>
          )}

          {/* Subject Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Subject / Title <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={
                type === 'BUG'
                  ? 'e.g., Image upload error on mobile'
                  : type === 'SUGGESTION'
                  ? 'e.g., Add dark mode toggle for blog preview'
                  : 'e.g., Loving the platform performance!'
              }
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
            />
          </div>

          {/* Detailed Message Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Detailed Message <span className="text-orange-500">*</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">{message.length} / 1000</span>
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              required
              placeholder={
                type === 'BUG'
                  ? 'Describe what happened, what you expected, and steps to reproduce...'
                  : type === 'SUGGESTION'
                  ? 'Share your idea in detail and how it would improve your experience...'
                  : 'Write your honest review or feedback here...'
              }
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Feedback & Error Banner */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs font-medium flex items-center space-x-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center space-x-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
              <div>
                <p className="font-bold text-sm">Submission Successful!</p>
                <p className="text-xs opacity-90">{successMsg}</p>
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={loading || !message.trim()}
              className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Feedback</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Feedback History Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <span>Your Previous Submissions</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">{history.length} items</span>
        </div>

        {fetchingHistory ? (
          <div className="p-8 text-center bg-white dark:bg-[#0e1422] rounded-3xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
            <p className="text-xs text-slate-500 mt-2">Loading your feedback history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-[#0e1422] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <ThumbsUp className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No previous feedback yet</p>
            <p className="text-[11px] text-slate-500">Your submitted feedback, reviews, and bug reports will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0e1422] border border-slate-200 dark:border-slate-800/80 space-y-2 transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                        item.type === 'BUG'
                          ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30'
                          : item.type === 'SUGGESTION'
                          ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                          : item.type === 'REVIEW'
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                          : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'
                      }`}
                    >
                      {item.type}
                    </span>

                    {item.rating && (
                      <div className="flex items-center space-x-0.5 text-amber-400">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                        item.status === 'RESOLVED'
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30'
                          : item.status === 'IN_PROGRESS'
                          ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {item.subject && (
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.subject}</h4>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {item.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
