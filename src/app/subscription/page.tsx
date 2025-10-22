'use client';

// src/app/subscription/page.tsx
// Subscription payment page with Razorpay integration
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2, Check, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    checkSubscriptionStatus();
    loadRazorpayScript();
  }, [user]);

  const checkSubscriptionStatus = async () => {
    try {
      const res = await fetch('/api/subscription/check');
      const data = await res.json();
      setHasActiveSubscription(data.hasActiveSubscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const loadRazorpayScript = () => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login first');
      router.push('/login');
      return;
    }

    setLoading(true);

    try {
      // Create subscription
      const res = await fetch('/api/subscription/create', {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to create subscription');
        setLoading(false);
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: data.razorpayKeyId,
        subscription_id: data.subscriptionId,
        name: 'Marketplace',
        description: 'Monthly Subscription - ₹10/month',
        image: '/logo.png', // Add your logo
        prefill: {
          name: data.userName,
          email: data.userEmail,
          contact: data.userPhone,
        },
        theme: {
          color: '#2563eb', // Blue color
        },
        handler: async function (response: any) {
          // Payment successful, verify on backend
          await verifyPayment(response);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Subscribe error:', error);
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  const verifyPayment = async (paymentData: any) => {
    try {
      const res = await fetch('/api/subscription/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_subscription_id: paymentData.razorpay_subscription_id,
          razorpay_signature: paymentData.razorpay_signature,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Subscription activated! 🎉');
        // Update user context
        window.location.href = '/product/new'; // Redirect to create product
      } else {
        toast.error(data.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verify payment error:', error);
      toast.error('Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user || checkingStatus) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (hasActiveSubscription) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">You're Already Subscribed!</h1>
          <p className="text-gray-600 mb-6">
            Your subscription is active. Start listing your products now.
          </p>
          <button
            onClick={() => router.push('/product/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            List a Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscribe to List Products</h1>
          <p className="text-gray-600">
            Get unlimited product listings for just ₹10/month
          </p>
        </div>

        {/* Pricing Card */}
        <div className="border-2 border-blue-600 rounded-lg p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-blue-600 mb-1">₹10</div>
            <div className="text-gray-600">per month</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span>List unlimited products</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span>Reach buyers across India</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span>Auto-renewal every month</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span>Manage listings from dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-600" size={20} />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold text-lg"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            <>
              <CreditCard size={20} />
              Subscribe Now
            </>
          )}
        </button>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Secure payment powered by Razorpay</p>
          <p className="mt-2">
            By subscribing, you agree to auto-renewal. Cancel anytime from your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}