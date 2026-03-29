import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function AdminBookingsPage() {
  const bookings = [
    { id: 'BK-001', client: 'Rami S.', service: 'Physiotherapy', specialist: 'Dr. Nicolas Khoury', date: 'Apr 2, 2026', time: '10:00', status: 'confirmed', type: 'package' },
    { id: 'BK-002', client: 'Diana M.', service: 'Dietitian', specialist: 'Sarah Mansour', date: 'Apr 2, 2026', time: '14:00', status: 'confirmed', type: 'single' },
    { id: 'BK-003', client: 'Lea K.', service: 'Body Shaping', specialist: 'Lara Haddad', date: 'Apr 3, 2026', time: '11:00', status: 'scheduled', type: 'package' },
    { id: 'BK-004', client: 'Jad H.', service: 'Gym PT', specialist: 'Ahmad Rizk', date: 'Apr 3, 2026', time: '16:00', status: 'scheduled', type: 'single' },
    { id: 'BK-005', client: 'Nadia A.', service: 'Electrolysis', specialist: 'Nour Khalil', date: 'Apr 4, 2026', time: '15:00', status: 'waitlist', type: 'package' },
    { id: 'BK-006', client: 'Karim B.', service: 'Physiotherapy', specialist: 'Maya Abboud', date: 'Apr 4, 2026', time: '09:00', status: 'confirmed', type: 'package' },
  ];

  const statusColors: Record<string, 'success' | 'primary' | 'warning' | 'danger' | 'default'> = {
    confirmed: 'success',
    scheduled: 'primary',
    waitlist: 'warning',
    cancelled: 'danger',
    no_show: 'danger',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bookings Management</h1>
          <p className="text-muted-foreground text-sm">Manage all appointments and scheduling.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> New Booking</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Specialist</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4 text-sm font-medium text-primary">{b.id}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{b.client}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{b.service}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{b.specialist}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{b.date}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{b.time}</td>
                  <td className="py-3 px-4"><Badge variant="outline">{b.type}</Badge></td>
                  <td className="py-3 px-4"><Badge variant={statusColors[b.status] || 'default'}>{b.status}</Badge></td>
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
