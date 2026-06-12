import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { comparePassword, generateOTP, generateToken, isAdminEmail } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Account is disabled' },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // If the user is already verified, bypass OTP and log them in directly
    // Sanitize role: only allowed admin emails can have admin role in the token
    const role = user.role === 'admin' && !isAdminEmail(user.email) ? 'customer' : user.role;

    if (user.isVerified) {
      const token = generateToken({
        userId: user._id,
        email: user.email,
        role,
      });

      return NextResponse.json({
        success: true,
        requiresOTP: false,
        token,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role,
          isVerified: user.isVerified,
        },
      });
    }

    // Generate and send OTP for login verification for unverified users
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await User.findByIdAndUpdate(user._id, {
      otpCode: otp,
      otpExpiry,
    });

    await sendVerificationEmail(user.email, otp);

    return NextResponse.json({
      success: true,
      requiresOTP: true,
      message: 'OTP sent to your email',
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}