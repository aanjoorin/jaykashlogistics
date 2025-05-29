import emailjs from 'emailjs-com';

interface QuoteData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  serviceType: string;
  vehicleType: string;
  origin: string;
  destination: string;
  pickupDate?: string;
  deliveryDate?: string;
  specialRequirements?: string;
  vinNumber?: string;
  vehicleCondition?: string;
  shipperName?: string;
  shipperPhone?: string;
  shipperEmail?: string;
  consigneeName?: string;
  consigneePhone?: string;
  consigneeAddress?: string;
  loadingPort?: string;
  dischargePort?: string;
}

export const submitQuoteRequest = async (quoteData: QuoteData) => {
  try {
    // Send email notification using EmailJS
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        to_email: import.meta.env.VITE_ADMIN_EMAIL,
        from_name: `${quoteData.firstName} ${quoteData.lastName}`,
        from_email: quoteData.email,
        subject: 'New Quote Request',
        message: `
          Customer Information:
          Name: ${quoteData.firstName} ${quoteData.lastName}
          Email: ${quoteData.email}
          Phone: ${quoteData.phone}
          Company: ${quoteData.company || 'N/A'}

          Shipping Details:
          Service Type: ${quoteData.serviceType}
          Vehicle Type: ${quoteData.vehicleType}
          Origin: ${quoteData.origin}
          Destination: ${quoteData.destination}
          Pickup Date: ${quoteData.pickupDate || 'Not specified'}
          Delivery Date: ${quoteData.deliveryDate || 'Not specified'}

          Vehicle Information:
          VIN: ${quoteData.vinNumber || 'Not provided'}
          Condition: ${quoteData.vehicleCondition || 'Not specified'}

          Additional Information:
          ${quoteData.specialRequirements || 'No special requirements'}

          Shipping Line Details:
          Loading Port: ${quoteData.loadingPort || 'Not specified'}
          Discharge Port: ${quoteData.dischargePort || 'Not specified'}

          Shipper Information:
          Name: ${quoteData.shipperName || quoteData.firstName + ' ' + quoteData.lastName}
          Phone: ${quoteData.shipperPhone || quoteData.phone}
          Email: ${quoteData.shipperEmail || quoteData.email}

          Consignee Information:
          Name: ${quoteData.consigneeName || 'Not provided'}
          Phone: ${quoteData.consigneePhone || 'Not provided'}
          Address: ${quoteData.consigneeAddress || 'Not provided'}
        `,
      },
      import.meta.env.VITE_EMAILJS_USER_ID
    );

    // Send confirmation email to customer
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID,
      {
        to_email: quoteData.email,
        customer_name: `${quoteData.firstName} ${quoteData.lastName}`,
        quote_details: `
          Service Type: ${quoteData.serviceType}
          Route: ${quoteData.origin} to ${quoteData.destination}
          Vehicle Type: ${quoteData.vehicleType}
        `,
      },
      import.meta.env.VITE_EMAILJS_USER_ID
    );

    return { success: true };
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
};