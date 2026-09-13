import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  UserCheck,
  Database,
  Globe,
  Bell,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Clock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | PostNest',
  description:
    'Read the PostNest Privacy Policy. Learn how we handle your personal data, ensure content privacy, secure your credentials, and maintain search engine compliance.',
  alternates: {
    canonical: 'https://www.postnest.in/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | PostNest',
    description:
      'Learn how PostNest protects your privacy, manages user data, and safeguards guest posts and backlink distributions.',
    url: 'https://www.postnest.in/privacy-policy',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'September 12, 2026';

  const sections = [
    {
      id: 'commitment',
      title: '1. Our Privacy Commitment',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            At <strong>PostNest.in</strong> (&quot;PostNest&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we take your privacy and data sovereignty seriously. We are committed to maintaining transparent, ethical, and secure data practices for all our users—whether you are an independent tech blogger, a SaaS founder, or a digital marketing team publishing guest posts.
          </p>
          <p>
            This Privacy Policy explains what personal information we collect when you visit our website, register an account, publish articles, or utilize our backlink and guest posting services, and how that information is utilized and protected.
          </p>
        </div>
      ),
    },
    {
      id: 'information-collected',
      title: '2. Information We Collect',
      icon: Database,
      content: (
        <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>We collect information to deliver a seamless publishing and backlink distribution experience. The types of data collected include:</p>
          <ul className="space-y-2 pl-2">
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>
                <strong>Account Information:</strong> When you sign up, we collect your name, email address, password hash (securely encrypted with bcrypt), optional company profile details, and profile avatar.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>
                <strong>User-Generated Content & Articles:</strong> Blog post titles, markdown/HTML body content, categories, tags, cover images, canonical URLs, and embedded contextual backlinks submitted through our editor or bulk ingestion tools.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>
                <strong>Usage & Technical Data:</strong> Browser user agent, IP address, approximate geographical location, pages visited, session duration, and interactions with our publishing editor.
              </span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>
                <strong>Payment & Subscription Records:</strong> Invoicing history, plan tier details, and payment transaction identifiers processed securely through our verified payment gateway partners. We never store raw credit card numbers.
              </span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'how-we-use-data',
      title: '3. How We Use Your Information',
      icon: Eye,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>Your data is utilized strictly for legitimate operational purposes:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white text-xs">🚀 Content Distribution & SEO</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Rendering published blogs, generating XML sitemaps, and outputting JSON-LD Schema for Google indexing.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white text-xs">🛡️ Spam Prevention & Quality Control</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scanning submitted content against plagiarism, malicious URLs, automated bot spam, and keyword stuffing.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white text-xs">📈 Analytics & Impression Metrics</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tracking post impression counts, reading times, and engagement metrics inside your creator dashboard.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white text-xs">📬 Essential Notifications</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Sending account confirmations, editorial moderation status alerts, security notices, and subscription renewals.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'public-visibility',
      title: '4. Public Nature of Published Posts & Backlinks',
      icon: Globe,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            Please note that <strong>PostNest is an open web publishing platform</strong>. Any guest post, article text, author bio, social handle, and backlink marked with status <em>&quot;PUBLISHED&quot;</em> is made publicly accessible across the Internet and will be crawled and indexed by search engines such as Google, Bing, and DuckDuckGo.
          </p>
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
            <strong>Important:</strong> Do not include private phone numbers, home addresses, sensitive confidential corporate information, or credentials within the body of your public guest posts.
          </div>
        </div>
      ),
    },
    {
      id: 'cookies',
      title: '5. Cookies & Local Storage',
      icon: Lock,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            We use essential cookies and browser local storage mechanisms to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Keep you securely authenticated during your active sessions (JWT tokens).</li>
            <li>Preserve your theme preference (Dark Mode vs Light Mode).</li>
            <li>Prevent recurring display of early-bird announcement modals once dismissed.</li>
            <li>Safeguard against Cross-Site Request Forgery (CSRF) and bot attacks.</li>
          </ul>
          <p className="text-xs text-slate-500">You can manage or disable cookie preferences directly in your browser settings, though certain authenticated features may require cookies to function properly.</p>
        </div>
      ),
    },
    {
      id: 'third-parties',
      title: '6. Third-Party Services & Infrastructure',
      icon: FileText,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>We work with trusted third-party providers who adhere to strict data security standards:</p>
          <ul className="space-y-2 pl-2">
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span><strong>Media & CDN Hosting:</strong> ImageKit.io handles image compression, transformation, and high-speed global media delivery.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span><strong>Cloud Infrastructure:</strong> Managed cloud database and serverless hosting with end-to-end TLS/SSL encryption.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0" />
              <span><strong>Payment Processors:</strong> PCI-DSS compliant payment gateways manage transactions without exposing raw card data to PostNest servers.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'data-security',
      title: '7. Data Security & Storage',
      icon: ShieldCheck,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            We implement industry-standard technical and organizational measures to safeguard your information against unauthorized access, alteration, disclosure, or destruction:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>HTTPS/TLS 1.3 encryption across all communication endpoints.</li>
            <li>Bcrypt salted password hashing with high work factor.</li>
            <li>Role-Based Access Control (RBAC) preventing unauthorized administrative changes.</li>
            <li>Routine automated database backups and vulnerability scanning.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'user-rights',
      title: '8. Your Rights & Data Controls',
      icon: UserCheck,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>As a registered user of PostNest, you retain full rights over your data:</p>
          <ul className="space-y-2 pl-2">
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Access & Export:</strong> You can view, export, and edit your articles, drafts, and company profile at any time through your dashboard.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Content Modification & Deletion:</strong> You have the ability to unpublish, edit, or permanently remove your guest posts from our platform.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Account Erasure:</strong> You can request full account deletion and purging of personal data by contacting our support team.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'contact',
      title: '9. Contact & Privacy Inquiries',
      icon: Mail,
      content: (
        <div className="space-y-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          <p>
            If you have any questions, clarifications, or requests concerning this Privacy Policy or your personal information, please reach out to our privacy desk:
          </p>
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <p className="font-bold text-slate-900 dark:text-white text-sm">PostNest Privacy & Editorial Team</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Email: <a href="mailto:contact.postnest@gmail.com" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">contact.postnest@gmail.com</a>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Phone / WhatsApp: <a href="tel:+917041167089" className="text-orange-600 dark:text-orange-400 hover:underline font-semibold">+91 70411 67089</a>
            </p>
            <p className="text-xs text-slate-500">Website: https://www.postnest.in</p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500"
              >
                <span>Submit a Privacy Request</span>
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
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Trust & Transparency</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          We value your trust. Learn how PostNest protects your account data, safeguards your guest posts, and ensures fair, transparent content syndication.
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
                  className="block px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-500/5 transition-colors truncate"
                >
                  {sec.title}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
              <Link
                href="/terms"
                className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 group"
              >
                <span>View Terms & Conditions</span>
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
                className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 space-y-4 scroll-mt-24 shadow-xs"
              >
                <div className="flex items-center space-x-3 pb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
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

          {/* Bottom Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Questions regarding our privacy standards?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Our support and editorial desk is here to address any inquiries regarding your data and publications.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-orange-500/20"
              >
                <span>Contact Support</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
