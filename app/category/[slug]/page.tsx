import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Cpu } from 'lucide-react';

interface Props {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: Props) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link href="/" className="text-xs text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-white flex items-center space-x-1 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900/60">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{category.name}</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{category.description || 'Explore top technical articles and discussions in this topic.'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {category.posts.length === 0 && (
          <div className="col-span-3 text-center py-12 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <p className="text-slate-500 text-sm">No published articles yet in this category.</p>
            <Link href="/dashboard/create-post" className="text-xs text-orange-500 font-semibold mt-2 inline-block hover:underline">
              Be the first to publish in {category.name} →
            </Link>
          </div>
        )}
        {category.posts.map((post) => (
          <article key={post.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-800 group">
            <div>
              <div className="h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={post.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">{post.excerpt}</p>
              </div>
            </div>
            <div className="p-5 pt-0 text-xs text-slate-500 dark:text-slate-400 flex justify-between border-t border-slate-100 dark:border-slate-800/60 mt-4">
              <span>By {post.author.name}</span>
              <Link href={`/blog/${post.slug}`} className="text-orange-600 dark:text-orange-400 font-semibold hover:underline">
                Read →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
