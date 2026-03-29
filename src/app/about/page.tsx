import { Metadata } from 'next';
import { CheckCircle, Award, Users, Heart, Target, Clock } from 'lucide-react';
import { COMPANY, TEAM_MEMBERS } from '@/lib/constants';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About Us | Nicolas Web',
  description: 'Learn about Nicolas Web — a digital wellness and rehabilitation platform combining expert care with AI-powered coaching.',
};

export default function AboutPage() {
  const stats = [
    { label: 'Years of Experience', value: '15+', icon: Award },
    { label: 'Expert Specialists', value: '6+', icon: Users },
    { label: 'Happy Clients', value: '2000+', icon: Heart },
    { label: 'Services Offered', value: '5+', icon: Target },
  ];

  const values = [
    { title: 'Patient-Centered Care', description: 'Every treatment plan is tailored to your unique needs, goals, and lifestyle.' },
    { title: 'Evidence-Based Practice', description: 'We use proven clinical methods combined with the latest technology for optimal outcomes.' },
    { title: 'Innovation', description: 'Our AI E-Coach and digital tracking systems make care more accessible and affordable.' },
    { title: 'Continuous Improvement', description: 'We track every metric to ensure your progress and constantly improve our services.' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              About <span className="text-primary">{COMPANY.name}</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We are a comprehensive digital wellness and rehabilitation platform that combines expert clinical care
              with AI-powered coaching. Our mission is to make quality healthcare accessible, trackable, and affordable.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {COMPANY.name} was founded with a simple belief: quality healthcare should be accessible to everyone,
                  not just those who can afford daily in-clinic visits.
                </p>
                <p>
                  Our founder, Dr. Nicolas Khoury, recognized that patients often struggle to maintain their rehabilitation
                  programs between clinic visits. The gap between appointments is where progress stalls.
                </p>
                <p>
                  That insight led to the creation of our AI E-Coach system — a digital companion that provides
                  personalized exercise guidance, reminders, and pain monitoring between sessions. Combined with our
                  expert clinical team, patients now have 24/7 support at a fraction of traditional costs.
                </p>
                <p>
                  Today, {COMPANY.name} is more than a clinic. It is a digital wellness ecosystem covering physiotherapy,
                  nutrition, aesthetics, fitness, and AI coaching — all connected through one intelligent platform.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
              <h3 className="text-xl font-bold text-foreground mb-6 flex items-center">
                <Clock className="h-6 w-6 text-primary mr-2" />
                How It Works
              </h3>
              <ol className="space-y-4">
                {[
                  'Sign up and choose your service',
                  'Book an appointment with a specialist',
                  'Receive your personalized treatment plan',
                  'Track your exercises and progress digitally',
                  'Get AI E-Coach support between sessions',
                  'See your results and maintain your gains',
                ].map((step, i) => (
                  <li key={i} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full gradient-primary text-white text-sm font-bold flex items-center justify-center mr-3">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1 mr-3" />
                <div>
                  <h4 className="font-semibold text-foreground text-lg mb-1">{value.title}</h4>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Future of Wellness</h2>
          <p className="text-lg text-gray-200 mb-8">
            Experience the difference that expert care combined with smart technology can make.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link href="/book">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Book Appointment</Button>
            </Link>
            <Link href="/team">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">Meet Our Team</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
