import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function HistoryPage() {
  const treatmentHistory = [
    { date: 'Mar 25, 2026', service: 'Physiotherapy', specialist: 'Dr. Nicolas Khoury', notes: 'Knee rehab session 3. ROM improved to 120 degrees. Progressing well.', painBefore: 5, painAfter: 3 },
    { date: 'Mar 22, 2026', service: 'Dietitian', specialist: 'Sarah Mansour', notes: 'Follow-up consultation. Weight down 1.5kg. Adjusted meal plan for more protein.', painBefore: null, painAfter: null },
    { date: 'Mar 20, 2026', service: 'Electrolysis', specialist: 'Nour Khalil', notes: 'Session 3 of 6 for underarm area. Good reduction visible.', painBefore: null, painAfter: null },
    { date: 'Mar 18, 2026', service: 'Body Shaping (LPG)', specialist: 'Lara Haddad', notes: 'Session 4 of 8. Abdomen and thigh treatment. Measurements updated.', painBefore: null, painAfter: null },
    { date: 'Mar 15, 2026', service: 'Physiotherapy', specialist: 'Dr. Nicolas Khoury', notes: 'Knee rehab session 2. Started resistance exercises. Pain decreasing.', painBefore: 6, painAfter: 4 },
    { date: 'Mar 12, 2026', service: 'Gym (PT Session)', specialist: 'Ahmad Rizk', notes: 'Functional fitness assessment. Designed initial program focusing on lower body.', painBefore: null, painAfter: null },
    { date: 'Mar 10, 2026', service: 'Physiotherapy', specialist: 'Dr. Nicolas Khoury', notes: 'Initial assessment. Post-ACL reconstruction. Treatment plan created.', painBefore: 7, painAfter: 5 },
  ];

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
