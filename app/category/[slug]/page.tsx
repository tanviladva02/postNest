import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSiteUrl } from '@/lib/site';
import FaqAccordion from '@/components/FaqAccordion';
import {
  ArrowLeft,
  Cpu,
  Sparkles,
  BookOpen,
  TrendingUp,
  Layers,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  User,
  Calendar,
} from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/category/${params.slug}`;

  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    select: { name: true, slug: true, description: true },
  });

  const categoryName = category?.name || params.slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  const description =
    category?.description ||
    `Explore in-depth technical guides, tutorials, and engineering articles in ${categoryName} on PostNest. Published by verified creators and industry professionals.`;

  return {
    title: `${categoryName} Articles, AI Tools & Engineering Guides | PostNest`,
    description,
    keywords: [
      `${categoryName}`,
      `${categoryName} articles`,
      `${categoryName} tools`,
      `${categoryName} guides`,
      'tech publishing',
      'developer blogs',
      'PostNest categories',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${categoryName} — Technical Articles & Guides | PostNest`,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'PostNest',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | PostNest`,
      description,
    },
  };
}

export const revalidate = 60; // 60s cache revalidation

export default async function CategoryPage({ params }: Props) {
  const siteUrl = getSiteUrl();
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
    include: {
      posts: {
        where: { status: 'PUBLISHED' },
        include: { author: true, company: true },
        orderBy: { publishedAt: 'desc' },
      },
    },
  });

  if (!category) notFound();

  const canonicalUrl = `${siteUrl}/category/${category.slug}`;

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: `${siteUrl}/#categories`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: canonicalUrl,
      },
    ],
  };

  // CollectionPage Schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Articles & Guides`,
    description: category.description || `Explore technical guides and engineering insights in ${category.name}.`,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: category.posts.map((post, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${siteUrl}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  // Category specific FAQs for SEO rich snippet ranking
  const categoryFaqs = [
    {
      q: `What type of content can I publish under ${category.name}?`,
      a: `Under ${category.name}, you can publish step-by-step technical guides, hands-on tutorials, code breakdowns, tool reviews, case studies, and engineering updates. All articles must adhere to our 100% natural human-written language standards.`,
    },
    {
      q: `How quickly are new articles in ${category.name} indexed by search engines?`,
      a: `Articles published under ${category.name} are rendered on the server side (SSR) and automatically added to PostNest's dynamic XML sitemap. Googlebot typically crawls and indexes new posts within 24 hours.`,
    },
    {
      q: `Can companies publish official guides in ${category.name}?`,
      a: `Yes! Verified company profiles can co-author engineering posts, product changelogs, and technical documentation in ${category.name} to build domain authority and reach developers worldwide.`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Breadcrumb Navigation Trail */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-orange-600 dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/#categories" className="hover:text-orange-600 dark:hover:text-white transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 dark:text-white font-semibold">{category.name}</span>
        </nav>

        {/* Category Hero Header Banner */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 shadow-md shadow-orange-500/10">
                <Cpu className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Topic Category</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {category.name}
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl leading-relaxed">
                  {category.description ||
                    `Explore high-quality, human-written guides, reviews, and tutorials in ${category.name}. Distraction-free reading with zero paywalls.`}
                </p>
              </div>
            </div>

            <Link
              href="/dashboard/create-post"
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all shrink-0 flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Publish in {category.name}</span>
            </Link>
          </div>
        </div>

        {/* Informative Human-Written Category Guide Section */}
        <section className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 bg-white dark:bg-slate-900/60">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span>Understanding {category.name} in Modern Tech Publishing</span>
          </h2>
          <div className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 space-y-4 leading-relaxed font-normal">
            <p>
              Welcome to the official <strong>{category.name}</strong> hub on PostNest. Whether you are an engineer looking for hands-on technical solutions, a founder evaluating software utilities, or a writer sharing real-world industry experience, this hub brings together curated human-authored perspectives.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>100% Human Content</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every guide is authored by human developers and subject-matter specialists with zero generic AI filler.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Instant Google Crawling</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Server-side HTML and structured JSON-LD schemas guarantee search engines discover and rank content quickly.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Reader Paywalls</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  All articles remain fully open for readers, social sharing, and search engine crawlers without email popups.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Articles Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-orange-500" />
              <span>Published Articles ({category.posts.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {category.posts.length === 0 && (
              <div className="col-span-3 text-center py-16 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 mx-auto flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium text-base">
                  No published articles yet in {category.name}.
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto">
                  Be the pioneer writer! Share your technical experience or guide in this category and get featured on PostNest.
                </p>
                <Link
                  href="/dashboard/create-post"
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs inline-block shadow-md transition-all"
                >
                  Publish First Article in {category.name} →
                </Link>
              </div>
            )}

            {category.posts.map((post) => (
              <article
                key={post.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-800 group hover:border-orange-500/40 transition-all duration-300"
              >
                <div>
                  <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                    <img
                      src={post.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-orange-400 text-[10px] font-extrabold uppercase tracking-wider border border-orange-500/30">
                        {category.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 space-y-2.5">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed font-normal">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-1">
                      <User className="w-3 h-3 text-orange-500 inline mr-1" />
                      {post.author.name}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center space-x-1"
                    >
                      <span>Read →</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Category FAQs Accordion */}
        <section className="space-y-6 max-w-4xl mx-auto pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center space-x-2">
              <HelpCircle className="w-5 h-5 text-orange-500" />
              <span>{category.name} Publishing FAQ</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Frequently asked questions about writing and reading in {category.name}
            </p>
          </div>
          <FaqAccordion items={categoryFaqs} defaultOpenIndex={0} />
        </section>
      </div>
    </>
  );
}
