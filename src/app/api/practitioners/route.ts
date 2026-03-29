import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET /api/practitioners - list available practitioners for booking
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceCategory = searchParams.get('category');

    // Map service categories to practitioner roles
    const roleMap: Record<string, string[]> = {
      physio: ['therapist'],
      dietitian: ['dietitian'],
      aesthetic: ['aesthetic_specialist'],
      electrolysis: ['electrologist'],
      gym: ['trainer'],
    };

    const roles = serviceCategory && roleMap[serviceCategory]
      ? roleMap[serviceCategory]
      : Object.values(roleMap).flat();

    const practitioners = await prisma.user.findMany({
      where: {
        role: { in: roles },
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
        specialties: true,
        bio: true,
        avatarUrl: true,
      },
      orderBy: { firstName: 'asc' },
    });

    const formatted = practitioners.map((p) => ({
      ...p,
      specialties: p.specialties ? JSON.parse(p.specialties) : [],
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Practitioners GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
