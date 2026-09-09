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
      <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center space-x-1">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white">{category.name}</h1>
            <p className="text-slate-400 text-sm">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {category.posts.map((post) => (
          <article key={post.id} className="glass-card rounded-xl overflow-hidden flex flex-col justify-between">
            <div>
              <div className="h-44 overflow-hidden">
                <img
                  src={post.featuredImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600'}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-white hover:text-brand-300">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3">{post.excerpt}</p>
              </div>
            </div>
            <div className="p-5 pt-0 text-xs text-slate-400 flex justify-between">
              <span>{post.author.name}</span>
              <Link href={`/blog/${post.slug}`} className="text-brand-400 font-semibold">
                Read →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
