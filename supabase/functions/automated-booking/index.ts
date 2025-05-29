import { serve } from 'npm:std/http/server';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import emailjs from 'npm:@emailjs/browser@4.3.3';

declare global {
  interface Window {
    Deno: {
      env: {
        get(key: string): string | undefined;
      };
    };
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      window.Deno.env.get('SUPABASE_URL') ?? '',
      window.Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { bookingData } = await req.json();

    // Create booking record
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        ...bookingData,
        status: 'confirmed',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Send confirmation email
    await emailjs.send(
      window.Deno.env.get('VITE_EMAILJS_SERVICE_ID') ?? '',
      window.Deno.env.get('VITE_EMAILJS_BOOKING_TEMPLATE_ID') ?? '',
      {
        to_email: bookingData.email,
        booking_reference: booking.reference,
        service_details: `${bookingData.service_type} - ${bookingData.vehicle_type}`,
        pickup_details: bookingData.pickup_location,
        delivery_details: bookingData.delivery_location,
        estimated_dates: `${bookingData.pickup_date} - ${bookingData.delivery_date}`,
        tracking_url: `${req.headers.get('origin')}/tracking/${booking.reference}`
      },
      {
        publicKey: window.Deno.env.get('VITE_EMAILJS_PUBLIC_KEY') ?? '',
      }
    );

    return new Response(
      JSON.stringify({ success: true, booking }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});