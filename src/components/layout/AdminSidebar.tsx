'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Calendar, Users, Stethoscope, Package,
  CreditCard, BarChart3, Settings, LogOut, Tag, Bell, Megaphone
} from 'lucide-react';

const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Staff', href: '/admin/staff', icon: Stethoscope },
  { label: 'Services', href: '/admin/services', icon: Tag },
  { label: 'Packages', href: '/admin/packages', icon: Package },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Reminders', href: '/admin/reminders', icon: Bell },
  { label: 'Promotions', href: '/admin/promotions', icon: Megaphone },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-foreground text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xs">N</span>
          </div>
          <div>
            <p className="font-medium text-white text-sm">Nicolas Web</p>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {ADMIN_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="h-4 w-4 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
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
