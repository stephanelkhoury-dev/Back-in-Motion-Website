import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { randomBytes } from 'crypto';

// POST /api/auth/forgot-password
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Always return success to prevent email enumeration
    const successResponse = NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return successResponse;

    // Delete any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });

    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        email: user.email,
        token,
        expiresAt,
      },
    });

    // In production, send email with reset link:
    // const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
    // await sendEmail({ to: user.email, subject: 'Reset Password', html: `...${resetUrl}...` });

    // For development, log the token
    console.log(`[DEV] Password reset token for ${user.email}: ${token}`);
    console.log(`[DEV] Reset URL: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`);

    return successResponse;
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
