import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edunexus/database';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        message: 'If your email is eligible for self-reset, a password reset link has been sent',
      });
    }

    // Role-based password reset restriction
    // Students cannot reset their own passwords - must contact admin
    if (user.role === 'STUDENT') {
      return NextResponse.json({
        message: 'Students cannot reset passwords via email. Please contact your school administrator.',
        isStudent: true,
      });
    }

    // Teachers, Staff, and other roles can use email-based reset
    // Generate reset token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Invalidate any existing tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        used: false,
      },
      data: {
        used: true,
      },
    });

    // Create new reset token
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    });

    // TODO: In production, send email with reset link
    // For demo/development, we'll return the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

    // In production, comment out the next line and send email instead
    console.log('Password reset link:', resetUrl);

    return NextResponse.json({
      message: 'A password reset link has been sent to your email',
      // Remove this in production:
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
