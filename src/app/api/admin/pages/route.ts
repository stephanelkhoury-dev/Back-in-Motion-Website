import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orgFilter = user.role === 'super_admin' ? {} : { organizationId: user.organizationId };
  const pages = await prisma.page.findMany({
    where: orgFilter,
    include: { children: { orderBy: { navOrder: 'asc' } } },
    orderBy: { navOrder: 'asc' },
  });

  return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { title, slug, description, content, isActive, showInNav, navOrder, navParentId, icon, metaTitle, metaDescription } = body;

  if (!title || !slug) {
    return NextResponse.json({ error: 'Title and slug are required' }, { status: 400 });
  }

  // Check slug uniqueness
  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
  }

  const page = await prisma.page.create({
    data: {
      title,
      slug,
      description: description || null,
      content: content ? JSON.stringify(content) : null,
      isActive: isActive ?? true,
      showInNav: showInNav ?? true,
      navOrder: navOrder ?? 0,
      navParentId: navParentId || null,
      icon: icon || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      organizationId: user.organizationId || null,
    },
  });

  return NextResponse.json(page, { status: 201 });
}
