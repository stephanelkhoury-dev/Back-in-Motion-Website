import { Calendar, Dumbbell, CreditCard, TrendingUp, Clock, Bell, Bot, ArrowRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser, getClientAppointments, getClientSubscriptions, getClientReminders, getClientExerciseAssignments } from '@/lib/data';

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect('/auth/signin');

  const [appointments, subscriptions, remindersData, assignments] = await Promise.all([
    getClientAppointments(user.id),
    getClientSubscriptions(user.id),
    getClientReminders(user.id),
    getClientExerciseAssignments(user.id),
  ]);

  const upcomingAppointments = appointments
    .filter((a) => ['scheduled', 'confirmed'].includes(a.status))
    .slice(0, 3);

  const totalSessionsRemaining = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + (s.sessionsTotal - s.sessionsUsed), 0);

  const stats = [
    { label: 'Upcoming Appointments', value: String(upcomingAppointments.length), icon: Calendar, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Sessions Remaining', value: String(totalSessionsRemaining), icon: Clock, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Exercises Assigned', value: String(assignments.length), icon: Dumbbell, color: 'text-secondary', bg: 'bg-secondary/10' },
    { label: 'Active Subscriptions', value: String(subscriptions.filter((s) => s.status === 'active').length), icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  const sessionBalance = subscriptions
    .filter((s) => s.status === 'active')
    .map((s) => ({
      name: s.package.name,
      purchased: s.sessionsTotal,
      completed: s.sessionsUsed,
      remaining: s.sessionsTotal - s.sessionsUsed,
    }));

  const reminders = remindersData.slice(0, 3).map((r) => ({
    type: r.type,
    message: r.message,
    time: new Date(r.scheduledAt).toLocaleDateString(),
  }));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your wellness journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mr-4`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Appointments</h2>
              <Link href="/dashboard/appointments" className="text-sm text-primary font-medium flex items-center">
                View all <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.map((appt) => (
                <div key={appt.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium text-foreground text-sm">{appt.service.name}</p>
                    <p className="text-xs text-muted-foreground">{appt.practitioner.firstName} {appt.practitioner.lastName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">{new Date(appt.date).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{appt.startTime}</p>
                  </div>
                  <Badge variant={appt.status === 'confirmed' ? 'success' : 'primary'}>
                    {appt.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Reminders */}
        <div>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Reminders</h2>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              {reminders.map((reminder, i) => (
                <div key={i} className="flex items-start p-3 bg-muted rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">{reminder.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{reminder.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Session Balance + E-Coach */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <h2 className="text-lg font-semibold text-foreground mb-4">Session Balance</h2>
          <div className="space-y-4">
            {sessionBalance.length === 0 && (
              <p className="text-sm text-muted-foreground">No active subscriptions.</p>
            )}
            {sessionBalance.map((sub) => (
              <div key={sub.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground font-medium">{sub.name}</span>
                  <span className="text-muted-foreground">{sub.completed}/{sub.purchased}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{ width: `${sub.purchased > 0 ? (sub.completed / sub.purchased) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{sub.remaining} sessions remaining</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <div className="flex items-center mb-3">
            <Bot className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-lg font-semibold text-foreground">E-Coach AI</h2>
            <Badge variant="success" className="ml-2">Active</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Your AI coach has generated today&apos;s workout plan. Complete your exercises to maintain your streak!
          </p>
          <div className="flex items-center justify-between mb-4 text-sm">
            <span className="text-muted-foreground">Today&apos;s exercises</span>
            <span className="font-medium text-foreground">3 of 5 completed</span>
          </div>
          <div className="w-full bg-white rounded-full h-2 mb-4">
            <div className="bg-primary rounded-full h-2" style={{ width: '60%' }} />
          </div>
          <Link href="/dashboard/e-coach">
            <Button size="sm" className="w-full">
              Continue Workout <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
