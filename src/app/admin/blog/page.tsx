'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { Plus, Pencil, Trash2, Eye, EyeOff, X } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl: string | null;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
}

const CATEGORIES = ['health', 'fitness', 'nutrition', 'physiotherapy', 'wellness', 'aesthetics', 'lifestyle'];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '', slug: '', excerpt: '', content: '', author: '',
    category: 'health', tags: '', imageUrl: '', isPublished: true,
  });

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch('/api/admin/blog');
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ title: '', slug: '', excerpt: '', content: '', author: '', category: 'health', tags: '', imageUrl: '', isPublished: true });
    setCreating(true);
  }

  function openEdit(post: BlogPost) {
    setCreating(false);
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      tags: post.tags.join(', '),
      imageUrl: post.imageUrl || '',
      isPublished: post.isPublished,
    });
  }

  function closeForm() {
    setEditing(null);
    setCreating(false);
  }

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleSave() {
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl: form.imageUrl || undefined,
    };

    const url = editing ? `/api/admin/blog/${editing.id}` : '/api/admin/blog';
    const method = editing ? 'PATCH' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      closeForm();
      fetchPosts();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' });
    fetchPosts();
  }

  async function togglePublish(post: BlogPost) {
    await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !post.isPublished }),
    });
    fetchPosts();
  }

  const showForm = creating || editing;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground text-sm">Manage your blog content.</p>
        </div>
        {!showForm && (
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" /> New Post
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">{editing ? 'Edit Post' : 'New Post'}</h2>
            <button onClick={closeForm} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title" value={form.title} onChange={e => { setForm(f => ({ ...f, title: e.target.value, slug: !editing ? generateSlug(e.target.value) : f.slug })); }} />
              <Input label="Slug" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Author" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <Input label="Tags (comma separated)" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
            </div>
            <Input label="Excerpt" value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Content</label>
              <textarea rows={8} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <Input label="Image URL (optional)" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="rounded border-border" />
              <span className="text-sm text-foreground">Published</span>
            </label>
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving || !form.title || !form.slug || !form.excerpt || !form.content}>
                {saving ? 'Saving...' : editing ? 'Update Post' : 'Create Post'}
              </Button>
              <Button variant="outline" onClick={closeForm}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : posts.length === 0 ? (
        <Card>
          <p className="text-center text-muted-foreground py-8">No blog posts yet. Create your first post!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <Card key={post.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    <Badge variant={post.isPublished ? 'success' : 'warning'}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                    <Badge variant="primary">{post.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>By {post.author}</span>
                    <span>Slug: /{post.slug}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button onClick={() => togglePublish(post)} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted" title={post.isPublished ? 'Unpublish' : 'Publish'}>
                    {post.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button onClick={() => openEdit(post)} className="p-2 text-muted-foreground hover:text-primary rounded-lg hover:bg-muted">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="p-2 text-muted-foreground hover:text-danger rounded-lg hover:bg-muted">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
