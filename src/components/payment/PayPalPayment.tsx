import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

interface PayPalPaymentProps {
  amount: string; // e.g. "10.00"
  currency?: string; // default: "USD"
  onSuccess: (details: any) => void;
  onError?: (error: any) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  currency = "USD",
  onSuccess,
  onError,
}) => {
  return (
    <PayPalScriptProvider options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(_, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: { value: amount, currency_code: currency },
              },
            ],
          });
        }}
        onApprove={async (_, actions) => {
          const details = await actions.order?.capture();
          onSuccess(details);
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalPayment;