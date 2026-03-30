import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  const user = await getAuthUser();
  if (!user || !['super_admin', 'admin', 'manager'].includes(user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orgFilter = user.role === 'super_admin' ? {} : { organizationId: user.organizationId };

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [
    allPayments,
    thisMonthPayments,
    lastMonthPayments,
    yearPayments,
    pendingPayments,
    refundedPayments,
    allExpenses,
    thisMonthExpenses,
    activeSubscriptions,
    accounts,
  ] = await Promise.all([
    prisma.payment.findMany({ where: { status: 'completed', client: orgFilter } }),
    prisma.payment.findMany({ where: { status: 'completed', createdAt: { gte: startOfMonth }, client: orgFilter } }),
    prisma.payment.findMany({ where: { status: 'completed', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth }, client: orgFilter } }),
    prisma.payment.findMany({ where: { status: 'completed', createdAt: { gte: startOfYear }, client: orgFilter } }),
    prisma.payment.findMany({ where: { status: 'pending', client: orgFilter } }),
    prisma.payment.findMany({ where: { status: 'refunded', client: orgFilter } }),
    prisma.expense.findMany({ where: orgFilter }),
    prisma.expense.findMany({ where: { ...orgFilter, date: { gte: startOfMonth } } }),
    prisma.subscription.count({ where: { status: 'active', client: orgFilter } }),
    prisma.financialAccount.findMany({ where: { ...orgFilter, isActive: true } }),
  ]);

  const sum = (arr: { amount: number }[]) => arr.reduce((s, p) => s + p.amount, 0);

  const totalRevenue = sum(allPayments);
  const thisMonthRevenue = sum(thisMonthPayments);
  const lastMonthRevenue = sum(lastMonthPayments);
  const yearRevenue = sum(yearPayments);
  const pendingAmount = sum(pendingPayments);
  const refundedAmount = sum(refundedPayments);
  const totalExpenses = sum(allExpenses);
  const thisMonthExpenseTotal = sum(thisMonthExpenses);
  const netProfit = totalRevenue - totalExpenses;
  const thisMonthProfit = thisMonthRevenue - thisMonthExpenseTotal;
  const revenueGrowth = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;

  // Monthly breakdown for chart (last 12 months)
  const monthlyData = [];
  for (let i = 11; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const monthLabel = monthStart.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    const revenue = allPayments.filter(p => p.createdAt >= monthStart && p.createdAt <= monthEnd).reduce((s, p) => s + p.amount, 0);
    const expenses = allExpenses.filter(e => e.date >= monthStart && e.date <= monthEnd).reduce((s, e) => s + e.amount, 0);
    monthlyData.push({ month: monthLabel, revenue, expenses, profit: revenue - expenses });
  }

  // Revenue by service category
  const paymentsByService = await prisma.payment.findMany({
    where: { status: 'completed', client: orgFilter },
    select: { amount: true, description: true },
  });

  // Expense breakdown by category
  const expensesByCategory: Record<string, number> = {};
  allExpenses.forEach(e => {
    expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + e.amount;
  });

  // Recent transactions
  const recentTransactions = await prisma.payment.findMany({
    where: { client: orgFilter },
    include: { client: { select: { firstName: true, lastName: true } }, invoice: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return NextResponse.json({
    summary: {
      totalRevenue, thisMonthRevenue, lastMonthRevenue, yearRevenue,
      pendingAmount, refundedAmount, totalExpenses, thisMonthExpenseTotal,
      netProfit, thisMonthProfit, revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      activeSubscriptions, totalTransactions: allPayments.length,
      pendingCount: pendingPayments.length, refundedCount: refundedPayments.length,
    },
    monthlyData,
    expensesByCategory,
    accounts: accounts.map(a => ({ id: a.id, name: a.name, type: a.type, balance: a.balance, currency: a.currency })),
    recentTransactions: recentTransactions.map(t => ({
      id: t.id, client: `${t.client.firstName} ${t.client.lastName}`,
      amount: t.amount, status: t.status, method: t.method,
      description: t.description, date: t.createdAt,
      invoiceNumber: t.invoice?.invoiceNumber,
    })),
  });
}
