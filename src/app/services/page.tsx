import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Activity, Utensils, Sparkles, Zap, Dumbbell, Bot } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { SERVICES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Services | Nicolas Web',
  description: 'Explore our comprehensive wellness services: physiotherapy, nutrition, body shaping, electrolysis, gym, and AI E-Coach.',
};

const SERVICE_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  physio: Activity,
  dietitian: Utensils,
  aesthetic: Sparkles,
  electrolysis: Zap,
  gym: Dumbbell,
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Our Services</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Comprehensive health and wellness services delivered by expert practitioners, enhanced by
              AI-powered technology for personalized, trackable results.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {SERVICES.map((service, i) => {
              const Icon = SERVICE_ICONS[service.category] || Activity;
              const isEven = i % 2 === 0;
              return (
                <div key={service.id} className={`flex flex-col lg:flex-row gap-8 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="lg:w-1/2">
                    <div className="bg-muted rounded-2xl h-64 lg:h-80 flex items-center justify-center">
                      <Icon className="h-20 w-20 text-primary/30" />
                    </div>
                  </div>
                  <div className="lg:w-1/2">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mr-3">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="primary">{service.category}</Badge>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{service.name}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">{service.description}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-sm text-muted-foreground">From <span className="text-primary font-bold text-lg">${service.price}</span>/session</span>
                      <span className="text-sm text-muted-foreground">|</span>
                      <span className="text-sm text-muted-foreground">{service.duration} min</span>
                    </div>
                    <div className="flex gap-3">
                      <Link href={`/services/${service.slug}`}>
                        <Button>
                          Learn More <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/book">
                        <Button variant="outline">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* E-Coach Banner */}
      <section className="py-16 gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-2/3">
              <div className="flex items-center mb-4">
                <Bot className="h-8 w-8 mr-3" />
                <Badge className="bg-white/20 text-white">AI-Powered</Badge>
              </div>
              <h2 className="text-3xl font-bold mb-4">E-Coach AI: Your Digital Wellness Companion</h2>
              <p className="text-gray-200 text-lg mb-6">
                Get personalized workout plans, daily reminders, pain check-ins, and progress tracking —
                all powered by AI for a fraction of in-person training cost.
              </p>
              <Link href="/e-coach">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Explore E-Coach <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/3 flex justify-center">
              <div className="w-48 h-48 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="h-24 w-24 text-white/50" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
