import { Calendar, Plus, Filter } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function AppointmentsPage() {
  const appointments = [
    { id: 1, service: 'Physiotherapy', specialist: 'Dr. Nicolas Khoury', date: 'Apr 2, 2026', time: '10:00 AM', duration: '60 min', status: 'confirmed', room: 'Room A' },
    { id: 2, service: 'Dietitian Consultation', specialist: 'Sarah Mansour', date: 'Apr 5, 2026', time: '2:00 PM', duration: '45 min', status: 'scheduled', room: 'Online' },
    { id: 3, service: 'Body Shaping (LPG)', specialist: 'Lara Haddad', date: 'Apr 8, 2026', time: '11:00 AM', duration: '45 min', status: 'confirmed', room: 'Room C' },
    { id: 4, service: 'Physiotherapy', specialist: 'Dr. Nicolas Khoury', date: 'Mar 25, 2026', time: '10:00 AM', duration: '60 min', status: 'completed', room: 'Room A' },
    { id: 5, service: 'Electrolysis', specialist: 'Nour Khalil', date: 'Mar 20, 2026', time: '3:00 PM', duration: '30 min', status: 'completed', room: 'Room D' },
    { id: 6, service: 'Physiotherapy', specialist: 'Dr. Nicolas Khoury', date: 'Mar 15, 2026', time: '10:00 AM', duration: '60 min', status: 'cancelled', room: 'Room A' },
  ];

  const statusColors: Record<string, 'success' | 'primary' | 'danger' | 'default'> = {
    confirmed: 'success',
    scheduled: 'primary',
    completed: 'default',
    cancelled: 'danger',
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>
          <p className="text-muted-foreground text-sm">Manage your upcoming and past appointments.</p>
        </div>
        <Link href="/book">
          <Button><Plus className="h-4 w-4 mr-1" /> Book New</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Specialist</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{appt.service}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{appt.specialist}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{appt.date}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{appt.time}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{appt.duration}</td>
                  <td className="py-3 px-4">
                    <Badge variant={statusColors[appt.status] || 'default'}>{appt.status}</Badge>
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
