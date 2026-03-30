'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  FileText, Plus, Eye, EyeOff, Navigation, GripVertical, Pencil,
  Trash2, ExternalLink, ChevronRight, Globe, Search
} from 'lucide-react';

interface PageItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  showInNav: boolean;
  navOrder: number;
  navParentId: string | null;
  icon: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  children?: PageItem[];
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_PAGES = [
  { title: 'Home', slug: '/', icon: 'Home' },
  { title: 'About', slug: 'about', icon: 'Info' },
  { title: 'Services', slug: 'services', icon: 'Stethoscope' },
  { title: 'E-Coach', slug: 'e-coach', icon: 'Bot' },
  { title: 'Packages', slug: 'packages', icon: 'Package' },
  { title: 'Team', slug: 'team', icon: 'Users' },
  { title: 'Blog', slug: 'blog', icon: 'BookOpen' },
  { title: 'FAQ', slug: 'faq', icon: 'HelpCircle' },
  { title: 'Contact', slug: 'contact', icon: 'Mail' },
];

const SERVICE_SUBPAGES = [
  { title: 'Physiotherapy', slug: 'services/physio' },
  { title: 'Dietitian', slug: 'services/dietitian' },
  { title: 'Body Shaping (LPG/Cavitation)', slug: 'services/lpg-body-shaping' },
  { title: 'Electrolysis Hair Removal', slug: 'services/electrolysis' },
  { title: 'Gym & Training', slug: 'services/gym' },
];

