import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/progress - get client progress data (measurements + workout stats)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const [measurements, workoutLogs, appointments] = await Promise.all([
      prisma.bodyMeasurement.findMany({
        where: { clientId: userId },
        orderBy: { measuredAt: 'desc' },
        take: 10,
      }),
      prisma.workoutLog.findMany({
        where: { clientId: userId },
        include: {
          assignment: {
            include: { exercise: { select: { name: true, category: true } } },
          },
        },
        orderBy: { completedAt: 'desc' },
        take: 30,
      }),
      prisma.appointment.findMany({
        where: { clientId: userId, status: 'completed' },
        include: { service: { select: { name: true, category: true } } },
        orderBy: { date: 'desc' },
        take: 20,
      }),
    ]);

    // Calculate exercise stats
    const totalWorkouts = workoutLogs.length;
    const avgPainLevel = workoutLogs.reduce((sum, l) => sum + (l.painLevel || 0), 0) / (totalWorkouts || 1);
    const completedAppointments = appointments.length;

    return NextResponse.json({
      measurements,
      workoutLogs,
      completedAppointments,
      stats: {
        totalWorkouts,
        avgPainLevel: Math.round(avgPainLevel * 10) / 10,
        completedAppointments,
        latestWeight: measurements[0]?.weight || null,
        latestBmi: measurements[0]?.bmi || null,
      },
    });
  } catch (error) {
    console.error('Progress GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
