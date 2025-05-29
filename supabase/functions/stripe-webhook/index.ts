import { serve } from 'npm:std/http/server';
import Stripe from 'npm:stripe@14.14.0';
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

const stripe = new Stripe(window.Deno.env.get('STRIPE_SECRET_KEY') || '', {
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
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      window.Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Send confirmation email
        await emailjs.send(
          window.Deno.env.get('VITE_EMAILJS_SERVICE_ID') || '',
          window.Deno.env.get('VITE_EMAILJS_BOOKING_TEMPLATE_ID') || '',
          {
            to_email: paymentIntent.receipt_email,
            payment_id: paymentIntent.id,
            amount: (paymentIntent.amount / 100).toFixed(2),
            currency: paymentIntent.currency.toUpperCase(),
            booking_reference: paymentIntent.metadata.booking_reference
          },
          {
            publicKey: window.Deno.env.get('VITE_EMAILJS_PUBLIC_KEY') || '',
          }
        );
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        // Send failure notification
        await emailjs.send(
          window.Deno.env.get('VITE_EMAILJS_SERVICE_ID') || '',
          window.Deno.env.get('VITE_EMAILJS_TEMPLATE_ID') || '',
          {
            to_email: failedPayment.receipt_email,
            payment_id: failedPayment.id,
            error_message: failedPayment.last_payment_error?.message || 'Payment failed'
          },
          {
            publicKey: window.Deno.env.get('VITE_EMAILJS_PUBLIC_KEY') || '',
          }
        );
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});