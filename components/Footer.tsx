import Link from 'next/link';
import { Feather, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 mt-20 pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center">
                <Feather className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Post<span className="text-brand-400">Nest</span>
                <span className="text-xs text-sky-400 font-semibold ml-0.5">.in</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              The modern blog publishing, company showcase, and content marketing platform for SEO professionals, startups, and bloggers.
            </p>
            <div className="flex items-center space-x-2 text-xs text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-lg w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Early Bird Offer: 30 Posts / Month Free</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Explore Articles</Link>
              </li>
              <li>
                <Link href="/dashboard/subscription" className="hover:text-white transition-colors">Pricing & Plans</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Create Company Profile</Link>
              </li>
              <li>
                <Link href="/dashboard/api-access" className="hover:text-white transition-colors">Developer API</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/category/technology" className="hover:text-white transition-colors">Technology</Link>
              </li>
              <li>
                <Link href="/category/digital-marketing" className="hover:text-white transition-colors">Digital Marketing</Link>
              </li>
              <li>
                <Link href="/category/business" className="hover:text-white transition-colors">Business & Startups</Link>
              </li>
              <li>
                <Link href="/category/ai-tools" className="hover:text-white transition-colors">AI & Software Tools</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Disclosure */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-semibold text-slate-200 tracking-wider uppercase mb-4">Publisher Guidelines</h4>
            <p className="text-slate-400 leading-normal">
              PostNest strictly enforces content quality control to prevent link spam and copied material.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Google AdSense & Affiliate Compliant</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PostNest.in. All rights reserved. Publish. Discover. Grow.</p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="hover:text-slate-300 transition-colors">Content Policy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
