import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import {
  Calendar,
  Eye,
  Building2,
  CheckCircle2,
  Share2,
  ArrowLeft,
  ExternalLink,
  Info,
  Sparkles,
} from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

// Generate SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true, company: true },
  });

  if (!post) {
    return {
      title: 'Article Not Found | PostNest.in',
    };
  }

  return {
    title: `${post.title} | PostNest.in`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
      authors: [post.author.name],
      images: post.featuredImage ? [{ url: post.featuredImage }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      author: true,
      company: true,
    },
  });

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Increment view count asynchronously
  await prisma.post.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  // Query Related Articles
  const relatedPosts = await prisma.post.findMany({
    where: {
      categoryId: post.categoryId,
      id: { not: post.id },
      status: 'PUBLISHED',
    },
    take: 3,
  });

  // Check if content has external links for affiliate disclosure display
  const hasExternalLinks = post.externalLinksCount > 0 || post.content.includes('href=');

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage ? [post.featuredImage] : [],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PostNest.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://postnest.in/logo.png',
      },
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Schema.org Article Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white flex items-center space-x-1">
          <ArrowLeft className="w-3 h-3" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <Link href={`/category/${post.category.slug}`} className="hover:text-white text-sky-400">
          {post.category.name}
        </Link>
        <span>/</span>
        <span className="truncate max-w-xs text-slate-300">{post.title}</span>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-slate-800 pb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider border border-brand-500/30">
          {post.category.name}
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight">
          {post.title}
        </h1>

        <p className="text-lg text-slate-300 leading-relaxed font-normal">
          {post.excerpt}
        </p>

        {/* Author / Company Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <img
              src={post.author.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <div>
              <p className="text-slate-200 font-semibold text-sm">{post.author.name}</p>
              {post.company && (
                <Link
                  href={`/company/${post.company.slug}`}
                  className="flex items-center space-x-1 text-sky-400 hover:underline"
                >
                  <Building2 className="w-3 h-3" />
                  <span>{post.company.companyName}</span>
                  {post.company.isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{post.views} views</span>
            </span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full max-h-[450px] object-cover"
          />
        </div>
      )}

      {/* Affiliate / External Link Disclosure Box */}
      {hasExternalLinks && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-brand-500/20 flex items-start space-x-3 text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-white">Disclosure:</span> This article may contain outbound partner links or official product recommendations in accordance with PostNest.in policies.
          </div>
        </div>
      )}

      {/* Google AdSense Spot (Top of Content) */}
      <div className="w-full py-3 bg-slate-950/60 border border-slate-800 rounded-lg text-center text-[10px] text-slate-500 font-mono">
        [ AdSense Article Banner Spot ]
      </div>

      {/* Main Article Content */}
      <div
        className="blog-prose pt-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Google AdSense Spot (Bottom of Content) */}
      <div className="w-full py-3 bg-slate-950/60 border border-slate-800 rounded-lg text-center text-[10px] text-slate-500 font-mono my-8">
        [ AdSense Bottom Content Banner Spot ]
      </div>

      {/* Company / Author Profile Card Footer */}
      {post.company && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 my-10">
          <div className="flex items-center space-x-4">
            <img
              src={post.company.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'}
              alt={post.company.companyName}
              className="w-14 h-14 rounded-xl object-cover border border-slate-700 bg-slate-900"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <h4 className="text-base font-bold text-white">{post.company.companyName}</h4>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 max-w-md">{post.company.description}</p>
            </div>
          </div>

          {post.company.website && (
            <a
              href={post.company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors whitespace-nowrap"
            >
              <span>Visit Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="pt-10 border-t border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-white">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <Link
                key={rel.id}
                href={`/blog/${rel.slug}`}
                className="glass-card p-4 rounded-xl space-y-3 group"
              >
                <div className="h-32 rounded-lg overflow-hidden">
                  <img
                    src={rel.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-brand-300 line-clamp-2">
                  {rel.title}
                </h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
