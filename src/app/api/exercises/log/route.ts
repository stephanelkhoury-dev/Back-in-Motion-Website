import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

const logSchema = z.object({
  assignmentId: z.string(),
  setsCompleted: z.number().min(0),
  repsCompleted: z.number().min(0),
  painLevel: z.number().min(0).max(10).optional(),
  difficulty: z.enum(['too_easy', 'just_right', 'too_hard']).optional(),
  notes: z.string().optional(),
});

// POST /api/exercises/log - log a workout
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const data = logSchema.parse(body);

    // Verify assignment belongs to user
    const assignment = await prisma.exerciseAssignment.findUnique({
      where: { id: data.assignmentId },
    });
    if (!assignment || assignment.clientId !== userId) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const log = await prisma.workoutLog.create({
      data: {
        assignmentId: data.assignmentId,
        clientId: userId,
        setsCompleted: data.setsCompleted,
        repsCompleted: data.repsCompleted,
        painLevel: data.painLevel,
        difficulty: data.difficulty,
        notes: data.notes,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Workout log error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/exercises/log - get workout history
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const logs = await prisma.workoutLog.findMany({
      where: { clientId: userId },
      include: {
        assignment: {
          include: { exercise: { select: { name: true, category: true, muscleGroup: true } } },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: 50,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Workout logs GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
