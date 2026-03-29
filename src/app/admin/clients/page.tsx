import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Search, Plus } from 'lucide-react';

export default function AdminClientsPage() {
  const clients = [
    { id: 'C-001', name: 'Rami Saleh', email: 'rami@example.com', phone: '+961 71 123 456', joined: 'Jan 15, 2026', activePackages: 2, sessions: 14, lastVisit: 'Mar 25, 2026' },
    { id: 'C-002', name: 'Diana Mansour', email: 'diana@example.com', phone: '+961 70 234 567', joined: 'Feb 1, 2026', activePackages: 1, sessions: 8, lastVisit: 'Mar 22, 2026' },
    { id: 'C-003', name: 'Lea Khoury', email: 'lea@example.com', phone: '+961 76 345 678', joined: 'Feb 10, 2026', activePackages: 1, sessions: 4, lastVisit: 'Mar 18, 2026' },
    { id: 'C-004', name: 'Jad Haddad', email: 'jad@example.com', phone: '+961 03 456 789', joined: 'Mar 1, 2026', activePackages: 2, sessions: 6, lastVisit: 'Mar 20, 2026' },
    { id: 'C-005', name: 'Nadia Abboud', email: 'nadia@example.com', phone: '+961 78 567 890', joined: 'Mar 5, 2026', activePackages: 1, sessions: 3, lastVisit: 'Mar 20, 2026' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground text-sm">Manage client accounts and history.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> Add Client</Button>
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="search" placeholder="Search clients..." className="pl-10" />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Joined</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Packages</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total Sessions</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Visit</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-primary">{c.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-foreground">{c.email}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{c.joined}</td>
                  <td className="py-3 px-4"><Badge variant="primary">{c.activePackages} active</Badge></td>
                  <td className="py-3 px-4 text-sm text-foreground">{c.sessions}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{c.lastVisit}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
