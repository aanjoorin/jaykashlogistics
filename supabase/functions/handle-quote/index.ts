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
      window.Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { action, quoteData } = await req.json();

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
        // Send approval email to customer
        await emailjs.send(
          window.Deno.env.get('VITE_EMAILJS_SERVICE_ID') ?? '',
          window.Deno.env.get('VITE_EMAILJS_APPROVAL_TEMPLATE_ID') ?? '',
          {
            to_email: quote.customer_email,
            quote_reference: quote.reference,
            amount: quote.amount,
            booking_url: `${req.headers.get('origin')}/book-now/${quote.service_type.toLowerCase()}?ref=${quote.reference}`
          },
          {
            publicKey: window.Deno.env.get('VITE_EMAILJS_PUBLIC_KEY') ?? '',
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error('Invalid action');
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});