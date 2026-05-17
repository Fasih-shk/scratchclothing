import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your Secret Key from .env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, amount, currency } = body;

    if (!token || !amount) {
      return NextResponse.json(
        { error: 'Missing required payment data (token or amount)' },
        { status: 400 }
      );
    }

    // Stripe requires the amount to be in the smallest currency unit.
    // For GBP, this is pence. So £15.00 becomes 1500.
    const amountInPence = Math.round(Number(amount) * 100);

    // Create and confirm the PaymentIntent using the Stripe token from Google Pay
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: currency || 'gbp',
      payment_method_data: {
        type: 'card',
        card: {
          token: token,
        },
      },
      confirm: true, // Automatically confirms the charge
      // return_url is sometimes required for redirect-based flows (like 3D Secure)
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/success`, 
    });

    return NextResponse.json({ success: true, paymentIntent });
  } catch (error) {
    console.error('Stripe processing error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred processing the payment' },
      { status: 500 }
    );
  }
}
