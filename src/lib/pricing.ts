/**
 * HeatSync Dynamic Pricing Engine
 * Calculates charging costs based on:
 * 1. Base Price (Set by Host)
 * 2. Time-of-Day (Peak/Off-Peak)
 * 3. Grid Load (Simulated Transformer Capacity)
 * 4. Renewable Status (Green Premium)
 */

export interface PricingOptions {
  basePrice: number;
  startTime: Date;
  durationHours: number;
  gridLoad: number; // 0.0 to 1.0
  isGreen: boolean;
}

export const calculateDynamicPrice = ({
  basePrice,
  startTime,
  durationHours,
  gridLoad,
  isGreen,
}: PricingOptions) => {
  const hour = startTime.getHours();
  let multiplier = 1.0;

  // 1. Time-of-Day Multiplier
  // Peak: 8 AM - 10 AM, 5 PM - 9 PM
  if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 21)) {
    multiplier *= 1.5; // 50% Peak Surcharge
  } else if (hour >= 23 || hour <= 5) {
    multiplier *= 0.8; // 20% Off-Peak Discount
  }

  // 2. Grid Load Multiplier (Grid-Friendly Pricing)
  // If grid is > 85% capacity, spike price to discourage use
  if (gridLoad > 0.85) {
    multiplier *= 2.0; 
  } else if (gridLoad > 0.7) {
    multiplier *= 1.3;
  }

  // 3. Green Premium
  // Truly renewable energy can have a small premium or be used to offset peak surcharges
  if (isGreen) {
    multiplier *= 0.95; // 5% discount for using Green Energy (Incentive)
  }

  const finalRate = basePrice * multiplier;
  const totalCost = finalRate * durationHours;

  return {
    ratePerHour: Number(finalRate.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    multiplier: Number(multiplier.toFixed(2)),
    isPeak: multiplier > 1.0 && gridLoad <= 0.7,
    isGridCritical: gridLoad > 0.85,
    suggestDelay: gridLoad > 0.85,
  };
};
