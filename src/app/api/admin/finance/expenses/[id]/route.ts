import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const expense = await prisma.expense.update({
    where: { id },
    data: {
      category: body.category,
      description: body.description,
      amount: body.amount ? parseFloat(body.amount) : undefined,
      vendor: body.vendor ?? undefined,
      date: body.date ? new Date(body.date) : undefined,
      isRecurring: body.isRecurring ?? undefined,
      recurringFreq: body.recurringFreq ?? undefined,
      receiptUrl: body.receiptUrl ?? undefined,
    },
  });

  return NextResponse.json(expense);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await prisma.expense.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
