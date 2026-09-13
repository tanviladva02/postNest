export default function RootLoading() {
  return (
    <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Top Ambient Loading Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 animate-[loading_1.5s_ease-in-out_infinite] z-50 shadow-sm shadow-orange-500/50" />

      {/* Hero / Header Skeleton */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 bg-white/50 dark:bg-slate-900/40">
        <div className="h-6 w-36 bg-orange-500/20 rounded-full" />
        <div className="h-10 sm:h-12 w-3/4 max-w-xl bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="h-4 w-full max-w-md bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>

      {/* Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5 space-y-4"
          >
            <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-24 bg-orange-500/20 rounded-md" />
            <div className="h-6 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
              <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-4 w-12 bg-orange-500/20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
