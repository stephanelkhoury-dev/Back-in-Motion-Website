import { Calendar, Users, DollarSign, TrendingUp, Activity, Package, Bot, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { redirect } from 'next/navigation';
import { getSessionUser, getAdminAnalytics, getAllAppointments } from '@/lib/data';

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  if (!user || !['super_admin', 'admin', 'manager', 'receptionist'].includes(user.role)) redirect('/auth/signin');

  const analytics = await getAdminAnalytics();
  const allAppointments = await getAllAppointments();
  const o = analytics.overview;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = allAppointments
    .filter((a) => new Date(a.date).toISOString().split('T')[0] === todayStr)
    .map((a) => ({
      time: a.startTime,
      client: `${a.client.firstName} ${a.client.lastName.charAt(0)}.`,
      service: a.service.name,
      specialist: `${a.practitioner.firstName} ${a.practitioner.lastName.charAt(0)}.`,
      status: a.status,
      room: a.roomOrEquipment || '-',
    }));

  const stats = [
    { label: "Today's Appointments", value: String(todayAppointments.length), icon: Calendar, color: 'text-primary', bg: 'bg-primary/10', change: `${o.thisMonthAppointments} this month` },
    { label: 'Active Clients', value: String(o.activeClients), icon: Users, color: 'text-success', bg: 'bg-success/10', change: `${o.totalClients} total` },
    { label: "Total Revenue", value: `$${o.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-accent', bg: 'bg-accent/10', change: `$${o.thisMonthRevenue} this month` },
    { label: 'Active Subscriptions', value: String(o.activeSubscriptions), icon: Bot, color: 'text-secondary', bg: 'bg-secondary/10', change: `${o.completedAppointments} completed appts` },
  ];

  const statusColors: Record<string, 'success' | 'primary' | 'warning' | 'default'> = {
    confirmed: 'success',
    scheduled: 'primary',
    in_progress: 'warning',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of clinic operations and performance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-lg font-semibold text-foreground mb-4">Today&apos;s Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Time</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Specialist</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Room</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((appt, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-2 px-3 text-sm font-medium text-foreground">{appt.time}</td>
                      <td className="py-2 px-3 text-sm text-foreground">{appt.client}</td>
                      <td className="py-2 px-3 text-sm text-muted-foreground">{appt.service}</td>
                      <td className="py-2 px-3 text-sm text-muted-foreground">{appt.specialist}</td>
                      <td className="py-2 px-3 text-sm text-muted-foreground">{appt.room}</td>
                      <td className="py-2 px-3">
                        <Badge variant={statusColors[appt.status] || 'default'}>
                          {appt.status.replace('_', ' ')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Alerts */}
        <div>
          <Card>
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground">{o.totalAppointments} total appointments</p>
              </div>
              <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                <p className="text-sm text-foreground">{o.completedAppointments} completed appointments</p>
              </div>
              <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                <p className="text-sm text-foreground">{o.activeSubscriptions} active subscriptions</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Summary */}
      <Card>
        <h2 className="text-lg font-semibold text-foreground mb-4">Revenue Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-xl">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold text-foreground">${o.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-muted rounded-xl">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold text-foreground">${o.thisMonthRevenue.toLocaleString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
