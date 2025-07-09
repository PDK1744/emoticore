import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-05-28.basil',
});

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      expand: ['data.product'],
      active: true,
      type: 'recurring',
    });

    const plans = prices.data.map((price) => {
      const product = price.product as Stripe.Product;
      return {
        id: price.id,
        name: product.name,
        description: product.description,
        price: price.unit_amount,
        interval: price.recurring?.interval,
        price_id: price.id,
      };
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching subscription plans' }, { status: 500 });
  }
}