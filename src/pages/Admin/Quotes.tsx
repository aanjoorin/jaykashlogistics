import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../../lib/supabase';
import PageHeader from '../../components/common/PageHeader';
import { Search, RefreshCw, Send, Eye, DollarSign } from 'lucide-react';

interface Quote {
  id: string;
  created_at: string;
  status: string;
  customer_name: string;
  customer_email: string;
  service_type: string;
  vehicle_type: string;
  pickup_location: string;
  delivery_location: string;
  amount: number | null;
  user: {
    email: string;
  };
}

const Quotes: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [amount, setAmount] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = async () => {
    if (!selectedQuote || !amount) return;

    setUpdating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/handle-quote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          action: 'update_quote',
          quoteData: {
            id: selectedQuote.id,
            amount: parseFloat(amount)
          }
        })
      });

      if (!response.ok) throw new Error('Failed to send quote');

      setSelectedQuote(null);
      setAmount('');
      fetchQuotes();
    } catch (error) {
      console.error('Error sending quote:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSetAmountClick = (quote: Quote) => {
    setSelectedQuote(quote);
    setAmount(quote.amount?.toString() || '');
  };

  const handleModalClose = () => {
    setSelectedQuote(null);
    setAmount('');
  };

  const handleAmountSubmit = async () => {
    if (!selectedQuote) return;

    try {
      const { data, error } = await supabase.functions.invoke('handle-quote', {
        body: {
          action: 'update_quote',
          quoteData: {
            id: selectedQuote.id,
            amount: parseFloat(amount),
          },
        },
      });

      if (error) throw error;
      
      fetchQuotes();
      handleModalClose();
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };


  const filteredQuotes = quotes.filter(quote => {
    return (
      quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.delivery_location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <PageHeader 
        title="Quote Management" 
        subtitle="Review and manage customer quote requests"
        breadcrumbs={[{ name: "Quotes", path: "/admin/quotes" }]}
      />
      
      <section className="section bg-white">
        <div className="container-custom">
          {/* Search and Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search quotes..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={fetchQuotes}
              className="btn btn-outline"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          {/* Quotes Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Route</th>
                  <th className="p-4 text-left">Service</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      Loading quotes...
                    </td>
                  </tr>
                ) : filteredQuotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center">
                      No quotes found
                    </td>
                  </tr>
                ) : (
                  filteredQuotes.map((quote) => (
                    <tr key={quote.id} className="border-b border-slate-200">
                      <td className="p-4">
                        {format(new Date(quote.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">
                        <div>
                          <div>{quote.customer_name}</div>
                          <div className="text-sm text-slate-500">{quote.customer_email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>From: {quote.pickup_location}</div>
                          <div>To: {quote.delivery_location}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <div>{quote.service_type}</div>
                          <div className="text-slate-500">{quote.vehicle_type}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          quote.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {quote.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {quote.amount ? `$${quote.amount}` : '-'}
                      </td>
                      <td className="p-4">
                        {quote.status === 'pending' && (
                          <button
                            onClick={() => setSelectedQuote(quote)}
                            className="btn btn-sm btn-primary"
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Send Quote
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Set Quote Amount for {selectedQuote.id}
            </h3>
            <div className="mt-4">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                className="input-field mt-1"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAmountSubmit}
              >
                Save and Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quotes;