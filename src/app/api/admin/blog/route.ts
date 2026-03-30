import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

const ADMIN_ROLES = ['admin', 'super_admin', 'manager'];

const blogPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
  excerpt: z.string().min(1).max(500),
  content: z.string().min(1),
  author: z.string().min(1).max(100),
  category: z.string().min(1).max(100),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().max(500).optional(),
  isPublished: z.boolean().default(true),
});

// GET /api/admin/blog - list all blog posts (including unpublished)
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(posts.map(p => ({
      ...p,
      tags: JSON.parse(p.tags || '[]'),
    })));
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/blog - create blog post
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = blogPostSchema.parse(body);

    // Check slug uniqueness
    const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        category: data.category,
        tags: JSON.stringify(data.tags),
        imageUrl: data.imageUrl || null,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? new Date() : new Date(),
      },
    });

    return NextResponse.json({ ...post, tags: data.tags }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Blog POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
