'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, User, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface ServiceData {
  id: string;
  name: string;
  slug: string;
  category: string;
  duration: number;
  price: number;
  shortDescription: string | null;
}

interface PractitionerData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  specialties: string[];
}

type BookingStep = 'service' | 'specialist' | 'datetime' | 'details' | 'confirm';

const BOOKING_STEPS: { id: BookingStep; label: string }[] = [
  { id: 'service', label: 'Service' },
  { id: 'specialist', label: 'Specialist' },
  { id: 'datetime', label: 'Date & Time' },
  { id: 'details', label: 'Your Details' },
  { id: 'confirm', label: 'Confirm' },
];

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
];

export default function BookPage() {
  const [step, setStep] = useState<BookingStep>('service');
  const [SERVICES, setServices] = useState<ServiceData[]>([]);
  const [TEAM_MEMBERS, setTeamMembers] = useState<PractitionerData[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/practitioners').then((r) => r.json()),
    ]).then(([services, practitioners]) => {
      setServices(services);
      setTeamMembers(practitioners);
    });
  }, []);
  const [selectedService, setSelectedService] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingType, setBookingType] = useState<'single' | 'package'>('single');
  const [submitted, setSubmitted] = useState(false);

  const currentStepIndex = BOOKING_STEPS.findIndex((s) => s.id === step);
  const service = SERVICES.find((s) => s.id === selectedService);

  const filteredSpecialists = TEAM_MEMBERS.filter((t) => {
    if (!service) return true;
    if (service.category === 'physio') return t.role === 'therapist';
    if (service.category === 'dietitian') return t.role === 'dietitian';
    if (service.category === 'aesthetic') return t.role === 'aesthetic_specialist';
    if (service.category === 'electrolysis') return t.role === 'aesthetic_specialist';
    if (service.category === 'gym') return t.role === 'trainer';
    return true;
  });

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < BOOKING_STEPS.length) {
      setStep(BOOKING_STEPS[nextIndex].id);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(BOOKING_STEPS[prevIndex].id);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-32 bg-white">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
          <p className="text-muted-foreground mb-2">
            Your appointment has been booked successfully.
          </p>
          <p className="text-muted-foreground mb-8">
            You will receive a confirmation email and reminder notifications before your appointment.
          </p>
          <Card className="text-left mb-8">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium text-foreground">{service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Specialist</span>
                <span className="font-medium text-foreground">
                  {TEAM_MEMBERS.find((t) => t.id === selectedSpecialist)?.name || 'Any available'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium text-foreground">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium text-foreground">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium text-foreground">{bookingType === 'package' ? 'Package Session' : 'Single Session'}</span>
              </div>
            </div>
          </Card>
          <Button onClick={() => { setSubmitted(false); setStep('service'); setSelectedService(''); }}>
            Book Another Appointment
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-muted py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground">Follow the steps below to schedule your visit.</p>
        </div>
      </section>

      {/* Progress */}
      <section className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {BOOKING_STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    i <= currentStepIndex ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {i < currentStepIndex ? <CheckCircle className="h-4 w-4" /> : i + 1}
                </div>
                <span className={cn('ml-2 text-sm hidden sm:block', i <= currentStepIndex ? 'text-foreground font-medium' : 'text-muted-foreground')}>
                  {s.label}
                </span>
                {i < BOOKING_STEPS.length - 1 && (
                  <div className={cn('w-8 sm:w-16 h-0.5 mx-2', i < currentStepIndex ? 'bg-primary' : 'bg-border')} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step Content */}
      <section className="py-12 bg-white min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Service Selection */}
          {step === 'service' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Select a Service</h2>
              <p className="text-muted-foreground mb-6">Choose the service you would like to book.</p>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setBookingType('single')}
                  className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    bookingType === 'single' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')}
                >
                  Single Session
                </button>
                <button
                  onClick={() => setBookingType('package')}
                  className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                    bookingType === 'package' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')}
                >
                  Package Booking
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all cursor-pointer',
                      selectedService === svc.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <h3 className="font-semibold text-foreground mb-1">{svc.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{svc.shortDescription}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>${svc.price}/session</span>
                      <span>{svc.duration} min</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Specialist */}
          {step === 'specialist' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Choose a Specialist</h2>
              <p className="text-muted-foreground mb-6">Select your preferred specialist or choose &quot;Any Available.&quot;</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setSelectedSpecialist('')}
                  className={cn(
                    'p-4 rounded-xl border-2 text-left transition-all cursor-pointer',
                    selectedSpecialist === '' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  )}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mr-3">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Any Available</h3>
                      <p className="text-sm text-muted-foreground">First available specialist</p>
                    </div>
                  </div>
                </button>
                {filteredSpecialists.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSpecialist(spec.id)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all cursor-pointer',
                      selectedSpecialist === spec.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <span className="text-primary font-bold text-sm">
                          {spec.name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{spec.name}</h3>
                        <p className="text-sm text-muted-foreground">{spec.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 'datetime' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Select Date & Time</h2>
              <p className="text-muted-foreground mb-6">Choose your preferred appointment date and time.</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-foreground mb-2">
                    <Calendar className="h-4 w-4 inline mr-1" /> Select Date
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Clock className="h-4 w-4 inline mr-1" /> Select Time
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          'px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                          selectedTime === time ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {step === 'details' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Details</h2>
              <p className="text-muted-foreground mb-6">Please provide your contact information.</p>
              <div className="max-w-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input id="bookFirstName" label="First Name" placeholder="Your first name" required />
                  <Input id="bookLastName" label="Last Name" placeholder="Your last name" required />
                </div>
                <Input id="bookEmail" label="Email" type="email" placeholder="you@example.com" required />
                <Input id="bookPhone" label="Phone" type="tel" placeholder="+961 XX XXX XXX" required />
                <div>
                  <label htmlFor="bookNotes" className="block text-sm font-medium text-foreground mb-1.5">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    id="bookNotes"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Any special requirements or conditions..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirm */}
          {step === 'confirm' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Confirm Your Booking</h2>
              <p className="text-muted-foreground mb-6">Please review your appointment details below.</p>
              <Card className="max-w-lg">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium text-foreground">{service?.name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Specialist</span>
                    <span className="font-medium text-foreground">
                      {TEAM_MEMBERS.find((t) => t.id === selectedSpecialist)?.name || 'Any available'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{selectedDate || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{selectedTime || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground">{service?.duration} min</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-muted-foreground">Booking Type</span>
                    <Badge variant={bookingType === 'package' ? 'success' : 'primary'}>
                      {bookingType === 'package' ? 'Package Session' : 'Single Session'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Price</span>
                    <span className="text-2xl font-bold text-primary">${service?.price}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step === 'confirm' ? (
              <Button onClick={handleSubmit} size="lg">
                Confirm Booking <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={goNext}
                disabled={step === 'service' && !selectedService}
              >
                Next <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
