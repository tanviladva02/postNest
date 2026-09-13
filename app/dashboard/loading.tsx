export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 dark:bg-slate-900/40">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-4 w-80 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="h-10 w-40 bg-orange-500/30 rounded-xl" />
      </div>

      {/* Quota & Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-3"
          >
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-8 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full" />
          </div>
        ))}
      </div>

      {/* Table / List Skeleton */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 space-y-4">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 w-full bg-slate-100 dark:bg-slate-800/60 rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
