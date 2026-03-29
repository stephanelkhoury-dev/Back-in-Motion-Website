import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function PaymentsPage() {
  const payments = [
    { id: 'INV-001', date: 'Mar 10, 2026', description: 'Physio 10 Sessions Package', amount: 650, status: 'paid', method: 'Credit Card' },
    { id: 'INV-002', date: 'Mar 12, 2026', description: 'Body Shaping 8 Sessions', amount: 640, status: 'paid', method: 'Bank Transfer' },
    { id: 'INV-003', date: 'Mar 15, 2026', description: 'E-Coach Monthly Subscription', amount: 29, status: 'paid', method: 'Credit Card' },
    { id: 'INV-004', date: 'Apr 1, 2026', description: 'E-Coach Monthly Renewal', amount: 29, status: 'pending', method: 'Auto-renew' },
  ];

  const balance = {
    totalSpent: 1348,
    pendingPayments: 29,
    activeSubscriptions: 1,
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Payments & Invoices</h1>
        <p className="text-muted-foreground text-sm">View your payment history and invoices.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold text-foreground">${balance.totalSpent}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-warning">${balance.pendingPayments}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">Active Subscriptions</p>
          <p className="text-2xl font-bold text-primary">{balance.activeSubscriptions}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-foreground mb-4">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Method</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4 text-sm font-medium text-primary">{p.id}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{p.date}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{p.description}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{p.method}</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">${p.amount}</td>
                  <td className="py-3 px-4">
                    <Badge variant={p.status === 'paid' ? 'success' : 'warning'}>{p.status}</Badge>
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
