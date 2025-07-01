import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Mail, Phone, MapPin } from 'lucide-react';
import { sendEmail } from '../lib/emailjs';

interface PaymentSuccessData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  serviceType?: string;
  bookingReference?: string;
  amount?: number;
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Get data from location state or URL params
  const getSuccessData = (): PaymentSuccessData => {
    if (location.state?.formData) {
      return location.state.formData;
    }
    
    const params = new URLSearchParams(location.search);
    return {
      firstName: params.get('firstName') || undefined,
      lastName: params.get('lastName') || undefined,
      email: params.get('email') || undefined,
      phone: params.get('phone') || undefined,
      serviceType: params.get('serviceType') || undefined,
      bookingReference: params.get('bookingReference') || undefined,
      amount: params.get('amount') ? parseInt(params.get('amount')!) : undefined,
    };
  };

  const successData = getSuccessData();

  useEffect(() => {
    // Send confirmation email if we have the data
    if (successData.email && !emailSent) {
      sendConfirmationEmail();
    }
  }, [successData.email, emailSent]);

  const sendConfirmationEmail = async () => {
    if (!successData.email) return;
    
    setIsLoading(true);
    try {
      await sendEmail('payment_confirmation_template', {
        ...successData,
        payment_status: 'completed',
        payment_date: new Date().toISOString(),
      });
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReceipt = () => {
    // Generate and download receipt
    const receiptData = {
      bookingReference: successData.bookingReference,
      customerName: `${successData.firstName} ${successData.lastName}`,
      serviceType: successData.serviceType,
      amount: successData.amount,
      paymentDate: new Date().toLocaleDateString(),
    };

    const receiptText = `
      JAYKASH LOGISTICS - PAYMENT RECEIPT
      
      Booking Reference: ${receiptData.bookingReference}
      Customer: ${receiptData.customerName}
      Service: ${receiptData.serviceType}
      Amount: $${receiptData.amount?.toFixed(2)}
      Payment Date: ${receiptData.paymentDate}
      
      Thank you for your payment!
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptData.bookingReference}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="text-center">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Payment Successful!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Your booking has been confirmed and payment has been processed successfully.
              </p>
              
              {successData.bookingReference && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-green-600 mb-2">Booking Reference:</p>
                  <p className="font-mono font-bold text-xl text-green-800">
                    {successData.bookingReference}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {successData.firstName} {successData.lastName}
                  </p>
                </div>
                {successData.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{successData.email}</span>
                  </div>
                )}
                {successData.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{successData.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Service Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Service Type</p>
                  <p className="font-medium">{successData.serviceType}</p>
                </div>
                {successData.amount && (
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="font-bold text-xl text-green-600">
                      ${successData.amount.toFixed(2)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Payment Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Confirmation Email</h3>
                  <p className="text-gray-600 text-sm">
                    You'll receive a detailed confirmation email with all booking information.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Team Contact</h3>
                  <p className="text-gray-600 text-sm">
                    Our logistics team will contact you within 24 hours to discuss pickup arrangements.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Service Execution</h3>
                  <p className="text-gray-600 text-sm">
                    We'll coordinate pickup, shipping, and delivery according to your requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadReceipt}
                className="btn btn-outline flex items-center justify-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </button>
              
              <button
                onClick={() => navigate('/contact')}
                className="btn btn-outline flex items-center justify-center"
              >
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="btn btn-primary flex-1"
              >
                Return to Home
              </button>
            </div>
          </div>

          {/* Email Status */}
          {isLoading && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Sending confirmation email...
            </div>
          )}
          
          {emailSent && (
            <div className="mt-4 text-center text-sm text-green-600">
              ✓ Confirmation email sent successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 