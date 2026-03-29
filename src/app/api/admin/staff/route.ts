import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/admin/staff - list all staff members
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const staff = await prisma.user.findMany({
      where: {
        role: { notIn: ['client'] },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        specialties: true,
        bio: true,
        languages: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            practitionerAppointments: true,
          },
        },
      },
      orderBy: { firstName: 'asc' },
    });

    const formatted = staff.map((s) => ({
      ...s,
      specialties: s.specialties ? JSON.parse(s.specialties) : [],
      languages: s.languages ? JSON.parse(s.languages) : [],
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Admin staff error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
