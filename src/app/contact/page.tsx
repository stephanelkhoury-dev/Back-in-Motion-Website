import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { COMPANY } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact | Back in Motion',
  description: 'Get in touch with Back in Motion. Book an appointment, ask a question, or visit our clinic.',
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Have a question or ready to book? Reach out to us through any of the channels below.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Send Us a Message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input id="firstName" label="First Name" placeholder="Your first name" required />
                  <Input id="lastName" label="Last Name" placeholder="Your last name" required />
                </div>
                <Input id="email" label="Email" type="email" placeholder="you@example.com" required />
                <Input id="phone" label="Phone" type="tel" placeholder="+961 XX XXX XXX" />
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-foreground mb-1.5">
                    Service Interest
                  </label>
                  <select
                    id="service"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option value="physio">Physiotherapy</option>
                    <option value="dietitian">Nutrition & Dietetics</option>
                    <option value="aesthetic">Body Shaping</option>
                    <option value="electrolysis">Electrolysis</option>
                    <option value="gym">Gym & Training</option>
                    <option value="ecoach">E-Coach AI</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us how we can help..."
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              <div className="space-y-4 mb-8">
                <Card>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Address</h4>
                      <p className="text-sm text-muted-foreground">{COMPANY.address}</p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Phone</h4>
                      <p className="text-sm text-muted-foreground">{COMPANY.phone}</p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Email</h4>
                      <p className="text-sm text-muted-foreground">{COMPANY.email}</p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-start">
                    <MessageCircle className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">WhatsApp</h4>
                      <p className="text-sm text-muted-foreground">Message us on WhatsApp for quick responses</p>
                    </div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground">Working Hours</h4>
                      <p className="text-sm text-muted-foreground">Mon-Fri: {COMPANY.workingHours.weekdays}</p>
                      <p className="text-sm text-muted-foreground">Sat: {COMPANY.workingHours.saturday}</p>
                      <p className="text-sm text-muted-foreground">Sun: {COMPANY.workingHours.sunday}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Map placeholder */}
              <div className="w-full h-64 rounded-2xl bg-muted flex items-center justify-center border border-border">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">Map integration coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
