import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orgFilter = user.role === 'super_admin' ? {} : { organizationId: user.organizationId };
  const invoices = await prisma.invoice.findMany({
    include: {
      payment: {
        include: {
          client: { select: { firstName: true, lastName: true, email: true } },
        },
      },
    },
    orderBy: { issuedAt: 'desc' },
  });

  return NextResponse.json(invoices.map(inv => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    client: `${inv.payment.client.firstName} ${inv.payment.client.lastName}`,
    clientEmail: inv.payment.client.email,
    items: JSON.parse(inv.items),
    subtotal: inv.subtotal,
    tax: inv.tax,
    total: inv.total,
    status: inv.payment.status,
    method: inv.payment.method,
    issuedAt: inv.issuedAt,
  })));
}
