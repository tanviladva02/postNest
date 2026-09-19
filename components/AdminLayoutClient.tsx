'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import {
  Shield,
  MessageSquare,
  AlertCircle,
  Settings,
  LayoutDashboard,
  Home,
  LogOut,
  Menu,
  X,
  Users,
  BarChart3,
  Send,
} from 'lucide-react';

interface AdminLayoutClientProps {
  user: any;
  children: React.ReactNode;
}

export default function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Platform Overview', icon: BarChart3 },
    { href: '/admin/newsletter', label: 'Newsletter Broadcast', icon: Send },
    { href: '/admin/messages', label: 'Inquiries & Contact', icon: MessageSquare },
    { href: '/admin/moderation', label: 'Moderation Queue', icon: AlertCircle },
    { href: '/admin/settings', label: 'Plan Quota Settings', icon: Settings },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row overflow-x-hidden">
      {/* Mobile Sticky Topbar (Mobile viewports < 768px down to 250px) */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-3 py-2.5 flex items-center justify-between gap-2">
        <Link href="/admin" onClick={closeMenu} className="flex items-center space-x-2 min-w-0">
          <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30 shrink-0">
            <Shield className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">PostNest Admin</p>
            <span className="text-[9px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">
              Control Center
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-1.5 shrink-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Admin Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Dropdown (< 768px) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[53px] z-50 bg-slate-950/60 backdrop-blur-xs flex flex-col">
          <div className="bg-white dark:bg-[#0c121e] border-b border-slate-200 dark:border-slate-800 p-4 space-y-3 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
              <img
                src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-amber-500/40"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase">
                  Super Admin
                </span>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium"
              >
                <LayoutDashboard className="w-4 h-4 text-orange-500" />
                <span>User Dashboard</span>
              </Link>
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
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 text-xs font-medium transition-colors"
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
      <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-64 md:h-screen md:z-30 bg-white dark:bg-[#0c121e] border-r border-slate-200 dark:border-slate-800/80 p-5 flex-col justify-between shrink-0 overflow-hidden transition-colors">
        <div className="space-y-5 flex-1 overflow-y-auto pr-1 scrollbar-none">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
            <Link href="/admin" className="flex items-center space-x-2.5 group">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Admin Center</p>
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  PostNest Control
                </span>
              </div>
            </Link>
            <ThemeToggle />
          </div>

          {/* User Profile Card */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 flex items-center space-x-3">
            <img
              src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-amber-500/30 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
              <span className="inline-block text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-semibold">
                Super Administrator
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Links & Sign Out */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-1.5 shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-xs font-medium transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-orange-500" />
            <span>User Dashboard</span>
          </Link>
          <Link
            href="/"
            className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 text-xs font-medium transition-colors"
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
      </aside>

      {/* Main Content Area (Offset by fixed sidebar on desktop) */}
      <div className="flex-1 w-full min-w-0 md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 w-full min-w-0 p-3 sm:p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
