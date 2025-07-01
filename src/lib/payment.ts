import { NavigateFunction } from 'react-router-dom';

export interface PaymentData {
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
  amount: number;
  bookingReference?: string;
}

export const navigateToPayment = (
  navigate: NavigateFunction,
  paymentData: PaymentData,
  method: 'state' | 'params' = 'state'
) => {
  if (method === 'state') {
    // Pass data through navigation state (more secure, no data in URL)
    navigate('/payment', { state: { formData: paymentData } });
  } else {
    // Pass data through URL parameters (visible in URL, but works with page refresh)
    const params = new URLSearchParams();
    
    Object.entries(paymentData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, value.toString());
      }
    });
    
    navigate(`/payment?${params.toString()}`);
  }
};

export const generateBookingReference = (serviceType: string): string => {
  const prefix = serviceType.toUpperCase().substring(0, 3);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${prefix}-${timestamp}-${random}`;
};

export const calculatePaymentFees = (baseAmount: number) => {
  const insurance = baseAmount * 0.12; // 12% insurance
  const handling = baseAmount * 0.06; // 6% handling fee
  const total = baseAmount + insurance + handling;
  
  return {
    base: baseAmount,
    insurance,
    handling,
    total
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}; 