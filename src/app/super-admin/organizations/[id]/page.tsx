'use client';

import { useState, useEffect, use } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Building2, Users, Stethoscope, Package, ArrowLeft, Edit, Save, X } from 'lucide-react';
import Link from 'next/link';

interface OrgDetail {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  timezone: string;
  currency: string;
  isActive: boolean;
  users: { id: string; firstName: string; lastName: string; email: string; role: string; isActive: boolean }[];
  services: { id: string; name: string; category: string; price: number; isActive: boolean }[];
  packages: { id: string; name: string; price: number; isActive: boolean }[];
  _count: { users: number; services: number; packages: number };
}

export default function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [org, setOrg] = useState<OrgDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', website: '', currency: '' });

  useEffect(() => { fetchOrg(); }, [id]);

  async function fetchOrg() {
    const res = await fetch(`/api/super-admin/organizations/${id}`);
    if (res.ok) {
      const data = await res.json();
      setOrg(data);
      setForm({
        name: data.name,
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        website: data.website || '',
        currency: data.currency,
      });
    }
    setLoading(false);
  }

  async function handleSave() {
    const res = await fetch(`/api/super-admin/organizations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEditing(false);
      fetchOrg();
    }
  }

  async function toggleActive() {
    if (!org) return;
    await fetch(`/api/super-admin/organizations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !org.isActive }),
    });
    fetchOrg();
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  if (!org) return <div className="p-8 text-center text-muted-foreground">Organization not found</div>;

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

  return (
    <div className="max-w-7xl mx-auto">
      <Link href="/super-admin/organizations" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Organizations
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{org.name}</h1>
            <p className="text-muted-foreground text-sm">{org.email || org.slug}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={toggleActive}>
            {org.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button onClick={() => setEditing(!editing)}>
            {editing ? <><X className="h-4 w-4 mr-1" /> Cancel</> : <><Edit className="h-4 w-4 mr-1" /> Edit</>}
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      {editing && (
        <Card className="mb-6">
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none">
                  <option value="USD">USD</option><option value="EUR">EUR</option><option value="LBP">LBP</option><option value="GBP">GBP</option><option value="AED">AED</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Address</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none" />
              </div>
            </div>
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-1" /> Save Changes</Button>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card><div className="p-4 text-center"><Users className="h-6 w-6 mx-auto mb-1 text-primary" /><p className="text-2xl font-bold text-foreground">{org._count.users}</p><p className="text-xs text-muted-foreground">Users</p></div></Card>
        <Card><div className="p-4 text-center"><Stethoscope className="h-6 w-6 mx-auto mb-1 text-primary" /><p className="text-2xl font-bold text-foreground">{org._count.services}</p><p className="text-xs text-muted-foreground">Services</p></div></Card>
        <Card><div className="p-4 text-center"><Package className="h-6 w-6 mx-auto mb-1 text-primary" /><p className="text-2xl font-bold text-foreground">{org._count.packages}</p><p className="text-xs text-muted-foreground">Packages</p></div></Card>
      </div>

      {/* Users Table */}
      <Card className="mb-6">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-foreground mb-4">Users ({org.users.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-muted">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {org.users.map((u) => (
                  <tr key={u.id} className="border-b border-muted/50 last:border-0">
                    <td className="py-2 px-2 font-medium text-foreground">{u.firstName} {u.lastName}</td>
                    <td className="py-2 px-2 text-muted-foreground">{u.email}</td>
                    <td className="py-2 px-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[u.role] || 'bg-gray-100 text-gray-700'}`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Services & Packages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Services ({org.services.length})</h2>
            <div className="space-y-2">
              {org.services.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground text-sm">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${s.price}</p>
                    <span className={`text-xs ${s.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Packages ({org.packages.length})</h2>
            <div className="space-y-2">
              {org.packages.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <p className="font-medium text-foreground text-sm">{p.name}</p>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${p.price}</p>
                    <span className={`text-xs ${p.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
