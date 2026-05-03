import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

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

    if (user.isVerified) {
      return NextResponse.json({
        success: true,
        message: 'Account already verified',
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: true,
        },
      });
    }

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

    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
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