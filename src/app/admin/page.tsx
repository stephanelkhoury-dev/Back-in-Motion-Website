import { Calendar, Users, DollarSign, TrendingUp, Activity, Package, Bot, AlertTriangle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function AdminDashboardPage() {
  const stats = [
    { label: "Today's Appointments", value: '12', icon: Calendar, color: 'text-primary', bg: 'bg-primary/10', change: '+3 from yesterday' },
    { label: 'Active Clients', value: '284', icon: Users, color: 'text-success', bg: 'bg-success/10', change: '+8 this month' },
    { label: "Monthly Revenue", value: '$14,250', icon: DollarSign, color: 'text-accent', bg: 'bg-accent/10', change: '+12% vs last month' },
    { label: 'E-Coach Subscribers', value: '47', icon: Bot, color: 'text-secondary', bg: 'bg-secondary/10', change: '+5 this week' },
  ];

  const todayAppointments = [
    { time: '08:00', client: 'Rami S.', service: 'Physio', specialist: 'Dr. Nicolas', status: 'confirmed', room: 'A' },
    { time: '08:30', client: 'Diana M.', service: 'Dietitian', specialist: 'Sarah M.', status: 'confirmed', room: 'Online' },
    { time: '09:00', client: 'Lea K.', service: 'LPG', specialist: 'Lara H.', status: 'in_progress', room: 'C' },
    { time: '09:30', client: 'Jad H.', service: 'Gym PT', specialist: 'Ahmad R.', status: 'scheduled', room: 'Gym' },
    { time: '10:00', client: 'Nadia A.', service: 'Electrolysis', specialist: 'Nour K.', status: 'confirmed', room: 'D' },
    { time: '10:30', client: 'Karim B.', service: 'Physio', specialist: 'Maya A.', status: 'scheduled', room: 'B' },
  ];

  const revenueByService = [
    { service: 'Physiotherapy', revenue: 5200, percentage: 37 },
    { service: 'Body Shaping', revenue: 3840, percentage: 27 },
    { service: 'Dietitian', revenue: 2160, percentage: 15 },
    { service: 'Gym', revenue: 1600, percentage: 11 },
    { service: 'Electrolysis', revenue: 1000, percentage: 7 },
    { service: 'E-Coach', revenue: 450, percentage: 3 },
  ];

  const alerts = [
    { type: 'warning', message: '3 clients have packages expiring this week' },
    { type: 'info', message: '2 no-shows today — follow up recommended' },
    { type: 'success', message: 'E-Coach adoption up 15% this month' },
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
            <h2 className="text-lg font-semibold text-foreground mb-4">Alerts & Notifications</h2>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className={`p-3 rounded-lg ${
                  alert.type === 'warning' ? 'bg-warning/5 border border-warning/20' :
                  alert.type === 'success' ? 'bg-success/5 border border-success/20' :
                  'bg-primary/5 border border-primary/20'
                }`}>
                  <p className="text-sm text-foreground">{alert.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Revenue by Service */}
      <Card>
        <h2 className="text-lg font-semibold text-foreground mb-4">Revenue by Service (This Month)</h2>
        <div className="space-y-3">
          {revenueByService.map((item) => (
            <div key={item.service}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground font-medium">{item.service}</span>
                <span className="text-muted-foreground">${item.revenue.toLocaleString()} ({item.percentage}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary rounded-full h-2 transition-all" style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
