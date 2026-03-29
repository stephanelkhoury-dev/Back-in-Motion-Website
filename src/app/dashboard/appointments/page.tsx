import { Calendar, Plus, Filter } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser, getClientAppointments } from '@/lib/data';

export default async function AppointmentsPage() {
  const user = await getSessionUser();
  if (!user) redirect('/auth/signin');

  const rawAppointments = await getClientAppointments(user.id);
  const appointments = rawAppointments.map((a) => ({
    id: a.id,
    service: a.service.name,
    specialist: `${a.practitioner.firstName} ${a.practitioner.lastName}`,
    date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: a.startTime,
    duration: `${a.service.duration} min`,
    status: a.status,
    room: a.roomOrEquipment || '-',
  }));

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
