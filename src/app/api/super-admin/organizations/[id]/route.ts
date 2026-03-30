import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/super-admin/organizations/[id]
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const org = await prisma.organization.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true, firstName: true, lastName: true, email: true,
            role: true, isActive: true, createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        services: { select: { id: true, name: true, category: true, price: true, isActive: true } },
        packages: { select: { id: true, name: true, price: true, isActive: true } },
        _count: { select: { users: true, services: true, packages: true } },
      },
    });

    if (!org) return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    return NextResponse.json(org);
  } catch (error) {
    console.error('Super admin org GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/super-admin/organizations/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.name !== undefined) {
      data.name = body.name;
      data.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (body.email !== undefined) data.email = body.email || null;
    if (body.phone !== undefined) data.phone = body.phone || null;
    if (body.address !== undefined) data.address = body.address || null;
    if (body.website !== undefined) data.website = body.website || null;
    if (body.timezone !== undefined) data.timezone = body.timezone;
    if (body.currency !== undefined) data.currency = body.currency;
    if (body.logo !== undefined) data.logo = body.logo || null;
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.settings !== undefined) data.settings = JSON.stringify(body.settings);

    const org = await prisma.organization.update({ where: { id }, data });
    return NextResponse.json(org);
  } catch (error) {
    console.error('Super admin org PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/super-admin/organizations/[id]
export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    // Soft delete
    await prisma.organization.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Super admin org DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
