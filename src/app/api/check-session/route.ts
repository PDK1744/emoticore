import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  const { sessionId } = await request.json();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Example: update user subscription status here if needed
    // if (session.payment_status === 'paid') {
    //   await updateUserSubscriptionStatus(session.client_reference_id, 'active');
    // }

    return NextResponse.json({ session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}