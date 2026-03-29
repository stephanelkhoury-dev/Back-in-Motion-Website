import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, Download, DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';

export default function AdminPaymentsPage() {
  const transactions = [
    { id: 'TXN-001', client: 'Rami Saleh', amount: '$250', type: 'Package Purchase', package: 'Physio Basic', date: 'Mar 25, 2026', method: 'Credit Card', status: 'completed' },
    { id: 'TXN-002', client: 'Diana Mansour', amount: '$120', type: 'Single Session', package: 'Dietitian', date: 'Mar 24, 2026', method: 'Cash', status: 'completed' },
    { id: 'TXN-003', client: 'Lea Khoury', amount: '$450', type: 'Package Purchase', package: 'Diet Premium', date: 'Mar 23, 2026', method: 'Bank Transfer', status: 'pending' },
    { id: 'TXN-004', client: 'Jad Haddad', amount: '$300', type: 'Package Renewal', package: 'LPG Basic', date: 'Mar 22, 2026', method: 'Credit Card', status: 'completed' },
    { id: 'TXN-005', client: 'Nadia Abboud', amount: '$100', type: 'Single Session', package: 'Gym', date: 'Mar 21, 2026', method: 'Credit Card', status: 'refunded' },
    { id: 'TXN-006', client: 'Omar Rizk', amount: '$750', type: 'Package Purchase', package: 'Hybrid Total Care', date: 'Mar 20, 2026', method: 'Bank Transfer', status: 'completed' },
  ];

  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    completed: 'success',
    pending: 'warning',
    refunded: 'danger',
    failed: 'danger',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground text-sm">Track revenue and manage transactions.</p>
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-1" /> Export</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="p-4">
            <div className="flex items-center mb-2">
              <DollarSign className="h-4 w-4 text-green-600 mr-2" />
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
            <p className="text-2xl font-bold text-foreground">$12,450</p>
            <p className="text-xs text-green-600">+18% vs last month</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-4 w-4 text-primary mr-2" />
              <p className="text-sm text-muted-foreground">Avg. Transaction</p>
            </div>
            <p className="text-2xl font-bold text-foreground">$287</p>
            <p className="text-xs text-muted-foreground">48 transactions</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center mb-2">
              <CreditCard className="h-4 w-4 text-blue-600 mr-2" />
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">$1,350</p>
            <p className="text-xs text-muted-foreground">3 transactions</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
            <p className="text-2xl font-bold text-red-600">$450</p>
            <p className="text-xs text-muted-foreground">1 invoice</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="search" placeholder="Search transactions..." className="pl-10" />
        </div>
        <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="refunded">Refunded</option>
        </select>
        <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background">
          <option value="">All Methods</option>
          <option value="card">Credit Card</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank Transfer</option>
        </select>
      </div>

      {/* Transactions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Transaction</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Method</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-foreground">{txn.id}</p>
                    <p className="text-xs text-muted-foreground">{txn.package}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-foreground">{txn.client}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{txn.type}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-foreground">{txn.amount}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{txn.method}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{txn.date}</td>
                  <td className="py-3 px-4"><Badge variant={statusVariant[txn.status]}>{txn.status}</Badge></td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
