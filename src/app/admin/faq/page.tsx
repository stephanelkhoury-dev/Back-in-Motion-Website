'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

const CATEGORIES = ['general', 'booking', 'payments', 'services', 'packages', 'account'];

export default function AdminFAQPage() {
  const [items, setItems] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', category: 'general', sortOrder: 0, isActive: true });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch('/api/admin/faq');
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ question: '', answer: '', category: 'general', sortOrder: items.length, isActive: true });
    setCreating(true);
  }

  function openEdit(item: FAQItem) {
    setCreating(false);
    setEditing(item);
    setForm({ question: item.question, answer: item.answer, category: item.category, sortOrder: item.sortOrder, isActive: item.isActive });
  }

  function closeForm() { setEditing(null); setCreating(false); }

  async function handleSave() {
    setSaving(true);
    const url = editing ? `/api/admin/faq/${editing.id}` : '/api/admin/faq';
    const method = editing ? 'PATCH' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { closeForm(); fetchItems(); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    await fetch(`/api/admin/faq/${id}`, { method: 'DELETE' });
    fetchItems();
  }

  async function toggleActive(item: FAQItem) {
    await fetch(`/api/admin/faq/${item.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !item.isActive }) });
    fetchItems();
  }

  const showForm = creating || editing;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">FAQ Management</h1>
          <p className="text-muted-foreground text-sm">Manage frequently asked questions.</p>
        </div>
        {!showForm && <Button onClick={openCreate}><Plus className="h-4 w-4 mr-1" /> Add FAQ</Button>}
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{editing ? 'Edit FAQ' : 'New FAQ'}</h2>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>
          <div className="space-y-4">
            <Input label="Question" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Answer</label>
              <textarea rows={4} value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <Input label="Sort Order" type="number" value={String(form.sortOrder)} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded border-border" />
              <span className="text-sm text-foreground">Active</span>
            </label>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving || !form.question || !form.answer}>{saving ? 'Saving...' : editing ? 'Update FAQ' : 'Create FAQ'}</Button>
              <Button variant="outline" onClick={closeForm}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <Card><p className="text-center text-muted-foreground py-8">No FAQs yet.</p></Card>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{item.question}</h3>
                    <Badge variant={item.isActive ? 'success' : 'warning'}>{item.isActive ? 'Active' : 'Hidden'}</Badge>
                    <Badge variant="primary">{item.category}</Badge>
                    <span className="text-xs text-muted-foreground">Order: {item.sortOrder}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.answer}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => toggleActive(item)} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted" title={item.isActive ? 'Hide' : 'Show'}>
                    {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-muted-foreground hover:text-danger rounded-lg hover:bg-muted"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
