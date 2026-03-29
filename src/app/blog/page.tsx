import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Tag } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getBlogPosts } from '@/lib/data';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog & Tips | Back in Motion',
  description: 'Expert articles on physiotherapy, nutrition, fitness, body shaping, and wellness from our clinical team.',
};

export default async function BlogPage() {
  const BLOG_POSTS = await getBlogPosts();
  return (
    <>
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Blog & Tips</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Expert insights, health tips, and wellness advice from our clinical team.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BLOG_POSTS.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card hover className="h-full">
                  <div className="h-48 bg-muted rounded-xl mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Article Image</span>
                  </div>
                  <Badge variant="primary" className="mb-2">{post.category}</Badge>
                  <h2 className="text-xl font-bold text-foreground mb-2">{post.title}</h2>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.publishedAt ? formatDate(post.publishedAt.toISOString()) : 'Draft'}
                    </div>
                    <span>{post.author}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {(post.tags as string[]).map((tag) => (
                      <span key={tag} className="flex items-center text-xs text-muted-foreground">
                        <Tag className="h-2.5 w-2.5 mr-0.5" />{tag}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
