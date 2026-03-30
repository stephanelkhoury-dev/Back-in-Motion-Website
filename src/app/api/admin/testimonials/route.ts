import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

const ADMIN_ROLES = ['admin', 'super_admin', 'manager'];

const testimonialSchema = z.object({
  clientName: z.string().min(1).max(200),
  service: z.string().min(1).max(200),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
  isActive: z.boolean().default(true),
});

// GET /api/admin/testimonials
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const items = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Testimonials GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/testimonials
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data = testimonialSchema.parse(body);

    const item = await prisma.testimonial.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Testimonials POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
