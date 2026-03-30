import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  const pages = await prisma.page.findMany({
    where: { isActive: true, showInNav: true, navParentId: null },
    include: {
      children: {
        where: { isActive: true, showInNav: true },
        orderBy: { navOrder: 'asc' },
      },
    },
    orderBy: { navOrder: 'asc' },
  });

  const nav = pages.map(p => ({
    label: p.title,
    href: p.slug === '/' ? '/' : `/${p.slug}`,
    icon: p.icon,
    children: p.children.length > 0
      ? p.children.map(c => ({ label: c.title, href: `/${c.slug}` }))
      : undefined,
  }));

  return NextResponse.json(nav);
}
