import { Decimal } from 'decimal.js';

interface PricingFactors {
  distance: number;
  vehicleCategory: string;
  serviceType: string;
  isExpress: boolean;
  isInternational: boolean;
}

const BASE_RATES = {
  'CT1': 1.2, // Sedans
  'CT2': 1.5, // SUV/Small Trucks
  'HH1': 2.0, // Large Trucks
  'HH2': 2.5  // Construction Equipment
};

const SERVICE_MULTIPLIERS = {
  'ocean': 2.5,
  'inland': 1.0,
  'express': 1.8
};

export const calculatePrice = (factors: PricingFactors): number => {
  try {
    let price = new Decimal(0);

    // Base rate by vehicle category
    const baseRate = new Decimal(BASE_RATES[factors.vehicleCategory as keyof typeof BASE_RATES] || 1.0);
    
    // Distance-based calculation
    const distanceRate = new Decimal(factors.distance).mul(0.5); // $0.50 per mile base
    
    // Service type multiplier
    const serviceMultiplier = new Decimal(
      SERVICE_MULTIPLIERS[factors.serviceType as keyof typeof SERVICE_MULTIPLIERS] || 1.0
    );
    
    // Calculate base price
    price = distanceRate.mul(baseRate).mul(serviceMultiplier);
    
    // Add express shipping premium
    if (factors.isExpress) {
      price = price.mul(1.3); // 30% premium for express
    }
    
    // Add international shipping premium
    if (factors.isInternational) {
      price = price.mul(1.5); // 50% premium for international
    }
    
    // Add insurance (0.5% of calculated price)
    const insurance = price.mul(0.005);
    price = price.add(insurance);
    
    // Round to nearest dollar
    return Math.ceil(price.toNumber());
  } catch (error) {
    console.error('Error calculating price:', error);
    return 0;
  }
};

export const estimateDeliveryTime = (
  distance: number,
  isExpress: boolean,
  isInternational: boolean
): { min: number; max: number } => {
  let baseDays = Math.ceil(distance / 400); // Average 400 miles per day
  
  if (isExpress) {
    baseDays = Math.max(1, Math.ceil(baseDays * 0.6)); // 40% faster for express
  }
  
  if (isInternational) {
    baseDays += 14; // Add 2 weeks for international shipping
  }
  
  return {
    min: baseDays,
    max: baseDays + 2 // Add buffer of 2 days
  };
};