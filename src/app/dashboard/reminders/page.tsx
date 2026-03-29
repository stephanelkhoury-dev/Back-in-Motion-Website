import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Bell, Calendar, Dumbbell, Clock, CreditCard, Bot } from 'lucide-react';

export default function RemindersPage() {
  const reminders = [
    { type: 'appointment', icon: Calendar, message: 'Physiotherapy session tomorrow at 10:00 AM with Dr. Nicolas Khoury', time: '1 hour ago', read: false },
    { type: 'exercise', icon: Dumbbell, message: 'You have 3 exercises to complete today — don\'t break your streak!', time: '3 hours ago', read: false },
    { type: 'session_balance', icon: Clock, message: 'You have 4 body shaping sessions remaining (expires in 25 days)', time: '1 day ago', read: true },
    { type: 'follow_up', icon: Bell, message: 'Time for your dietitian follow-up. Book your next consultation.', time: '2 days ago', read: true },
    { type: 'subscription', icon: CreditCard, message: 'Your E-Coach subscription renews on April 1 ($29/month)', time: '3 days ago', read: true },
    { type: 'ecoach', icon: Bot, message: 'Your E-Coach has generated a new weekly plan. Check it out!', time: '4 days ago', read: true },
    { type: 'package_expiry', icon: Clock, message: 'Your Physio 10 Sessions package expires in 60 days', time: '5 days ago', read: true },
  ];

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
