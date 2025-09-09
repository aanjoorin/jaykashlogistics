import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import StripeCheckout from '../components/payment/StripeCheckout'; // Assuming this component exists

interface Quote {
  id: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  service_type: string;
  // Add other quote fields as necessary
}

const Booking: React.FC = () => {
  const { quoteRef } = useParams<{ quoteRef: string }>();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quoteRef) {
      setError('Quote reference is missing.');
      setLoading(false);
      return;
    }

    const fetchQuote = async () => {
      try {
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .eq('reference', quoteRef)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Quote not found.');
        
        setQuote(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [quoteRef]);

  if (loading) {
    return <div className="container-custom py-12">Loading...</div>;
  }

  if (error) {
    return <div className="container-custom py-12 text-red-500">Error: {error}</div>;
  }

  if (!quote) {
    return <div className="container-custom py-12">Quote not found.</div>;
  }

  if (quote.status === 'confirmed') {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Payment Successful!</h1>
        <p className="text-lg">Your booking with reference <strong>{quote.reference}</strong> is confirmed.</p>
        <p>A confirmation email has been sent to {quote.customer_email}.</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-6">Booking for {quote.service_type}</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quote Details</h2>
        <p><strong>Reference:</strong> {quoteRef}</p>
        <p><strong>Name:</strong> {quote.customer_name}</p>
        <p><strong>Email:</strong> {quote.customer_email}</p>
        <p className="text-2xl font-bold mt-4">Amount: ${quote.amount}</p>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <StripeCheckout amount={quote.amount} quoteId={quote.id} />
        </div>
      </div>
    </div>
  );
};

export default Booking;