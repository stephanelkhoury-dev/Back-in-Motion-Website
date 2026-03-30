import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/super-admin/organizations
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const orgs = await prisma.organization.findMany({
      include: {
        _count: {
          select: { users: true, services: true, packages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get revenue per org
    const orgsWithStats = await Promise.all(
      orgs.map(async (org) => {
        const payments = await prisma.payment.aggregate({
          where: {
            status: 'completed',
            client: { organizationId: org.id },
          },
          _sum: { amount: true },
        });

        const activeSubscriptions = await prisma.subscription.count({
          where: {
            status: 'active',
            client: { organizationId: org.id },
          },
        });

        return {
          ...org,
          totalRevenue: payments._sum.amount || 0,
          activeSubscriptions,
        };
      })
    );

    return NextResponse.json(orgsWithStats);
  } catch (error) {
    console.error('Super admin orgs GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/super-admin/organizations
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, phone, address, website, timezone, currency } = body;

    if (!name) {
      return NextResponse.json({ error: 'Organization name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const existing = await prisma.organization.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'An organization with this name already exists' }, { status: 409 });
    }

    const org = await prisma.organization.create({
      data: {
        name,
        slug,
        email: email || null,
        phone: phone || null,
        address: address || null,
        website: website || null,
        timezone: timezone || 'Asia/Beirut',
        currency: currency || 'USD',
      },
    });

    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    console.error('Super admin orgs POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
