import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';
import { hash } from 'bcryptjs';

// GET /api/admin/users/[id]
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const targetUser = await prisma.user.findUnique({
      where: { id },
      include: {
        serviceAccess: {
          include: { service: { select: { id: true, name: true, category: true } } },
        },
        _count: {
          select: { clientAppointments: true, practitionerAppointments: true, subscriptions: true },
        },
      },
    });

    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.role !== 'super_admin' && targetUser.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { passwordHash: _, ...userWithout } = targetUser;
    return NextResponse.json({
      ...userWithout,
      specialties: userWithout.specialties ? (() => { try { return JSON.parse(userWithout.specialties); } catch { return []; } })() : [],
      languages: userWithout.languages ? (() => { try { return JSON.parse(userWithout.languages); } catch { return []; } })() : [],
      serviceAccess: userWithout.serviceAccess.map((sa) => sa.service),
    });
  } catch (error) {
    console.error('Admin user GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/users/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.role !== 'super_admin' && existing.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Prevent escalation
    if (user.role !== 'super_admin' && ['super_admin', 'admin'].includes(existing.role)) {
      return NextResponse.json({ error: 'Cannot modify admin users' }, { status: 403 });
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.firstName !== undefined) data.firstName = body.firstName;
    if (body.lastName !== undefined) data.lastName = body.lastName;
    if (body.email !== undefined) data.email = body.email;
    if (body.phone !== undefined) data.phone = body.phone || null;
    if (body.role !== undefined) {
      if (user.role !== 'super_admin' && ['super_admin', 'admin'].includes(body.role)) {
        return NextResponse.json({ error: 'Cannot assign admin role' }, { status: 403 });
      }
      data.role = body.role;
    }
    if (body.password) data.passwordHash = await hash(body.password, 12);
    if (body.specialties !== undefined) data.specialties = JSON.stringify(body.specialties);
    if (body.bio !== undefined) data.bio = body.bio || null;
    if (body.languages !== undefined) data.languages = JSON.stringify(body.languages);
    if (body.isActive !== undefined) data.isActive = body.isActive;

    // Update service access
    if (body.serviceIds !== undefined) {
      await prisma.staffServiceAccess.deleteMany({ where: { userId: id } });
      if (body.serviceIds.length > 0) {
        await prisma.staffServiceAccess.createMany({
          data: body.serviceIds.map((sid: string) => ({ userId: id, serviceId: sid })),
        });
      }
    }

    const updated = await prisma.user.update({ where: { id }, data });
    return NextResponse.json({ id: updated.id, email: updated.email, role: updated.role });
  } catch (error) {
    console.error('Admin user PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/users/[id] - deactivate user
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (user.role !== 'super_admin' && existing.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (existing.role === 'super_admin') {
      return NextResponse.json({ error: 'Cannot deactivate super admin' }, { status: 403 });
    }

    await prisma.user.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin user DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
