import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Dumbbell, Users, Bot, PlayCircle, BarChart3, Calendar } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PACKAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Gym & Personal Training | Nicolas Web',
  description: 'Modern gym facilities with personal training, group classes, and AI-powered E-Coach for smart, affordable fitness.',
};

export default function GymPage() {
  const features = [
    { icon: Calendar, title: 'Membership Plans', description: 'Monthly, quarterly, and annual memberships with flexible upgrade paths.' },
    { icon: Users, title: 'Trainer Assignment', description: 'Get matched with a certified personal trainer based on your goals.' },
    { icon: Dumbbell, title: 'Personal Programs', description: 'Custom workout plans with exercise library, sets, reps, and progression.' },
    { icon: PlayCircle, title: 'Exercise Videos', description: 'HD demonstration videos for every exercise in your program.' },
    { icon: Bot, title: 'E-Coach AI Integration', description: 'AI coaching between sessions for adaptive plans and daily guidance.' },
    { icon: BarChart3, title: 'Performance Dashboard', description: 'Track attendance, workout completion, PRs, and long-term trends.' },
  ];

  const gymPrograms = [
    { title: 'Strength Training', desc: 'Build muscle and increase functional strength with progressive overload programs.' },
    { title: 'Cardio & HIIT', desc: 'High-intensity and cardio programs for fat loss and cardiovascular health.' },
    { title: 'Functional Fitness', desc: 'Movement-based training for daily life performance and injury prevention.' },
    { title: 'Rehab Exercise', desc: 'Clinical exercise programs designed in collaboration with our physio team.' },
    { title: 'Group Classes', desc: 'Scheduled group classes: yoga, pilates, circuit, and more.' },
    { title: 'E-Coach AI Sessions', desc: 'AI-guided workouts with real-time reps counter and timer.' },
  ];

  const gymPackages = PACKAGES.filter((p) => p.category === 'gym');

  return (
    <>
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="primary" className="mb-4">Fitness</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Gym & Personal Training</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Modern gym facilities with certified personal trainers, group classes, and our AI-powered E-Coach.
              Custom workout programs with real-time tracking, exercise videos, and performance analytics.
            </p>
            <div className="flex gap-4">
              <Link href="/book"><Button size="lg">Start Training</Button></Link>
              <Link href="/e-coach"><Button size="lg" variant="outline">Try E-Coach</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Training Programs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gymPrograms.map((program) => (
              <Card key={program.title} hover>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{program.title}</h3>
                <p className="text-sm text-muted-foreground">{program.desc}</p>
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

      {/* Reps/Sets/Timer Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-primary/5 border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4 text-center">Built-In Workout Tracker</h3>
            <p className="text-muted-foreground text-center mb-8">
              Every workout includes real-time tracking tools right in the app.
            </p>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-1">12</div>
                <div className="text-sm text-muted-foreground">Reps Counter</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-1">3</div>
                <div className="text-sm text-muted-foreground">Sets Tracker</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-1">0:45</div>
                <div className="text-sm text-muted-foreground">Chronometer</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Gym Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gymPackages.map((pkg) => (
              <Card key={pkg.id} hover className="relative">
                {pkg.isPopular && <Badge variant="primary" className="absolute top-4 right-4">Popular</Badge>}
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
          <h2 className="text-3xl font-bold mb-4">Start Your Fitness Journey</h2>
          <p className="text-lg text-gray-200 mb-8">
            Join our gym or try the E-Coach AI for smart, affordable personal training.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href="/book">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Join Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/e-coach">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Try E-Coach
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
