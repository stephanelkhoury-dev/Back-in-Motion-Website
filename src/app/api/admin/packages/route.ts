import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/admin/packages - list packages for the admin's org
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const where = user.role === 'super_admin' ? {} : { organizationId: user.organizationId };

    const packages = await prisma.package.findMany({
      where,
      include: {
        services: { include: { service: { select: { id: true, name: true, category: true } } } },
        _count: { select: { subscriptions: true } },
        organization: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = packages.map((p) => ({
      ...p,
      features: (() => { try { return JSON.parse(p.features); } catch { return []; } })(),
      services: p.services.map((ps) => ps.service),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Admin packages GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/packages - create a new package
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, category, type, totalSessions, price, validityDays, includesECoach, features, isPopular, serviceIds } = body;

    if (!name || !description || !category || !type || totalSessions == null || price == null || !validityDays) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orgId = user.role === 'super_admin' ? body.organizationId : user.organizationId;

    const pkg = await prisma.package.create({
      data: {
        name,
        description,
        category,
        type,
        totalSessions: parseInt(totalSessions),
        price: parseFloat(price),
        validityDays: parseInt(validityDays),
        includesECoach: includesECoach || false,
        features: JSON.stringify(features || []),
        isPopular: isPopular || false,
        organizationId: orgId,
        ...(serviceIds?.length ? {
          services: {
            create: serviceIds.map((sid: string) => ({ serviceId: sid })),
          },
        } : {}),
      },
      include: {
        services: { include: { service: { select: { id: true, name: true } } } },
      },
    });

    return NextResponse.json(pkg, { status: 201 });
  } catch (error) {
    console.error('Admin packages POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
