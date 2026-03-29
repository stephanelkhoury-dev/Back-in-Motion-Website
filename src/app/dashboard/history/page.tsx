import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { redirect } from 'next/navigation';
import { getSessionUser, getClientAppointments } from '@/lib/data';

export default async function HistoryPage() {
  const user = await getSessionUser();
  if (!user) redirect('/auth/signin');

  const rawAppointments = await getClientAppointments(user.id);
  const completedAppointments = rawAppointments.filter((a) => a.status === 'completed');

  const treatmentHistory = completedAppointments.map((a) => ({
    date: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    service: a.service.name,
    specialist: `${a.practitioner.firstName} ${a.practitioner.lastName}`,
    notes: a.notes || 'No notes recorded.',
    painBefore: null as number | null,
    painAfter: null as number | null,
  }));

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Treatment History</h1>
        <p className="text-muted-foreground text-sm">Full timeline of your treatments and sessions.</p>
      </div>

      <div className="space-y-4">
        {treatmentHistory.map((entry, i) => (
          <Card key={i}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="primary">{entry.service}</Badge>
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                </div>
                <p className="text-sm text-foreground font-medium mb-1">{entry.specialist}</p>
                <p className="text-sm text-muted-foreground">{entry.notes}</p>
              </div>
              {entry.painBefore !== null && (
                <div className="flex gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pain Before</p>
                    <span className="text-lg font-bold text-danger">{entry.painBefore}/10</span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pain After</p>
                    <span className="text-lg font-bold text-success">{entry.painAfter}/10</span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
