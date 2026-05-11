export interface PricingTier {
  minQty: number;
  discountPercent: number;
  /** Short label for unlock messages (e.g. "26% OFF") */
  label: string;
  /** Two-line checkpoint: title row under the progress marker */
  checkpointTitle: string;
  /** Two-line checkpoint: subtitle (quantity threshold) */
  checkpointSubtitle: string;
}

/**
 * Quantity is total units in cart (all lines). Percentages and thresholds must stay in sync
 * with Shopify Admin automatic discounts (this store: 10% @ 2+, 18% @ 3+, 24% @ 5+ items).
 */
export const PRICING_TIERS: PricingTier[] = [
  {
    minQty: 1,
    discountPercent: 0,
    label: 'Standard pricing',
    checkpointTitle: 'Standard pricing',
    checkpointSubtitle: '1+ items'
  },
  {
    minQty: 2,
    discountPercent: 10,
    label: '10% OFF',
    checkpointTitle: '10% OFF',
    checkpointSubtitle: '2+ items'
  },
  {
    minQty: 3,
    discountPercent: 18,
    label: '18% OFF',
    checkpointTitle: '18% OFF',
    checkpointSubtitle: '3+ items'
  },
  {
    minQty: 5,
    discountPercent: 24,
    label: '24% OFF',
    checkpointTitle: '24% OFF',
    checkpointSubtitle: '5+ items'
  }
];

/** Progress bar marker horizontal positions (one per checkpoint, left → right). */
export const PRICING_TIER_POSITIONS = [6, 34, 62, 94];

const clampQty = (qty: number) => Math.max(1, Math.floor(qty));

export const getApplicablePricingTier = (qty: number): PricingTier => {
  const normalizedQty = clampQty(qty);
  let tier = PRICING_TIERS[0];

  for (const candidate of PRICING_TIERS) {
    if (normalizedQty >= candidate.minQty) tier = candidate;
  }

  return tier;
};

export const getApplicablePricingTierIndex = (qty: number): number => {
  const tier = getApplicablePricingTier(qty);
  const idx = PRICING_TIERS.findIndex((t) => t.minQty === tier.minQty);
  return idx >= 0 ? idx : 0;
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
  const lastTier = PRICING_TIERS[PRICING_TIERS.length - 1];
  /** Fill track to 100% once the final discount tier (e.g. 5+) is reached — not only to the last marker (94%). */
  if (normalizedQty >= lastTier.minQty) return 100;

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
