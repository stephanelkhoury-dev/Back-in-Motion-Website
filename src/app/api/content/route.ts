import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const [faq, testimonials] = await Promise.all([
      prisma.fAQItem.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
    ]);

    return NextResponse.json({ faq, testimonials });
  } catch (error) {
    console.error('Content GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
