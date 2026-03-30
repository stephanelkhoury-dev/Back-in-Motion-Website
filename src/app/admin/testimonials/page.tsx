'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  clientName: string;
  service: string;
  rating: number;
  comment: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ clientName: '', service: '', rating: 5, comment: '', isActive: true });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/testimonials');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ clientName: '', service: '', rating: 5, comment: '', isActive: true });
    setCreating(true);
  }

  function openEdit(item: Testimonial) {
    setCreating(false);
    setEditing(item);
    setForm({ clientName: item.clientName, service: item.service, rating: item.rating, comment: item.comment, isActive: item.isActive });
  }

  function closeForm() { setEditing(null); setCreating(false); }

  async function handleSave() {
    setSaving(true);
    const url = editing ? `/api/admin/testimonials/${editing.id}` : '/api/admin/testimonials';
    const method = editing ? 'PATCH' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { closeForm(); fetchItems(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
    fetchItems();
  }

  async function toggleActive(item: Testimonial) {
    await fetch(`/api/admin/testimonials/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) });
    fetchItems();
  }

  const showForm = creating || editing;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground text-sm">Manage client testimonials.</p>
        </div>
        {!showForm && <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add Testimonial</Button>}
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Client Name" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} />
              <Input label="Service" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} placeholder="e.g. Physiotherapy" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))} className="p-1">
                    <Star className={`h-6 w-6 ${n <= form.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Comment</label>
              <textarea rows={3} value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded border-border" />
              <span className="text-sm text-foreground">Visible on website</span>
            </label>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving || !form.clientName || !form.comment}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</Button>
              <Button variant="outline" onClick={closeForm}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <Card><p className="text-center text-muted-foreground py-8">No testimonials yet.</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => (
            <Card key={item.id}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{item.clientName}</h3>
                    <Badge variant={item.isActive ? 'success' : 'warning'}>{item.isActive ? 'Visible' : 'Hidden'}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.service}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(item)} className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-muted">
                    {item.isActive ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 text-muted-foreground hover:text-primary rounded hover:bg-muted"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-muted-foreground hover:text-danger rounded hover:bg-muted"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <Star key={n} className={`h-4 w-4 ${n <= item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{item.comment}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
