import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import StripeCheckout from '../components/payment/StripeCheckout';
import { CreditCard, CheckCircle, AlertCircle, User, Mail, Phone, MapPin } from 'lucide-react';
import { navigateToPayment, generateBookingReference, PaymentData } from '../lib/payment';

interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  serviceType?: string;
  amount?: number;
  bookingReference?: string;
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    // Get form data from location state or URL params
    const data = location.state?.formData || getFormDataFromParams();
    setFormData(data);
    
    if (data?.amount) {
      createPaymentIntent(data.amount, data.bookingReference || generateBookingRef(), data.email || '');
    } else {
      setError('No payment information found. Please complete the booking form first.');
      setIsLoading(false);
    }
  }, [location]);

  const getFormDataFromParams = (): FormData => {
    const params = new URLSearchParams(location.search);
    return {
      firstName: params.get('firstName') || undefined,
      lastName: params.get('lastName') || undefined,
      email: params.get('email') || undefined,
      phone: params.get('phone') || undefined,
      pickupAddress: params.get('pickupAddress') || undefined,
      deliveryAddress: params.get('deliveryAddress') || undefined,
      vehicleMake: params.get('vehicleMake') || undefined,
      vehicleModel: params.get('vehicleModel') || undefined,
      vehicleYear: params.get('vehicleYear') || undefined,
      serviceType: params.get('serviceType') || undefined,
      amount: params.get('amount') ? parseInt(params.get('amount')!) : undefined,
      bookingReference: params.get('bookingReference') || undefined,
    };
  };

  const generateBookingRef = (): string => {
    return `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const createPaymentIntent = async (amount: number, bookingReference: string, email: string) => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: 'usd',
          booking_reference: bookingReference,
          receipt_email: email,
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

  const handlePaymentSuccess = async () => {
    setIsSuccess(true);
    
    // Send confirmation email if form data is available
    if (formData?.email) {
      try {
        // Now send the email
        await sendEmail('ocean_freight_template', { ...formData, payment_status: 'completed' });
      } catch (error) {
        console.error('Error sending confirmation email:', error);
      }
    }
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  const calculateFees = (baseAmount: number) => {
    const insurance = baseAmount * 0.12; // 12% insurance
    const handling = baseAmount * 0.06; // 6% handling fee
    const total = baseAmount + insurance + handling;
    
    return {
      base: baseAmount,
      insurance,
      handling,
      total
    };
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
              <p className="text-slate-600 mb-4">
                Your payment has been processed successfully. You will receive a confirmation email shortly.
              </p>
              {formData?.bookingReference && (
                <div className="bg-slate-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-slate-600">Booking Reference:</p>
                  <p className="font-mono font-semibold text-lg">{formData.bookingReference}</p>
                </div>
              )}
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

  if (!formData) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">No Booking Information</h2>
              <p className="text-slate-600 mb-6">
                Please complete a booking form first before proceeding to payment.
              </p>
              <button
                onClick={() => navigate('/request-forms')}
                className="btn btn-primary"
              >
                Go to Booking Forms
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fees = formData.amount ? calculateFees(formData.amount) : null;

  return (
    <div>
      <PageHeader 
        title="Complete Payment" 
        subtitle="Secure payment for your booking"
        breadcrumbs={[
          { name: "Booking", path: "/request-forms" },
          { name: "Payment", path: "/payment" }
        ]}
      />

      <section className="section bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Information */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Customer Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-500">Name</p>
                      <p className="font-medium">
                        {formData.firstName} {formData.lastName}
                      </p>
                    </div>
                    {formData.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="text-sm">{formData.email}</span>
                      </div>
                    )}
                    {formData.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-slate-400" />
                        <span className="text-sm">{formData.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Information */}
                {(formData.vehicleMake || formData.vehicleModel || formData.vehicleYear) && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
                    <div className="space-y-2">
                      {formData.vehicleYear && formData.vehicleMake && formData.vehicleModel && (
                        <p className="text-sm">
                          {formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Service Information */}
                {formData.serviceType && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Service Type</h3>
                    <p className="text-sm text-slate-600">{formData.serviceType}</p>
                  </div>
                )}
              </div>

              {/* Payment Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="flex items-center mb-6">
                    <CreditCard className="h-6 w-6 text-primary mr-2" />
                    <h2 className="text-2xl font-semibold">Payment Details</h2>
                  </div>

                  {/* Order Summary */}
                  {fees && (
                    <div className="mb-8">
                      <div className="bg-slate-50 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold mb-3">Order Summary</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Service Fee</span>
                            <span>${fees.base.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Insurance</span>
                            <span>${fees.insurance.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Handling Fee</span>
                            <span>${fees.handling.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-2 border-t border-slate-200">
                            <span>Total</span>
                            <span>${fees.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Form */}
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p>Loading payment form...</p>
                    </div>
                  ) : clientSecret ? (
                    <StripeCheckout
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  ) : (
                    <div className="text-center py-8 text-red-600">
                      <p>Failed to load payment form. Please try again later.</p>
                    </div>
                  )}

                  {/* Security Notice */}
                  <div className="mt-6 text-sm text-slate-500 flex items-center justify-center">
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
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;