import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckout from './StripeCheckout';
import { createPaymentIntent } from '../../lib/stripe';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentPageProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  customerEmail?: string;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ amount, onSuccess, onError, customerEmail }) => {
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    const initializePayment = async () => {
      try {
        const bookingRef = `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const secret = await createPaymentIntent(amount, bookingRef, customerEmail || '');
        setClientSecret(secret);
      } catch (error) {
        onError('Failed to initialize payment');
      }
    };

    initializePayment();
  }, [amount, customerEmail, onError]);

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading payment form...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Complete Your Payment</h2>
        
        <div className="mb-8">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span>Total Amount:</span>
              <span className="text-xl font-bold">${(amount / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeCheckout
            clientSecret={clientSecret}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>Secure payment powered by Stripe</p>
          <img 
            src="/stripe-badge.png" 
            alt="Secured by Stripe" 
            className="h-8 mx-auto mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;