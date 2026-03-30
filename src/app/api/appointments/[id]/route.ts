import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

const ADMIN_ROLES = ['admin', 'super_admin', 'manager', 'receptionist'];
const STAFF_ROLES = ['therapist', 'dietitian', 'trainer', 'aesthetic_specialist', 'electrologist'];
const VALID_TRANSITIONS: Record<string, string[]> = {
  scheduled: ['confirmed', 'cancelled', 'no_show'],
  confirmed: ['in_progress', 'cancelled', 'no_show'],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
  no_show: [],
};

// PATCH /api/appointments/[id] - update status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Authorization: must be the client, the assigned practitioner, or admin
    const isOwner = appointment.clientId === userId;
    const isPractitioner = appointment.practitionerId === userId;
    const isAdmin = ADMIN_ROLES.includes(role);
    if (!isOwner && !isPractitioner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Clients can only cancel their own appointments
    if (isOwner && !isAdmin && !isPractitioner && status && status !== 'cancelled') {
      return NextResponse.json({ error: 'Clients can only cancel appointments' }, { status: 403 });
    }

    // Validate status transition
    if (status) {
      const allowed = VALID_TRANSITIONS[appointment.status];
      if (!allowed || !allowed.includes(status)) {
        return NextResponse.json({ error: `Cannot transition from ${appointment.status} to ${status}` }, { status: 400 });
      }
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        service: true,
        client: { select: { firstName: true, lastName: true, email: true } },
        practitioner: { select: { firstName: true, lastName: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Appointment PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/appointments/[id] - cancel appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;
    const { id } = await params;
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Authorization: must be the client, assigned practitioner, or admin
    const isOwner = appointment.clientId === userId;
    const isAdmin = ADMIN_ROLES.includes(role);
    const isPractitioner = appointment.practitionerId === userId;
    if (!isOwner && !isPractitioner && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot cancel already completed/cancelled appointments
    if (['completed', 'cancelled'].includes(appointment.status)) {
      return NextResponse.json({ error: `Cannot cancel a ${appointment.status} appointment` }, { status: 400 });
    }

    // If it's a package booking, refund the session
    if (appointment.bookingType === 'package' && appointment.subscriptionId) {
      await prisma.subscription.update({
        where: { id: appointment.subscriptionId },
        data: { sessionsUsed: { decrement: 1 } },
      });
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    return NextResponse.json({ message: 'Appointment cancelled' });
  } catch (error) {
    console.error('Appointment DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
