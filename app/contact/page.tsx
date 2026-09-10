import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  Building2,
  Clock,
  Code2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | PostNest.in - Publish Like a Pro',
  description:
    'Have questions, feedback, or partnership proposals? Contact the PostNest editorial and engineering team. We typically respond within 24 business hours.',
  keywords: [
    'contact postnest',
    'editorial inquiries',
    'tech blog support',
    'publish like a pro',
    'postnest support',
  ],
  openGraph: {
    title: 'Contact PostNest.in - Publish Like a Pro',
    description: 'Get in touch with the PostNest editorial, technical, and partnership teams.',
    url: 'https://postnest.in/contact',
  },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact PostNest.in',
    description: 'Get in touch with the PostNest editorial, technical, and partnership teams.',
    url: 'https://postnest.in/contact',
    publisher: {
      '@type': 'Organization',
      name: 'PostNest.in',
      url: 'https://postnest.in',
    },
  };

  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold uppercase tracking-wider">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Get in Touch • Real Humans, 24-Hour SLA</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          How can our editorial & <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            tech team assist you?
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Whether you have a technical question, an editorial suggestion, partnership proposal, or inquiry about company verification, we are here to help.
        </p>
      </section>

      {/* Main Grid: Info Cards + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Direct Inquiries & SLA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 bg-white dark:bg-slate-900/60">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Mail className="w-5 h-5 text-orange-500" />
              <span>Direct Channels</span>
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                  <span>Editorial & Quality Moderation</span>
                </p>
                <p className="text-xs text-slate-500">Article appeals, plagiarism checks, publisher status.</p>
                <p className="text-xs font-mono text-orange-600 dark:text-orange-400 pt-1">editor@postnest.in</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Building2 className="w-3.5 h-3.5 text-orange-500" />
                  <span>Company Hubs & Verification</span>
                </p>
                <p className="text-xs text-slate-500">Corporate branding, team accounts, custom showcases.</p>
                <p className="text-xs font-mono text-orange-600 dark:text-orange-400 pt-1">partners@postnest.in</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Code2 className="w-3.5 h-3.5 text-orange-500" />
                  <span>Developer API & Integrations</span>
                </p>
                <p className="text-xs text-slate-500">API keys, bulk ingestion, rate limit upgrades.</p>
                <p className="text-xs font-mono text-orange-600 dark:text-orange-400 pt-1">dev@postnest.in</p>
              </div>
            </div>

            {/* SLA Promise */}
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-500/20 flex items-start space-x-3 text-xs text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Our 24-Hour Commitment:</span> We don&apos;t use automated bot replies. Every message is reviewed by an authentic team member and answered within 24 business hours.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto space-y-6 pt-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
          Frequently Asked Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-5 rounded-2xl space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">How long does company verification take?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Company verifications are reviewed manually within 24 to 48 hours. Once verified, the green shield badge appears automatically on all articles and your company hub.
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl space-y-1.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Can I request an API rate limit increase?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! Submit this contact form selecting &ldquo;Developer API&rdquo; and mention your anticipated publishing volume. Our engineering team can configure custom limits.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
