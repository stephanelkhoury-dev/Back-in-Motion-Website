import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/admin/services - list services for the admin's org
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const where = user.role === 'super_admin' ? {} : { organizationId: user.organizationId };

    const services = await prisma.service.findMany({
      where,
      include: {
        _count: { select: { appointments: true, staffAccess: true } },
        organization: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Admin services GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/admin/services - create a new service
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || !['super_admin', 'admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, category, description, shortDescription, duration, price, imageUrl } = body;

    if (!name || !category || !description || !shortDescription || !duration || price == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Check slug uniqueness
    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'A service with this name already exists' }, { status: 409 });
    }

    const orgId = user.role === 'super_admin' ? body.organizationId : user.organizationId;

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        category,
        description,
        shortDescription,
        duration: parseInt(duration),
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        organizationId: orgId,
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Admin services POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
