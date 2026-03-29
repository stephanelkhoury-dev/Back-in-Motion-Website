import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    const where = {
      isActive: true,
      ...(category && { category }),
      ...(type && { type }),
    };

    const packages = await prisma.package.findMany({
      where,
      include: {
        services: { include: { service: true } },
      },
      orderBy: { price: 'asc' },
    });

    const formatted = packages.map((pkg) => ({
      ...pkg,
      features: JSON.parse(pkg.features as string),
      services: pkg.services.map((ps) => ps.service),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Packages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
