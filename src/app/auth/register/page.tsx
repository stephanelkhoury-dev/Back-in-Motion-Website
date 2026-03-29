import { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { COMPANY } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Register | Nicolas Web',
  description: 'Create your Nicolas Web account to book appointments, track your wellness journey, and access E-Coach AI.',
};

export default function RegisterPage() {
  return (
    <section className="py-20 bg-muted min-h-[80vh] flex items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
            <p className="text-muted-foreground text-sm mt-1">Join {COMPANY.name} and start your wellness journey</p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input id="firstName" label="First Name" placeholder="First name" required />
              <Input id="lastName" label="Last Name" placeholder="Last name" required />
            </div>
            <Input id="email" label="Email" type="email" placeholder="you@example.com" required />
            <Input id="phone" label="Phone" type="tel" placeholder="+961 XX XXX XXX" required />
            <Input id="password" label="Password" type="password" placeholder="Create a password" required />
            <Input id="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" required />

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-foreground mb-1.5">Gender</label>
              <select
                id="gender"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input id="dob" label="Date of Birth" type="date" />

            <label className="flex items-start text-sm mt-2">
              <input type="checkbox" className="mr-2 mt-1 rounded border-border" required />
              <span className="text-muted-foreground">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:text-primary-dark">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:text-primary-dark">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" className="w-full" size="lg">
              Create Account
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-border" />
            <span className="px-4 text-sm text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">Google</Button>
            <Button variant="outline" className="w-full">Apple</Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:text-primary-dark font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
