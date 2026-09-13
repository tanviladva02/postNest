export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />

      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 bg-white/50 dark:bg-slate-900/40">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20" />
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-5 space-y-4"
          >
            <div className="h-44 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
