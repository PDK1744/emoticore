'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  price_id: string;
  features?: string[];
  popular?: boolean;
}

const PricingPlans: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/subscription-plans')
      .then(res => res.json())
      .then(data => setPlans(data));
  }, []);

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId);
    const stripe = await stripePromise;
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    });
    const { sessionId } = await res.json();
    if (stripe && sessionId) {
      const result = await stripe.redirectToCheckout({ sessionId });
      if (result.error) {
        alert(result.error.message);
      }
    }
    setLoading(null);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start free and upgrade when you're ready for more features
          </p>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-x-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.popular ? 'border-blue-500 shadow-lg ring-1 ring-blue-500' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">${plan.price / 100}</span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </CardHeader>
              <CardContent>
                {plan.features && (
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-700 flex items-center">
                        <span className="mr-2 text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.price_id)}
                  loading={loading === plan.price_id}
                  disabled={loading !== null}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;