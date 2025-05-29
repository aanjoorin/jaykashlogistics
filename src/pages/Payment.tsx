import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import StripeCheckout from '../components/payment/StripeCheckout';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1475, // Amount in cents
          currency: 'usd',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsSuccess(true);
    // You might want to redirect to a success page or show a success message
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
              <p className="text-slate-600 mb-8">
                Your payment has been processed successfully. You will receive a confirmation email shortly.
              </p>
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Payment" 
        subtitle="Complete your payment securely"
        breadcrumbs={[{ name: "Payment", path: "/payment" }]}
      />

      <section className="section bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            {error && (
              <div className="mb-6 p-4 bg-error-light/10 text-error rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <CreditCard className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-2xl font-semibold">Payment Details</h2>
              </div>

              <div className="mb-8">
                <div className="bg-slate-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>$1,250.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance</span>
                      <span>$150.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Handling Fee</span>
                      <span>$75.00</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>$1,475.00</span>
                    </div>
                  </div>
                </div>

                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Loading payment form...</p>
                  </div>
                ) : clientSecret ? (
                  <StripeCheckout
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  <div className="text-center py-8 text-error">
                    <p>Failed to load payment form. Please try again later.</p>
                  </div>
                )}
              </div>

              <div className="text-sm text-slate-500 flex items-center justify-center">
                <img 
                  src="/stripe-badge.png" 
                  alt="Secured by Stripe" 
                  className="h-8 mr-2"
                />
                <span>Payments are securely processed by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;