import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';
import Card from '@/components/ui/Card';
import { Building2, Users, DollarSign, TrendingUp, Calendar, Package } from 'lucide-react';

export default async function SuperAdminAnalyticsPage() {
  const user = await getAuthUser();
  if (!user || user.role !== 'super_admin') redirect('/auth/signin');

  const [orgs, totalUsers, totalRevenue, totalAppointments, totalSubscriptions, totalServices, totalPackages] = await Promise.all([
    prisma.organization.findMany({ include: { _count: { select: { users: true, services: true } } } }),
    prisma.user.count(),
    prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
    prisma.appointment.count(),
    prisma.subscription.count({ where: { status: 'active' } }),
    prisma.service.count(),
    prisma.package.count(),
  ]);

  const stats = [
    { label: 'Organizations', value: orgs.length, icon: Building2, color: 'text-amber-600' },
    { label: 'Total Users', value: totalUsers, icon: Users, color: 'text-blue-600' },
    { label: 'Total Revenue', value: `$${(totalRevenue._sum.amount || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Appointments', value: totalAppointments, icon: Calendar, color: 'text-purple-600' },
    { label: 'Active Subs', value: totalSubscriptions, icon: TrendingUp, color: 'text-teal-600' },
    { label: 'Services', value: totalServices, icon: Package, color: 'text-orange-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
        <p className="text-muted-foreground text-sm">Across all organizations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="p-5 flex items-center gap-4">
                <Icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <h2 className="text-lg font-semibold text-foreground mb-3">Per Organization</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-muted">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Organization</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Users</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Services</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((org) => (
                <tr key={org.id} className="border-b border-muted/50 last:border-0">
                  <td className="py-3 px-4 font-medium text-foreground">{org.name}</td>
                  <td className="py-3 px-4 text-foreground">{org._count.users}</td>
                  <td className="py-3 px-4 text-foreground">{org._count.services}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium ${org.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {org.isActive ? 'Active' : 'Inactive'}
                    </span>
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
