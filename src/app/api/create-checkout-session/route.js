import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe lazily so build time doesn't throw if the key is absent
let stripeInstance = null;
function getStripe() {
  if (!stripeInstance && process.env.STRIPE_SECRET_KEY) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }
  return stripeInstance;
}

export async function POST(request) {
  try {
    const stripe = getStripe();

    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured on this environment.' },
        { status: 500 }
      );
    }

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