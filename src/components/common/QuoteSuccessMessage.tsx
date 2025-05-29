import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const QuoteSuccessMessage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-green-50 rounded-lg p-8 mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quote Request Submitted!</h2>
        <p className="text-gray-600 mb-4">
          Thank you for your quote request. Our team will review your information and get back to you within 24 hours with a detailed quote tailored to your needs.
        </p>
        <p className="text-gray-600">
          A confirmation email has been sent to your email address.
        </p>
      </div>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
};

export default QuoteSuccessMessage;