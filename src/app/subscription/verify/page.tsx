'use client';

// src/app/subscription/verify/page.tsx (FIXED)
// Cashfree redirects here after payment
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Separate component that uses useSearchParams
function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    verifyPayment();
  }, [searchParams]);

  const verifyPayment = async () => {
    try {
      // Get order ID from URL query params
      // Cashfree redirects with order_id parameter
      const orderId = searchParams.get('order_id');

      console.log('Order ID from URL:', orderId);

      if (!orderId) {
        setStatus('failed');
        setMessage('Order ID not found. Please try again.');
        return;
      }

      // Send order ID to backend for verification
      const res = await fetch('/api/subscription/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      console.log('Verification response:', data);

      if (res.ok && data.success) {
        setStatus('success');
        setMessage('Subscription activated! 🎉');
        
        // Redirect to product creation after 2 seconds
        setTimeout(() => {
          router.push('/product/new');
        }, 2000);
      } else {
        setStatus('failed');
        setMessage(data.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verify payment error:', error);
      setStatus('failed');
      setMessage('Payment verification failed. Please contact support.');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">{message}</p>
          <p className="text-sm text-gray-500">Redirecting to product creation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <XCircle className="text-red-600 mx-auto mb-4" size={48} />
        <h1 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => router.push('/subscription')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

// Loading component for Suspense
function VerifyLoading() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
        <p className="text-gray-600">Verifying payment...</p>
      </div>
    </div>
  );
}

// Main component wrapped with Suspense
export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent />
    </Suspense>
  );
}