import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const page = await prisma.page.findUnique({
    where: { id },
    include: { children: { orderBy: { navOrder: 'asc' } } },
  });

  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // If slug changed, check uniqueness
  if (body.slug) {
    const existing = await prisma.page.findFirst({ where: { slug: body.slug, NOT: { id } } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
  }

  const page = await prisma.page.update({
    where: { id },
    data: {
      title: body.title ?? undefined,
      slug: body.slug ?? undefined,
      description: body.description ?? undefined,
      content: body.content ? JSON.stringify(body.content) : undefined,
      isActive: body.isActive ?? undefined,
      showInNav: body.showInNav ?? undefined,
      navOrder: body.navOrder ?? undefined,
      navParentId: body.navParentId ?? undefined,
      icon: body.icon ?? undefined,
      metaTitle: body.metaTitle ?? undefined,
      metaDescription: body.metaDescription ?? undefined,
    },
  });

  return NextResponse.json(page);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Unparent children before deleting
  await prisma.page.updateMany({ where: { navParentId: id }, data: { navParentId: null } });
  await prisma.page.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
