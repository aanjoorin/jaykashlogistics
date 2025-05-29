import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import PageHeader from '../components/common/PageHeader';
import { Truck, Calendar, MapPin, DollarSign, Clock, AlertCircle } from 'lucide-react';

interface Booking {
  id: string;
  reference: string;
  status: string;
  service_type: string;
  vehicle_type: string;
  pickup_location: string;
  delivery_location: string;
  pickup_date: string;
  delivery_date: string;
  amount: number;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchBookings();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  };

  const fetchBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader 
        title="My Dashboard" 
        subtitle="Track your shipments and manage your bookings"
        breadcrumbs={[{ name: "Dashboard", path: "/dashboard" }]}
      />
      
      <section className="section bg-white">
        <div className="container-custom">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-primary-light/10 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-semibold ml-3">Active Shipments</h3>
              </div>
              <p className="text-3xl font-bold text-primary">
                {bookings.filter(b => b.status === 'in_transit').length}
              </p>
            </div>
            
            <div className="bg-accent-light/10 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-8 w-8 text-accent" />
                <h3 className="text-lg font-semibold ml-3">Upcoming Pickups</h3>
              </div>
              <p className="text-3xl font-bold text-accent">
                {bookings.filter(b => b.status === 'scheduled').length}
              </p>
            </div>
            
            <div className="bg-success-light/10 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <MapPin className="h-8 w-8 text-success" />
                <h3 className="text-lg font-semibold ml-3">Delivered</h3>
              </div>
              <p className="text-3xl font-bold text-success">
                {bookings.filter(b => b.status === 'delivered').length}
              </p>
            </div>
            
            <div className="bg-slate-100 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="h-8 w-8 text-slate-600" />
                <h3 className="text-lg font-semibold ml-3">Total Spent</h3>
              </div>
              <p className="text-3xl font-bold text-slate-600">
                ${bookings.reduce((sum, b) => sum + b.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-2xl font-semibold">Recent Bookings</h2>
            </div>
            
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 text-center">
                  <p>Loading bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-6 text-center">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">No bookings found</p>
                  <button 
                    onClick={() => navigate('/request-quote')}
                    className="btn btn-primary mt-4"
                  >
                    Get a Quote
                  </button>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-3 text-left">Booking Ref</th>
                      <th className="px-6 py-3 text-left">Service</th>
                      <th className="px-6 py-3 text-left">Route</th>
                      <th className="px-6 py-3 text-left">Dates</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-slate-200">
                        <td className="px-6 py-4">
                          <span className="font-medium">{booking.reference}</span>
                          <br />
                          <span className="text-sm text-slate-500">
                            {format(new Date(booking.created_at), 'MMM d, yyyy')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium">{booking.service_type}</span>
                          <br />
                          <span className="text-sm text-slate-500">{booking.vehicle_type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 text-slate-400 mr-1" />
                            {booking.pickup_location}
                            <Clock className="h-4 w-4 text-slate-400 mx-1" />
                            <MapPin className="h-4 w-4 text-slate-400 mr-1" />
                            {booking.delivery_location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div>Pickup: {format(new Date(booking.pickup_date), 'MMM d, yyyy')}</div>
                            <div>Delivery: {format(new Date(booking.delivery_date), 'MMM d, yyyy')}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'in_transit' ? 'bg-primary-light/10 text-primary' :
                            booking.status === 'scheduled' ? 'bg-accent-light/10 text-accent' :
                            booking.status === 'delivered' ? 'bg-success-light/10 text-success' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {booking.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => navigate(`/tracking/${booking.reference}`)}
                            className="text-primary hover:text-primary-dark font-medium"
                          >
                            Track Shipment
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;