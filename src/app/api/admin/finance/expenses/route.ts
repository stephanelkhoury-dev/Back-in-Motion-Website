import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const orgFilter = user.role === 'super_admin' ? {} : { organizationId: user.organizationId };
  const where: Record<string, unknown> = { ...orgFilter };
  if (category) where.category = category;

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(expenses);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { category, description, amount, vendor, date, isRecurring, recurringFreq, receiptUrl } = body;

  if (!category || !description || !amount || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const expense = await prisma.expense.create({
    data: {
      category,
      description,
      amount: parseFloat(amount),
      vendor: vendor || null,
      date: new Date(date),
      isRecurring: isRecurring || false,
      recurringFreq: recurringFreq || null,
      receiptUrl: receiptUrl || null,
      organizationId: user.organizationId || null,
    },
  });

  return NextResponse.json(expense, { status: 201 });
}
