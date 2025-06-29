import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import StripeCheckout from '../components/payment/StripeCheckout';
import { sendEmailToAdmin, sendCustomerConfirmationEmail } from '../lib/emailjs';

const SERVICE_FEE = 1250;
const INSURANCE = 150;
const HANDLING_FEE = 75;
const TOTAL_AMOUNT = SERVICE_FEE + INSURANCE + HANDLING_FEE; // $1,475

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    const data = localStorage.getItem('bookingFormData');
    if (data) setFormData(JSON.parse(data));
    else navigate('/booking'); // If no data, redirect back
  }, [navigate]);

  useEffect(() => {
    // Fetch clientSecret from your backend
    const createPaymentIntent = async () => {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: TOTAL_AMOUNT * 100 }) // Stripe expects cents
      });
      const { clientSecret } = await res.json();
      setClientSecret(clientSecret);
    };
    createPaymentIntent();
  }, []);

  const handlePaymentSuccess = async () => {
    if (!formData) return;
    try {
      await sendEmailToAdmin({
        ...formData,
        payment_status: 'completed',
        amount: TOTAL_AMOUNT
      });
      await sendCustomerConfirmationEmail({
        ...formData,
        payment_status: 'completed',
        amount: TOTAL_AMOUNT
      });
      setPaymentSuccess(true);
      localStorage.removeItem('bookingFormData');
    } catch (error) {
      alert('Payment succeeded, but failed to send confirmation email.');
      setPaymentSuccess(true);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
        <p>Your booking is confirmed. Check your email for details.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary mt-6">Return Home</button>
      </div>
    );
  }

  if (!formData) return <div>Loading...</div>;

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
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-semibold">Payment Details</h2>
              </div>

              <div className="mb-8">
                <div className="bg-slate-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service Fee</span>
                      <span>${SERVICE_FEE.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Insurance</span>
                      <span>${INSURANCE.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Handling Fee</span>
                      <span>${HANDLING_FEE.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t border-slate-200">
                      <span>Total</span>
                      <span>${TOTAL_AMOUNT.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {clientSecret && (
                  <StripeCheckout
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={err => alert('Payment failed: ' + err)}
                  />
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