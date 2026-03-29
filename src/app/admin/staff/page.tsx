import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, Plus, UserCog } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getSessionUser, getAdminStaff } from '@/lib/data';

export default async function AdminStaffPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') redirect('/auth/signin');

  const rawStaff = await getAdminStaff();
  const staff = rawStaff.filter((s) => s.role !== 'admin').map((s) => ({
    id: s.id.slice(0, 8),
    name: `${s.firstName} ${s.lastName}`,
    role: s.role.replace('_', ' '),
    specialties: s.specialties as string[],
    email: s.email,
    status: s.isActive ? 'active' : 'inactive',
    clients: s._count.practitionerAppointments,
  }));

  const roleColors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
    'therapist': 'primary',
    'dietitian': 'success',
    'aesthetic specialist': 'warning',
    'trainer': 'danger',
    'electrologist': 'default',
    'receptionist': 'default',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground text-sm">Manage practitioners and support staff.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> Add Staff</Button>
      </div>

      <div className="mb-4 flex items-center gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="search" placeholder="Search staff..." className="pl-10" />
        </div>
        <select className="border border-border rounded-lg px-3 py-2 text-sm bg-background">
          <option value="">All Roles</option>
          <option value="physio">Physiotherapist</option>
          <option value="diet">Dietitian</option>
          <option value="aesthetic">Aesthetician</option>
          <option value="gym">Gym Trainer</option>
          <option value="electro">Electrologist</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((s) => (
          <Card key={s.id} hover>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <UserCog className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <Badge variant={roleColors[s.role] || 'default'} className="mt-1">{s.role}</Badge>
                  </div>
                </div>
                <Badge variant={s.status === 'active' ? 'success' : 'warning'}>
                  {s.status === 'active' ? 'Active' : 'On Leave'}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {s.specialties.map((sp) => (
                  <Badge key={sp} variant="outline">{sp}</Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-1">{s.email}</p>
              <p className="text-sm text-muted-foreground">{s.clients} active clients</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">View Profile</Button>
                <Button variant="ghost" size="sm">Schedule</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
