import Link from 'next/link';
import { Feather, ShieldCheck, Sparkles, HeartHandshake, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-100/70 dark:bg-[#07080b] border-t border-slate-200 dark:border-slate-800/80 mt-20 pt-16 pb-12 text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/20">
                <Feather className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Post<span className="text-orange-500">Nest</span>
                <span className="text-xs text-orange-500 font-bold ml-0.5">.in</span>
              </span>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider">
              Publish like a pro
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The premier developer blogging, engineering showcase, and content syndication platform for tech teams and independent writers.
            </p>
            <div className="flex items-center space-x-2 text-xs text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-3 py-1.5 rounded-xl w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-medium">Early Bird Offer: 30 Posts / Month Free</span>
            </div>
          </div>

          {/* Column 2: Platform & Solutions */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 tracking-wider uppercase mb-4">
              Platform & Solutions
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                  Explore Tech Stories
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                  Publishing Services
                </Link>
              </li>
              <li>
                <Link href="/dashboard/subscription" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                  Register Company Hub
                </Link>
              </li>
              <li>
                <Link href="/dashboard/create-post" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                  Write an Article
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Information */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 tracking-wider uppercase mb-4">
              Company & Help
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                  About Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                  Contact Editorial Team
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                  Technology Topic
                </Link>
              </li>
              <li>
                <Link href="/category/ai-tools" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                  AI & Software Tools
                </Link>
              </li>
              <li>
                <Link href="/category/digital-marketing" className="hover:text-orange-600 dark:hover:text-white transition-colors">
                  Digital Marketing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Publisher Integrity */}
          <div className="space-y-3 text-xs">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-200 tracking-wider uppercase mb-4">
              Publisher Standards
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-normal">
              PostNest strictly enforces content quality control to prevent link spam, AI hallucinations, and copied material.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Google AdSense & Affiliate Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <HeartHandshake className="w-4 h-4 text-orange-500" />
              <span>Human Editorial Review</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PostNest.in. All rights reserved. Publish like a pro.</p>
          <div className="flex items-center space-x-6">
            <Link href="/about" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
              Editorial Policy
            </Link>
            <Link href="/contact" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
              Help Center
            </Link>
            <Link href="/services" className="hover:text-slate-800 dark:hover:text-slate-300 transition-colors">
              Publisher Services
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
