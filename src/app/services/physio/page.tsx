import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Upload, ClipboardList, Calendar, TrendingUp, Dumbbell, FileText, Trophy, Bone, Hand, Brain, Baby, PersonStanding, Wind, Heart } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getPackages } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Physiotherapy & Rehabilitation | Nicolas Web',
  description: 'Comprehensive rehabilitation: sports, orthopedic, neurological, pediatric, geriatric, respiratory, and post-pregnancy rehab.',
};

export default async function PhysioPage() {
  const PACKAGES = await getPackages();

  const PHYSIO_SPECIALTIES = [
    { id: 'sports_rehab', name: 'Sports Rehabilitation', icon: Trophy, description: 'Recovery and performance programs for athletes and sports injuries.' },
    { id: 'orthopedic_rehab', name: 'Orthopedic Rehabilitation', icon: Bone, description: 'Post-surgery and musculoskeletal condition rehabilitation.' },
    { id: 'rheumatology_rehab', name: 'Rheumatology Rehabilitation', icon: Hand, description: 'Management of arthritis, joint, and autoimmune conditions.' },
    { id: 'neurological_rehab', name: 'Neurological Rehabilitation', icon: Brain, description: 'Recovery programs for stroke, spinal cord, and neurological conditions.' },
    { id: 'pediatric_rehab', name: 'Pediatric Rehabilitation', icon: Baby, description: 'Specialized therapy for children and developmental conditions.' },
    { id: 'geriatric_rehab', name: 'Geriatric Rehabilitation', icon: PersonStanding, description: 'Age-related mobility and strength improvement programs.' },
    { id: 'respiratory_rehab', name: 'Respiratory Rehabilitation', icon: Wind, description: 'Breathing exercise programs and lung function improvement.' },
    { id: 'post_pregnancy_rehab', name: 'Post-Pregnancy Rehabilitation', icon: Heart, description: 'Recovery programs for new mothers, including pelvic floor therapy.' },
  ];

  const features = [
    { icon: ClipboardList, title: 'Injury / Condition Selection', description: 'Identify your condition and match with the right specialist and treatment path.' },
    { icon: FileText, title: 'Treatment Plan Creation', description: 'Personalized rehab plans with clear goals, timelines, and milestones.' },
    { icon: Calendar, title: 'Session Scheduling', description: 'Book recurring or single sessions with your dedicated therapist.' },
    { icon: TrendingUp, title: 'Mobility & Pain Tracking', description: 'Digital tracking of your pain levels, range of motion, and functional progress.' },
    { icon: Dumbbell, title: 'Rehab Exercise Assignment', description: 'Custom exercise programs with reps, sets, timer, and video demonstrations.' },
    { icon: Upload, title: 'Scan & Report Upload', description: 'Upload MRIs, X-rays, and medical reports for your therapist to review.' },
  ];

  const physioPackages = PACKAGES.filter((p) => p.category === 'physio');

  return (
    <>
      {/* Hero */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-4">Physiotherapy</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Physiotherapy & Rehabilitation
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Comprehensive rehabilitation programs for sports injuries, orthopedic conditions, neurological disorders,
              and more. Our licensed therapists create personalized treatment plans with digital tracking and AI support.
            </p>
            <div className="flex gap-4">
              <Link href="/book"><Button size="lg">Book Assessment</Button></Link>
              <Link href="/packages"><Button size="lg" variant="outline">View Packages</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Rehabilitation Specialties</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PHYSIO_SPECIALTIES.map((specialty) => (
              <Card key={specialty.id} hover className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <specialty.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{specialty.name}</h3>
                <p className="text-sm text-muted-foreground">{specialty.description}</p>
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
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Physio Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {physioPackages.map((pkg) => (
              <Card key={pkg.id} hover className="relative">
                {pkg.isPopular && <Badge variant="primary" className="absolute top-4 right-4">Popular</Badge>}
                <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">${pkg.price}</span>
                  {pkg.includesECoach && <Badge variant="success" className="ml-2">+ E-Coach</Badge>}
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

      {/* CTA */}
      <section className="py-16 gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Recovery Today</h2>
          <p className="text-lg text-gray-200 mb-8">
            Book an initial assessment and let our expert team create your personalized rehabilitation plan.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Book Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
