'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CheckCircle, ArrowLeft } from 'lucide-react';

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to reset password.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Card>
        <div className="text-center py-4">
          <p className="text-danger font-medium mb-2">Invalid Reset Link</p>
          <p className="text-sm text-muted-foreground mb-4">This password reset link is invalid or has been used.</p>
          <Link href="/auth/forgot-password" className="text-primary hover:underline text-sm font-medium">
            Request a new reset link
          </Link>
        </div>
      </Card>
    );
  }

  if (success) {
    return (
      <Card>
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <p className="text-foreground font-medium mb-2">Password Reset Successfully</p>
          <p className="text-sm text-muted-foreground mb-4">You can now sign in with your new password.</p>
          <Link href="/auth/signin" className="text-primary hover:underline text-sm font-medium">
            Go to Sign In
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="password"
          label="New Password"
          type="password"
          placeholder="Enter your new password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading || !password || !confirmPassword}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Back in Motion" width={48} height={48} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground">Set New Password</h1>
          <p className="text-muted-foreground text-sm mt-1">Choose a strong password for your account.</p>
        </div>

        <Suspense fallback={<Card><p className="text-center text-muted-foreground py-4">Loading...</p></Card>}>
          <ResetForm />
        </Suspense>

        <div className="text-center mt-4">
          <Link href="/auth/signin" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
