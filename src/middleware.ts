import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;

    // Super Admin routes
    if (pathname.startsWith('/super-admin')) {
      if (role !== 'super_admin') {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    // Admin routes
    if (pathname.startsWith('/admin')) {
      const adminRoles = ['super_admin', 'admin', 'manager', 'receptionist'];
      if (!role || !adminRoles.includes(role)) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    // Dashboard routes
    if (pathname.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/super-admin/:path*', '/dashboard/:path*'],
};
