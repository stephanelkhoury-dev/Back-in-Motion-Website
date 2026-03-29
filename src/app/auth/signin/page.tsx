'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { COMPANY } from '@/lib/constants';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password.');
      return;
    }

    // Fetch user role for redirect
    const res = await fetch('/api/auth/me');
    if (res.ok) {
      const user = await res.json();
      if (user.role === 'admin' || user.role === 'receptionist') {
        router.push('/admin');
      } else {
        router.push(callbackUrl);
      }
    } else {
      router.push(callbackUrl);
    }
    router.refresh();
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
      <div className="text-center mb-8">
        <img src="/logo.png" alt="Back in Motion" width={48} height={48} className="w-12 h-12 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground text-sm mt-1">Sign in to your {COMPANY.name} account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2 rounded border-border" />
            <span className="text-muted-foreground">Remember me</span>
          </label>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/auth/register" className="text-primary hover:text-primary-dark font-medium">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <section className="py-20 bg-muted min-h-[80vh] flex items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <Suspense fallback={
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        }>
          <SignInForm />
        </Suspense>
      </div>
    </section>
  );
}
