import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'npm:stripe@14';
import { createClient } from 'npm:@supabase/supabase-js@2';
import emailjs from 'npm:@emailjs/nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      throw new Error('No signature found');
    }

    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    emailjs.init({
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
    });

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const quoteId = paymentIntent.metadata.booking_reference;

        if (!quoteId) {
          throw new Error('Booking reference not found in payment intent metadata.');
        }

        // Update quote status to 'confirmed'
        const { data: updatedQuote, error } = await supabase
          .from('quotes')
          .update({ status: 'confirmed' })
          .eq('id', quoteId)
          .select()
          .single();

        if (error) {
          throw new Error(`Failed to update quote status: ${error.message}`);
        }
        
        // Send confirmation email to customer
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID!,
            process.env.EMAILJS_BOOKING_TEMPLATE_ID!, // Assuming this is the customer confirmation template
            {
              to_email: updatedQuote.customer_email,
              payment_id: paymentIntent.id,
              amount: (paymentIntent.amount / 100).toFixed(2),
              currency: paymentIntent.currency.toUpperCase(),
              booking_reference: updatedQuote.reference,
              subject: '[Payment Successful] New Booking Confirmation'
            }
        );
          
        // Send notification email to admin
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID!,
            process.env.EMAILJS_ADMIN_BOOKING_TEMPLATE_ID!, // A new template for admin notifications
            {
              booking_reference: updatedQuote.reference,
              customer_email: updatedQuote.customer_email,
              amount: (paymentIntent.amount / 100).toFixed(2),
              subject: '[Payment Successful] New Booking Confirmation'
            }
        );

        break;

      case 'payment_intent.payment_failed':
        // Handle failed payment if needed
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});