import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/admin/packages/[id]
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        services: { include: { service: { select: { id: true, name: true, category: true } } } },
        _count: { select: { subscriptions: true } },
      },
    });

    if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    if (user.role !== 'super_admin' && pkg.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      ...pkg,
      features: (() => { try { return JSON.parse(pkg.features); } catch { return []; } })(),
      services: pkg.services.map((ps) => ps.service),
    });
  } catch (error) {
    console.error('Admin package GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/admin/packages/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    if (user.role !== 'super_admin' && existing.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.category !== undefined) data.category = body.category;
    if (body.type !== undefined) data.type = body.type;
    if (body.totalSessions !== undefined) data.totalSessions = parseInt(body.totalSessions);
    if (body.price !== undefined) data.price = parseFloat(body.price);
    if (body.validityDays !== undefined) data.validityDays = parseInt(body.validityDays);
    if (body.includesECoach !== undefined) data.includesECoach = body.includesECoach;
    if (body.features !== undefined) data.features = JSON.stringify(body.features);
    if (body.isPopular !== undefined) data.isPopular = body.isPopular;
    if (body.isActive !== undefined) data.isActive = body.isActive;

    // Update service associations if provided
    if (body.serviceIds) {
      await prisma.packageService.deleteMany({ where: { packageId: id } });
      if (body.serviceIds.length > 0) {
        await prisma.packageService.createMany({
          data: body.serviceIds.map((sid: string) => ({ packageId: id, serviceId: sid })),
        });
      }
    }

    const pkg = await prisma.package.update({ where: { id }, data });
    return NextResponse.json(pkg);
  } catch (error) {
    console.error('Admin package PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/admin/packages/[id]
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    if (user.role !== 'super_admin' && existing.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.package.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin package DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
