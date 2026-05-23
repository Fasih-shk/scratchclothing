import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req) {
  try {
    // Initialize Stripe inside the handler to avoid constructing
    // the client during build-time (which causes failures when
    // env vars are not present during static build steps).
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return NextResponse.json(
        { error: "Stripe not configured on server" },
        { status: 500 },
      );
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2023-10-16",
    });

    const body = await req.json();
    const { token, amount, currency } = body;

    if (!token || !amount) {
      return NextResponse.json(
        { error: "Missing required payment data (token or amount)" },
        { status: 400 },
      );
    }

    const amountInPence = Math.round(Number(amount) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInPence,
      currency: currency || "gbp",
      payment_method_data: {
        type: "card",
        card: {
          token: token,
        },
      },
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/checkout/success`,
    });

    return NextResponse.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Stripe processing error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred processing the payment" },
      { status: 500 },
    );
  }
}
