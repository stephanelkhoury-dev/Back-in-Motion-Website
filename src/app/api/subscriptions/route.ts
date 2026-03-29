import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/subscriptions - list user subscriptions
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;

    const where = role === 'admin' ? {} : { clientId: userId };

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        package: true,
        client: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { startDate: 'desc' },
    });

    const formatted = subscriptions.map((s) => ({
      ...s,
      package: {
        ...s.package,
        features: JSON.parse(s.package.features as string),
      },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Subscriptions GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
