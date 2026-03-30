import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import prisma from '@/lib/db';
import Card from '@/components/ui/Card';
import { Building2, Users, DollarSign, TrendingUp, Package, Stethoscope } from 'lucide-react';
import Link from 'next/link';

export default async function SuperAdminDashboard() {
  const user = await getAuthUser();
  if (!user || user.role !== 'super_admin') redirect('/auth/signin');

  const [orgCount, userCount, totalPayments, activeSubscriptions, serviceCount, packageCount] = await Promise.all([
    prisma.organization.count(),
    prisma.user.count(),
    prisma.payment.aggregate({ where: { status: 'completed' }, _sum: { amount: true } }),
    prisma.subscription.count({ where: { status: 'active' } }),
    prisma.service.count(),
    prisma.package.count(),
  ]);

  const orgs = await prisma.organization.findMany({
    include: {
      _count: { select: { users: true, services: true } },
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  const stats = [
    { label: 'Organizations', value: orgCount, icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Users', value: userCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Platform Revenue', value: `$${(totalPayments._sum.amount || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Subscriptions', value: activeSubscriptions, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Services', value: serviceCount, icon: Stethoscope, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Total Packages', value: packageCount, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-muted-foreground text-sm">Manage all organizations and monitor platform-wide metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent Organizations */}
      <Card>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Organizations</h2>
            <Link href="/super-admin/organizations" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-muted">
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Users</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Services</th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-2 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((org) => (
                  <tr key={org.id} className="border-b border-muted/50 last:border-0">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium text-foreground">{org.name}</p>
                        <p className="text-xs text-muted-foreground">{org.email || org.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-foreground">{org._count.users}</td>
                    <td className="py-3 px-2 text-foreground">{org._count.services}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${org.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {org.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Link href={`/super-admin/organizations/${org.id}`} className="text-primary hover:underline text-sm">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}
