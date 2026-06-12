import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken, isAdminEmail } from '@/lib/auth';

export async function POST(request) {
  try {
    const { otp, userId } = await request.json();

    if (!otp || !userId) {
      return NextResponse.json(
        { success: false, error: 'OTP and user ID are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // If the user provides an OTP, we verify it regardless of isVerified status
    // to allow for login-time OTP verification.

    if (user.otpCode !== otp) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    if (user.otpExpiry < new Date()) {
      return NextResponse.json(
        { success: false, error: 'OTP expired. Please request a new one.' },
        { status: 400 }
      );
    }

    await User.findByIdAndUpdate(userId, {
      isVerified: true,
      otpCode: null,
      otpExpiry: null,
    });

    const role = user.role === 'admin' && !isAdminEmail(user.email) ? 'customer' : user.role;

    const token = generateToken({
      userId: user._id,
      email: user.email,
      role,
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}