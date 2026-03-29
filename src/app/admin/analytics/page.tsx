'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { TrendingUp, Users, Calendar, DollarSign, BarChart3, Activity } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const kpis = [
    { label: 'Total Revenue', value: '$48,250', change: '+18%', positive: true, icon: DollarSign },
    { label: 'Active Clients', value: '187', change: '+12', positive: true, icon: Users },
    { label: 'Sessions This Month', value: '342', change: '+8%', positive: true, icon: Calendar },
    { label: 'Client Retention', value: '94%', change: '+2%', positive: true, icon: Activity },
  ];

  const revenueByService = [
    { service: 'Physiotherapy', revenue: 18600, percentage: 38 },
    { service: 'Dietitian', revenue: 10680, percentage: 22 },
    { service: 'LPG & Body Shaping', revenue: 13400, percentage: 28 },
    { service: 'Electrolysis', revenue: 3200, percentage: 7 },
    { service: 'Gym & Fitness', revenue: 2370, percentage: 5 },
  ];

  const monthlyTrend = [
    { month: 'Oct', revenue: 32000, sessions: 240 },
    { month: 'Nov', revenue: 35000, sessions: 268 },
    { month: 'Dec', revenue: 28000, sessions: 210 },
    { month: 'Jan', revenue: 38000, sessions: 290 },
    { month: 'Feb', revenue: 42000, sessions: 310 },
    { month: 'Mar', revenue: 48250, sessions: 342 },
  ];

  const topPackages = [
    { name: 'Physio 10 Sessions', sold: 34, revenue: '$22,100' },
    { name: 'E-Coach Lite', sold: 56, revenue: '$2,800' },
    { name: 'Dietitian Monthly', sold: 28, revenue: '$5,040' },
    { name: 'Physio Lite', sold: 22, revenue: '$4,378' },
    { name: 'LPG 10 Sessions', sold: 19, revenue: '$5,700' },
  ];

  const staffPerformance = [
    { name: 'Dr. Karim Nassar', sessions: 68, clients: 32, satisfaction: 4.9 },
    { name: 'Maya Touma', sessions: 52, clients: 40, satisfaction: 4.8 },
    { name: 'Dr. Lina Fadel', sessions: 48, clients: 28, satisfaction: 4.9 },
    { name: 'Nour Sabbagh', sessions: 45, clients: 22, satisfaction: 4.7 },
    { name: 'Tony Makhlouf', sessions: 38, clients: 18, satisfaction: 4.6 },
  ];

  const maxRevenue = Math.max(...revenueByService.map(s => s.revenue));
  const maxMonthlyRevenue = Math.max(...monthlyTrend.map(m => m.revenue));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm">Business insights and performance metrics.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-5 w-5 text-primary" />
                <Badge variant={kpi.positive ? 'success' : 'danger'}>{kpi.change}</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Revenue Trend (6 Months)</h3>
            </div>
            <div className="space-y-3">
              {monthlyTrend.map((m) => (
                <div key={m.month} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-8">{m.month}</span>
                  <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(m.revenue / maxMonthlyRevenue) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">${(m.revenue / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground w-16 text-right">{m.sessions} sessions</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Revenue by Service */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Revenue by Service</h3>
            </div>
            <div className="space-y-4">
              {revenueByService.map((s) => (
                <div key={s.service}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{s.service}</span>
                    <span className="text-sm font-medium text-foreground">${s.revenue.toLocaleString()} ({s.percentage}%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="h-3 bg-primary rounded-full transition-all"
                      style={{ width: `${(s.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Packages */}
        <Card>
          <div className="p-5">
            <h3 className="font-semibold text-foreground mb-4">Top Packages</h3>
            <div className="space-y-3">
              {topPackages.map((pkg, i) => (
                <div key={pkg.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{pkg.name}</p>
                      <p className="text-xs text-muted-foreground">{pkg.sold} sold</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{pkg.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Staff Performance */}
        <Card>
          <div className="p-5">
            <h3 className="font-semibold text-foreground mb-4">Staff Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Staff</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Sessions</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Clients</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {staffPerformance.map((s) => (
                    <tr key={s.name} className="border-b border-border last:border-0">
                      <td className="py-2 text-sm font-medium text-foreground">{s.name}</td>
                      <td className="py-2 text-sm text-muted-foreground">{s.sessions}</td>
                      <td className="py-2 text-sm text-muted-foreground">{s.clients}</td>
                      <td className="py-2 text-sm text-foreground">⭐ {s.satisfaction}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
