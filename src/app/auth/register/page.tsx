'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { COMPANY } from '@/lib/constants';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', gender: '', dateOfBirth: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
        gender: form.gender || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Registration failed. Please try again.');
      setLoading(false);
      return;
    }

    // Auto sign-in after successful registration
    const signInResult = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      // Registration succeeded but auto-login failed — redirect to sign in
      router.push('/auth/signin');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

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

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input id="firstName" label="First Name" placeholder="First name" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
              <Input id="lastName" label="Last Name" placeholder="Last name" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
            </div>
            <Input id="email" label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            <Input id="phone" label="Phone" type="tel" placeholder="+961 XX XXX XXX" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            <Input id="password" label="Password" type="password" placeholder="Create a password (min 8 chars)" value={form.password} onChange={(e) => update('password', e.target.value)} required />
            <Input id="confirmPassword" label="Confirm Password" type="password" placeholder="Confirm your password" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} required />

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-foreground mb-1.5">Gender</label>
              <select
                id="gender"
                value={form.gender}
                onChange={(e) => update('gender', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input id="dob" label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />

            <label className="flex items-start text-sm mt-2">
              <input type="checkbox" className="mr-2 mt-1 rounded border-border" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              <span className="text-muted-foreground">
                I agree to the{' '}
                <Link href="/terms" className="text-primary hover:text-primary-dark">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-primary hover:text-primary-dark">Privacy Policy</Link>
              </span>
            </label>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

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
