import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Edit } from 'lucide-react';
import { PACKAGES } from '@/lib/constants';

export default function AdminPackagesPage() {
  const packageSales = [
    { pkgId: 'pkg-physio-basic', sold: 34, active: 18, revenue: '$8,500' },
    { pkgId: 'pkg-physio-premium', sold: 22, active: 15, revenue: '$11,000' },
    { pkgId: 'pkg-diet-basic', sold: 28, active: 20, revenue: '$5,600' },
    { pkgId: 'pkg-diet-premium', sold: 15, active: 10, revenue: '$6,750' },
    { pkgId: 'pkg-lpg-basic', sold: 19, active: 12, revenue: '$5,700' },
    { pkgId: 'pkg-lpg-premium', sold: 11, active: 8, revenue: '$6,600' },
    { pkgId: 'pkg-gym-basic', sold: 42, active: 30, revenue: '$4,200' },
    { pkgId: 'pkg-hybrid-total', sold: 8, active: 6, revenue: '$6,000' },
    { pkgId: 'pkg-ecoach-lite', sold: 56, active: 48, revenue: '$2,800' },
  ];

  const getSalesData = (id: string) => packageSales.find(p => p.pkgId === id);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Packages</h1>
          <p className="text-muted-foreground text-sm">Manage service packages and subscriptions.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> Create Package</Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{PACKAGES.length}</p>
            <p className="text-sm text-muted-foreground">Total Packages</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">167</p>
            <p className="text-sm text-muted-foreground">Active Subscriptions</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">$57,150</p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">92%</p>
            <p className="text-sm text-muted-foreground">Renewal Rate</p>
          </div>
        </Card>
      </div>

      {/* Package Cards */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Package</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sessions</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sold</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Active</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PACKAGES.map((pkg) => {
                const sales = getSalesData(pkg.id);
                return (
                  <tr key={pkg.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <p className="text-sm font-medium text-foreground">{pkg.name}</p>
                      <p className="text-xs text-muted-foreground">{pkg.category}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={pkg.type === 'hybrid' ? 'warning' : pkg.type === 'bundle' ? 'primary' : 'default'}>
                        {pkg.type}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">${pkg.price}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{pkg.totalSessions} sessions</td>
                    <td className="py-3 px-4 text-sm text-foreground">{sales?.sold || 0}</td>
                    <td className="py-3 px-4 text-sm text-foreground">{sales?.active || 0}</td>
                    <td className="py-3 px-4 text-sm font-medium text-foreground">{sales?.revenue || '$0'}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm"><Edit className="h-3 w-3 mr-1" /> Edit</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
