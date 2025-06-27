'use client';

import React from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { PricingPlan } from '@/types';

const pricingPlans: PricingPlan[] = [
  {
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      '5 messages per day',
      'Basic AI responses',
      'No conversation memory',
      'Email support',
    ],
    buttonText: 'Get Started',
  },
  {
    name: 'Premium',
    price: 9.99,
    interval: 'month',
    popular: true,
    features: [
      'Unlimited messages',
      'Advanced AI responses',
      'Conversation memory',
      'Priority support',
      'Mood tracking',
      'Export conversations',
    ],
    buttonText: 'Start Premium',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
  },
];

const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start free and upgrade when you're ready for more features
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-x-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? 'border-blue-500 shadow-lg ring-1 ring-blue-500'
                  : 'border-gray-200'
              }`}
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
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.interval}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link href={plan.name === 'Free' ? '/signup' : '/pricing'}>
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'primary' : 'outline'}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            All plans include our core AI therapy features and privacy protection.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            <strong>Disclaimer:</strong> EmotiCore is an AI assistant and not a replacement for professional therapy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
