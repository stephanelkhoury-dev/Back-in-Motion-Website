import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/exercises/assignments - get user's exercise assignments
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const assignments = await prisma.exerciseAssignment.findMany({
      where: { clientId: userId, isActive: true },
      include: {
        exercise: true,
        logs: {
          orderBy: { completedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = assignments.map((a) => ({
      ...a,
      exercise: {
        ...a.exercise,
        instructions: JSON.parse(a.exercise.instructions as string),
        precautions: a.exercise.precautions ? JSON.parse(a.exercise.precautions as string) : [],
      },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Assignments GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
