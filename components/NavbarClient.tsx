'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import EarlyBirdPopup from './EarlyBirdPopup';
import {
  PlusCircle,
  LayoutDashboard,
  Shield,
  Menu,
  X,
  Compass,
  Briefcase,
  Info,
  Mail,
  CreditCard,
  LogIn,
} from 'lucide-react';

interface NavbarClientProps {
  user: any;
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Explore', icon: Compass },
    { href: '/services', label: 'Services', icon: Briefcase },
    { href: '/pricing', label: 'Pricing', icon: CreditCard },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Mail },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <EarlyBirdPopup isLoggedIn={Boolean(user)} />
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200 dark:border-slate-800/80 transition-colors w-full">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Left: Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 sm:space-x-6 lg:space-x-8 min-w-0">
            <Link href="/" onClick={closeMenu} className="flex flex-col items-start justify-center group py-0.5 shrink-0">
              <div className="relative flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="PostNest"
                  width={150}
                  height={38}
                  style={{ width: 'auto', height: 'auto' }}
                  className="h-6 sm:h-8 w-auto max-w-[110px] sm:max-w-[150px] object-contain dark:hidden transition-transform duration-200 group-hover:scale-105"
                  priority
                  quality={100}
                />
                <Image
                  src="/logo-dark.png"
                  alt="PostNest"
                  width={150}
                  height={38}
                  style={{ width: 'auto', height: 'auto' }}
                  className="h-6 sm:h-8 w-auto max-w-[110px] sm:max-w-[150px] object-contain hidden dark:block transition-transform duration-200 group-hover:scale-105"
                  priority
                  quality={100}
                />
              </div>
              <span className="text-[7px] sm:text-[9px] font-extrabold tracking-[0.18em] sm:tracking-[0.22em] uppercase bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500 dark:from-orange-400 dark:via-amber-300 dark:to-orange-400 bg-clip-text text-transparent group-hover:tracking-[0.24em] transition-all duration-300 select-none">
                Publish like a pro
              </span>
            </Link>

            {/* Desktop Middle Nav Links */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 text-xs lg:text-sm font-medium text-slate-600 dark:text-slate-300">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    className={`transition-colors py-1 ${
                      isActive
                        ? 'text-orange-600 dark:text-orange-400 font-bold'
                        : 'hover:text-orange-600 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Prominent Write / Add Blog Post CTA (Always Visible) */}
            <Link
              href={user ? '/dashboard/create-post' : '/login?redirect=/dashboard/create-post'}
              prefetch={true}
              className="flex items-center space-x-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-xs shadow-sm shadow-orange-500/25 transition-all whitespace-nowrap active:scale-95 hover:shadow-orange-500/40"
            >
              <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Submit Guest Post</span>
              <span className="sm:hidden">Submit Post</span>
            </Link>

            {/* User Account / Login Buttons */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-1.5">
                <Link
                  href="/dashboard"
                  prefetch={true}
                  className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-orange-500" />
                  <span>Dashboard</span>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    prefetch={true}
                    className="p-1.5 sm:p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500/20 text-xs font-medium transition-colors"
                    title="Admin Panel"
                  >
                    <Shield className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                prefetch={true}
                className="hidden sm:inline-block px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-white transition-colors"
              >
                Login
              </Link>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-orange-500" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 px-2 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-b-2xl shadow-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    prefetch={true}
                    onClick={closeMenu}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-orange-500" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <Link
                href={user ? '/dashboard/create-post' : '/login?redirect=/dashboard/create-post'}
                prefetch={true}
                onClick={closeMenu}
                className="w-full flex items-center justify-center space-x-1.5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Submit Guest Post</span>
              </Link>

              {user ? (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/dashboard"
                    prefetch={true}
                    onClick={closeMenu}
                    className="flex items-center justify-center space-x-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-orange-500" />
                    <span>Dashboard</span>
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      prefetch={true}
                      onClick={closeMenu}
                      className="flex items-center justify-center space-x-1 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs border border-amber-500/30"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    prefetch={true}
                    onClick={closeMenu}
                    className="flex items-center justify-center space-x-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    prefetch={true}
                    onClick={closeMenu}
                    className="flex items-center justify-center py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
