'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, X, Save, DollarSign, Clock, Tag } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  duration: number;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
  _count: { appointments: number; staffAccess: number };
}

const CATEGORIES = [
  { value: 'physio', label: 'Physiotherapy' },
  { value: 'dietitian', label: 'Dietitian / Nutrition' },
  { value: 'aesthetic', label: 'Aesthetic / Body Shaping' },
  { value: 'electrolysis', label: 'Electrolysis' },
  { value: 'gym', label: 'Gym & Fitness' },
];

const categoryColors: Record<string, string> = {
  physio: 'bg-teal-50 text-teal-700 border-teal-200',
  dietitian: 'bg-green-50 text-green-700 border-green-200',
  aesthetic: 'bg-purple-50 text-purple-700 border-purple-200',
  electrolysis: 'bg-pink-50 text-pink-700 border-pink-200',
  gym: 'bg-orange-50 text-orange-700 border-orange-200',
};

const emptyForm = {
  name: '', category: 'physio', description: '', shortDescription: '', duration: '60', price: '', imageUrl: '',
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { fetchServices(); }, []);

  async function fetchServices() {
    const res = await fetch('/api/admin/services');
    if (res.ok) setServices(await res.json());
    setLoading(false);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setShowForm(true);
  }

  function openEdit(service: Service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      category: service.category,
      description: service.description,
      shortDescription: service.shortDescription,
      duration: String(service.duration),
      price: String(service.price),
      imageUrl: service.imageUrl || '',
    });
    setError('');
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      fetchServices();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to save');
    }
    setSaving(false);
  }

  async function toggleActive(service: Service) {
    await fetch(`/api/admin/services/${service.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !service.isActive }),
    });
    fetchServices();
  }

  async function deleteService(service: Service) {
    if (!confirm(`Deactivate "${service.name}"? This will hide it from clients.`)) return;
    await fetch(`/api/admin/services/${service.id}`, { method: 'DELETE' });
    fetchServices();
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services & Pricing</h1>
          <p className="text-muted-foreground text-sm">Manage your service offerings, durations, and pricing.</p>
        </div>
        <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Service</Button>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">{editingId ? 'Edit Service' : 'New Service'}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Service Name *</label>
                <input
                  type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g., Physiotherapy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                >
                  {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Duration (minutes) *</label>
                <input
                  type="number" required min="5" value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Price (USD) *</label>
                <input
                  type="number" required min="0" step="0.01" value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="75.00"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Short Description *</label>
                <input
                  type="text" required value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Brief one-line description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Full Description *</label>
                <textarea
                  required rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none resize-none"
                  placeholder="Detailed description of the service"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Image URL</label>
                <input
                  type="text" value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-muted rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
                  placeholder="/images/services/physio.jpg"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-1" /> {saving ? 'Saving...' : editingId ? 'Update Service' : 'Create Service'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {services.map((service) => (
          <Card key={service.id} hover className={!service.isActive ? 'opacity-60' : ''}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{service.shortDescription}</p>
                </div>
                <Badge variant={service.isActive ? 'success' : 'danger'}>
                  {service.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[service.category] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                  {CATEGORIES.find(c => c.value === service.category)?.label || service.category}
                </span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="flex items-center text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" /> {service.duration} min
                </span>
                <span className="flex items-center font-semibold text-foreground">
                  <DollarSign className="h-3.5 w-3.5" /> {service.price}
                </span>
                <span className="flex items-center text-muted-foreground">
                  <Tag className="h-3.5 w-3.5 mr-1" /> {service._count.appointments} bookings
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => openEdit(service)}>
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleActive(service)}>
                  {service.isActive ? 'Disable' : 'Enable'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteService(service)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No services yet. Click &quot;Add Service&quot; to create your first one.
        </div>
      )}

      {/* Pricing Table */}
      {services.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-foreground mb-3">Pricing Overview</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Bookings</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Staff</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{service.name}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[service.category] || 'bg-gray-50 text-gray-700'}`}>
                          {service.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{service.duration} min</td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">${service.price}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{service._count.appointments}</td>
                      <td className="py-3 px-4 text-sm text-foreground">{service._count.staffAccess}</td>
                      <td className="py-3 px-4"><Badge variant={service.isActive ? 'success' : 'danger'}>{service.isActive ? 'Active' : 'Inactive'}</Badge></td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => openEdit(service)} className="text-primary hover:underline text-sm">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
