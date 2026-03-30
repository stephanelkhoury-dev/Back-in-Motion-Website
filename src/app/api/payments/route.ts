import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';

const ADMIN_ROLES = ['admin', 'super_admin', 'manager', 'receptionist'];

// GET /api/payments - list payments
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;

    const where = ADMIN_ROLES.includes(role) ? {} : { clientId: userId };

    const payments = await prisma.payment.findMany({
      where,
      include: {
        client: { select: { firstName: true, lastName: true, email: true } },
        invoice: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = payments.map((p) => ({
      ...p,
      invoice: p.invoice
        ? { ...p.invoice, items: JSON.parse(p.invoice.items as string) }
        : null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Payments GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const createPaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  method: z.enum(['credit_card', 'cash', 'bank_transfer', 'insurance']).default('credit_card'),
  description: z.string().min(1).max(500),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().positive(),
    total: z.number().positive(),
  })).optional(),
  clientId: z.string().optional(),
});

// POST /api/payments - create payment
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;
    const body = await request.json();
    const data = createPaymentSchema.parse(body);

    // Admin can create payments for other clients
    const payerId = (ADMIN_ROLES.includes(role) && data.clientId) ? data.clientId : userId;

    const payment = await prisma.payment.create({
      data: {
        clientId: payerId,
        amount: data.amount,
        method: data.method,
        status: 'pending',
        description: data.description,
        transactionRef: `TXN-${Date.now()}`,
      },
    });

    // Create invoice
    const invoiceCount = await prisma.invoice.count();
    const invoiceItems = data.items || [{ description: data.description, quantity: 1, unitPrice: data.amount, total: data.amount }];
    await prisma.invoice.create({
      data: {
        paymentId: payment.id,
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(3, '0')}`,
        items: JSON.stringify(invoiceItems),
        subtotal: data.amount,
        tax: 0,
        total: data.amount,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Payments POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
