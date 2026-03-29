import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Bell, Send, Clock, CheckCircle } from 'lucide-react';

export default function AdminRemindersPage() {
  const reminders = [
    { id: 'R-001', client: 'Rami Saleh', type: 'appointment', message: 'Upcoming session tomorrow at 10:00 AM', channel: 'WhatsApp', scheduledFor: 'Mar 26, 2026 09:00', status: 'pending' },
    { id: 'R-002', client: 'Diana Mansour', type: 'exercise', message: 'Complete your daily exercises – Week 3, Day 5', channel: 'In-App', scheduledFor: 'Mar 26, 2026 08:00', status: 'sent' },
    { id: 'R-003', client: 'Lea Khoury', type: 'package_expiry', message: 'Your LPG Basic package expires in 3 days', channel: 'Email', scheduledFor: 'Mar 25, 2026 10:00', status: 'sent' },
    { id: 'R-004', client: 'Jad Haddad', type: 'follow_up', message: 'How are you feeling after your last session?', channel: 'WhatsApp', scheduledFor: 'Mar 25, 2026 14:00', status: 'sent' },
    { id: 'R-005', client: 'Nadia Abboud', type: 'payment', message: 'Invoice #INV-042 is overdue. Please settle payment.', channel: 'Email', scheduledFor: 'Mar 24, 2026 09:00', status: 'sent' },
    { id: 'R-006', client: 'All Clients', type: 'promotion', message: 'Spring wellness special – 20% off hybrid packages!', channel: 'SMS', scheduledFor: 'Mar 28, 2026 10:00', status: 'scheduled' },
  ];

  const typeColors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
    appointment: 'primary',
    exercise: 'success',
    package_expiry: 'warning',
    follow_up: 'default',
    payment: 'danger',
    promotion: 'warning',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock className="h-3 w-3" />,
    sent: <CheckCircle className="h-3 w-3" />,
    scheduled: <Send className="h-3 w-3" />,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
          <p className="text-muted-foreground text-sm">Manage automated and manual notifications.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> New Reminder</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <div className="p-4 text-center">
            <Bell className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">342</p>
            <p className="text-sm text-muted-foreground">Sent This Month</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <Send className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground">Scheduled</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">96%</p>
            <p className="text-sm text-muted-foreground">Delivery Rate</p>
          </div>
        </Card>
        <Card>
          <div className="p-4 text-center">
            <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">5</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </Card>
      </div>

      {/* Automation Rules */}
      <h2 className="text-lg font-semibold text-foreground mb-3">Automation Rules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {[
          { name: 'Appointment Reminder', trigger: '24h before appointment', channel: 'WhatsApp + In-App', active: true },
          { name: 'Exercise Reminder', trigger: 'Daily at 8:00 AM', channel: 'In-App', active: true },
          { name: 'Package Expiry Alert', trigger: '7 days before expiry', channel: 'Email + WhatsApp', active: true },
          { name: 'Follow-up Message', trigger: '48h after session', channel: 'WhatsApp', active: false },
          { name: 'Payment Overdue', trigger: '3 days after due date', channel: 'Email', active: true },
          { name: 'Re-engagement', trigger: '14 days of inactivity', channel: 'SMS', active: false },
        ].map((rule) => (
          <Card key={rule.name}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-foreground text-sm">{rule.name}</h3>
                <Badge variant={rule.active ? 'success' : 'default'}>{rule.active ? 'Active' : 'Paused'}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">Trigger: {rule.trigger}</p>
              <p className="text-xs text-muted-foreground">Channel: {rule.channel}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Reminders */}
      <h2 className="text-lg font-semibold text-foreground mb-3">Recent Activity</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Recipient</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Message</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Channel</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{r.client}</td>
                  <td className="py-3 px-4"><Badge variant={typeColors[r.type]}>{r.type.replace('_', ' ')}</Badge></td>
                  <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">{r.message}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{r.channel}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{r.scheduledFor}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-sm">
                      {statusIcons[r.status]}
                      <span className="capitalize">{r.status}</span>
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
