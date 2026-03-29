import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Bell, Calendar, Dumbbell, Clock, CreditCard, Bot } from 'lucide-react';
import { redirect } from 'next/navigation';
import { getSessionUser, getClientReminders } from '@/lib/data';

const iconMap: Record<string, typeof Bell> = {
  appointment: Calendar,
  exercise: Dumbbell,
  session_balance: Clock,
  follow_up: Bell,
  subscription_renewal: CreditCard,
  package_expiry: Clock,
};

export default async function RemindersPage() {
  const user = await getSessionUser();
  if (!user) redirect('/auth/signin');

  const rawReminders = await getClientReminders(user.id);
  const reminders = rawReminders.map((r) => ({
    type: r.type,
    icon: iconMap[r.type] || Bell,
    message: r.message,
    time: new Date(r.scheduledAt).toLocaleDateString(),
    read: r.isRead,
  }));

  const typeColors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default'> = {
    appointment: 'primary',
    exercise: 'success',
    session_balance: 'warning',
    follow_up: 'primary',
    subscription: 'default',
    ecoach: 'success',
    package_expiry: 'warning',
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reminders</h1>
        <p className="text-muted-foreground text-sm">Your notifications and wellness reminders.</p>
      </div>

      <div className="space-y-3">
        {reminders.map((r, i) => {
          const Icon = r.icon;
          return (
            <Card key={i} className={`${!r.read ? 'bg-primary/5 border-primary/20' : ''}`}>
              <div className="flex items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                  !r.read ? 'bg-primary/10' : 'bg-muted'
                }`}>
                  <Icon className={`h-5 w-5 ${!r.read ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className={`text-sm ${!r.read ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {r.message}
                    </p>
                    {!r.read && <div className="w-2 h-2 rounded-full bg-primary ml-2 mt-1 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={typeColors[r.type] || 'default'} className="text-[10px]">{r.type.replace('_', ' ')}</Badge>
                    <span className="text-xs text-muted-foreground">{r.time}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
