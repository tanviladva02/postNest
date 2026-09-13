import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import {
  Mail,
  MessageSquare,
  ShieldCheck,
  Building2,
  Clock,
  Code2,
  Phone,
  PhoneCall,
  MessageCircle,
} from 'lucide-react';
import FaqAccordion from '@/components/FaqAccordion';

export const metadata: Metadata = {
  title: 'Contact Us | PostNest - Publish Like a Pro',
  description:
    'Have questions, feedback, or partnership proposals? Contact the PostNest team at +91 70411 67089 or support@postnest.in. We typically respond within 24 business hours.',
  keywords: [
    'contact postnest',
    'PostNest support',
    'editorial inquiries',
    'tech blog support',
    'publish like a pro',
    'postnest phone number',
  ],
  alternates: {
    canonical: 'https://www.postnest.in/contact',
  },
  openGraph: {
    title: 'Contact PostNest - Publish Like a Pro',
    description: 'Get in touch with the PostNest editorial, technical, and partnership teams.',
    url: 'https://www.postnest.in/contact',
  },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact PostNest',
    description: 'Get in touch with the PostNest editorial, technical, and partnership teams.',
    url: 'https://www.postnest.in/contact',
    telephone: '+91 70411 67089',
    publisher: {
      '@type': 'Organization',
      name: 'PostNest',
      url: 'https://www.postnest.in',
      logo: 'https://www.postnest.in/logo.png',
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
              <PhoneCall className="w-5 h-5 text-orange-500" />
              <span>Direct Channels</span>
            </h2>

            <div className="space-y-4">
              {/* Mobile Phone & WhatsApp Support Card */}
              <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-white dark:from-[#121623] dark:via-[#101420] dark:to-[#0d101a] border border-orange-200 dark:border-orange-500/30 shadow-md shadow-orange-500/5 space-y-3 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>Phone & WhatsApp Support</span>
                  </p>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live Desk</span>
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center space-x-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs font-bold shadow-xs">
                    <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                    <span>+91 70411 67089</span>
                  </div>

                  <a
                    href="https://wa.me/917041167089?text=Hi%20PostNest%20Team%2C%20I%20have%20an%20inquiry%20regarding%20publishing%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Official Email Channel Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#101420] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs transition-colors">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span>Official Email Desk</span>
                  </p>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    Primary Support
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  For editorial appeals, company verification, developer API keys, and custom enterprise plans.
                </p>
                <a
                  href="mailto:contact.postnest@gmail.com"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 hover:text-orange-500 hover:underline pt-0.5"
                >
                  <span>contact.postnest@gmail.com</span>
                </a>
              </div>

              {/* Department Assistance Scope */}
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#0d101a] border border-slate-200 dark:border-slate-800 space-y-2.5 transition-colors">
                <p className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  <span>Support Coverage & Inquiries</span>
                </p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <li className="flex items-start space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Editorial Moderation, Quality Review & Backlinks</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                    <span>Company Hub Branding & Green Badge Verification</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Code2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                    <span>Developer REST API, Webhooks & Bulk CSV Uploads</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* SLA Promise */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-orange-50/40 dark:from-[#131926] dark:via-[#161a22] dark:to-[#0f131d] border border-orange-200/90 dark:border-orange-500/30 flex items-start space-x-3.5 text-xs text-slate-700 dark:text-slate-300 shadow-xs transition-colors">
              <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div className="leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white">Our 24-Hour Human Commitment:</span>{' '}
                We don&apos;t use generic bot replies. Every inquiry is personally reviewed by an authentic team member and answered within 24 business hours.
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

        <FaqAccordion
          items={[
            {
              q: 'How long does company verification take?',
              a: 'Company verifications are reviewed manually within 24 to 48 hours. Once verified, the green shield badge appears automatically on all articles and your company hub.',
            },
            {
              q: 'Can I request an API rate limit increase?',
              a: 'Yes! Submit this contact form selecting "Developer API" and mention your anticipated publishing volume. Our engineering team can configure custom limits.',
            },
            {
              q: 'How do I appeal a moderation rejection?',
              a: 'Select "Editorial & Quality Moderation" in the inquiry form above and include your draft ID or post title. Our editorial team will re-evaluate your submission within 24 business hours.',
            },
          ]}
          defaultOpenIndex={0}
        />
      </section>
    </div>
  );
}
