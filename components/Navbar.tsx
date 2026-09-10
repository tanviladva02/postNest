import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import ThemeToggle from './ThemeToggle';
import {
  Feather,
  PlusCircle,
  Search,
  LayoutDashboard,
  Shield,
  Layers,
  Info,
  Mail,
} from 'lucide-react';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo & Tagline */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/25 group-hover:scale-105 transition-transform duration-200">
                <Feather className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Post<span className="text-orange-500">Nest</span>
                  <span className="text-xs text-orange-500 font-bold ml-0.5">.in</span>
                </span>
                <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold tracking-wider uppercase -mt-1 hidden sm:block">
                  Publish like a pro
                </span>
              </div>
            </Link>

            {/* Middle Nav Links */}
            <nav className="hidden md:flex items-center space-x-5 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link href="/" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                Explore
              </Link>
              <Link href="/services" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/about" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/dashboard/subscription" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Actions: Search + Theme Toggle + CTA + Account */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <Link
              href="/#search"
              aria-label="Search articles"
              className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-orange-500" />
              <span>Search posts...</span>
            </Link>

            {/* Theme Toggle (Orange & White / Orange & Black) */}
            <ThemeToggle />

            {/* Prominent Write / Add Blog Post CTA */}
            <Link
              href={user ? "/dashboard/create-post" : "/login?redirect=/dashboard/create-post"}
              className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write</span>
            </Link>

            {/* User Account / Login */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/90 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-500" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 text-xs font-medium transition-colors"
                    title="Admin Moderation Panel"
                  >
                    <Shield className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
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
