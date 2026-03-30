'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  DollarSign, TrendingUp, TrendingDown, Wallet, CreditCard, Receipt,
  PiggyBank, ArrowUpRight, ArrowDownRight, Plus, Download, Filter,
  Building2, BarChart3, CircleDollarSign, AlertCircle, CheckCircle2, Clock,
  ChevronDown, ChevronUp
} from 'lucide-react';

interface FinanceSummary {
  totalRevenue: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  yearRevenue: number;
  pendingAmount: number;
  refundedAmount: number;
  totalExpenses: number;
  thisMonthExpenseTotal: number;
  netProfit: number;
  thisMonthProfit: number;
  revenueGrowth: number;
  activeSubscriptions: number;
  totalTransactions: number;
  pendingCount: number;
  refundedCount: number;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface Transaction {
  id: string;
  client: string;
  amount: number;
  status: string;
  method: string;
  description: string;
  date: string;
  invoiceNumber?: string;
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  vendor: string | null;
  date: string;
  isRecurring: boolean;
  recurringFreq: string | null;
}

const EXPENSE_CATEGORIES = [
  'rent', 'utilities', 'salaries', 'supplies', 'equipment', 'marketing', 'insurance', 'other'
];

export default function FinanceDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'invoices' | 'accounts'>('overview');
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<Record<string, number>>({});
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [expenseForm, setExpenseForm] = useState({ category: 'supplies', description: '', amount: '', vendor: '', date: new Date().toISOString().split('T')[0], isRecurring: false, recurringFreq: '' });
  const [accountForm, setAccountForm] = useState({ name: '', type: 'bank', balance: '0', currency: 'USD', accountNumber: '', bankName: '' });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [overviewRes, expensesRes, invoicesRes, accountsRes] = await Promise.all([
        fetch('/api/admin/finance/overview'),
        fetch('/api/admin/finance/expenses'),
        fetch('/api/admin/finance/invoices'),
        fetch('/api/admin/finance/accounts'),
      ]);
      if (overviewRes.ok) {
        const data = await overviewRes.json();
        setSummary(data.summary);
        setMonthlyData(data.monthlyData);
        setExpensesByCategory(data.expensesByCategory);
        setRecentTransactions(data.recentTransactions);
      }
      if (expensesRes.ok) setExpenses(await expensesRes.json());
      if (invoicesRes.ok) setInvoices(await invoicesRes.json());
      if (accountsRes.ok) setAccounts(await accountsRes.json());
    } catch (err) { console.error(err); }
    setLoading(false);
  }

  async function handleCreateExpense(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/finance/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseForm),
    });
    if (res.ok) {
      setShowExpenseForm(false);
      setExpenseForm({ category: 'supplies', description: '', amount: '', vendor: '', date: new Date().toISOString().split('T')[0], isRecurring: false, recurringFreq: '' });
      loadData();
    }
  }

  async function handleDeleteExpense(id: string) {
    if (!confirm('Delete this expense?')) return;
    await fetch(`/api/admin/finance/expenses/${id}`, { method: 'DELETE' });
    loadData();
  }

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/finance/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(accountForm),
    });
    if (res.ok) {
      setShowAccountForm(false);
      setAccountForm({ name: '', type: 'bank', balance: '0', currency: 'USD', accountNumber: '', bankName: '' });
      loadData();
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Finance Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Card key={i}><div className="h-24 animate-pulse bg-muted rounded" /></Card>)}
        </div>
      </div>
    );
  }

  const s = summary!;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance Dashboard</h1>
          <p className="text-muted-foreground text-sm">Complete financial overview and management.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border mb-6 gap-0 overflow-x-auto">
        {(['overview', 'expenses', 'invoices', 'accounts'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─────────────────────── */}
      {activeTab === 'overview' && (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${s.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    {s.revenueGrowth >= 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span className={`text-xs font-medium ${s.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {s.revenueGrowth}% vs last month
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">${s.thisMonthRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Revenue this month</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-foreground">${s.totalExpenses.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">${s.thisMonthExpenseTotal.toLocaleString()} this month</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Profit</p>
                  <p className={`text-2xl font-bold ${s.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${s.netProfit.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">${s.thisMonthProfit.toLocaleString()} this month</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <PiggyBank className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Second row: Pending, Refunded, Subs, Transactions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <p className="text-xl font-bold text-amber-600">${s.pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{s.pendingCount} transactions</p>
              </div>
            </Card>
            <Card>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-muted-foreground">Refunded</p>
                </div>
                <p className="text-xl font-bold text-red-600">${s.refundedAmount.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{s.refundedCount} transactions</p>
              </div>
            </Card>
            <Card>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-1">
                  <Receipt className="h-4 w-4 text-teal-600" />
                  <p className="text-sm text-muted-foreground">Active Subs</p>
                </div>
                <p className="text-xl font-bold text-foreground">{s.activeSubscriptions}</p>
                <p className="text-xs text-muted-foreground">Recurring revenue</p>
              </div>
            </Card>
            <Card>
              <div className="p-1">
                <div className="flex items-center gap-2 mb-1">
                  <CircleDollarSign className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Year to Date</p>
                </div>
                <p className="text-xl font-bold text-foreground">${s.yearRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{s.totalTransactions} total transactions</p>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Monthly Revenue Chart (bar visualization) */}
            <div className="lg:col-span-2">
              <Card>
                <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Revenue & Expenses</h3>
                <div className="space-y-3">
                  {monthlyData.map((m) => {
                    const maxVal = Math.max(...monthlyData.map(d => Math.max(d.revenue, d.expenses)), 1);
                    return (
                      <div key={m.month} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-14 shrink-0">{m.month}</span>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="h-4 bg-green-500 rounded-sm" style={{ width: `${(m.revenue / maxVal) * 100}%`, minWidth: m.revenue > 0 ? '4px' : '0px' }} />
                            <span className="text-xs text-foreground">${m.revenue.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-4 bg-red-400 rounded-sm" style={{ width: `${(m.expenses / maxVal) * 100}%`, minWidth: m.expenses > 0 ? '4px' : '0px' }} />
                            <span className="text-xs text-foreground">${m.expenses.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-500" /><span className="text-xs text-muted-foreground">Revenue</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-400" /><span className="text-xs text-muted-foreground">Expenses</span></div>
                </div>
              </Card>
            </div>

            {/* Expense Breakdown */}
            <Card>
              <h3 className="text-lg font-semibold text-foreground mb-4">Expense Breakdown</h3>
              {Object.keys(expensesByCategory).length === 0 ? (
                <p className="text-sm text-muted-foreground">No expenses recorded yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(expensesByCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, amount]) => {
                      const total = Object.values(expensesByCategory).reduce((s, v) => s + v, 0);
                      const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
                      return (
                        <div key={cat}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground capitalize">{cat}</span>
                            <span className="text-muted-foreground">${amount.toLocaleString()} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </Card>
          </div>

          {/* Accounts & Recent Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Accounts */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Accounts</h3>
                <button onClick={() => { setActiveTab('accounts'); }} className="text-xs text-primary hover:underline cursor-pointer">View All</button>
              </div>
              {accounts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No accounts set up yet.</p>
              ) : (
                <div className="space-y-3">
                  {accounts.map(a => (
                    <div key={a.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{a.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{a.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-foreground">${a.balance.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
                  <button onClick={() => { setActiveTab('invoices'); }} className="text-xs text-primary hover:underline cursor-pointer">View All Invoices</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Client</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Description</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Amount</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Method</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map(t => (
                        <tr key={t.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                          <td className="py-2 px-3 font-medium text-foreground">{t.client}</td>
                          <td className="py-2 px-3 text-muted-foreground">{t.description}</td>
                          <td className="py-2 px-3 font-medium text-foreground">${t.amount}</td>
                          <td className="py-2 px-3 text-muted-foreground capitalize">{t.method.replace('_', ' ')}</td>
                          <td className="py-2 px-3">
                            <Badge variant={t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warning' : 'danger'}>
                              {t.status}
                            </Badge>
                          </td>
                          <td className="py-2 px-3 text-muted-foreground">{new Date(t.date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* ─── EXPENSES TAB ─────────────────────── */}
      {activeTab === 'expenses' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Expenses</h2>
            <Button size="sm" onClick={() => setShowExpenseForm(!showExpenseForm)}>
              <Plus className="h-4 w-4 mr-1" /> Add Expense
            </Button>
          </div>

          {showExpenseForm && (
            <Card className="mb-6">
              <form onSubmit={handleCreateExpense} className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">New Expense</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                    <select
                      value={expenseForm.category}
                      onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                    >
                      {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={expenseForm.amount}
                      onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={expenseForm.date}
                      onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                    <input
                      type="text"
                      required
                      value={expenseForm.description}
                      onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                      placeholder="e.g. Office supplies for reception"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Vendor</label>
                    <input
                      type="text"
                      value={expenseForm.vendor}
                      onChange={e => setExpenseForm(f => ({ ...f, vendor: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={expenseForm.isRecurring}
                    onChange={e => setExpenseForm(f => ({ ...f, isRecurring: e.target.checked }))}
                    className="h-4 w-4 rounded border-border"
                  />
                  <span className="text-sm text-foreground">Recurring expense</span>
                </label>
                {expenseForm.isRecurring && (
                  <select
                    value={expenseForm.recurringFreq}
                    onChange={e => setExpenseForm(f => ({ ...f, recurringFreq: e.target.value }))}
                    className="w-48 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  >
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                )}
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Save Expense</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowExpenseForm(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          )}

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Description</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Vendor</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Recurring</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No expenses recorded yet. Click &quot;Add Expense&quot; to get started.</td></tr>
                  ) : expenses.map(exp => (
                    <tr key={exp.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-foreground">{new Date(exp.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4"><Badge variant="default">{exp.category}</Badge></td>
                      <td className="py-3 px-4 text-foreground">{exp.description}</td>
                      <td className="py-3 px-4 text-muted-foreground">{exp.vendor || '-'}</td>
                      <td className="py-3 px-4 font-medium text-red-600">${exp.amount.toLocaleString()}</td>
                      <td className="py-3 px-4">{exp.isRecurring ? <Badge variant="primary">{exp.recurringFreq}</Badge> : '-'}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => handleDeleteExpense(exp.id)} className="text-xs text-red-600 hover:underline cursor-pointer">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ─── INVOICES TAB ─────────────────────── */}
      {activeTab === 'invoices' && (
        <>
          <h2 className="text-lg font-semibold text-foreground mb-4">Invoices</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Invoice #</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Subtotal</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Tax</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Method</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Issued</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.length === 0 ? (
                    <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No invoices yet.</td></tr>
                  ) : invoices.map((inv: any) => (
                    <tr key={inv.id} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-foreground">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 text-foreground">{inv.client}</td>
                      <td className="py-3 px-4 text-foreground">${inv.subtotal}</td>
                      <td className="py-3 px-4 text-muted-foreground">${inv.tax}</td>
                      <td className="py-3 px-4 font-medium text-foreground">${inv.total}</td>
                      <td className="py-3 px-4">
                        <Badge variant={inv.status === 'completed' ? 'success' : inv.status === 'pending' ? 'warning' : 'danger'}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground capitalize">{inv.method.replace('_', ' ')}</td>
                      <td className="py-3 px-4 text-muted-foreground">{new Date(inv.issuedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* ─── ACCOUNTS TAB ─────────────────────── */}
      {activeTab === 'accounts' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Financial Accounts</h2>
            <Button size="sm" onClick={() => setShowAccountForm(!showAccountForm)}>
              <Plus className="h-4 w-4 mr-1" /> Add Account
            </Button>
          </div>

          {showAccountForm && (
            <Card className="mb-6">
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <h3 className="text-base font-semibold text-foreground">New Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Account Name</label>
                    <input
                      type="text"
                      required
                      value={accountForm.name}
                      onChange={e => setAccountForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                      placeholder="e.g. Main Business Account"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                    <select
                      value={accountForm.type}
                      onChange={e => setAccountForm(f => ({ ...f, type: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                    >
                      <option value="bank">Bank Account</option>
                      <option value="cash">Cash</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="petty_cash">Petty Cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Opening Balance ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={accountForm.balance}
                      onChange={e => setAccountForm(f => ({ ...f, balance: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={accountForm.bankName}
                      onChange={e => setAccountForm(f => ({ ...f, bankName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Account Number</label>
                    <input
                      type="text"
                      value={accountForm.accountNumber}
                      onChange={e => setAccountForm(f => ({ ...f, accountNumber: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Currency</label>
                    <select
                      value={accountForm.currency}
                      onChange={e => setAccountForm(f => ({ ...f, currency: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="LBP">LBP</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm">Create Account</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowAccountForm(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.length === 0 ? (
              <Card className="md:col-span-3">
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No financial accounts set up yet.</p>
                </div>
              </Card>
            ) : accounts.map(a => (
              <Card key={a.id}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      a.type === 'bank' ? 'bg-blue-50' : a.type === 'cash' ? 'bg-green-50' : a.type === 'credit_card' ? 'bg-purple-50' : 'bg-amber-50'
                    }`}>
                      {a.type === 'bank' ? <Building2 className="h-5 w-5 text-blue-600" /> :
                       a.type === 'cash' ? <DollarSign className="h-5 w-5 text-green-600" /> :
                       a.type === 'credit_card' ? <CreditCard className="h-5 w-5 text-purple-600" /> :
                       <Wallet className="h-5 w-5 text-amber-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{a.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{a.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">${a.balance.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.currency}</p>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
