'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/50" />
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'Orange & White' : 'Orange & Black'} theme`}
      title={`Active: ${isDark ? 'Orange & Black' : 'Orange & White'}. Click to switch.`}
      className="relative flex items-center justify-center p-2 rounded-xl border transition-all duration-200 group
        bg-white border-slate-200 text-slate-700 hover:border-orange-400 hover:text-orange-600 shadow-sm
        dark:bg-slate-900/90 dark:border-slate-800 dark:text-slate-300 dark:hover:border-orange-500 dark:hover:text-orange-400"
    >
      <div className="relative w-4 h-4">
        {isDark ? (
          <Moon className="w-4 h-4 text-orange-400 transform transition-transform group-hover:rotate-12 duration-200" />
        ) : (
          <Sun className="w-4 h-4 text-orange-600 transform transition-transform group-hover:rotate-45 duration-200" />
        )}
      </div>

      {/* Subtle indicator dot */}
      <span
        className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-white dark:border-slate-900 ${
          isDark ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-orange-500'
        }`}
      />
    </button>
  );
}
