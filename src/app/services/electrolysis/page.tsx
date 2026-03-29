import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Zap, Shield, Clock, Camera, Bell, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getPackages } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Electrolysis Hair Removal | Nicolas Web',
  description: 'Permanent electrolysis hair removal safe for all skin and hair types with personalized treatment protocols.',
};

export default async function ElectrolysisPage() {
  const PACKAGES = await getPackages();

  const features = [
    { icon: Zap, title: 'Body Area Selection', description: 'Choose treatment areas: face, underarms, bikini, legs, arms, or full body.' },
    { icon: Shield, title: 'Skin & Hair Profile Intake', description: 'Detailed assessment of skin type, hair type, and medical contraindications.' },
    { icon: Clock, title: 'Session History', description: 'Full log of all sessions with treatment notes and progress documentation.' },
    { icon: Bell, title: 'Interval Reminders', description: 'Smart reminders for optimal appointment spacing to maximize results.' },
    { icon: Camera, title: 'Progress Log', description: 'Visual documentation showing hair reduction over your treatment course.' },
    { icon: FileText, title: 'Aftercare Instructions', description: 'Post-treatment care guidelines delivered digitally after each session.' },
  ];

  const bodyAreas = [
    { area: 'Face', description: 'Upper lip, chin, cheeks, sideburns' },
    { area: 'Underarms', description: 'Full underarm area' },
    { area: 'Arms', description: 'Full arms or forearms only' },
    { area: 'Bikini', description: 'Standard bikini or Brazilian' },
    { area: 'Legs', description: 'Full legs, lower legs, or thighs' },
    { area: 'Back & Chest', description: 'Full back, chest, or shoulders' },
  ];

  const hairPackages = PACKAGES.filter((p) => p.category === 'electrolysis');

  return (
    <>
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-4">Hair Removal</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Electrolysis Hair Removal</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              The only FDA-approved permanent hair removal method. Safe for all skin tones and hair colors
              with customized treatment protocols, digital progress tracking, and aftercare guidance.
            </p>
            <div className="flex gap-4">
              <Link href="/book"><Button size="lg">Book Consultation</Button></Link>
              <Link href="/packages"><Button size="lg" variant="outline">View Packages</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Body Areas */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Treatment Areas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bodyAreas.map((item) => (
              <Card key={item.area} hover className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.area}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
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

      {/* Safety */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary/5 border-primary/20">
            <div className="flex items-start">
              <Shield className="h-8 w-8 text-primary mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Safety & Contraindications</h3>
                <p className="text-muted-foreground mb-4">
                  Before your first treatment, our specialist will review your medical history and conduct a
                  skin assessment. A consent form and contraindication check are required for your safety.
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-success mr-2" /> Safe for all skin types and hair colors</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-success mr-2" /> FDA-approved permanent hair removal</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-success mr-2" /> Full contraindication screening before treatment</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-success mr-2" /> Digital consent and aftercare documentation</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Hair Removal Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {hairPackages.map((pkg) => (
              <Card key={pkg.id} hover>
                <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">${pkg.price}</span>
                  <span className="text-muted-foreground text-sm">/area</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {(pkg.features as string[]).map((f) => (
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
          <h2 className="text-3xl font-bold mb-4">Say Goodbye to Unwanted Hair</h2>
          <p className="text-lg text-gray-200 mb-8">
            Book your initial consultation for a personalized electrolysis treatment plan.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Book Consultation <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
