import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import emailjs from 'npm:@emailjs/nodejs';

const generateReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
    );

    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY!,
      privateKey: process.env.EMAILJS_PRIVATE_KEY!,
    });

    const authorization = req.headers.get('Authorization');
    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      await supabase.auth.getUser(token);
    }
    
    const { action, quoteData } = await req.json();

    if (action === 'submit_quote') {
      const reference = generateReference();
      const vehicleDetails = `${quoteData.vehicleYear} ${quoteData.vehicleMake} ${quoteData.vehicleModel}`.trim();
      const { data: quote, error } = await supabase
        .from('quotes')
        .insert({
          reference,
          customer_name: `${quoteData.firstName} ${quoteData.lastName}`,
          customer_email: quoteData.email,
          customer_phone: quoteData.phone,
          company_name: quoteData.company,
          service_type: quoteData.serviceType,
          origin: quoteData.origin,
          destination: quoteData.destination,
          vehicle_details: vehicleDetails || 'N/A',
          vin_number: quoteData.vinNumber,
          buyer_details: `${quoteData.buyerName} - ${quoteData.buyerPhone}`,
          lot_number: quoteData.lotNumber,
          is_car_title_ready: quoteData.isCarTitleReady,
          pickup_location_type: quoteData.pickupLocationType,
          delivery_location_type: quoteData.deliveryLocationType,
          shipping_line: quoteData.shipline,
          origin_port: quoteData.originPort,
          special_requirements: quoteData.specialRequirements,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      const templateParams = {
        to_name: 'Admin',
        from_name: `${quoteData.firstName} ${quoteData.lastName}`,
        from_email: quoteData.email,
        subject: `New Quote Request - Ref: ${quote.reference}`,
        message: `
          A new quote request has been submitted.
          
          Quote Reference: ${quote.reference}
          Service: ${quoteData.serviceType}
          Vehicle: ${quoteData.vehicleYear} ${quoteData.vehicleMake} ${quoteData.vehicleModel}
          VIN: ${quoteData.vinNumber}
          From: ${quoteData.origin}
          To: ${quoteData.destination}
          
          Customer Details:
          Name: ${quoteData.firstName} ${quoteData.lastName}
          Email: ${quoteData.email}
          Phone: ${quoteData.phone}
          
          You can view the full details in the admin dashboard.
        `
      };

      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_ADMIN_TEMPLATE_ID!,
        templateParams
      );

      return new Response(
        JSON.stringify({ success: true, quote }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'update_quote') {
      const { data: quote } = await supabase
        .from('quotes')
        .update({ 
          status: 'approved',
          amount: quoteData.amount,
          approved_at: new Date().toISOString()
        })
        .eq('id', quoteData.id)
        .select()
        .single();

      if (quote) {
        const templateParams = {
          to_email: quote.customer_email,
          quote_reference: quote.reference,
          amount: quote.amount,
          booking_url: `${req.headers.get('origin')}/book-now/${quote.reference}`
        };

        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID!,
          process.env.EMAILJS_APPROVAL_TEMPLATE_ID!,
          templateParams,
          {
            publicKey: process.env.EMAILJS_PUBLIC_KEY!,
            privateKey: process.env.EMAILJS_PRIVATE_KEY!,
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    console.error('Error handling quote:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});