import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PACKAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Packages & Pricing | Nicolas Web',
  description: 'Flexible wellness packages: physiotherapy bundles, dietitian plans, body shaping, hair removal, gym memberships, and E-Coach AI.',
};

const CATEGORY_LABELS: Record<string, string> = {
  physio: 'Physiotherapy',
  dietitian: 'Nutrition',
  aesthetic: 'Aesthetics',
  electrolysis: 'Hair Removal',
  gym: 'Gym & Fitness',
};

export default function PackagesPage() {
  const categories = [...new Set(PACKAGES.map((p) => p.category))];

  return (
    <>
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Packages & Pricing</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Flexible plans designed for every need and budget. Single sessions, bundles, monthly subscriptions,
              and hybrid packages with AI E-Coach support.
            </p>
          </div>
        </div>
      </section>

      {categories.map((cat) => {
        const catPackages = PACKAGES.filter((p) => p.category === cat);
        return (
          <section key={cat} className="py-16 bg-white even:bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">{CATEGORY_LABELS[cat] || cat}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catPackages.map((pkg) => (
                  <Card key={pkg.id} hover className="relative h-full flex flex-col">
                    {pkg.isPopular && <Badge variant="primary" className="absolute top-4 right-4">Popular</Badge>}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{pkg.type}</Badge>
                      {pkg.includesECoach && <Badge variant="success" className="text-xs">+ E-Coach</Badge>}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{pkg.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-primary">${pkg.price}</span>
                      {pkg.type === 'monthly' && <span className="text-muted-foreground text-sm">/month</span>}
                    </div>
                    <div className="text-xs text-muted-foreground mb-4">
                      {pkg.totalSessions > 0 && `${pkg.totalSessions} sessions • `}
                      Valid {pkg.validityDays} days
                    </div>
                    <ul className="space-y-2 mb-6 flex-1">
                      {pkg.features.map((f) => (
                        <li key={f} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href="/book">
                      <Button className="w-full" variant={pkg.isPopular ? 'primary' : 'outline'}>
                        Get Started
                      </Button>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="py-16 gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Not Sure Which Package?</h2>
          <p className="text-lg text-gray-200 mb-8">
            Contact us for a personalized recommendation based on your goals and needs.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Contact Us</Button>
            </Link>
            <Link href="/book">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Book Consultation</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
