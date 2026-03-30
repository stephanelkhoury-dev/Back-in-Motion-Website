'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, X, Save, Package, DollarSign, Calendar, Zap } from 'lucide-react';

interface ServiceRef { id: string; name: string; category: string }
interface Pkg {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  totalSessions: number;
  price: number;
  validityDays: number;
  includesECoach: boolean;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  services: ServiceRef[];
  _count: { subscriptions: number };
}

const CATEGORIES = [
  { value: 'physio', label: 'Physiotherapy' },
  { value: 'dietitian', label: 'Dietitian / Nutrition' },
  { value: 'aesthetic', label: 'Aesthetic / Body Shaping' },
  { value: 'electrolysis', label: 'Electrolysis' },
  { value: 'gym', label: 'Gym & Fitness' },
  { value: 'hybrid', label: 'Hybrid / Multi-Service' },
];

const TYPES = [
  { value: 'single', label: 'Single Session' },
  { value: 'bundle', label: 'Bundle (Fixed Sessions)' },
  { value: 'monthly', label: 'Monthly Subscription' },
  { value: 'hybrid', label: 'Hybrid (Sessions + E-Coach)' },
];

const emptyForm = {
  name: '', description: '', category: 'physio', type: 'bundle',
  totalSessions: '10', price: '', validityDays: '30',
  includesECoach: false, features: '', isPopular: false, serviceIds: [] as string[],
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [allServices, setAllServices] = useState<ServiceRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/packages').then(r => r.json()),
      fetch('/api/admin/services').then(r => r.json()),
    ]).then(([pkgs, svcs]) => {
      setPackages(pkgs);
      setAllServices(svcs.map((s: ServiceRef & { slug?: string }) => ({ id: s.id, name: s.name, category: s.category })));
      setLoading(false);
    });
  }, []);

  async function fetchPackages() {
    const res = await fetch('/api/admin/packages');
    if (res.ok) setPackages(await res.json());
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  }

  function openEdit(pkg: Pkg) {
    setEditingId(pkg.id);
    setForm({
      name: pkg.name,
      description: pkg.description,
      category: pkg.category,
      type: pkg.type,
      totalSessions: String(pkg.totalSessions),
      price: String(pkg.price),
      validityDays: String(pkg.validityDays),
      includesECoach: pkg.includesECoach,
      features: pkg.features.join('\n'),
      isPopular: pkg.isPopular,
      serviceIds: pkg.services.map(s => s.id),
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
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
    };

    const url = editingId ? `/api/admin/packages/${editingId}` : '/api/admin/packages';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      fetchPackages();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save');
    }
    setSaving(false);
  }

  async function toggleActive(pkg: Pkg) {
    await fetch(`/api/admin/packages/${pkg.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !pkg.isActive }),
    });
    fetchPackages();
  }

  async function deletePkg(pkg: Pkg) {
    if (!confirm(`Deactivate "${pkg.name}"?`)) return;
    await fetch(`/api/admin/packages/${pkg.id}`, { method: 'DELETE' });
    fetchPackages();
  }

  function toggleServiceId(sid: string) {
    setForm(f => ({
      ...f,
      serviceIds: f.serviceIds.includes(sid) ? f.serviceIds.filter(id => id !== sid) : [...f.serviceIds, sid],
    }));
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Packages & Pricing</h1>
          <p className="text-muted-foreground text-sm">Create and manage service packages and subscription plans.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Package</Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><div className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{packages.length}</p><p className="text-xs text-muted-foreground">Total Packages</p></div></Card>
        <Card><div className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{packages.filter(p => p.isActive).length}</p><p className="text-xs text-muted-foreground">Active</p></div></Card>
        <Card><div className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{packages.reduce((sum, p) => sum + p._count.subscriptions, 0)}</p><p className="text-xs text-muted-foreground">Total Subscriptions</p></div></Card>
        <Card><div className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{packages.filter(p => p.isPopular).length}</p><p className="text-xs text-muted-foreground">Popular</p></div></Card>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{editingId ? 'Edit Package' : 'New Package'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Package Name *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g., Physio 10 Sessions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none">
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none">
                  {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Total Sessions *</label>
                <input type="number" required min="0" value={form.totalSessions} onChange={(e) => setForm({ ...form, totalSessions: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Price (USD) *</label>
                <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="650.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Validity (days) *</label>
                <input type="number" required min="1" value={form.validityDays} onChange={(e) => setForm({ ...form, validityDays: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
                <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
                  placeholder="What's included in this package"
                />
              </div>
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-foreground mb-1">Features (one per line)</label>
                <textarea rows={3} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
                  placeholder="10 in-clinic sessions&#10;Dedicated therapist&#10;Treatment plan"
                />
              </div>
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-foreground mb-2">Included Services</label>
                <div className="flex flex-wrap gap-2">
                  {allServices.map(s => (
                    <button key={s.id} type="button" onClick={() => toggleServiceId(s.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.serviceIds.includes(s.id)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background text-foreground border-muted hover:border-primary'
                      }`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.includesECoach} onChange={(e) => setForm({ ...form, includesECoach: e.target.checked })}
                    className="rounded border-muted" />
                  <span className="text-sm text-foreground">Includes E-Coach</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isPopular} onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="rounded border-muted" />
                  <span className="text-sm text-foreground">Mark as Popular</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-1" /> {saving ? 'Saving...' : editingId ? 'Update Package' : 'Create Package'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Packages Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Package</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sessions</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Validity</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Subs</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id} className={`border-b border-border last:border-0 hover:bg-muted/50 ${!pkg.isActive ? 'opacity-50' : ''}`}>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{pkg.name}</p>
                        <p className="text-xs text-muted-foreground">{pkg.category}</p>
                      </div>
                      {pkg.isPopular && <Badge variant="warning">Popular</Badge>}
                      {pkg.includesECoach && <span className="text-amber-500" aria-label="Includes E-Coach"><Zap className="h-3.5 w-3.5" /></span>}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground capitalize">{pkg.type}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{pkg.totalSessions}</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">${pkg.price}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{pkg.validityDays} days</td>
                  <td className="py-3 px-4 text-sm text-foreground">{pkg._count.subscriptions}</td>
                  <td className="py-3 px-4"><Badge variant={pkg.isActive ? 'success' : 'danger'}>{pkg.isActive ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(pkg)} className="p-1.5 rounded hover:bg-muted" title="Edit">
                        <Edit className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button onClick={() => toggleActive(pkg)} className="p-1.5 rounded hover:bg-muted" title="Toggle">
                        <span className="text-xs text-muted-foreground">{pkg.isActive ? 'Disable' : 'Enable'}</span>
                      </button>
                      <button onClick={() => deletePkg(pkg)} className="p-1.5 rounded hover:bg-muted" title="Delete">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {packages.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No packages yet. Click &quot;Add Package&quot; to create your first one.
        </div>
      )}
    </div>
  );
}
