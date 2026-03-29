import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/exercises - list exercises (optionally filtered)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const muscleGroup = searchParams.get('muscleGroup');
    const difficulty = searchParams.get('difficulty');

    const where = {
      isActive: true,
      ...(category && { category }),
      ...(muscleGroup && { muscleGroup }),
      ...(difficulty && { difficulty }),
    };

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    const formatted = exercises.map((e) => ({
      ...e,
      instructions: JSON.parse(e.instructions as string),
      precautions: e.precautions ? JSON.parse(e.precautions as string) : [],
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Exercises GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
