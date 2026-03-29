import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Megaphone, Tag, Calendar, TrendingUp } from 'lucide-react';

export default function AdminPromotionsPage() {
  const promotions = [
    { id: 'PROMO-001', name: 'Spring Wellness Special', code: 'SPRING25', discount: '25% off', type: 'percentage', applicableTo: 'All Packages', startDate: 'Apr 1, 2026', endDate: 'Apr 30, 2026', usageCount: 0, maxUses: 100, status: 'scheduled' },
    { id: 'PROMO-002', name: 'Referral Bonus', code: 'REFER10', discount: '$10 off', type: 'fixed', applicableTo: 'All Services', startDate: 'Jan 1, 2026', endDate: 'Dec 31, 2026', usageCount: 34, maxUses: 500, status: 'active' },
    { id: 'PROMO-003', name: 'New Client Welcome', code: 'WELCOME20', discount: '20% off', type: 'percentage', applicableTo: 'First Session', startDate: 'Jan 1, 2026', endDate: 'Dec 31, 2026', usageCount: 78, maxUses: 200, status: 'active' },
    { id: 'PROMO-004', name: 'Holiday Bundle', code: 'HOLIDAY30', discount: '30% off', type: 'percentage', applicableTo: 'Hybrid Packages', startDate: 'Dec 15, 2025', endDate: 'Jan 15, 2026', usageCount: 22, maxUses: 50, status: 'expired' },
    { id: 'PROMO-005', name: 'E-Coach Launch', code: 'ECOACH50', discount: '50% off', type: 'percentage', applicableTo: 'E-Coach Plans', startDate: 'Feb 1, 2026', endDate: 'Mar 31, 2026', usageCount: 45, maxUses: 100, status: 'active' },
  ];

  const statusVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    active: 'success',
    scheduled: 'warning',
    expired: 'danger',
    paused: 'default',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Promotions</h1>
          <p className="text-muted-foreground text-sm">Manage discount codes and marketing campaigns.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> Create Promotion</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="p-4">
            <Megaphone className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-sm text-muted-foreground">Active Promotions</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <Tag className="h-5 w-5 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-foreground">157</p>
            <p className="text-sm text-muted-foreground">Total Redemptions</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <TrendingUp className="h-5 w-5 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-foreground">$4,710</p>
            <p className="text-sm text-muted-foreground">Discounts Given</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <Calendar className="h-5 w-5 text-amber-600 mb-2" />
            <p className="text-2xl font-bold text-foreground">1</p>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </div>
        </Card>
      </div>

      {/* Promotions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Promotion</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Code</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Discount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Applies To</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Usage</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-sm bg-muted px-2 py-0.5 rounded font-mono">{p.code}</code>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-foreground">{p.discount}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{p.applicableTo}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">
                    {p.startDate} – {p.endDate}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${(p.usageCount / p.maxUses) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{p.usageCount}/{p.maxUses}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><Badge variant={statusVariant[p.status]}>{p.status}</Badge></td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">Edit</Button>
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
