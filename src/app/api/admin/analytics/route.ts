import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/admin/analytics - dashboard analytics data
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user as { role: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalClients,
      activeClients,
      totalAppointments,
      completedAppointments,
      thisMonthAppointments,
      totalRevenue,
      thisMonthRevenue,
      activeSubscriptions,
      services,
      recentPayments,
      upcomingAppointments,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'client' } }),
      prisma.user.count({ where: { role: 'client', isActive: true } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: 'completed' } }),
      prisma.appointment.count({ where: { date: { gte: startOfMonth } } }),
      prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: 'completed', createdAt: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.service.findMany({ select: { id: true, name: true, category: true } }),
      prisma.payment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { firstName: true, lastName: true } } },
      }),
      prisma.appointment.findMany({
        where: { date: { gte: now }, status: { in: ['scheduled', 'confirmed'] } },
        take: 10,
        orderBy: { date: 'asc' },
        include: {
          client: { select: { firstName: true, lastName: true } },
          practitioner: { select: { firstName: true, lastName: true } },
          service: { select: { name: true } },
        },
      }),
    ]);

    // Revenue by service (aggregate through appointments)
    const appointmentsByService = await prisma.appointment.groupBy({
      by: ['serviceId'],
      where: { status: 'completed' },
      _count: true,
    });

    const revenueByService = appointmentsByService.map((a) => {
      const service = services.find((s) => s.id === a.serviceId);
      return {
        service: service?.name || 'Unknown',
        category: service?.category || 'unknown',
        bookings: a._count,
      };
    });

    return NextResponse.json({
      overview: {
        totalClients,
        activeClients,
        totalAppointments,
        completedAppointments,
        thisMonthAppointments,
        totalRevenue: totalRevenue._sum.amount || 0,
        thisMonthRevenue: thisMonthRevenue._sum.amount || 0,
        activeSubscriptions,
      },
      revenueByService,
      recentPayments,
      upcomingAppointments,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
