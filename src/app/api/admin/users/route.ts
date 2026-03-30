import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';
import { hash } from 'bcryptjs';

// GET /api/admin/users - list all users in the admin's org
export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const roleFilter = searchParams.get('role');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    // Org scoping
    if (user.role !== 'super_admin') {
      where.organizationId = user.organizationId;
    }

    if (roleFilter && roleFilter !== 'all') {
      if (roleFilter === 'staff') {
        where.role = { notIn: ['client', 'super_admin'] };
      } else if (roleFilter === 'client') {
        where.role = 'client';
      } else {
        where.role = roleFilter;
      }
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
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
        organizationId: true,
        serviceAccess: {
          include: { service: { select: { id: true, name: true, category: true } } },
        },
        _count: {
          select: {
            clientAppointments: true,
            practitionerAppointments: true,
            subscriptions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = users.map((u) => ({
      ...u,
      specialties: u.specialties ? (() => { try { return JSON.parse(u.specialties); } catch { return []; } })() : [],
      languages: u.languages ? (() => { try { return JSON.parse(u.languages); } catch { return []; } })() : [],
      serviceAccess: u.serviceAccess.map((sa) => sa.service),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/users - create a new user
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { firstName, lastName, email, password, phone, role, specialties, bio, languages, serviceIds } = body;

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prevent non-super_admin from creating admin/super_admin
    if (user.role !== 'super_admin' && ['super_admin', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Cannot create users with admin or higher role' }, { status: 403 });
    }

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await hash(password, 12);
    const orgId = user.role === 'super_admin' ? body.organizationId : user.organizationId;

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        phone: phone || null,
        role,
        organizationId: orgId,
        specialties: specialties ? JSON.stringify(specialties) : null,
        bio: bio || null,
        languages: languages ? JSON.stringify(languages) : null,
      },
    });

    // Create service access entries
    if (serviceIds?.length && role !== 'client') {
      await prisma.staffServiceAccess.createMany({
        data: serviceIds.map((sid: string) => ({ userId: newUser.id, serviceId: sid })),
      });
    }

    return NextResponse.json({ id: newUser.id, email: newUser.email, role: newUser.role }, { status: 201 });
  } catch (error) {
    console.error('Admin users POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
