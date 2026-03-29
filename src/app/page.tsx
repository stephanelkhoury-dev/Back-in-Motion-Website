import Link from 'next/link';
import { ArrowRight, Activity, Utensils, Sparkles, Zap, Dumbbell, Bot, Star, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getServices, getPackages, getTestimonials } from '@/lib/data';

const SERVICE_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  physio: Activity,
  dietitian: Utensils,
  aesthetic: Sparkles,
  electrolysis: Zap,
  gym: Dumbbell,
};

function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero text-white">
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
        <div className="max-w-3xl">
          <Badge variant="primary" className="bg-white/20 text-white mb-6 text-sm px-4 py-1">
            AI-Powered Wellness Platform
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Your Complete
            <br />
            <span className="text-primary-light">Wellness Journey</span>
            <br />
            Starts Here
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
            Expert physiotherapy, nutrition, body shaping, and fitness — combined with AI coaching
            to deliver personalized care that fits your life and your budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/book">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
                Book Appointment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/e-coach">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Try E-Coach AI
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

function ServicesSection({ services }: { services: Awaited<ReturnType<typeof getServices>> }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive health and wellness services under one roof, powered by expert care and smart technology.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.category] || Activity;
            return (
              <Link key={service.id} href={`/services/${service.slug}`}>
                <Card hover className="h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
                  </div>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">{service.shortDescription}</p>
                    <div className="mt-4 flex items-center text-primary text-sm font-medium">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
          <Link href="/e-coach">
            <Card hover className="h-full border-primary/30 bg-primary/5">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">E-Coach AI</h3>
                  <Badge variant="primary" className="text-[10px]">NEW</Badge>
                </div>
              </div>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  AI-powered coaching at a fraction of the cost. Workout plans, reminders, and progress tracking.
                </p>
                <div className="mt-4 flex items-center text-primary text-sm font-medium">
                  Explore E-Coach <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUsSection() {
  const features = [
    { title: 'Expert Clinical Team', description: 'Licensed therapists, dietitians, and specialists with years of experience.' },
    { title: 'AI-Powered Coaching', description: 'E-Coach AI fills the gap between sessions, reducing costs while maintaining quality care.' },
    { title: 'All-in-One Platform', description: 'Appointments, exercise tracking, meal plans, progress — all in one place.' },
    { title: 'Real-Time Tracking', description: 'Reps counter, chronometer, pain feedback, and compliance analytics for every session.' },
    { title: 'Flexible Packages', description: 'Single sessions, bundles, subscriptions, and hybrid plans to fit every budget.' },
    { title: 'Smart Reminders', description: 'WhatsApp, SMS, email, and push notifications so you never miss a session.' },
  ];

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Why Choose Back in Motion</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            More than a clinic — a digital wellness and rehabilitation system designed for modern care.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="flex items-start">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1 mr-3" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ testimonials }: { testimonials: Awaited<ReturnType<typeof getTestimonials>> }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">What Our Clients Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t) => (
            <Card key={t.id} className="h-full">
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-accent fill-accent" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm italic mb-4">&ldquo;{t.comment}&rdquo;</p>
              <div className="flex items-center mt-auto">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm mr-3">
                  {t.clientName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{t.clientName}</p>
                  <p className="text-xs text-muted-foreground">{t.service}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackagesPreview({ packages }: { packages: Awaited<ReturnType<typeof getPackages>> }) {
  const featured = packages.filter((p) => p.isPopular).slice(0, 3);

  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Popular Packages</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Flexible plans designed to give you the best value and outcomes.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((pkg) => (
            <Card key={pkg.id} hover className="h-full relative">
              <Badge variant="primary" className="absolute top-4 right-4">Popular</Badge>
              <h3 className="text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{pkg.description}</p>
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">${pkg.price}</span>
                {pkg.type === 'monthly' && <span className="text-muted-foreground text-sm">/month</span>}
              </div>
              <ul className="space-y-2 mb-6">
                {(pkg.features as string[]).map((f) => (
                  <li key={f} className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/book">
                <Button className="w-full">Get Started</Button>
              </Link>
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/packages">
            <Button variant="outline">View All Packages</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 gradient-hero text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6">
          Ready to Start Your Wellness Journey?
        </h2>
        <p className="text-xl text-gray-200 mb-8">
          Book your first appointment today or explore our AI E-Coach for affordable, personalized care.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/book">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Book Appointment
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const [services, packages, testimonials] = await Promise.all([
    getServices(),
    getPackages(),
    getTestimonials(),
  ]);

  return (
    <>
      <HeroSection />
      <ServicesSection services={services} />
      <WhyChooseUsSection />
      <PackagesPreview packages={packages} />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  );
}
