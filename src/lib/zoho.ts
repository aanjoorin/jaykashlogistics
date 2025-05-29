// import emailjs from '@emailjs/browser';
import { sendEmail, sendCustomerConfirmationEmail } from './emailjs';

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
}

// Generate a unique quote reference
const generateQuoteReference = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `QT-${timestamp}-${random}`;
};

export const submitQuoteRequest = async (quoteData: QuoteData) => {
  try {
    const quoteReference = generateQuoteReference();

    // Then replace the direct emailjs.send calls with:
    
    // Send quote request notification to admin
    await sendEmail(import.meta.env.VITE_EMAILJS_TEMPLATE_ID, {
      shipper_info: {
        name: `${quoteData.firstName} ${quoteData.lastName}`,
        email: quoteData.email,
        phone: quoteData.phone
      },
      service_type: quoteData.serviceType,
      // Map other fields as needed
    });
    
    // Send confirmation to customer
    await sendCustomerConfirmationEmail(import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID, {
      shipper_info: {
        name: `${quoteData.firstName} ${quoteData.lastName}`,
        email: quoteData.email,
        phone: quoteData.phone
      },
      service_type: quoteData.serviceType,
      // Map other fields as needed
    });

    return { success: true, quoteReference };
  } catch (error) {
    console.error('Error submitting quote:', error);
    throw error;
  }
};

// Store quote amounts (in a real app, this would be in a database)
const quoteAmounts: Record<string, number> = {};

// Admin function to set quote amount
export const setQuoteAmount = (quoteReference: string, amount: number) => {
  quoteAmounts[quoteReference] = amount;
};

// Get quote amount for booking
export const getQuoteAmount = (quoteReference: string): number | null => {
  return quoteAmounts[quoteReference] || null;
};

// Verify quote reference and return quote details
export const verifyQuoteReference = async (reference: string) => {
  try {
    const amount = getQuoteAmount(reference);
    if (amount === null) {
      return { valid: false };
    }
    
    return {
      valid: true,
      details: {
        reference,
        amount,
        // Add any other quote details you want to return
      }
    };
  } catch (error) {
    console.error('Error verifying quote reference:', error);
    return { valid: false };
  }
};

// import emailjs from '@emailjs/browser';
// import { sendEmail, sendCustomerConfirmationEmail } from './emailjs';

// interface QuoteData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   company?: string;
//   serviceType: string;
//   vehicleType: string;
//   origin: string;
//   destination: string;
//   pickupDate?: string;
//   deliveryDate?: string;
//   specialRequirements?: string;
// }

// // Generate a unique quote reference
// const generateQuoteReference = () => {
//   const timestamp = Date.now();
//   const random = Math.random().toString(36).substring(2, 8).toUpperCase();
//   return `QT-${timestamp}-${random}`;
// };

// export const submitQuoteRequest = async (quoteData: QuoteData) => {
//   try {
//     const quoteReference = generateQuoteReference();

//     // Send quote request notification to admin
//     await emailjs.sendEmail(
//       import.meta.env.VITE_EMAILJS_SERVICE_ID,
//       import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
//       {
//         to_email: import.meta.env.VITE_ADMIN_EMAIL,
//         from_name: `${quoteData.firstName} ${quoteData.lastName}`,
//         from_email: quoteData.email,
//         subject: 'New Quote Request',
//         message: `
//           Quote Reference: ${quoteReference}

//           Customer Information:
//           Name: ${quoteData.firstName} ${quoteData.lastName}
//           Email: ${quoteData.email}
//           Phone: ${quoteData.phone}
//           Company: ${quoteData.company || 'N/A'}

//           Shipping Details:
//           Service Type: ${quoteData.serviceType}
//           Vehicle Type: ${quoteData.vehicleType}
//           Origin: ${quoteData.origin}
//           Destination: ${quoteData.destination}
//           Pickup Date: ${quoteData.pickupDate || 'Not specified'}
//           Delivery Date: ${quoteData.deliveryDate || 'Not specified'}

//           Additional Information:
//           ${quoteData.specialRequirements || 'No special requirements'}
//         `,
//         quote_reference: quoteReference
//       },
//       import.meta.env.VITE_EMAILJS_USER_ID
//     );

//     // Send confirmation to customer
//     await emailjs.send(
//       import.meta.env.VITE_EMAILJS_SERVICE_ID,
//       import.meta.env.VITE_EMAILJS_BOOKING_TEMPLATE_ID,
//       {
//         to_email: quoteData.email,
//         customer_name: `${quoteData.firstName} ${quoteData.lastName}`,
//         quote_reference: quoteReference,
//         quote_details: `
//           Service Type: ${quoteData.serviceType}
//           Route: ${quoteData.origin} to ${quoteData.destination}
//           Vehicle Type: ${quoteData.vehicleType}
//         `
//       },
//       import.meta.env.VITE_EMAILJS_USER_ID
//     );

//     return { success: true, quoteReference };
//   } catch (error) {
//     console.error('Error submitting quote:', error);
//     throw error;
//   }
// };

// // Store quote amounts (in a real app, this would be in a database)
// const quoteAmounts: Record<string, number> = {};

// // Admin function to set quote amount
// export const setQuoteAmount = (quoteReference: string, amount: number) => {
//   quoteAmounts[quoteReference] = amount;
// };

// // Get quote amount for booking
// export const getQuoteAmount = (quoteReference: string): number | null => {
//   return quoteAmounts[quoteReference] || null;
// };

// // Verify quote reference and return quote details
// export const verifyQuoteReference = async (reference: string) => {
//   try {
//     const amount = getQuoteAmount(reference);
//     if (amount === null) {
//       return { valid: false };
//     }
    
//     return {
//       valid: true,
//       details: {
//         reference,
//         amount,
//         // Add any other quote details you want to return
//       }
//     };
//   } catch (error) {
//     console.error('Error verifying quote reference:', error);
//     return { valid: false };
//   }
// };