import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

export const getOrCreateStripeCustomer = async (
  email: string,
  userId: string
): Promise<string> => {
  const existingCustomers = await stripe.customers.list({
    email: email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0].id;
  }

  const customer = await stripe.customers.create({
    email: email,
    metadata: {
      supabase_user_id: userId,
    },
  });

  return customer.id;
};

export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  userId: string
): Promise<Stripe.Checkout.Session> => {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    billing_address_collection: 'required',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    allow_promotion_codes: true,
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
    metadata: {
      user_id: userId,
    },
  });

  return session;
};

export const createBillingPortalSession = async (
  customerId: string
): Promise<Stripe.BillingPortal.Session> => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  });

  return session;
};

export const constructWebhookEvent = (
  body: string,
  signature: string,
  secret: string
): Stripe.Event => {
  return stripe.webhooks.constructEvent(body, signature, secret);
};
