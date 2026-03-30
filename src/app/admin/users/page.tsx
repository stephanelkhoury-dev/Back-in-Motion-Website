'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Edit, X, Save, Users, Shield, Stethoscope, UserCheck, UserX, Search } from 'lucide-react';

interface ServiceRef { id: string; name: string; category: string }
interface UserItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  specialties: string[];
  languages: string[];
  bio: string | null;
  isActive: boolean;
  createdAt: string;
  serviceAccess: ServiceRef[];
  _count: { clientAppointments: number; practitionerAppointments: number; subscriptions: number };
}

const ROLES = [
  { value: 'admin', label: 'Admin', description: 'Full access to manage the organization' },
  { value: 'manager', label: 'Manager', description: 'Manage bookings, clients, and staff schedules' },
  { value: 'therapist', label: 'Therapist', description: 'Physiotherapy sessions and treatment notes' },
  { value: 'dietitian', label: 'Dietitian', description: 'Nutrition consultations and meal plans' },
  { value: 'trainer', label: 'Trainer', description: 'Fitness training and gym sessions' },
  { value: 'aesthetic_specialist', label: 'Aesthetic Specialist', description: 'Body shaping and LPG treatments' },
  { value: 'electrologist', label: 'Electrologist', description: 'Electrolysis hair removal' },
  { value: 'receptionist', label: 'Receptionist', description: 'Front desk, bookings, and client check-in' },
  { value: 'client', label: 'Client', description: 'Patient / customer account' },
];

const roleColors: Record<string, string> = {
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

const emptyForm = {
  firstName: '', lastName: '', email: '', password: '', phone: '', role: 'client',
  specialties: '', bio: '', languages: '', serviceIds: [] as string[],
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [allServices, setAllServices] = useState<ServiceRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/services').then(r => r.json()),
    ]).then(([svcs]) => {
      setAllServices(svcs.map((s: ServiceRef & Record<string, unknown>) => ({ id: s.id, name: s.name, category: s.category })));
    });
  }, []);

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

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  }

  function openEdit(user: UserItem) {
    setEditingId(user.id);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      phone: user.phone || '',
      role: user.role,
      specialties: user.specialties.join(', '),
      bio: user.bio || '',
      languages: user.languages.join(', '),
      serviceIds: user.serviceAccess.map(s => s.id),
    });
    setError('');
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      specialties: form.specialties ? form.specialties.split(',').map(s => s.trim()).filter(Boolean) : [],
      languages: form.languages ? form.languages.split(',').map(l => l.trim()).filter(Boolean) : [],
    };

    // Don't send empty password on edit
    if (editingId && !payload.password) {
      const { password: _, ...rest } = payload;
      Object.assign(payload, rest);
      delete (payload as Record<string, unknown>).password;
    }

    const url = editingId ? `/api/admin/users/${editingId}` : '/api/admin/users';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      fetchUsers();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save');
    }
    setSaving(false);
  }

  async function toggleActive(user: UserItem) {
    await fetch(`/api/admin/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    fetchUsers();
  }

  function toggleServiceId(sid: string) {
    setForm(f => ({
      ...f,
      serviceIds: f.serviceIds.includes(sid) ? f.serviceIds.filter(id => id !== sid) : [...f.serviceIds, sid],
    }));
  }

  const staffCount = users.filter(u => u.role !== 'client').length;
  const clientCount = users.filter(u => u.role === 'client').length;
  const activeCount = users.filter(u => u.isActive).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Team & Users</h1>
          <p className="text-muted-foreground text-sm">Manage staff, clients, roles, and service access permissions.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add User</Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><div className="p-4 flex items-center gap-3"><Users className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold text-foreground">{users.length}</p><p className="text-xs text-muted-foreground">Total Users</p></div></div></Card>
        <Card><div className="p-4 flex items-center gap-3"><Stethoscope className="h-5 w-5 text-teal-600" /><div><p className="text-2xl font-bold text-foreground">{staffCount}</p><p className="text-xs text-muted-foreground">Staff Members</p></div></div></Card>
        <Card><div className="p-4 flex items-center gap-3"><Shield className="h-5 w-5 text-sky-600" /><div><p className="text-2xl font-bold text-foreground">{clientCount}</p><p className="text-xs text-muted-foreground">Clients</p></div></div></Card>
        <Card><div className="p-4 flex items-center gap-3"><UserCheck className="h-5 w-5 text-green-600" /><div><p className="text-2xl font-bold text-foreground">{activeCount}</p><p className="text-xs text-muted-foreground">Active</p></div></div></Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text" placeholder="Search users..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-muted rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-muted rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary outline-none">
          <option value="all">All Roles</option>
          <option value="staff">All Staff</option>
          {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{editingId ? 'Edit User' : 'Create New User'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">First Name *</label>
                <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Last Name *</label>
                <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{editingId ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <input type="password" required={!editingId} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder={editingId ? 'Leave blank to keep current' : ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Role *</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none">
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label} - {r.description}</option>)}
                </select>
              </div>
            </div>

            {/* Staff-specific fields */}
            {form.role !== 'client' && (
              <div className="space-y-4 pt-2 border-t border-muted">
                <h4 className="text-sm font-medium text-foreground">Staff Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Specialties (comma-separated)</label>
                    <input type="text" value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                      className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                      placeholder="e.g., Sports Rehab, Orthopedic Rehab" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Languages (comma-separated)</label>
                    <input type="text" value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })}
                      className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                      placeholder="e.g., English, Arabic, French" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                    <textarea rows={2} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
                      placeholder="Brief bio for the team page" />
                  </div>
                </div>

                {/* Service Access */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Service Access - Which services can this user provide?</label>
                  <div className="flex flex-wrap gap-2">
                    {allServices.map(s => (
                      <button key={s.id} type="button" onClick={() => toggleServiceId(s.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.serviceIds.includes(s.id)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-background text-foreground border-muted hover:border-primary'
                        }`}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-1" /> {saving ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading...</div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service Access</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Activity</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={`border-b border-border last:border-0 hover:bg-muted/50 ${!user.isActive ? 'opacity-50' : ''}`}>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        {user.phone && <p className="text-xs text-muted-foreground">{user.phone}</p>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role] || 'bg-gray-100 text-gray-700'}`}>
                        {user.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {user.serviceAccess.length > 0 ? (
                          user.serviceAccess.map(s => (
                            <span key={s.id} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{s.name}</span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">{user.role === 'client' ? '-' : 'No services assigned'}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {user.role === 'client' ? (
                        <span>{user._count.clientAppointments} appts, {user._count.subscriptions} subs</span>
                      ) : (
                        <span>{user._count.practitionerAppointments} sessions</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={user.isActive ? 'success' : 'danger'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(user)} className="p-1.5 rounded hover:bg-muted" title="Edit">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button onClick={() => toggleActive(user)} className="p-1.5 rounded hover:bg-muted" title={user.isActive ? 'Deactivate' : 'Activate'}>
                          {user.isActive ? <UserX className="h-4 w-4 text-red-500" /> : <UserCheck className="h-4 w-4 text-green-500" />}
                        </button>
                      </div>
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
          No users found matching your filters.
        </div>
      )}
    </div>
  );
}
