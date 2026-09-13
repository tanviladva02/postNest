export default function BlogDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />

      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-28 bg-orange-500/20 rounded-full" />
        <div className="h-10 sm:h-14 w-full max-w-2xl bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-4 w-60 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>

      {/* Image Skeleton */}
      <div className="h-64 sm:h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl" />

      {/* Body lines */}
      <div className="space-y-3 pt-4">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>
    </div>
  );
}