export default function CMSPagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    title: '', slug: '', description: '', isActive: true, showInNav: true,
    navOrder: 0, navParentId: '', icon: '', metaTitle: '', metaDescription: '',
  });

  useEffect(() => { loadPages(); }, []);

  async function loadPages() {
    setLoading(true);
    const res = await fetch('/api/admin/pages');
    if (res.ok) setPages(await res.json());
    setLoading(false);
  }

  async function initializePages() {
    // Create all default pages that don't exist yet
    const existingSlugs = pages.map(p => p.slug);
    let servicesPage: PageItem | null = null;

    for (let i = 0; i < DEFAULT_PAGES.length; i++) {
      const dp = DEFAULT_PAGES[i];
      if (!existingSlugs.includes(dp.slug)) {
        const res = await fetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: dp.title, slug: dp.slug, icon: dp.icon,
            isActive: true, showInNav: true, navOrder: i,
            description: `${dp.title} page`,
          }),
        });
        if (res.ok) {
          const created = await res.json();
          if (dp.slug === 'services') servicesPage = created;
        }
      } else if (dp.slug === 'services') {
        servicesPage = pages.find(p => p.slug === 'services') || null;
      }
    }

    // Create service subpages
    if (servicesPage) {
      for (let i = 0; i < SERVICE_SUBPAGES.length; i++) {
        const sp = SERVICE_SUBPAGES[i];
        if (!existingSlugs.includes(sp.slug)) {
          await fetch('/api/admin/pages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: sp.title, slug: sp.slug,
              isActive: true, showInNav: true, navOrder: i,
              navParentId: servicesPage.id,
              description: `${sp.title} service page`,
            }),
          });
        }
      }
    }

    await loadPages();
  }

  function startEdit(page: PageItem) {
    setEditingId(page.id);
    setForm({
      title: page.title, slug: page.slug, description: page.description || '',
      isActive: page.isActive, showInNav: page.showInNav, navOrder: page.navOrder,
      navParentId: page.navParentId || '', icon: page.icon || '',
      metaTitle: page.metaTitle || '', metaDescription: page.metaDescription || '',
    });
    setShowForm(true);
  }

  function startNew() {
    setEditingId(null);
    setForm({
      title: '', slug: '', description: '', isActive: true, showInNav: true,
      navOrder: pages.length, navParentId: '', icon: '', metaTitle: '', metaDescription: '',
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editingId ? `/api/admin/pages/${editingId}` : '/api/admin/pages';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        navParentId: form.navParentId || null,
      }),
    });

    if (res.ok) {
      setShowForm(false);
      setEditingId(null);
      loadPages();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to save');
    }
  }

  async function toggleActive(page: PageItem) {
    await fetch(`/api/admin/pages/${page.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !page.isActive }),
    });
    loadPages();
  }

  async function toggleNav(page: PageItem) {
    await fetch(`/api/admin/pages/${page.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showInNav: !page.showInNav }),
    });
    loadPages();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this page? This will also remove it from navigation.')) return;
    await fetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
    loadPages();
  }

  const topPages = pages.filter(p => !p.navParentId);
  const filteredPages = search
    ? pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase()))
    : topPages;

  const parentOptions = pages.filter(p => !p.navParentId);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pages & Navigation</h1>
          <p className="text-muted-foreground text-sm">Manage website pages, toggle visibility, and control navigation.</p>
        </div>
        <div className="flex gap-2">
          {pages.length === 0 && (
            <Button variant="outline" size="sm" onClick={initializePages}>
              <Globe className="h-4 w-4 mr-1" /> Initialize Default Pages
            </Button>
          )}
          <Button size="sm" onClick={startNew}>
            <Plus className="h-4 w-4 mr-1" /> Add Page
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search pages..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
        />
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-base font-semibold text-foreground">{editingId ? 'Edit Page' : 'New Page'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: f.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  placeholder="e.g. About Us"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">URL Slug</label>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-muted-foreground">/</span>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                    placeholder="about-us"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  placeholder="Brief page description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Parent Page (for submenu)</label>
                <select
                  value={form.navParentId}
                  onChange={e => setForm(f => ({ ...f, navParentId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                >
                  <option value="">None (top-level)</option>
                  {parentOptions.filter(p => p.id !== editingId).map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nav Order</label>
                <input
                  type="number"
                  value={form.navOrder}
                  onChange={e => setForm(f => ({ ...f, navOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Icon Name (Lucide)</label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  placeholder="e.g. Home, Users, Package"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">SEO Title</label>
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  placeholder="Browser tab title"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-1">SEO Description</label>
                <input
                  type="text"
                  value={form.metaDescription}
                  onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm"
                  placeholder="Search engine description"
                />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-foreground">Page Active</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.showInNav}
                  onChange={e => setForm(f => ({ ...f, showInNav: e.target.checked }))}
                  className="h-4 w-4 rounded border-border"
                />
                <span className="text-sm text-foreground">Show in Navigation</span>
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">{editingId ? 'Save Changes' : 'Create Page'}</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Active Navigation Preview */}
      <Card className="mb-6">
        <h3 className="text-base font-semibold text-foreground mb-3">Navigation Preview</h3>
        <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
          {topPages.filter(p => p.isActive && p.showInNav).sort((a, b) => a.navOrder - b.navOrder).map(page => (
            <div key={page.id} className="relative group">
              <span className="px-3 py-1.5 text-sm font-medium text-foreground bg-background rounded-lg border border-border inline-flex items-center gap-1">
                {page.title}
                {page.children && page.children.filter(c => c.isActive && c.showInNav).length > 0 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                )}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Pages List */}
      {loading ? (
        <Card><div className="h-40 animate-pulse bg-muted rounded" /></Card>
      ) : pages.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Pages Yet</h3>
            <p className="text-muted-foreground mb-4">Click &quot;Initialize Default Pages&quot; to set up your website pages.</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Page</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">URL</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Order</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">In Nav</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.sort((a, b) => a.navOrder - b.navOrder).map(page => (
                  <>
                    <tr key={page.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{page.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono text-xs">/{page.slug}</td>
                      <td className="py-3 px-4 text-foreground">{page.navOrder}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => toggleActive(page)} className="cursor-pointer">
                          <Badge variant={page.isActive ? 'success' : 'danger'}>
                            {page.isActive ? 'Active' : 'Disabled'}
                          </Badge>
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <button onClick={() => toggleNav(page)} className="cursor-pointer">
                          {page.showInNav ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600"><Eye className="h-3 w-3" /> Visible</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><EyeOff className="h-3 w-3" /> Hidden</span>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEdit(page)} className="text-xs text-primary hover:underline cursor-pointer">Edit</button>
                          <button onClick={() => handleDelete(page.id)} className="text-xs text-red-600 hover:underline cursor-pointer">Delete</button>
                        </div>
                      </td>
                    </tr>
                    {/* Children */}
                    {!search && page.children && page.children.map(child => (
                      <tr key={child.id} className="border-b border-border/50 hover:bg-muted/50 bg-muted/20">
                        <td className="py-2 px-4 pl-10">
                          <div className="flex items-center gap-2">
                            <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            <span className="text-foreground">{child.title}</span>
                          </div>
                        </td>
                        <td className="py-2 px-4 text-muted-foreground font-mono text-xs">/{child.slug}</td>
                        <td className="py-2 px-4 text-foreground">{child.navOrder}</td>
                        <td className="py-2 px-4">
                          <button onClick={() => toggleActive(child)} className="cursor-pointer">
                            <Badge variant={child.isActive ? 'success' : 'danger'}>
                              {child.isActive ? 'Active' : 'Disabled'}
                            </Badge>
                          </button>
                        </td>
                        <td className="py-2 px-4">
                          <button onClick={() => toggleNav(child)} className="cursor-pointer">
                            {child.showInNav ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600"><Eye className="h-3 w-3" /> Visible</span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><EyeOff className="h-3 w-3" /> Hidden</span>
                            )}
                          </button>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEdit(child)} className="text-xs text-primary hover:underline cursor-pointer">Edit</button>
                            <button onClick={() => handleDelete(child.id)} className="text-xs text-red-600 hover:underline cursor-pointer">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
