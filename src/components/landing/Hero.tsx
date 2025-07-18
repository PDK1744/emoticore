'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { Heart, MessageCircle, Shield } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-4xl"
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Your Personal{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Therapist
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              EmotiCore provides empathetic, 24/7 emotional support through AI-powered conversations. 
              Start your journey to better mental wellness today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link href="/sign-up">
              <Button size="lg" className="px-8 py-4">
                Start Free Today
              </Button>
            </Link>
            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Empathetic Support</h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                AI trained to provide warm, understanding conversations
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">24/7 Availability</h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Get support whenever you need it, day or night
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Private & Safe</h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Your conversations are encrypted and confidential
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-purple-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
