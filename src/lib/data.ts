import prisma from '@/lib/db';
import { auth } from '@/lib/auth';

// Helper to parse JSON string fields
function parseJson(val: string | null, fallback: unknown[] = []) {
  if (!val) return fallback;
  try { return JSON.parse(val); } catch { return fallback; }
}

// ===== Public data =====

export async function getServices(category?: string) {
  const where = category ? { isActive: true, category } : { isActive: true };
  return prisma.service.findMany({ where, orderBy: { name: 'asc' } });
}

export async function getPackages(category?: string) {
  const where: Record<string, unknown> = { isActive: true };
  if (category) where.category = category;
  const packages = await prisma.package.findMany({
    where,
    include: { services: { include: { service: true } } },
    orderBy: { price: 'asc' },
  });
  return packages.map((p) => ({
    ...p,
    features: parseJson(p.features, []),
    services: p.services.map((ps) => ps.service),
  }));
}

export async function getPractitioners() {
  const staff = await prisma.user.findMany({
    where: { role: { not: 'client' }, isActive: true },
    select: {
      id: true, firstName: true, lastName: true, role: true,
      specialties: true, bio: true, avatarUrl: true, languages: true,
    },
    orderBy: { firstName: 'asc' },
  });
  return staff.map((s) => ({
    ...s,
    specialties: parseJson(s.specialties, []),
    languages: parseJson(s.languages, []),
    name: `${s.firstName} ${s.lastName}`,
  }));
}

export async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });
  return posts.map((p) => ({ ...p, tags: parseJson(p.tags, []) }));
}

export async function getFAQItems() {
  return prisma.fAQItem.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}

// ===== Auth helper =====

export async function getSessionUser() {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user as unknown as { id: string; role: string; email?: string };
  return user;
}

// ===== Client dashboard data =====

export async function getClientAppointments(clientId: string) {
  return prisma.appointment.findMany({
    where: { clientId },
    include: {
      service: { select: { name: true, category: true, duration: true, price: true } },
      practitioner: { select: { firstName: true, lastName: true, role: true } },
    },
    orderBy: { date: 'desc' },
  });
}

export async function getClientSubscriptions(clientId: string) {
  const subs = await prisma.subscription.findMany({
    where: { clientId },
    include: {
      package: true,
    },
    orderBy: { startDate: 'desc' },
  });
  return subs.map((s) => ({
    ...s,
    package: { ...s.package, features: parseJson(s.package.features, []) },
  }));
}

export async function getClientReminders(clientId: string) {
  return prisma.reminder.findMany({
    where: { userId: clientId },
    orderBy: { scheduledAt: 'desc' },
  });
}

export async function getClientExerciseAssignments(clientId: string) {
  const assignments = await prisma.exerciseAssignment.findMany({
    where: { clientId, isActive: true },
    include: {
      exercise: true,
      logs: { orderBy: { completedAt: 'desc' }, take: 5 },
    },
  });
  return assignments.map((a) => ({
    ...a,
    exercise: {
      ...a.exercise,
      instructions: parseJson(a.exercise.instructions, []),
      precautions: parseJson(a.exercise.precautions, []),
    },
  }));
}

export async function getClientProgress(clientId: string) {
  const [measurements, workoutLogs, completedAppts] = await Promise.all([
    prisma.bodyMeasurement.findMany({
      where: { clientId },
      orderBy: { measuredAt: 'desc' },
      take: 10,
    }),
    prisma.workoutLog.findMany({
      where: { clientId },
      orderBy: { completedAt: 'desc' },
      take: 20,
    }),
    prisma.appointment.count({
      where: { clientId, status: 'completed' },
    }),
  ]);
  const latestMeasurement = measurements[0];
  return {
    measurements,
    workoutLogs,
    completedAppointments: completedAppts,
    stats: {
      totalWorkouts: workoutLogs.length,
      avgPainLevel: workoutLogs.length > 0
        ? Math.round(workoutLogs.reduce((sum, l) => sum + (l.painLevel ?? 0), 0) / workoutLogs.length * 10) / 10
        : 0,
      completedAppointments: completedAppts,
      latestWeight: latestMeasurement?.weight ?? null,
      latestBmi: latestMeasurement?.bmi ?? null,
    },
  };
}

export async function getClientPayments(clientId: string) {
  return prisma.payment.findMany({
    where: { clientId },
    include: {
      invoice: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getClientECoachConversations(clientId: string) {
  return prisma.eCoachConversation.findMany({
    where: { clientId, isActive: true },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getClientProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      phone: true, role: true, avatarUrl: true, dateOfBirth: true,
      gender: true, medicalNotes: true, createdAt: true,
    },
  });
}

// ===== Admin dashboard data =====

export async function getAdminAnalytics() {
  const [totalClients, activeClients, totalAppointments, completedAppointments,
    thisMonthAppointments, payments, activeSubscriptions] = await Promise.all([
    prisma.user.count({ where: { role: 'client' } }),
    prisma.user.count({ where: { role: 'client', isActive: true } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: 'completed' } }),
    prisma.appointment.count({
      where: {
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.payment.findMany({ where: { status: 'completed' } }),
    prisma.subscription.count({ where: { status: 'active' } }),
  ]);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const thisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const thisMonthRevenue = payments
    .filter((p) => p.createdAt >= thisMonth)
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    overview: {
      totalClients, activeClients, totalAppointments, completedAppointments,
      thisMonthAppointments, totalRevenue, thisMonthRevenue, activeSubscriptions,
    },
  };
}

export async function getAdminClients() {
  return prisma.user.findMany({
    where: { role: 'client' },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      phone: true, gender: true, isActive: true, createdAt: true,
      subscriptions: { include: { package: true }, take: 1, orderBy: { startDate: 'desc' } },
      _count: { select: { clientAppointments: true, workoutLogs: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAdminStaff() {
  const staff = await prisma.user.findMany({
    where: { role: { not: 'client' } },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      phone: true, role: true, specialties: true, bio: true,
      languages: true, isActive: true, createdAt: true,
      _count: { select: { practitionerAppointments: true } },
    },
    orderBy: { firstName: 'asc' },
  });
  return staff.map((s) => ({
    ...s,
    specialties: parseJson(s.specialties, []),
    languages: parseJson(s.languages, []),
  }));
}

export async function getAllAppointments() {
  return prisma.appointment.findMany({
    include: {
      client: { select: { firstName: true, lastName: true, email: true, phone: true } },
      practitioner: { select: { firstName: true, lastName: true, role: true } },
      service: { select: { name: true, category: true, duration: true, price: true } },
    },
    orderBy: { date: 'desc' },
  });
}

export async function getAllPayments() {
  return prisma.payment.findMany({
    include: {
      client: { select: { firstName: true, lastName: true, email: true } },
      invoice: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getExercises(category?: string) {
  const where: Record<string, unknown> = { isActive: true };
  if (category) where.category = category;
  const exercises = await prisma.exercise.findMany({ where, orderBy: { name: 'asc' } });
  return exercises.map((e) => ({
    ...e,
    instructions: parseJson(e.instructions, []),
    precautions: parseJson(e.precautions, []),
  }));
}
