import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key (reads from environment variables)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request) {
  try {
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // Change to 'nzd' if you prefer local currency
            product_data: {
              name: 'ZapDocu Pro Subscription',
              description: 'Unlimited batch processing, zero ads, and local priority rendering.',
            },
            unit_amount: 499, // $4.99 USD
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}