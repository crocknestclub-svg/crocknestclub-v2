'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type PaymentView = 'loading' | 'success' | 'failed' | 'pending';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<PaymentView>('loading');
  const [message, setMessage] = useState<string>('Verifying your payment...');

  useEffect(() => {
    const paymentRequestId = searchParams.get('payment_request_id');
    const paymentStatus = searchParams.get('payment_status');

    // If Instamojo already provides status in query, use it optimistically
    if (paymentStatus === 'Credit') {
      setView('success');
      setMessage('Payment successful!');
    } else if (paymentStatus === 'Failed' || paymentStatus === 'Cancelled') {
      setView('failed');
      setMessage('Payment failed or cancelled.');
    }

    // Confirm against our API to be certain
    const verify = async () => {
      if (!paymentRequestId) {
        setView('failed');
        setMessage('Missing payment reference.');
        return;
      }
      try {
        const res = await fetch(`/api/payments/${paymentRequestId}`);
        const data = await res.json();
        const s = data?.status?.payment_request?.payment?.status || data?.status?.payment_request?.status;
        if (s === 'Credit' || s === 'Completed') {
          setView('success');
          setMessage('Payment successful!');
        } else if (s === 'Failed' || s === 'Cancelled') {
          setView('failed');
          setMessage('Payment failed or cancelled.');
        } else {
          setView('pending');
          setMessage('Payment pending. We will notify you once it completes.');
        }
      } catch {
        setView('failed');
        setMessage('Could not verify payment.');
      }
    };
    verify();

    // Background polling up to 60s total (every 5s x 12)
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      if (attempts > 12 || view === 'success' || view === 'failed') {
        clearInterval(interval);
        return;
      }
      await verify();
    }, 5000);

    return () => clearInterval(interval);
  }, [view, searchParams, router]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8 text-center">
      <h1 className="text-2xl font-bold mb-2">Order Confirmation</h1>
      <p className="mb-6">{message}</p>
      {view === 'success' && (
        <div className="space-x-2">
          <Button onClick={() => router.push('/account')}>Go to Account</Button>
          <Button variant="outline" onClick={() => router.push('/')}>Continue Shopping</Button>
        </div>
      )}
      {view !== 'success' && (
        <div className="space-x-2">
          <Button onClick={() => location.reload()}>Retry Verification</Button>
          <Button variant="outline" onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      )}
    </div>
  );
}


