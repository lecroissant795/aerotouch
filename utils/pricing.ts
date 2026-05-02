export interface PricingTier {
  minQty: number;
  discountPercent: number;
  label: string;
}

/** Quantity is total units in cart (all lines). Tier 1 = no volume discount. */
export const PRICING_TIERS: PricingTier[] = [
  { minQty: 1, discountPercent: 0, label: '1+' },
  { minQty: 2, discountPercent: 56, label: '56% OFF' },
  { minQty: 3, discountPercent: 80, label: '80% OFF' }
];

/** Progress bar marker positions (one per tier). */
export const PRICING_TIER_POSITIONS = [12, 48, 100];

const clampQty = (qty: number) => Math.max(1, Math.floor(qty));

export const getApplicablePricingTier = (qty: number): PricingTier => {
  const normalizedQty = clampQty(qty);
  let tier = PRICING_TIERS[0];

  for (const candidate of PRICING_TIERS) {
    if (normalizedQty >= candidate.minQty) tier = candidate;
  }

  return tier;
};

export const getNextPricingTier = (qty: number): PricingTier | null => {
  const normalizedQty = clampQty(qty);
  return PRICING_TIERS.find(tier => normalizedQty < tier.minQty) ?? null;
};

export const getLinePricing = (compareAtUnitPrice: number, qty: number) => {
  const normalizedQty = clampQty(qty);
  const tier = getApplicablePricingTier(normalizedQty);
  const unitPrice = compareAtUnitPrice * (1 - tier.discountPercent / 100);
  const compareAtTotal = compareAtUnitPrice * normalizedQty;
  const total = unitPrice * normalizedQty;
  const savings = Math.max(compareAtTotal - total, 0);

  return {
    qty: normalizedQty,
    tier,
    unitPrice,
    total,
    compareAtTotal,
    savings,
    discountPercent: tier.discountPercent
  };
};

/** Unit price after global volume tier (% off reference = compare-at or list). */
export const getVolumeAdjustedUnitPrice = (referenceUnitPrice: number, globalCartItemCount: number): number => {
  const n = Math.max(0, Math.floor(globalCartItemCount));
  if (n <= 0 || referenceUnitPrice <= 0) return round2(referenceUnitPrice);
  const tier = getApplicablePricingTier(n);
  return round2(referenceUnitPrice * (1 - tier.discountPercent / 100));
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export const getPricingProgress = (qty: number): number => {
  if (qty <= 0) return 0;
  const normalizedQty = clampQty(qty);

  for (let i = 0; i < PRICING_TIERS.length; i++) {
    const tierQty = PRICING_TIERS[i].minQty;
    const prevQty = i === 0 ? 0 : PRICING_TIERS[i - 1].minQty;
    const prevPos = i === 0 ? 0 : PRICING_TIER_POSITIONS[i - 1];

    if (normalizedQty < tierQty) {
      const ratio = (normalizedQty - prevQty) / (tierQty - prevQty);
      return prevPos + ratio * (PRICING_TIER_POSITIONS[i] - prevPos);
    }
    if (normalizedQty === tierQty) return PRICING_TIER_POSITIONS[i];
  }

  return 100;
};
