import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import PaymentPage from '../components/payment/PaymentPage';
import { CheckCircle, AlertCircle, User, Mail, Phone, MapPin } from 'lucide-react';

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
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Get form data from location state or URL params
    const data = location.state?.formData || getFormDataFromParams();
    setFormData(data);
    
    if (!data?.amount) {
      setError('No payment information found. Please complete the booking form first.');
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

  const handlePaymentSuccess = async () => {
    // Payment success is handled by the PaymentPage component
    navigate('/payment/success', { 
      state: { formData } 
    });
  };

  const handlePaymentError = (error: string) => {
    setError(error);
  };

  if (error) {
    return (
      <div>
        <PageHeader 
          title="Payment Error" 
          subtitle="Unable to process payment"
          breadcrumbs={[
            { name: "Booking", path: "/request-forms" },
            { name: "Payment", path: "/payment" }
          ]}
        />
        <section className="section bg-slate-50">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold mb-4">Payment Error</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => navigate('/request-forms')}
                  className="btn btn-primary"
                >
                  Return to Booking
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!formData) {
    return (
      <div>
        <PageHeader 
          title="Payment" 
          subtitle="Loading payment information"
          breadcrumbs={[
            { name: "Booking", path: "/request-forms" },
            { name: "Payment", path: "/payment" }
          ]}
        />
        <section className="section bg-slate-50">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading payment information...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

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
                {formData.vehicleMake && (
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-primary" />
                      Vehicle Details
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-slate-500">Vehicle</p>
                        <p className="font-medium">
                          {formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Service Information */}
                {formData.serviceType && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Service Details</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-slate-500">Service Type</p>
                        <p className="font-medium">{formData.serviceType}</p>
                      </div>
                      {formData.pickupAddress && (
                        <div>
                          <p className="text-sm text-slate-500">From</p>
                          <p className="font-medium">{formData.pickupAddress}</p>
                        </div>
                      )}
                      {formData.deliveryAddress && (
                        <div>
                          <p className="text-sm text-slate-500">To</p>
                          <p className="font-medium">{formData.deliveryAddress}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Form */}
              <div className="lg:col-span-2">
                <PaymentPage
                  amount={(formData.amount || 0) * 100} // Convert to cents
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  customerEmail={formData.email}
                  customerName={`${formData.firstName} ${formData.lastName}`}
                  serviceType={formData.serviceType}
                  bookingReference={formData.bookingReference}
                  bookingDetails={`${formData.pickupAddress} to ${formData.deliveryAddress}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;