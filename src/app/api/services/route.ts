import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = {
      isActive: true,
      ...(category && { category }),
    };

    const services = await prisma.service.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Services error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
