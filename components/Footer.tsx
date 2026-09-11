import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Send,
  CheckCircle2,
  FileText,
  Building2,
  Code2,
  Cpu,
  Layers,
  Globe2,
  HeartHandshake,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 dark:bg-[#06070a] border-t border-slate-800 text-slate-400 pt-16 pb-12 overflow-hidden transition-colors">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-orange-500/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Top Section: SaaS Newsletter / Callout */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-800/40 dark:bg-slate-900/60 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>Developer-First Publishing Platform</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Scale your brand voice with <span className="text-orange-500">PostNest</span>.
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Publish technical stories, showcase engineering milestones, and reach thousands of builders with instant SEO indexing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard/create-post"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Writing Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/subscription"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
            >
              <span>View Pricing</span>
            </Link>
          </div>
        </div>

        {/* Middle Grid: 4 Modern Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-8 border-b border-slate-800/80">
          {/* Column 1 & 2: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex flex-col items-start group">
              <div className="relative flex items-center">
                {/* Dark mode logo */}
                <Image
                  src="/logo-dark.png"
                  alt="PostNest"
                  width={160}
                  height={40}
                  className="h-8 sm:h-9 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                  quality={100}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.22em] uppercase bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 bg-clip-text text-transparent group-hover:tracking-[0.26em] transition-all duration-300 mt-1 select-none">
                Publish like a pro
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The premier SaaS publishing suite, engineering showcase, and content syndication hub engineered for high-growth tech teams, enterprise brands, and independent writers.
            </p>

            {/* Platform Status Indicator */}
            <div className="flex items-center space-x-2.5 pt-1">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Systems Operational</span>
              </div>
              <div className="text-[11px] text-orange-400 font-semibold bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full">
                Early Bird: 30 Free Posts/mo
              </div>
            </div>
          </div>

          {/* Column 3: Platform & Products */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-orange-500" />
              <span>Platform</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Explore Tech Stories
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Publishing Services
                </Link>
              </li>
              <li>
                <Link href="/dashboard/subscription" className="hover:text-white transition-colors">
                  Plans & Pricing
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Company Hub Registration
                </Link>
              </li>
              <li>
                <Link href="/dashboard/bulk-upload" className="hover:text-white transition-colors">
                  CSV Bulk Ingestion
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Topic Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-orange-500" />
              <span>Topic Hubs</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/category/technology" className="hover:text-white transition-colors">
                  Technology & Cloud
                </Link>
              </li>
              <li>
                <Link href="/category/ai-tools" className="hover:text-white transition-colors">
                  AI & Developer Tools
                </Link>
              </li>
              <li>
                <Link href="/category/digital-marketing" className="hover:text-white transition-colors">
                  Digital Marketing & Growth
                </Link>
              </li>
              <li>
                <Link href="/dashboard/create-post" className="hover:text-white transition-colors text-orange-400 font-medium">
                  + Submit an Article
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 tracking-wider uppercase flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trust & Standards</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Google AdSense & SEO Compliant</span>
              </div>
              <div className="flex items-start space-x-2">
                <HeartHandshake className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>Human Quality Moderation</span>
              </div>
              <div className="flex items-start space-x-2">
                <Globe2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Global CDN via ImageKit</span>
              </div>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="text-orange-400 hover:text-orange-300 font-medium inline-flex items-center space-x-1 transition-colors"
                >
                  <span>Contact Editorial Team</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 pt-2">
          <div className="flex items-center space-x-2">
            <span>© {currentYear}</span>
            <span className="font-bold text-slate-300">PostNest.in</span>
            <span>• Publish like a pro. All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400">
            <Link href="/about" className="hover:text-white transition-colors">
              Editorial Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Help & Support
            </Link>
            <Link href="/services" className="hover:text-white transition-colors">
              Publisher Services
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
