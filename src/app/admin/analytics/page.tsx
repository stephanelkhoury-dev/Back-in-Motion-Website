'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { TrendingUp, Users, Calendar, DollarSign, BarChart3, Activity } from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalClients: number;
    activeClients: number;
    totalAppointments: number;
    completedAppointments: number;
    thisMonthAppointments: number;
    totalRevenue: number;
    thisMonthRevenue: number;
    activeSubscriptions: number;
  };
  revenueByService: { service: string; category: string; bookings: number }[];
  recentPayments: { id: string; amount: number; status: string; createdAt: string; client: { firstName: string; lastName: string } }[];
  upcomingAppointments: { id: string; date: string; startTime: string; status: string; client: { firstName: string; lastName: string }; practitioner: { firstName: string; lastName: string }; service: { name: string } }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Analytics</h1>
        <p className="text-muted-foreground">Loading analytics data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-6">Analytics</h1>
        <p className="text-muted-foreground">Failed to load analytics data.</p>
      </div>
    );
  }

  const { overview } = data;
  const completionRate = overview.totalAppointments > 0
    ? Math.round((overview.completedAppointments / overview.totalAppointments) * 100)
    : 0;

  const kpis = [
    { label: 'Total Revenue', value: `$${overview.totalRevenue.toLocaleString()}`, sub: `$${overview.thisMonthRevenue.toLocaleString()} this month`, icon: DollarSign },
    { label: 'Active Clients', value: `${overview.activeClients}`, sub: `${overview.totalClients} total`, icon: Users },
    { label: 'Sessions This Month', value: `${overview.thisMonthAppointments}`, sub: `${overview.totalAppointments} total`, icon: Calendar },
    { label: 'Completion Rate', value: `${completionRate}%`, sub: `${overview.activeSubscriptions} active subs`, icon: Activity },
  ];

  const maxBookings = Math.max(...data.revenueByService.map(s => s.bookings), 1);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm">Real-time business insights and performance metrics.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bookings by Service */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Bookings by Service</h3>
            </div>
            {data.revenueByService.length > 0 ? (
              <div className="space-y-4">
                {data.revenueByService.map((s) => (
                  <div key={s.service}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-foreground">{s.service}</span>
                      <span className="text-sm font-medium text-foreground">{s.bookings} bookings</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="h-3 bg-primary rounded-full transition-all" style={{ width: `${(s.bookings / maxBookings) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No completed appointments yet.</p>
            )}
          </div>
        </Card>

        {/* Recent Payments */}
        <Card>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Recent Payments</h3>
            </div>
            {data.recentPayments.length > 0 ? (
              <div className="space-y-3">
                {data.recentPayments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.client.firstName} {p.client.lastName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={p.status === 'completed' ? 'success' : 'warning'}>{p.status}</Badge>
                      <span className="text-sm font-semibold text-foreground">${p.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No payments yet.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Upcoming Appointments</h3>
          </div>
          {data.upcomingAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Practitioner</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Time</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.upcomingAppointments.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0">
                      <td className="py-2 text-sm text-foreground">{a.client.firstName} {a.client.lastName}</td>
                      <td className="py-2 text-sm text-muted-foreground">{a.service.name}</td>
                      <td className="py-2 text-sm text-muted-foreground">{a.practitioner.firstName} {a.practitioner.lastName}</td>
                      <td className="py-2 text-sm text-muted-foreground">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="py-2 text-sm text-muted-foreground">{a.startTime}</td>
                      <td className="py-2"><Badge variant={a.status === 'confirmed' ? 'success' : 'primary'}>{a.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
