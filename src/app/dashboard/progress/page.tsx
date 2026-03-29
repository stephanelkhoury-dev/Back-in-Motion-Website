import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function ProgressPage() {
  const metrics = [
    { label: 'Pain Level', current: 3, previous: 5, unit: '/10', trend: 'down' },
    { label: 'Mobility Score', current: 78, previous: 65, unit: '%', trend: 'up' },
    { label: 'Exercise Compliance', current: 85, previous: 72, unit: '%', trend: 'up' },
    { label: 'Weight', current: 72.5, previous: 74, unit: 'kg', trend: 'down' },
    { label: 'Body Fat', current: 22, previous: 24, unit: '%', trend: 'down' },
    { label: 'BMI', current: 23.5, previous: 24.1, unit: '', trend: 'down' },
  ];

  const bodyMeasurements = [
    { area: 'Waist', current: 82, previous: 86, unit: 'cm' },
    { area: 'Hips', current: 96, previous: 98, unit: 'cm' },
    { area: 'Chest', current: 95, previous: 95, unit: 'cm' },
    { area: 'Right Arm', current: 32, previous: 31, unit: 'cm' },
    { area: 'Right Thigh', current: 55, previous: 57, unit: 'cm' },
  ];

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-primary" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Progress Tracking</h1>
        <p className="text-muted-foreground text-sm">Track your wellness metrics over time.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <TrendIcon trend={metric.trend} />
            </div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-foreground">{metric.current}</span>
              <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Previous: {metric.previous}{metric.unit}
            </p>
          </Card>
        ))}
      </div>

      {/* Body Measurements */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Body Measurements</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Area</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Current</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Previous</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-muted-foreground">Change</th>
              </tr>
            </thead>
            <tbody>
              {bodyMeasurements.map((m) => {
                const change = m.current - m.previous;
                return (
                  <tr key={m.area} className="border-b border-border last:border-0">
                    <td className="py-2 px-3 text-sm font-medium text-foreground">{m.area}</td>
                    <td className="py-2 px-3 text-sm text-foreground">{m.current} {m.unit}</td>
                    <td className="py-2 px-3 text-sm text-muted-foreground">{m.previous} {m.unit}</td>
                    <td className="py-2 px-3">
                      <Badge variant={change < 0 ? 'success' : change > 0 ? 'warning' : 'default'}>
                        {change > 0 ? '+' : ''}{change} {m.unit}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Progress Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-foreground mb-4">Pain Level Over Time</h3>
          <div className="h-48 bg-muted rounded-xl flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Chart visualization</p>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-foreground mb-4">Exercise Compliance</h3>
          <div className="h-48 bg-muted rounded-xl flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Chart visualization</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
