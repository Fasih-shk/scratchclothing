import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subscriber from '@/models/Subscriber';
import { sendEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { firstName, email } = await request.json();

    if (!firstName || !email) {
      return NextResponse.json(
        { success: false, error: 'First name and email are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existingSubscriber) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
        couponCode: 'WELCOME10',
        alreadySubscribed: true,
      });
    }

    await Subscriber.create({
      firstName,
      email: email.toLowerCase(),
    });

    // Send Welcome / Coupon Email
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scratchclothing.co.uk';
    const emailSubject = 'Welcome to the Club! Enjoy 10% Off';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #ffffff; border: 1px solid #eaeaea; border-radius: 12px; color: #1a1a1a;">
        <h2 style="font-size: 26px; font-weight: 700; text-align: center; margin-bottom: 20px; color: #000000;">Welcome to the Club, ${firstName}!</h2>
        <p style="font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px; color: #666666;">Thanks for signing up for our newsletter. We're excited to share discount codes, exclusive previews, and more with you.</p>
        
        <div style="background: #f9f9f9; border: 1px dashed #cccccc; padding: 24px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
          <p style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #888888; margin: 0 0 10px 0;">Your 10% Discount Code</p>
          <span style="font-size: 32px; font-weight: 700; letter-spacing: 0.05em; color: #000000; display: inline-block;">WELCOME10</span>
        </div>
        
        <div style="text-align: center; margin-bottom: 20px;">
          <a href="${siteUrl}" style="display: inline-block; background: #000000; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">SHOP SCRATCH CLOTHING</a>
        </div>
        
        <p style="font-size: 12px; text-align: center; color: #999999; margin-top: 40px;">
          If you did not sign up for these updates, you can unsubscribe at any time.
        </p>
      </div>
    `;

    // Attempt to send email in background (don't block the API response if SMTP fails)
    try {
      await sendEmail({
        to: email,
        subject: emailSubject,
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send newsletter welcome email:', emailError);
      // We don't fail the response because the user is still saved in DB.
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for joining the club!',
      couponCode: 'WELCOME10',
      alreadySubscribed: false,
    });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Subscription failed' },
      { status: 500 }
    );
  }
}
