'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Calendar, Dumbbell, TrendingUp, History,
  Bot, FileText, CreditCard, Bell, Settings, LogOut, User
} from 'lucide-react';

const SIDEBAR_LINKS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { label: 'Exercises', href: '/dashboard/exercises', icon: Dumbbell },
  { label: 'Progress', href: '/dashboard/progress', icon: TrendingUp },
  { label: 'Treatment History', href: '/dashboard/history', icon: History },
  { label: 'E-Coach', href: '/dashboard/e-coach', icon: Bot },
  { label: 'Documents', href: '/dashboard/documents', icon: FileText },
  { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { label: 'Reminders', href: '/dashboard/reminders', icon: Bell },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-border min-h-screen flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">Welcome back</p>
            <p className="text-xs text-muted-foreground">Client Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {SIDEBAR_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4 mr-3" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
