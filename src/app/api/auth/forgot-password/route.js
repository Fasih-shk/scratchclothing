import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { success: true,
          message: 'If an account exists, a reset link will be sent' },
        { status: 200 }
      );
    }

    const resetToken = generateResetToken();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetExpiry,
    });

    await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a reset link will be sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}