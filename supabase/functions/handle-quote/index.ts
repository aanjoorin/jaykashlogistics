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
      const serviceType = quoteData.serviceType || quoteData.service_type;
      
      // Determine customer name and email based on form type
      let customerName, customerEmail, customerPhone;
      
      if (quoteData.firstName && quoteData.lastName) {
        // Standard quote form (main request-quote) or Ocean Freight
        customerName = `${quoteData.firstName} ${quoteData.lastName}`;
        customerEmail = quoteData.email;
        customerPhone = quoteData.phone;
      } else if (quoteData.shipperName) {
        // Inland Freight or Dispatch forms
        customerName = quoteData.shipperName;
        customerEmail = quoteData.shipperEmail;
        customerPhone = quoteData.shipperPhone;
      }
      
      // Build vehicle details
      const vehicleDetails = `${quoteData.vehicleYear || ''} ${quoteData.vehicleMake || ''} ${quoteData.vehicleModel || ''}`.trim();
      
      // Build origin and destination based on service type
      let origin = quoteData.origin || quoteData.pickupAddress || quoteData.loadingPort || 'N/A';
      let destination = quoteData.destination || quoteData.deliveryAddress || quoteData.dischargePort || 'N/A';
      
      // Build buyer/consignee details
      let buyerDetails = '';
      if (quoteData.buyerName && quoteData.buyerPhone) {
        buyerDetails = `${quoteData.buyerName} - ${quoteData.buyerPhone}`;
      } else if (quoteData.consigneeName) {
        buyerDetails = `${quoteData.consigneeName} - ${quoteData.consigneePhone || 'N/A'}`;
      }
      
      const { data: quote, error } = await supabase
        .from('quotes')
        .insert({
          reference,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          company_name: quoteData.company,
          service_type: serviceType,
          origin: origin,
          destination: destination,
          vehicle_details: vehicleDetails || 'N/A',
          vin_number: quoteData.vinNumber,
          buyer_details: buyerDetails || null,
          lot_number: quoteData.lotNumber,
          is_car_title_ready: quoteData.isCarTitleReady,
          pickup_location_type: quoteData.pickupLocationType,
          delivery_location_type: quoteData.deliveryLocationType,
          shipping_line: quoteData.shipline || quoteData.carrier,
          origin_port: quoteData.originPort || quoteData.loadingPort,
          special_requirements: quoteData.specialRequirements || quoteData.vehicleCondition,
          // Ocean Freight specific fields
          consignee_name: quoteData.consigneeName,
          consignee_address: quoteData.consigneeAddress,
          consignee_phone: quoteData.consigneePhone,
          vehicle_category: quoteData.vehicleCategory,
          title_number: quoteData.titleNumber,
          title_state: quoteData.titleState,
          declared_value: quoteData.declaredValue,
          notify_party: quoteData.notifyParty,
          // Inland Freight and Dispatch specific fields
          pickup_contact_name: quoteData.pickupContactName,
          pickup_contact_phone: quoteData.pickupContactPhone,
          pickup_address: quoteData.pickupAddress,
          delivery_address: quoteData.deliveryAddress,
          is_runner: quoteData.isRunner,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Build email message based on service type
      let emailMessage = `
        A new quote request has been submitted.
        
        Quote Reference: ${quote.reference}
        Service: ${serviceType}
        Vehicle: ${vehicleDetails || 'N/A'}
        VIN: ${quoteData.vinNumber || 'N/A'}
        
        Customer Details:
        Name: ${customerName}
        Email: ${customerEmail}
        Phone: ${customerPhone}
      `;

      // Add service-specific details
      if (serviceType === 'Ocean Freight') {
        emailMessage += `
        
        Shipping Details:
        Loading Port: ${quoteData.loadingPort || 'N/A'}
        Discharge Port: ${quoteData.dischargePort || 'N/A'}
        Carrier: ${quoteData.carrier || 'N/A'}
        
        Consignee Details:
        Name: ${quoteData.consigneeName || 'N/A'}
        Address: ${quoteData.consigneeAddress || 'N/A'}
        Phone: ${quoteData.consigneePhone || 'N/A'}
        
        Vehicle Details:
        Category: ${quoteData.vehicleCategory || 'N/A'}
        Title Number: ${quoteData.titleNumber || 'N/A'}
        Title State: ${quoteData.titleState || 'N/A'}
        Declared Value: ${quoteData.declaredValue || 'N/A'}
        `;
      } else if (serviceType === 'Inland Freight' || serviceType === 'Dispatch Service') {
        emailMessage += `
        
        Pickup Details:
        Location Type: ${quoteData.pickupLocationType || 'N/A'}
        Address: ${quoteData.pickupAddress || 'N/A'}
        Contact: ${quoteData.pickupContactName || 'N/A'} - ${quoteData.pickupContactPhone || 'N/A'}
        
        Delivery Details:
        Location Type: ${quoteData.deliveryLocationType || 'N/A'}
        Address: ${quoteData.deliveryAddress || 'N/A'}
        
        Vehicle Details:
        Buyer: ${quoteData.buyerName || 'N/A'} - ${quoteData.buyerPhone || 'N/A'}
        Lot Number: ${quoteData.lotNumber || 'N/A'}
        Is Runner: ${quoteData.isRunner ? 'Yes' : 'No'}
        Title Ready: ${quoteData.isCarTitleReady ? 'Yes' : 'No'}
        `;
      } else {
        // Standard quote
        emailMessage += `
        
        From: ${origin}
        To: ${destination}
        `;
      }

      emailMessage += `
        
        You can view the full details in the admin dashboard.
      `;

      const templateParams = {
        to_name: 'Admin',
        from_name: customerName,
        from_email: customerEmail,
        subject: `New ${serviceType} Quote Request - Ref: ${quote.reference}`,
        message: emailMessage
      };

      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_ADMIN_TEMPLATE_ID!,
        templateParams
      );

      // Send confirmation email to customer
      const customerMessage = `
        Dear ${customerName},
        
        Thank you for requesting a quote with JayKash Logistics!
        
        We have successfully received your ${serviceType} quote request.
        
        Quote Reference: ${quote.reference}
        Service: ${serviceType}
        ${vehicleDetails ? `Vehicle: ${vehicleDetails}` : ''}
        ${origin !== 'N/A' ? `From: ${origin}` : ''}
        ${destination !== 'N/A' ? `To: ${destination}` : ''}
        
        Our team is reviewing your request and will get back to you shortly with a detailed quote.
        
        Please keep your reference number (${quote.reference}) for future correspondence.
        
        If you have any urgent questions, please don't hesitate to contact us.
        
        Best regards,
        JayKash Logistics Team
      `;

      const customerTemplateParams = {
        to_name: customerName,
        to_email: customerEmail,
        subject: `Quote Request Received - Ref: ${quote.reference}`,
        message: customerMessage,
        quote_reference: quote.reference
      };

      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID!,
        process.env.EMAILJS_CUSTOMER_CONFIRMATION_TEMPLATE_ID!,
        customerTemplateParams
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