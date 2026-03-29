import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/db';

// GET /api/payments - list payments
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;

    const where = role === 'admin' || role === 'receptionist' ? {} : { clientId: userId };

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

// POST /api/payments - create payment
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, method, description, items } = body;

    const userId = (session.user as { id: string }).id;

    const payment = await prisma.payment.create({
      data: {
        clientId: userId,
        amount,
        method: method || 'credit_card',
        status: 'completed',
        description,
        transactionRef: `TXN-${Date.now()}`,
      },
    });

    // Create invoice
    const invoiceCount = await prisma.invoice.count();
    await prisma.invoice.create({
      data: {
        paymentId: payment.id,
        invoiceNumber: `INV-2026-${String(invoiceCount + 1).padStart(3, '0')}`,
        items: JSON.stringify(items || [{ description, quantity: 1, unitPrice: amount, total: amount }]),
        subtotal: amount,
        tax: 0,
        total: amount,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Payments POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
