import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orgFilter = user.role === 'super_admin' ? {} : { organizationId: user.organizationId };
  const accounts = await prisma.financialAccount.findMany({
    where: orgFilter,
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(accounts);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, type, balance, currency, accountNumber, bankName } = body;

  if (!name || !type) {
    return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
  }

  const account = await prisma.financialAccount.create({
    data: {
      name,
      type,
      balance: parseFloat(balance) || 0,
      currency: currency || 'USD',
      accountNumber: accountNumber || null,
      bankName: bankName || null,
      organizationId: user.organizationId || null,
    },
  });

  return NextResponse.json(account, { status: 201 });
}
