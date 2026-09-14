import Link from 'next/link';
import { SeoPageData } from '@/lib/seo-landing-data';
import FaqAccordion from '@/components/FaqAccordion';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Zap,
  ShieldCheck,
  Code,
  FolderUp,
  Building2,
  BarChart3,
  FileText,
  Link as LinkIcon,
  Globe,
  Search,
  ExternalLink,
  TrendingUp,
  ShieldAlert,
  Sliders,
  UploadCloud,
  Lock,
  Smartphone,
  PlusCircle,
  BookOpen,
  Cpu,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Zap,
  ShieldCheck,
  Code,
  FolderUp,
  Building2,
  BarChart3,
  FileText,
  Link: LinkIcon,
  Globe,
  Search,
  Sparkles,
  CheckCircle: CheckCircle2,
  ExternalLink,
  TrendingUp,
  ShieldAlert,
  Sliders,
  UploadCloud,
  Lock,
  Smartphone,
};

export interface DynamicPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage?: string | null;
  publishedAt?: Date | string | null;
  createdAt?: Date | string;
  category?: { name: string; slug: string } | null;
  author?: { name: string | null; image?: string | null } | null;
}

export interface DynamicCategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface SeoLandingTemplateProps {
  data: SeoPageData;
  recentPosts?: DynamicPostItem[];
  categories?: DynamicCategoryItem[];
}

export default function SeoLandingTemplate({
  data,
  recentPosts = [],
  categories = [],
}: SeoLandingTemplateProps) {
  const { hero, features, comparison, steps, faqs, canonicalUrl, metaTitle, metaDescription } = data;

  // Generate JSON-LD Schema for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PostNest',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: metaDescription,
    url: canonicalUrl,
  };

  return (
    <>
      {/* Google Schema JSON-LD Script Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <div className="space-y-20 pb-20">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800/80">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-slate-900 border border-orange-200 dark:border-orange-500/30 shadow-sm">
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {hero.badgeText}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {hero.title} <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                {hero.highlightTitle}
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {hero.description}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={hero.primaryCtaHref}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base shadow-lg shadow-orange-500/25 transition-all duration-200 flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-5 h-5" />
                <span>{hero.primaryCtaText}</span>
              </Link>

              <Link
                href={hero.secondaryCtaHref}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-base transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <BookOpen className="w-5 h-5 text-orange-500" />
                <span>{hero.secondaryCtaText}</span>
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-200 dark:border-slate-800 max-w-4xl mx-auto">
              {hero.stats.map((stat, idx) => (
                <div key={idx} className="text-center p-3">
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2. Key Features Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {features.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.items.map((item, idx) => {
              const IconComp = ICON_MAP[item.iconName] || Sparkles;
              return (
                <div
                  key={idx}
                  className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 hover:border-orange-500/40 transition-all duration-300 space-y-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic Category Hub Pills (if categories available) */}
        {categories.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span>Explore Trending Niche Topics</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-4 py-2.5 rounded-xl glass-card border border-slate-200 dark:border-slate-800 hover:border-orange-500/40 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2 hover:text-orange-600 dark:hover:text-white transition-all"
                >
                  <Cpu className="w-3.5 h-3.5 text-orange-500" />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Dynamic Live Community Articles Showcase (if recentPosts available) */}
        {recentPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span>Live Published Articles & Guest Posts</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fresh articles published recently on PostNest
                </p>
              </div>
              <Link
                href="/#explore"
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
              >
                View All Articles →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.slice(0, 6).map((post) => (
                <div
                  key={post.id}
                  className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-orange-500/40 transition-all duration-200 group"
                >
                  <div className="space-y-4">
                    {/* Featured Image Thumbnail */}
                    <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900">
                      <img
                        src={post.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {post.category && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-orange-400 text-[10px] font-extrabold uppercase tracking-wider border border-orange-500/30">
                            {post.category.name}
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Article Info */}
                    <div className="p-5 pt-0 space-y-2.5">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      {post.excerpt && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
                          {post.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                        {post.author?.name || 'PostNest Author'}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-orange-600 dark:text-orange-400 font-bold flex items-center space-x-1 hover:underline shrink-0"
                      >
                        <span>Read Article</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Feature Comparison Matrix */}
        <section id="comparison" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {comparison.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {comparison.subtitle}
            </p>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {comparison.headers.map((head, idx) => (
                    <th key={idx} className="p-4 sm:p-5">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
                {comparison.rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-semibold text-slate-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-orange-600 dark:text-orange-400 font-bold">
                      {typeof row.postNest === 'boolean' ? (
                        row.postNest ? (
                          <div className="flex items-center space-x-1.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            <span>Supported</span>
                          </div>
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-400" />
                        )
                      ) : (
                        row.postNest
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-slate-500 dark:text-slate-400">
                      {typeof row.others === 'boolean' ? (
                        row.others ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <div className="flex items-center space-x-1.5 text-slate-400">
                            <XCircle className="w-5 h-5 text-slate-400" />
                            <span>Not Available</span>
                          </div>
                        )
                      ) : (
                        row.others
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Step-by-Step Guide */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {steps.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {steps.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.items.map((step, idx) => (
              <div
                key={idx}
                className="glass-card p-8 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-4 relative overflow-hidden"
              >
                <span className="text-5xl font-black text-orange-500/20 dark:text-orange-500/15 absolute top-4 right-4 font-mono">
                  {step.step}
                </span>
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-orange-500/20">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FAQs Section with Accordion */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Have questions about PostNest? We have answers.
            </p>
          </div>

          <FaqAccordion
            items={faqs.map((faq) => ({ q: faq.question, a: faq.answer }))}
            defaultOpenIndex={0}
          />
        </section>

        {/* 6. Bottom Call to Action */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 sm:p-14 rounded-3xl border border-orange-200 dark:border-orange-500/30 text-center space-y-6 bg-gradient-to-b from-orange-500/10 dark:from-orange-950/30 via-amber-500/5 to-transparent">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
              Ready to Publish & Rank Higher?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base max-w-2xl mx-auto">
              Join thousands of creators, engineers, and marketers who publish on PostNest for maximum organic reach and instant search indexing.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
