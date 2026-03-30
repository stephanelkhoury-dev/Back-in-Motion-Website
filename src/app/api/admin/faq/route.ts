import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

const ADMIN_ROLES = ['admin', 'super_admin', 'manager'];

const faqSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(2000),
  category: z.string().min(1).max(100),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// GET /api/admin/faq
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const items = await prisma.fAQItem.findMany({ orderBy: { sortOrder: 'asc' } });
    return NextResponse.json(items);
  } catch (error) {
    console.error('FAQ GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/faq
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = faqSchema.parse(body);

    const item = await prisma.fAQItem.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('FAQ POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
