import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/reminders - list user reminders
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;

    const where = role === 'admin' ? {} : { userId };

    const reminders = await prisma.reminder.findMany({
      where,
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { scheduledAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Reminders GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
