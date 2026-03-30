'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Calendar, Users, Stethoscope, Package,
  CreditCard, BarChart3, Settings, LogOut, Tag, Bell, Megaphone, Shield, UserCog,
  Wallet, FileText, PenSquare, HelpCircle, MessageSquare
} from 'lucide-react';

const ADMIN_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { label: 'Team & Users', href: '/admin/users', icon: UserCog },
  { label: 'Clients', href: '/admin/clients', icon: Users },
  { label: 'Staff', href: '/admin/staff', icon: Stethoscope },
  { label: 'Services', href: '/admin/services', icon: Tag },
  { label: 'Packages', href: '/admin/packages', icon: Package },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Finance', href: '/admin/finance', icon: Wallet },
  { label: 'Pages & Nav', href: '/admin/pages', icon: FileText },
  { label: 'Blog Posts', href: '/admin/blog', icon: PenSquare },
  { label: 'FAQs', href: '/admin/faq', icon: HelpCircle },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
  { label: 'Reminders', href: '/admin/reminders', icon: Bell },
  { label: 'Promotions', href: '/admin/promotions', icon: Megaphone },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as unknown as { role?: string })?.role;

  return (
    <aside className="w-64 bg-foreground text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center">
          <img src="/logo.png" alt="Back in Motion" width={32} height={32} className="w-8 h-8 mr-3" />
          <div>
            <p className="font-medium text-white text-sm">Back in Motion</p>
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

      <div className="p-3 border-t border-white/10 space-y-1">
        {role === 'super_admin' && (
          <Link
            href="/super-admin"
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-white/10 transition-colors"
          >
            <Shield className="h-4 w-4 mr-3" />
            Super Admin
          </Link>
        )}
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
