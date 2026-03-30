'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Building2, Plus, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Org {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  currency: string;
  isActive: boolean;
  createdAt: string;
  _count: { users: number; services: number; packages: number };
  totalRevenue: number;
  activeSubscriptions: number;
}

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', currency: 'USD' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchOrgs(); }, []);

  async function fetchOrgs() {
    const res = await fetch('/api/super-admin/organizations');
    if (res.ok) setOrgs(await res.json());
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/super-admin/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ name: '', email: '', phone: '', address: '', currency: 'USD' });
      setShowCreateForm(false);
      fetchOrgs();
    }
    setSaving(false);
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Organizations</h1>
          <p className="text-muted-foreground text-sm">Manage all client organizations on the platform.</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-1" /> New Organization
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="mb-6">
          <form onSubmit={handleCreate} className="p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Create Organization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Organization Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g., Wellness Center Beirut"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="contact@clinic.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="+961 1 234 567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="LBP">LBP</option>
                  <option value="GBP">GBP</option>
                  <option value="AED">AED</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Full address"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>{saving ? 'Creating...' : 'Create Organization'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Organization Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {orgs.map((org) => (
          <Card key={org.id} hover>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{org.name}</h3>
                    <p className="text-xs text-muted-foreground">{org.email || org.slug}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${org.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {org.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-foreground">{org._count.users}</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-foreground">{org._count.services}</p>
                  <p className="text-xs text-muted-foreground">Services</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-foreground">{org._count.packages}</p>
                  <p className="text-xs text-muted-foreground">Packages</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold text-foreground">${org.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
              <Link
                href={`/super-admin/organizations/${org.id}`}
                className="inline-flex items-center text-sm text-primary hover:underline"
              >
                Manage Organization <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {orgs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No organizations yet. Create one to get started.</p>
        </div>
      )}
    </div>
  );
}
