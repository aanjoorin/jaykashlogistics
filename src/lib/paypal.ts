// PayPal configuration
export const paypalConfig = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || 'test',
  currency: 'USD',
  intent: 'capture' as const,
  environment: import.meta.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox'
};

// PayPal button options
export const paypalButtonOptions = {
  style: {
    layout: 'vertical' as const,
    color: 'blue' as const,
    shape: 'rect' as const,
    label: 'pay' as const,
  },
  fundingSource: undefined, // Allow all funding sources
};

// PayPal order creation options
export const createPayPalOrder = (amount: number, description: string) => ({
  purchase_units: [
    {
      amount: {
        value: (amount / 100).toFixed(2), // Convert from cents to dollars
        currency_code: 'USD',
      },
      description: description,
    },
  ],
  application_context: {
    shipping_preference: 'NO_SHIPPING',
  },
}); 