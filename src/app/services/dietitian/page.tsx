import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Apple, Target, Calendar, TrendingUp, Camera, Droplets } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PACKAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Nutrition & Dietetics | Nicolas Web',
  description: 'Personalized nutrition assessments, custom meal plans, and ongoing dietitian support for your health goals.',
};

export default function DietitianPage() {
  const features = [
    { icon: Apple, title: 'Nutrition Assessment', description: 'Comprehensive intake evaluation including medical history, lifestyle, and eating habits.' },
    { icon: Target, title: 'Body Goals Selection', description: 'Weight loss, muscle gain, medical diet, sports nutrition — we tailor to your objectives.' },
    { icon: Calendar, title: 'Custom Meal Plans', description: 'Weekly meal plans with detailed macros, calories, and easy-to-follow recipes.' },
    { icon: TrendingUp, title: 'Follow-Up Sessions', description: 'Regular check-ins to adjust your plan based on progress and feedback.' },
    { icon: Droplets, title: 'Hydration & Food Diary', description: 'Track your daily water intake and food consumption with our digital diary.' },
    { icon: Camera, title: 'Progress Photos & Measurements', description: 'Body composition tracking with photos, measurements, and weight history.' },
  ];

  const dietPackages = PACKAGES.filter((p) => p.category === 'dietitian');

  return (
    <>
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-4">Nutrition</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Nutrition & Dietetics</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Personalized nutrition assessments, custom meal plans, body composition analysis, and ongoing
              dietitian support. Whether your goal is weight management, performance nutrition, or medical dietary needs.
            </p>
            <div className="flex gap-4">
              <Link href="/book"><Button size="lg">Book Consultation</Button></Link>
              <Link href="/packages"><Button size="lg" variant="outline">View Packages</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">What We Offer</h2>
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

      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">How It Works</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">Your nutrition journey in four simple steps.</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Assessment', desc: 'Complete your nutrition intake form and share your goals.' },
              { step: 2, title: 'Consultation', desc: 'Meet with your dietitian for an in-depth evaluation.' },
              { step: 3, title: 'Meal Plan', desc: 'Receive a custom meal plan with macros and guidance.' },
              { step: 4, title: 'Follow Up', desc: 'Track progress, adjust plans, and reach your goals.' },
            ].map((item) => (
              <Card key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full gradient-primary text-white font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Dietitian Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {dietPackages.map((pkg) => (
              <Card key={pkg.id} hover>
                <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">${pkg.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
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
          <h2 className="text-3xl font-bold mb-4">Transform Your Nutrition</h2>
          <p className="text-lg text-gray-200 mb-8">
            Book a consultation with our expert dietitian and start your personalized nutrition journey.
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
