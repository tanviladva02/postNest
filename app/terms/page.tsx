import { Metadata } from 'next';
import Link from 'next/link';
import {
  FileCheck,
  ShieldAlert,
  CreditCard,
  Ban,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Scale,
  Sparkles,
  Users,
  Clock,
  HelpCircle,
  FileText,
  Mail,
  RefreshCcw,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | PostNest',
  description:
    'Review the official Terms & Conditions and Refund Policy for PostNest. Clear policies on guest post uploads, backlink standards, account subscriptions, and digital services.',
  alternates: {
    canonical: 'https://www.postnest.in/terms',
  },
  openGraph: {
    title: 'Terms & Conditions | PostNest',
    description:
      'Official terms of service, guest blogging rules, and refund policy for creators, brands, and subscribers on PostNest.',
    url: 'https://www.postnest.in/terms',
    type: 'website',
  },
};

export default function TermsPage() {
  const lastUpdated = 'September 12, 2026';

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: Scale,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            Welcome to <strong>PostNest.in</strong> (&quot;PostNest&quot;, &quot;Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). By accessing our website, creating an account, publishing blog posts, or subscribing to our publishing plans, you agree to be bound by these Terms & Conditions.
          </p>
          <p>
            If you do not agree to these terms in their entirety, you must discontinue the use of our services immediately.
          </p>
        </div>
      ),
    },
    {
      id: 'refund-policy',
      title: '2. Refund & Cancellation Policy',
      icon: CreditCard,
      highlight: true,
      content: (
        <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {/* Prominent Refund Notice Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-transparent border border-orange-500/30 space-y-3">
            <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 font-bold text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>General Policy: Digital Publishing Services are Non-Refundable</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              At PostNest, we deliver high-performance digital publishing infrastructure, server-side rendered indexing, instant quota allocations, and global CDN delivery. Because these digital resources, publication quotas, and backlink distributions are provisioned immediately upon purchase, <strong>we do not offer refunds by default</strong> on any paid subscription tiers or publishing credits.
            </p>
          </div>

          <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider pt-2">
            Special Case Refund Reviews
          </h4>
          <p>
            While our baseline policy is non-refundable, we understand that rare exceptional circumstances can occur. We may review refund requests in the following special cases:
          </p>
          <ul className="space-y-2 pl-2">
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>
                <strong>Accidental Duplicate Billing:</strong> If our payment processor charges you more than once for the same billing cycle due to a technical anomaly.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>
                <strong>Severe Platform Outage:</strong> If verified system failure on our end prevented you from accessing the platform or utilizing your purchased quota for an extended duration.
              </span>
            </li>
          </ul>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            To submit a special case refund request, you must email <a href="mailto:contact.postnest@gmail.com" className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">contact.postnest@gmail.com</a> within <strong>48 hours</strong> of the transaction with your registered email, invoice ID, and transaction proof. Each request is evaluated fairly on a case-by-case basis.
          </p>
        </div>
      ),
    },
    {
      id: 'guest-posting-rules',
      title: '3. Guest Posting & Content Guidelines',
      icon: FileCheck,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            PostNest is built to provide high-quality organic impressions, authentic knowledge sharing, and clean backlink authority. To maintain domain health, all users must adhere to strict editorial standards:
          </p>
          <ul className="space-y-2 pl-2">
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Originality & Value:</strong> Articles must be authentic, original, informative, and free from automated spam generation or mass plagiarism.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Contextual Backlinks:</strong> Links included within articles must be natural, relevant, and provide genuine reference value to readers.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Accuracy:</strong> Content should not promote deceptive claims, financial scams, malware, or unlawful activities.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'prohibited-content',
      title: '4. Prohibited Content & Blackhat Practices',
      icon: Ban,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            The following content categories and practices are strictly forbidden on PostNest and will result in immediate article removal and potential account suspension:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1">
              <p className="font-bold text-red-600 dark:text-red-400">🚫 Malicious & Deceptive Links</p>
              <p className="text-slate-500 dark:text-slate-400">Phishing URLs, cloaked redirects, malware distribution, or deceptive landing pages.</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1">
              <p className="font-bold text-red-600 dark:text-red-400">🚫 Spam & Keyword Stuffing</p>
              <p className="text-slate-500 dark:text-slate-400">Spin-tax articles, repetitive unnatural anchor text clusters, or unreadable automated text.</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1">
              <p className="font-bold text-red-600 dark:text-red-400">🚫 Illegal or Regulated Goods</p>
              <p className="text-slate-500 dark:text-slate-400">Gambling, unlicensed pharma, counterfeit goods, adult content, or unauthorized weapons.</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 text-xs space-y-1">
              <p className="font-bold text-red-600 dark:text-red-400">🚫 Copyright Infringement</p>
              <p className="text-slate-500 dark:text-slate-400">Unauthorized reproduction of third-party copyrighted text or trademarked images.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'intellectual-property',
      title: '5. Intellectual Property & License',
      icon: Sparkles,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            <strong>You own your content.</strong> When you publish an article on PostNest, you retain full ownership and copyright of the original text and materials created by you.
          </p>
          <p>
            By publishing on PostNest, you grant us a worldwide, non-exclusive, royalty-free license to host, display, index, format, syndicate, and distribute your content across our web platform, sitemaps, and search engine integration pipelines.
          </p>
        </div>
      ),
    },
    {
      id: 'accounts-security',
      title: '6. User Accounts & Security',
      icon: Users,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            You are responsible for safeguarding your login credentials and maintaining control over your account. Any activity occurring under your account credentials is your responsibility.
          </p>
          <p>
            PostNest reserves the right to suspend, rate-limit, or terminate accounts that violate our publishing policies or engage in abusive bot behavior.
          </p>
        </div>
      ),
    },
    {
      id: 'disclaimers',
      title: '7. Service Availability & SEO Disclaimers',
      icon: ShieldAlert,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            While PostNest implements state-of-the-art SEO schemas, high-speed SSR, and automated Google sitemaps to optimize crawlability and ranking potential, search engine ranking algorithms (Google, Bing, etc.) are independent third-party entities. PostNest does not guarantee specific ranking positions or keyword guarantees.
          </p>
          <p>
            Services are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of uninterrupted uptime or error-free operations.
          </p>
        </div>
      ),
    },
    {
      id: 'modifications',
      title: '8. Changes to Terms',
      icon: RefreshCcw,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            We may update these Terms & Conditions periodically to reflect improvements in our platform or legal requirements. Continued use of PostNest after changes take effect constitutes your acceptance of the updated terms.
          </p>
        </div>
      ),
    },
    {
      id: 'contact',
      title: '9. Contact Support & Legal Desk',
      icon: Mail,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            For questions regarding these terms, moderation appeals, or billing queries, please contact us:
          </p>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="font-bold text-slate-900 dark:text-white text-sm">PostNest Editorial & Legal Desk</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Email: <a href="mailto:contact.postnest@gmail.com" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">contact.postnest@gmail.com</a>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Phone / WhatsApp: <a href="tel:+917041167089" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">+91 70411 67089</a>
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500"
              >
                <span>Open Support Ticket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold uppercase tracking-wider">
          <Scale className="w-3.5 h-3.5" />
          <span>Legal & Service Agreement</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms & Conditions
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Clear, humanized terms outlining our digital publishing services, guest posting guidelines, and transparent no-refund policies.
        </p>

        <div className="flex items-center justify-center space-x-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <Clock className="w-3.5 h-3.5 text-orange-500" />
          <span>Last Updated: {lastUpdated}</span>
        </div>
      </div>

      {/* Main Content Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Quick Navigation Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Table of Contents</span>
            </h3>
            <nav className="space-y-1 text-xs">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className={`block px-2.5 py-1.5 rounded-lg transition-colors truncate ${
                    sec.highlight
                      ? 'text-orange-600 dark:text-orange-400 font-bold bg-orange-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-500/5'
                  }`}
                >
                  {sec.title}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <Link
                href="/privacy-policy"
                className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 group"
              >
                <span>View Privacy Policy</span>
                <ArrowRight className="w-3.5 h-3.5 text-orange-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Section Cards */}
        <main className="lg:col-span-8 space-y-8">
          {sections.map((sec) => {
            const Icon = sec.icon;
            return (
              <section
                key={sec.id}
                id={sec.id}
                className={`glass-panel p-6 sm:p-8 rounded-3xl border space-y-4 scroll-mt-24 shadow-xs transition-all ${
                  sec.highlight
                    ? 'border-orange-500/40 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent shadow-md'
                    : 'border-slate-200 dark:border-slate-800/80'
                }`}
              >
                <div className="flex items-center space-x-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      sec.highlight
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : 'bg-orange-500/10 text-orange-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                    {sec.title}
                  </h2>
                </div>

                <div className="pt-1">{sec.content}</div>
              </section>
            );
          })}

          {/* Bottom Callout */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Need assistance with your plan or account?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Our team is ready to help resolve any billing queries or publishing questions.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
              >
                <span>Contact Editorial Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
