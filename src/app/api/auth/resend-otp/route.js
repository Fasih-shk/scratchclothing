import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateOTP } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

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
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, error: 'Account already verified' },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      otpCode: otp,
      otpExpiry,
    });

    await sendVerificationEmail(user.email, otp);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}