'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import FloatingFeedbackWidget from './FloatingFeedbackWidget';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  UploadCloud,
  Building2,
  Key,
  CreditCard,
  LogOut,
  Shield,
  Menu,
  X,
  Home,
  MessageSquare,
  User,
} from 'lucide-react';

interface DashboardLayoutClientProps {
  user: any;
  planName: string;
  children: React.ReactNode;
}

export default function DashboardLayoutClient({ user, planName, children }: DashboardLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/posts', label: 'My Articles', icon: FileText },
    { href: '/dashboard/create-post', label: 'Create Post', icon: PlusCircle },
    { href: '/dashboard/bulk-upload', label: 'Bulk Upload', icon: UploadCloud },
    { href: '/dashboard/company', label: 'Company Profile', icon: Building2 },
    { href: '/dashboard/api-access', label: 'API Access', icon: Key },
    { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Account Settings', icon: User },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row overflow-x-hidden transition-colors">
      {/* Mobile Topbar (< 768px down to 250px) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#0e1422]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-3 py-2.5 flex items-center justify-between gap-2">
        <Link href="/" onClick={closeMenu} className="flex flex-col items-start min-w-0 shrink">
          <Image
            src="/logo.png"
            alt="PostNest"
            width={120}
            height={30}
            className="h-6 w-auto object-contain dark:hidden"
            priority
          />
          <Image
            src="/logo-dark.png"
            alt="PostNest"
            width={120}
            height={30}
            className="h-6 w-auto object-contain hidden dark:block"
            priority
          />
          <span className="text-[7px] font-extrabold tracking-[0.16em] uppercase bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">
            Publish like a pro
          </span>
        </Link>

        <div className="flex items-center space-x-1.5 shrink-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Dashboard Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-orange-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown (< 768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[53px] z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col">
          <div className="bg-white dark:bg-[#0e1422] border-b border-slate-200 dark:border-slate-800 p-4 space-y-3 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
              <img
                src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <span className="inline-block text-[9px] bg-orange-500/10 text-orange-600 dark:text-orange-300 px-1.5 py-0.5 rounded font-semibold truncate">
                  {planName}
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${isActive
                        ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    <Icon className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-amber-600 dark:text-amber-400 bg-amber-500/10 text-xs font-semibold"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Control Center</span>
                </Link>
              )}
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium"
              >
                <Home className="w-4 h-4 text-slate-400" />
                <span>Public Website</span>
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 text-xs font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
          <div className="flex-1" onClick={closeMenu} />
        </div>
      )}

      {/* Desktop Clean Fixed Sidebar Navigation (>= 768px) - 100% Fixed to Viewport */}
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:h-screen md:z-30 bg-white dark:bg-[#0e1422] border-r border-slate-200 dark:border-slate-800/80 p-5 lg:p-6 flex-col justify-between shrink-0 overflow-hidden transition-colors">
        <div className="space-y-5 flex-1 overflow-y-auto pr-1 scrollbar-none">
          {/* Brand Logo & Back to Home */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/60">
            <Link href="/" className="flex flex-col items-start group">
              <Image
                src="/logo.png"
                alt="PostNest"
                width={140}
                height={36}
                className="h-7 w-auto object-contain dark:hidden"
                priority
              />
              <Image
                src="/logo-dark.png"
                alt="PostNest"
                width={140}
                height={36}
                className="h-7 w-auto object-contain hidden dark:block"
                priority
              />
              <span className="text-[8px] font-extrabold tracking-[0.2em] uppercase bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent mt-0.5">
                Publish like a pro
              </span>
            </Link>
            <ThemeToggle />
          </div>

          {/* User Profile Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
            <img
              src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700 shrink-0"
            />
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <span className="inline-block text-[10px] bg-orange-500/10 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded font-medium truncate max-w-full">
                {planName}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1 text-sm font-medium">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl transition-all ${isActive
                      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                >
                  <Icon className="w-4 h-4 text-orange-500 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Admin Link & Logout */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5 shrink-0">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center space-x-3 px-3.5 py-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-medium transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Back to Home</span>
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-3.5 py-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 text-xs font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area (Offset by fixed sidebar on desktop) */}
      <div className="flex-1 w-full min-w-0 md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 w-full min-w-0 p-3 sm:p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>

      {/* Smooth Draggable Floating Feedback Widget */}
      <FloatingFeedbackWidget user={user} />
    </div>
  );
}
