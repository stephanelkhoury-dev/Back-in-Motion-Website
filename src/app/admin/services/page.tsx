import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Plus, Edit, ToggleLeft } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

export default function AdminServicesPage() {
  const serviceStats = [
    { name: 'Physiotherapy', bookings: 124, revenue: '$18,600', active: true },
    { name: 'Dietitian / Nutrition', bookings: 89, revenue: '$10,680', active: true },
    { name: 'LPG & Body Shaping', bookings: 67, revenue: '$13,400', active: true },
    { name: 'Electrolysis Hair Removal', bookings: 43, revenue: '$6,450', active: true },
    { name: 'Gym & Fitness', bookings: 56, revenue: '$5,600', active: true },
  ];

  const categoryColors: Record<string, string> = {
    'Physiotherapy': 'bg-teal-50 text-teal-700 border-teal-200',
    'Dietitian / Nutrition': 'bg-green-50 text-green-700 border-green-200',
    'LPG & Body Shaping': 'bg-purple-50 text-purple-700 border-purple-200',
    'Electrolysis Hair Removal': 'bg-pink-50 text-pink-700 border-pink-200',
    'Gym & Fitness': 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground text-sm">Manage service categories and offerings.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-1" /> Add Service</Button>
      </div>

      {/* Service Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {SERVICES.map((service, i) => (
          <Card key={service.id} hover>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-foreground">{service.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{service.description.substring(0, 80)}...</p>
                </div>
                <Badge variant={serviceStats[i]?.active ? 'success' : 'danger'}>
                  {serviceStats[i]?.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Bookings</p>
                  <p className="font-semibold text-foreground">{serviceStats[i]?.bookings}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="font-semibold text-foreground">{serviceStats[i]?.revenue}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                <span>Duration: {service.duration} min</span>
                <span>From ${service.price}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm">
                  <ToggleLeft className="h-3 w-3 mr-1" /> Toggle
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Service Pricing Table */}
      <h2 className="text-lg font-semibold text-foreground mb-3">Pricing Overview</h2>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Base Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">This Month</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {SERVICES.map((service, i) => (
                <tr key={service.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{service.name}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full border ${categoryColors[service.name] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                      {service.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{service.duration} min</td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">${service.price}</td>
                  <td className="py-3 px-4 text-sm text-foreground">{serviceStats[i]?.bookings} bookings</td>
                  <td className="py-3 px-4"><Badge variant="success">Active</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
