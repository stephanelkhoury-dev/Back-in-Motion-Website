'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Building2, Users, BarChart3, Settings, LogOut, Shield
} from 'lucide-react';

const SUPER_ADMIN_LINKS = [
  { label: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
  { label: 'Organizations', href: '/super-admin/organizations', icon: Building2 },
  { label: 'All Users', href: '/super-admin/users', icon: Users },
  { label: 'Platform Analytics', href: '/super-admin/analytics', icon: BarChart3 },
  { label: 'Platform Settings', href: '/super-admin/settings', icon: Settings },
];

export default function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center mr-3">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium text-white text-sm">Super Admin</p>
            <p className="text-xs text-gray-400">Platform Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {SUPER_ADMIN_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-amber-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="h-4 w-4 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/admin"
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <LayoutDashboard className="h-4 w-4 mr-3" />
          Go to Admin Panel
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
