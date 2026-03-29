import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Sparkles, Ruler, Camera, ClipboardList, Timer, TrendingUp } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { AESTHETIC_TREATMENTS, PACKAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Body Shaping & Aesthetics | Nicolas Web',
  description: 'LPG endermologie, cavitation, body firming, lymphatic drainage, and post-pregnancy aesthetic treatments.',
};

export default function LPGBodyShapingPage() {
  const features = [
    { icon: ClipboardList, title: 'Package Selection', description: 'Choose from targeted body area packages or full-body programs.' },
    { icon: Sparkles, title: 'Target Area Selection', description: 'Focus on specific areas: abdomen, thighs, arms, or full body.' },
    { icon: Timer, title: 'Session Counter', description: 'Track your purchased, completed, and remaining sessions in real time.' },
    { icon: Camera, title: 'Before/After Media', description: 'Visual documentation of your transformation with secure photo storage.' },
    { icon: Ruler, title: 'Body Measurement Tracking', description: 'Precise measurements tracked over time to show real results.' },
    { icon: TrendingUp, title: 'Visual Progress Timeline', description: 'See your body transformation journey in a beautiful timeline view.' },
  ];

  const aestheticPackages = PACKAGES.filter((p) => p.category === 'aesthetic');

  return (
    <>
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-4">Aesthetics</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Body Shaping & Aesthetics</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Advanced body contouring using LPG endermologie, cavitation, and radio-frequency treatments.
              Includes fat reduction, body firming, lymphatic drainage, and post-pregnancy body restoration.
            </p>
            <div className="flex gap-4">
              <Link href="/book"><Button size="lg">Book Treatment</Button></Link>
              <Link href="/packages"><Button size="lg" variant="outline">View Packages</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Treatment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {AESTHETIC_TREATMENTS.map((treatment) => (
              <Card key={treatment.id} hover>
                <div className="flex items-center mb-3">
                  <Sparkles className="h-6 w-6 text-primary mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">{treatment.name}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{treatment.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Aesthetic Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {aestheticPackages.map((pkg) => (
              <Card key={pkg.id} hover className="relative">
                {pkg.isPopular && <Badge variant="primary" className="absolute top-4 right-4">Popular</Badge>}
                <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">${pkg.price}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/book"><Button className="w-full">Get Started</Button></Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Transform Your Body</h2>
          <p className="text-lg text-gray-200 mb-8">
            Book a consultation and start your body contouring journey with our expert aesthetic specialists.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Book Treatment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
