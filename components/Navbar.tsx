import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { Feather, PlusCircle, Search, User, LogOut, LayoutDashboard, Building2, Shield } from 'lucide-react';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-sky-400 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <Feather className="w-5.5 h-5.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Post<span className="text-brand-400">Nest</span>
                  <span className="text-xs text-sky-400 font-semibold ml-0.5">.in</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1 hidden sm:block">
                  Publish. Discover. Grow.
                </span>
              </div>
            </Link>

            {/* Middle Nav Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/#categories" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Categories
              </Link>
              <Link href="/#companies" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Featured Companies
              </Link>
              <Link href="/dashboard/subscription" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Pricing Plans
              </Link>
            </nav>
          </div>

          {/* Right Actions: Search + CTA + Account */}
          <div className="flex items-center space-x-4">
            {/* Search Trigger */}
            <Link
              href="/#search"
              className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 text-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search posts...</span>
            </Link>

            {/* Prominent Add Blog Post CTA */}
            <Link
              href={user ? "/dashboard/create-post" : "/login?redirect=/dashboard/create-post"}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white font-semibold text-sm shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Blog Post</span>
            </Link>

            {/* User Account / Login */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700 text-sm font-medium transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-400" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-colors"
                    title="Admin Moderation Panel"
                  >
                    <Shield className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
