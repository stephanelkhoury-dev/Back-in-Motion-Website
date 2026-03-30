import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

// GET /api/appointments - list appointments
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let where: Record<string, unknown> = {};

    if (role === 'client') {
      where = { clientId: userId };
    } else if (['therapist', 'dietitian', 'trainer', 'aesthetic_specialist', 'electrologist'].includes(role)) {
      where = { practitionerId: userId };
    }
    // admin/receptionist see all

    if (status) where.status = status;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        practitioner: { select: { id: true, firstName: true, lastName: true, role: true } },
        service: { select: { id: true, name: true, category: true, duration: true, price: true } },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Appointments GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/appointments - create appointment
const createAppointmentSchema = z.object({
  serviceId: z.string(),
  practitionerId: z.string().optional(),
  date: z.string(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM format'),
  bookingType: z.enum(['single', 'package']).default('single'),
  subscriptionId: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const data = createAppointmentSchema.parse(body);

    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Calculate end time using minute arithmetic
    const [hours, minutes] = data.startTime.split(':').map(Number);
    const startTotalMins = hours * 60 + minutes;
    const endTotalMins = startTotalMins + service.duration;
    const endTime = `${String(Math.floor(endTotalMins / 60)).padStart(2, '0')}:${String(endTotalMins % 60).padStart(2, '0')}`;

    // Resolve practitioner - auto-assign if not specified
    let practitionerId = data.practitionerId;
    if (!practitionerId) {
      // Find available staff for this service category
      const roleMap: Record<string, string[]> = {
        physio: ['therapist'],
        dietitian: ['dietitian'],
        aesthetic: ['aesthetic_specialist'],
        electrolysis: ['aesthetic_specialist', 'electrologist'],
        gym: ['trainer'],
      };
      const roles = roleMap[service.category] || ['therapist'];
      const staff = await prisma.user.findMany({
        where: { role: { in: roles }, isActive: true },
        select: { id: true },
      });
      if (staff.length === 0) {
        return NextResponse.json({ error: 'No available specialists for this service' }, { status: 400 });
      }
      // Find first staff member without a conflict
      for (const s of staff) {
        const conflict = await prisma.appointment.findFirst({
          where: {
            practitionerId: s.id,
            date: new Date(data.date),
            status: { notIn: ['cancelled', 'no_show'] },
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gt: data.startTime } },
            ],
          },
        });
        if (!conflict) {
          practitionerId = s.id;
          break;
        }
      }
      if (!practitionerId) {
        return NextResponse.json({ error: 'No specialists available at this time' }, { status: 409 });
      }
    }

    // Check for overlapping appointments (correct interval overlap: A.start < B.end AND A.end > B.start)
    const existing = await prisma.appointment.findFirst({
      where: {
        practitionerId,
        date: new Date(data.date),
        status: { notIn: ['cancelled', 'no_show'] },
        AND: [
          { startTime: { lt: endTime } },
          { endTime: { gt: data.startTime } },
        ],
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Time slot not available' }, { status: 409 });
    }

    // If package booking, increment subscription usage
    if (data.bookingType === 'package' && data.subscriptionId) {
      const sub = await prisma.subscription.findUnique({ where: { id: data.subscriptionId } });
      if (!sub || sub.clientId !== userId || sub.status !== 'active') {
        return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
      }
      if (sub.sessionsUsed >= sub.sessionsTotal) {
        return NextResponse.json({ error: 'No sessions remaining' }, { status: 400 });
      }
      await prisma.subscription.update({
        where: { id: data.subscriptionId },
        data: { sessionsUsed: { increment: 1 } },
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId: userId,
        practitionerId,
        serviceId: data.serviceId,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime,
        bookingType: data.bookingType,
        subscriptionId: data.subscriptionId,
        notes: data.notes,
        status: 'scheduled',
      },
      include: {
        service: true,
        practitioner: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Appointments POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
