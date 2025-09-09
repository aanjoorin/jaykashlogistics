import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase'; // Corrected import path

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
    });

    if (error) {
      setError(error.message || 'An unexpected error occurred.');
      setIsProcessing(false);
    } else {
      navigate('/payment/success');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn btn-primary w-full"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </form>
  );
};

interface StripeCheckoutProps {
  amount: number;
  quoteId: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ amount, quoteId }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { 
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            booking_reference: quoteId 
          },
        });

        if (error) throw new Error(error.message);
        
        setClientSecret(data.clientSecret);

      } catch (err: any) {
        console.error('Error creating payment intent:', err);
      }
    };

    createPaymentIntent();
  }, [amount, quoteId]);

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }
  
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default StripeCheckout;