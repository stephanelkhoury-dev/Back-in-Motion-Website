import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconLinkedin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-xl font-bold">{COMPANY.name}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {COMPANY.description}
            </p>
            <div className="flex space-x-4">
              <a href={COMPANY.social.instagram} className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram">
                <IconInstagram className="h-5 w-5" />
              </a>
              <a href={COMPANY.social.facebook} className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook">
                <IconFacebook className="h-5 w-5" />
              </a>
              <a href={COMPANY.social.linkedin} className="text-gray-400 hover:text-primary transition-colors" aria-label="LinkedIn">
                <IconLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/services/physio" className="hover:text-white transition-colors">Physiotherapy</Link></li>
              <li><Link href="/services/dietitian" className="hover:text-white transition-colors">Nutrition & Dietetics</Link></li>
              <li><Link href="/services/lpg-body-shaping" className="hover:text-white transition-colors">Body Shaping</Link></li>
              <li><Link href="/services/electrolysis" className="hover:text-white transition-colors">Electrolysis</Link></li>
              <li><Link href="/services/gym" className="hover:text-white transition-colors">Gym & Training</Link></li>
              <li><Link href="/e-coach" className="hover:text-white transition-colors">E-Coach AI</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/packages" className="hover:text-white transition-colors">Packages & Pricing</Link></li>
              <li><Link href="/team" className="hover:text-white transition-colors">Our Team</Link></li>
              <li><Link href="/book" className="hover:text-white transition-colors">Book Appointment</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog & Tips</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mt-0.5 mr-2 text-primary flex-shrink-0" />
                {COMPANY.address}
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                {COMPANY.phone}
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                {COMPANY.email}
              </li>
            </ul>
            <div className="mt-4 text-sm text-gray-400">
              <p>Mon-Fri: {COMPANY.workingHours.weekdays}</p>
              <p>Sat: {COMPANY.workingHours.saturday}</p>
              <p>Sun: {COMPANY.workingHours.sunday}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
          <div className="flex space-x-6 mt-2 sm:mt-0">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
