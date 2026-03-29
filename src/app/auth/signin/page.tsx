import { Metadata } from 'next';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { COMPANY } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Sign In | Nicolas Web',
  description: 'Sign in to your Nicolas Web account to manage appointments, track progress, and access your wellness dashboard.',
};

export default function SignInPage() {
  return (
    <section className="py-20 bg-muted min-h-[80vh] flex items-center">
      <div className="max-w-md mx-auto px-4 w-full">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your {COMPANY.name} account</p>
          </div>

          <form className="space-y-4">
            <Input id="email" label="Email" type="email" placeholder="you@example.com" required />
            <Input id="password" label="Password" type="password" placeholder="Enter your password" required />
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 rounded border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-primary hover:text-primary-dark font-medium">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-border" />
            <span className="px-4 text-sm text-muted-foreground">or continue with</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              Google
            </Button>
            <Button variant="outline" className="w-full">
              Apple
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary hover:text-primary-dark font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
