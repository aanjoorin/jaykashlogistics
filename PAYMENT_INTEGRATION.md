# Payment Integration Guide

This guide explains how to integrate the payment system into your booking forms so customers can enter their card details after completing forms.

## Overview

The payment system consists of:
- **Payment Page** (`/payment`) - Where customers enter card details
- **Payment Success Page** (`/payment/success`) - Confirmation page after successful payment
- **Payment Utilities** (`src/lib/payment.ts`) - Helper functions for payment integration
- **Stripe Integration** - Secure payment processing

## Quick Start

### 1. Import Payment Utilities

```typescript
import { navigateToPayment, generateBookingReference, PaymentData } from '../lib/payment';
```

### 2. Prepare Payment Data

After form submission, prepare the payment data:

```typescript
const paymentData: PaymentData = {
  firstName: formData.firstName,
  lastName: formData.lastName,
  email: formData.email,
  phone: formData.phone,
  serviceType: 'Ocean Freight Booking',
  amount: 1250, // Base amount (fees will be calculated automatically)
  bookingReference: generateBookingReference('OCEAN'),
};
```

### 3. Navigate to Payment

```typescript
// Using navigation state (recommended - more secure)
navigateToPayment(navigate, paymentData, 'state');

// Or using URL parameters (visible in URL, but works with page refresh)
navigateToPayment(navigate, paymentData, 'params');
```

## Complete Example

Here's a complete example of integrating payment into a form:

```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { navigateToPayment, generateBookingReference, PaymentData } from '../lib/payment';

const MyBookingForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Send email notification (optional)
      await sendEmail('booking_template', formData);

      // Generate booking reference
      const bookingRef = generateBookingReference(formData.serviceType);
      
      // Calculate payment amount
      const baseAmount = 1250; // Your pricing logic here
      
      // Prepare payment data
      const paymentData: PaymentData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        serviceType: formData.serviceType,
        amount: baseAmount,
        bookingReference: bookingRef,
      };

      // Navigate to payment page
      navigateToPayment(navigate, paymentData, 'state');
      
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields here */}
      <button type="submit">Proceed to Payment</button>
    </form>
  );
};
```

## Payment Data Interface

```typescript
interface PaymentData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  serviceType?: string;
  amount: number; // Required - base amount
  bookingReference?: string;
}
```

## Available Utilities

### `navigateToPayment(navigate, paymentData, method)`

Navigates to the payment page with form data.

**Parameters:**
- `navigate`: React Router's navigate function
- `paymentData`: PaymentData object
- `method`: 'state' (recommended) or 'params'

### `generateBookingReference(serviceType)`

Generates a unique booking reference.

**Parameters:**
- `serviceType`: String to use as prefix (e.g., 'OCEAN', 'INLAND')

**Returns:** String like "OCEAN-1703123456789-abc123def"

### `calculatePaymentFees(baseAmount)`

Calculates insurance and handling fees.

**Parameters:**
- `baseAmount`: Base service amount

**Returns:** Object with base, insurance, handling, and total amounts

### `formatCurrency(amount)`

Formats amount as currency string.

**Parameters:**
- `amount`: Number to format

**Returns:** Formatted string like "$1,250.00"

## Payment Flow

1. **Form Submission** - User fills out booking form
2. **Data Preparation** - Form data is prepared for payment
3. **Payment Page** - User is redirected to `/payment` with form data
4. **Card Entry** - User enters card details using Stripe
5. **Payment Processing** - Stripe processes the payment
6. **Success Page** - User is redirected to `/payment/success`
7. **Confirmation** - User receives confirmation email and receipt

## Features

### Payment Page Features
- ✅ Displays customer information
- ✅ Shows order summary with calculated fees
- ✅ Secure Stripe payment form
- ✅ Responsive design
- ✅ Error handling

### Success Page Features
- ✅ Payment confirmation
- ✅ Booking reference display
- ✅ Customer and service details
- ✅ Next steps information
- ✅ Downloadable receipt
- ✅ Automatic confirmation email

### Security Features
- ✅ Stripe PCI compliance
- ✅ Secure data transmission
- ✅ No sensitive data stored locally
- ✅ HTTPS required

## Customization

### Styling
The payment pages use Tailwind CSS classes. You can customize the appearance by modifying the CSS classes in:
- `src/pages/Payment.tsx`
- `src/pages/PaymentSuccess.tsx`

### Fee Calculation
Modify the fee calculation in `src/lib/payment.ts`:

```typescript
export const calculatePaymentFees = (baseAmount: number) => {
  const insurance = baseAmount * 0.12; // 12% insurance
  const handling = baseAmount * 0.06; // 6% handling fee
  const total = baseAmount + insurance + handling;
  
  return { base: baseAmount, insurance, handling, total };
};
```

### Email Templates
Configure email templates in your EmailJS setup for:
- `payment_confirmation_template` - Sent after successful payment
- `booking_template` - Sent when form is submitted

## Environment Variables

Make sure these environment variables are set:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Testing

### Test Card Numbers
Use these Stripe test card numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Authentication:** 4000 0025 0000 3155

### Test Mode
The payment system works in Stripe test mode by default. For production, update your Stripe keys.

## Troubleshooting

### Common Issues

1. **Payment form not loading**
   - Check Stripe publishable key
   - Verify Supabase function is deployed

2. **Form data not passing**
   - Ensure PaymentData interface is followed
   - Check navigation method ('state' vs 'params')

3. **Payment fails**
   - Check Stripe dashboard for errors
   - Verify webhook endpoints are configured

### Debug Mode
Enable debug logging by adding to your component:

```typescript
console.log('Payment data:', paymentData);
```

## Support

For issues with:
- **Stripe integration:** Check Stripe documentation
- **Form integration:** Review this guide
- **Styling:** Modify Tailwind classes
- **Email:** Configure EmailJS templates 