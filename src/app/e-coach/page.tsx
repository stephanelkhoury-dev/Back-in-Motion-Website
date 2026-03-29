import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle, ArrowRight, Bot, Brain, Target, Bell, TrendingUp, MessageCircle, Dumbbell, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { PACKAGES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'E-Coach AI | Nicolas Web',
  description: 'AI-powered wellness coaching: personalized workouts, daily reminders, pain check-ins, and progress tracking at a fraction of the cost.',
};

export default function ECoachPage() {
  const plans = [
    {
      name: 'E-Coach Monthly',
      price: 29,
      period: '/month',
      description: 'AI coaching without in-person visits.',
      features: ['AI-generated workout plans', 'Exercise library with videos', 'Progress tracking', 'Daily reminders', 'Chat assistant', 'Pain check-ins'],
      type: 'Option A',
    },
    {
      name: 'Hybrid Plan',
      price: 199,
      period: '/month',
      description: 'Fewer PT sessions + AI support between visits.',
      features: ['2 in-clinic PT sessions', 'AI E-Coach full access', 'Therapist reviews progress', 'Exercise tracking', 'Adaptive weekly programs', 'Ideal for maintenance'],
      type: 'Option B',
      popular: true,
    },
    {
      name: 'Bundle + E-Coach',
      price: 599,
      period: '',
      description: '8 sessions + full AI support throughout.',
      features: ['8 in-clinic sessions', 'AI E-Coach entire period', 'Reduced overall cost', 'Full exercise tracking', 'Priority booking', 'Symptom escalation'],
      type: 'Option C',
    },
  ];

  const features = [
    { icon: Brain, title: 'Onboarding Assessment', description: 'Comprehensive intake to understand your goals, conditions, and fitness level.' },
    { icon: Target, title: 'Goal Selection', description: 'Pain reduction, strength building, weight loss, flexibility — tailored to you.' },
    { icon: Dumbbell, title: 'Adaptive Weekly Programs', description: 'AI adjusts your plan based on performance, feedback, and recovery.' },
    { icon: Bell, title: 'Recovery Reminders', description: 'Smart notifications for exercises, hydration, stretching, and rest days.' },
    { icon: MessageCircle, title: 'Chat Assistant', description: 'Ask questions about exercises, pain management, and wellness tips.' },
    { icon: TrendingUp, title: 'Progress Analytics', description: 'Visual dashboards showing compliance, pain trends, and performance gains.' },
    { icon: AlertTriangle, title: 'Symptom Flagging', description: 'AI detects concerning patterns and escalates to your therapist.' },
    { icon: Bot, title: 'Educational Tips', description: 'Daily micro-lessons on recovery, nutrition, posture, and wellness.' },
  ];

  return (
    <>
      <section className="gradient-hero text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <Bot className="h-10 w-10 mr-3" />
              <Badge className="bg-white/20 text-white text-sm px-4 py-1">AI-Powered</Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              E-Coach AI
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-4">
              Your digital wellness companion — personalized workout plans, daily exercise reminders,
              pain check-ins, and progress tracking, all powered by AI.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              Get quality coaching at a fraction of in-person training cost.
              Use it standalone or combined with in-clinic sessions for the best of both worlds.
            </p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <Link href="/book">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
                  Start E-Coach <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#plans">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">How E-Coach Works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Smart coaching in four simple steps — from assessment to daily AI-guided progress.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Onboarding', desc: 'Complete your assessment and set your wellness goals.' },
              { step: 2, title: 'AI Plan', desc: 'Receive an adaptive weekly program tailored to your needs.' },
              { step: 3, title: 'Daily Guidance', desc: 'Follow exercises with reps counter, timer, and video demos.' },
              { step: 4, title: 'Track & Adjust', desc: 'AI analyzes your progress and adapts your plan weekly.' },
            ].map((item) => (
              <Card key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full gradient-primary text-white font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-10 text-center">E-Coach Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} hover className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1 text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">E-Coach Plans</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Choose the plan that fits your needs — from standalone AI coaching to hybrid plans with in-person sessions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} hover className={`relative ${plan.popular ? 'border-primary border-2' : ''}`}>
                {plan.popular && <Badge variant="primary" className="absolute top-4 right-4">Most Popular</Badge>}
                <Badge variant="outline" className="mb-3">{plan.type}</Badge>
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">${plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/book">
                  <Button className="w-full" variant={plan.popular ? 'primary' : 'outline'}>
                    Get Started
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-warning/5 border-warning/20">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-warning mr-3 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> E-Coach AI is a coaching support and wellness assistance tool.
                It does not provide medical diagnoses or replace professional clinical judgment. For medical
                concerns, always consult your treating therapist or physician.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Future of Coaching</h2>
          <p className="text-lg text-gray-200 mb-8">
            Start with E-Coach AI today and get personalized wellness support from day one.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Start E-Coach <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
