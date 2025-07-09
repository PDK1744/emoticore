'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

type SessionStatus = 'loading' | 'failed' | 'complete' | 'open' | 'expired';

export default function SuccessPage() {
  const [status, setStatus] = useState<SessionStatus>('loading');
//   const [customerEmail, setCustomerEmail] = useState<string>('');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      fetchSessionStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function fetchSessionStatus() {
    const response = await fetch('/api/check-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    const { session, error } = await response.json();

    if (error || !session) {
      setStatus('failed');
      console.error(error);
      return;
    }

    setStatus(session.status as SessionStatus);
    // setCustomerEmail(session.customer_email as string);
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="bg-white rounded-lg shadow-md px-8 py-10 text-center w-full max-w-md">
          <div className="text-lg font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="bg-white rounded-lg shadow-md px-8 py-10 text-center w-full max-w-md">
          <div className="text-lg font-semibold text-red-600 mb-4">
            Failed to process subscription. Please try again.
          </div>
          <Button onClick={() => window.location.href = '/pricing'}>
            Back to Pricing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="bg-white rounded-lg shadow-md px-8 py-10 text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-green-700">Subscription Successful!</h1>
        <p className="text-gray-700 mb-4">
          Thank you for your subscription.
          {/* {customerEmail && (
            <> A confirmation email has been sent to <span className="font-semibold">{customerEmail}</span>.</>
          )} */}
        </p>
        <Button onClick={() => window.location.href = '/dashboard'}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
}