import React, { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../lib/stripe';

interface PaymentFormProps {
  clientSecret: string;
  quoteRef: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ quoteRef, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/booking/confirmation`,
          payment_intent_data: {
            metadata: {
              quote_reference: quoteRef
            }
          }
        }
      });

      if (error) {
        onError(error.message || 'An error occurred during payment processing.');
      } else {
        onSuccess();
      }
    } catch (err) {
      onError('An unexpected error occurred.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn btn-primary w-full mt-6"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

interface StripePaymentProps {
  clientSecret: string;
  quoteRef: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({ clientSecret, quoteRef, onSuccess, onError }) => {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm
        clientSecret={clientSecret}
        quoteRef={quoteRef}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePayment;