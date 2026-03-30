'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { Users, Search } from 'lucide-react';

interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  organizationId: string | null;
  serviceAccess: { id: string; name: string }[];
  _count: { clientAppointments: number; practitionerAppointments: number; subscriptions: number };
}

const roleColors: Record<string, string> = {
  super_admin: 'bg-amber-100 text-amber-700',
  admin: 'bg-blue-100 text-blue-700',
  manager: 'bg-purple-100 text-purple-700',
  therapist: 'bg-teal-100 text-teal-700',
  dietitian: 'bg-green-100 text-green-700',
  trainer: 'bg-orange-100 text-orange-700',
  aesthetic_specialist: 'bg-pink-100 text-pink-700',
  electrologist: 'bg-rose-100 text-rose-700',
  receptionist: 'bg-gray-100 text-gray-700',
  client: 'bg-sky-100 text-sky-700',
};

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, [roleFilter, search]);

  async function fetchUsers() {
    setLoading(true);
    const params = new URLSearchParams();
    if (roleFilter !== 'all') params.set('role', roleFilter);
    if (search) params.set('search', search);
    const res = await fetch(`/api/admin/users?${params}`);
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">All Platform Users</h1>
        <p className="text-muted-foreground text-sm">View all users across all organizations.</p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-muted rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-muted rounded-lg bg-background text-foreground text-sm">
          <option value="all">All Roles</option>
          <option value="staff">Staff Only</option>
          <option value="client">Clients Only</option>
        </select>
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-muted">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Activity</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-muted/50 last:border-0">
                    <td className="py-3 px-4">
                      <p className="font-medium text-foreground">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] || 'bg-gray-100 text-gray-700'}`}>
                        {u.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium ${u.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {u.role === 'client'
                        ? `${u._count.clientAppointments} appts`
                        : `${u._count.practitionerAppointments} sessions`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!loading && users.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No users found.</p>
        </div>
      )}
    </div>
  );
}
