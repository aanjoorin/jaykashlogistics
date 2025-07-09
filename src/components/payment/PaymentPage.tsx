import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import StripeCheckout from './StripeCheckout';
import { createPaymentIntent } from '../../lib/stripe';
import { sendPaymentConfirmationEmails } from '../../lib/emailjs';
import { paypalConfig, createPayPalOrder } from '../../lib/paypal';
import { CreditCard, DollarSign, Upload, CheckCircle, AlertCircle, Info } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentPageProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  customerEmail?: string;
  customerName?: string;
  serviceType?: string;
  bookingReference?: string;
  bookingDetails?: string;
}

type PaymentMethod = 'paypal' | 'zelle' | 'cashapp' | 'venmo' | 'stripe';

const PaymentPage: React.FC<PaymentPageProps> = ({ 
  amount, 
  onSuccess, 
  onError, 
  customerEmail = '',
  customerName = '',
  serviceType = '',
  bookingReference = '',
  bookingDetails = ''
}) => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentId, setPaymentId] = useState<string>('');

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const bookingRef = bookingReference || `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const secret = await createPaymentIntent(amount, bookingRef, customerEmail);
        setClientSecret(secret);
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
      }
    };

    if (selectedMethod === 'stripe') {
      initializeStripe();
    }
  }, [amount, customerEmail, bookingReference, selectedMethod]);

  const handlePaymentSuccess = async (paymentMethod: PaymentMethod, paymentId?: string) => {
    setIsProcessing(true);
    try {
      await sendPaymentConfirmationEmails({
        customerName,
        customerEmail,
        serviceType,
        amount: (amount / 100).toFixed(2),
        paymentMethod: paymentMethod.toUpperCase(),
        bookingReference: bookingReference || `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        bookingDetails,
        paymentId: paymentId || 'N/A'
      });
      
      onSuccess();
    } catch (error) {
      console.error('Error sending confirmation emails:', error);
      // Still call onSuccess since payment was successful
      onSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const handleManualPaymentSubmit = async () => {
    if (!paymentProof) {
      onError('Please upload proof of payment');
      return;
    }

    setIsProcessing(true);
    try {
      // In a real application, you would upload the file to your server
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await handlePaymentSuccess(selectedMethod, `MANUAL-${Date.now()}`);
    } catch (error) {
      onError('Failed to submit payment proof. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      description: 'Pay securely with your PayPal account',
      icon: '💳',
      color: 'bg-blue-50 border-blue-200',
      activeColor: 'bg-blue-100 border-blue-500'
    },
    {
      id: 'zelle' as PaymentMethod,
      name: 'Zelle',
      description: 'Send payment via Zelle to our business account',
      icon: '🏦',
      color: 'bg-purple-50 border-purple-200',
      activeColor: 'bg-purple-100 border-purple-500'
    },
    {
      id: 'cashapp' as PaymentMethod,
      name: 'Cash App',
      description: 'Send payment via Cash App',
      icon: '💚',
      color: 'bg-green-50 border-green-200',
      activeColor: 'bg-green-100 border-green-500'
    },
    {
      id: 'venmo' as PaymentMethod,
      name: 'Venmo',
      description: 'Send payment via Venmo',
      icon: '💙',
      color: 'bg-blue-50 border-blue-200',
      activeColor: 'bg-blue-100 border-blue-500'
    },
    {
      id: 'stripe' as PaymentMethod,
      name: 'Credit/Debit Card',
      description: 'Pay with any major credit or debit card',
      icon: '💳',
      color: 'bg-gray-50 border-gray-200',
      activeColor: 'bg-gray-100 border-gray-500'
    }
  ];

  const getPaymentInstructions = (method: PaymentMethod) => {
    switch (method) {
      case 'zelle':
        return {
          title: 'Zelle Payment Instructions',
          steps: [
            'Open your banking app and select Zelle',
            'Send payment to: business@jaykash.com',
            'Include your booking reference in the memo',
            'Upload a screenshot of the payment confirmation below'
          ],
          account: 'business@jaykash.com'
        };
      case 'cashapp':
        return {
          title: 'Cash App Payment Instructions',
          steps: [
            'Open Cash App on your phone',
            'Send payment to: $JaykashLogistics',
            'Include your booking reference in the note',
            'Upload a screenshot of the payment confirmation below'
          ],
          account: '$JaykashLogistics'
        };
      case 'venmo':
        return {
          title: 'Venmo Payment Instructions',
          steps: [
            'Open Venmo on your phone',
            'Send payment to: @JaykashLogistics',
            'Include your booking reference in the note',
            'Upload a screenshot of the payment confirmation below'
          ],
          account: '@JaykashLogistics'
        };
      default:
        return null;
    }
  };

  const instructions = getPaymentInstructions(selectedMethod);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Complete Your Payment</h2>
        
        {/* Order Summary */}
        <div className="mb-8">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span>Total Amount:</span>
              <span className="text-xl font-bold">${(amount / 100).toFixed(2)}</span>
            </div>
            {serviceType && (
              <div className="text-sm text-gray-600 mt-1">
                Service: {serviceType}
              </div>
            )}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedMethod === method.id
                    ? method.activeColor
                    : method.color
                } hover:shadow-md`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <div>
                    <div className="font-semibold">{method.name}</div>
                    <div className="text-sm text-gray-600">{method.description}</div>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Instructions for Manual Methods */}
        {instructions && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-600" />
                {instructions.title}
              </h3>
              <div className="mb-4">
                <div className="font-semibold text-blue-800 mb-2">Account:</div>
                <div className="bg-white p-3 rounded border font-mono text-lg">
                  {instructions.account}
                </div>
              </div>
              <div className="mb-4">
                <div className="font-semibold text-blue-800 mb-2">Steps:</div>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {instructions.steps.map((step, index) => (
                    <li key={index} className="text-gray-700">{step}</li>
                  ))}
                </ol>
              </div>
              
              {/* File Upload */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Payment Proof *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {paymentProof && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: JPG, PNG, PDF (Max 5MB)
                </p>
              </div>

              <button
                onClick={handleManualPaymentSubmit}
                disabled={!paymentProof || isProcessing}
                className="mt-4 w-full btn btn-primary disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Submit Payment Proof'}
              </button>
            </div>
          </div>
        )}

        {/* PayPal Payment */}
        {selectedMethod === 'paypal' && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">PayPal Payment</h3>
              <PayPalScriptProvider options={paypalConfig}>
                <PayPalButtons
                  createOrder={(data, actions) => {
                    return actions.order.create(
                      createPayPalOrder(amount, `${serviceType} - ${bookingReference}`)
                    );
                  }}
                  onApprove={async (data, actions) => {
                    if (actions.order) {
                      const order = await actions.order.capture();
                      setPaymentId(order.id);
                      await handlePaymentSuccess('paypal', order.id);
                    }
                  }}
                  onError={(err) => {
                    onError('PayPal payment failed. Please try again.');
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        )}

        {/* Stripe Payment */}
        {selectedMethod === 'stripe' && clientSecret && (
          <div className="mb-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Credit/Debit Card Payment</h3>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeCheckout
                  clientSecret={clientSecret}
                  onSuccess={() => handlePaymentSuccess('stripe')}
                  onError={onError}
                />
              </Elements>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-slate-500">
          <p>All payments are processed securely</p>
          <div className="flex justify-center items-center mt-2 space-x-4">
            <img 
              src="/stripe-badge.png" 
              alt="Secured by Stripe" 
              className="h-8"
            />
            <img 
              src="/paypal-badge.png" 
              alt="Secured by PayPal" 
              className="h-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;