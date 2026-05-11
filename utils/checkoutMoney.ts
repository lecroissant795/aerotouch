/**
 * Extract cart subtotal from a shopify-buy checkout payload when possible.
 * Prefer values that already include Shopify automatic discounts & discount codes.
 */
export function extractCheckoutSubtotalAfterDiscounts(checkout: unknown): number | null {
  if (!checkout || typeof checkout !== 'object') return null;
  const raw = checkout as Record<string, unknown>;

  const tryAmount = (v: unknown): number | null => {
    if (v == null) return null;
    if (typeof v === 'object' && v !== null && 'amount' in v) {
      const raw = (v as { amount?: string }).amount;
      if (raw == null) return null;
      const n = parseFloat(String(raw));
      return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
    }
    if (typeof v === 'string' || typeof v === 'number') {
      const n = parseFloat(String(v));
      return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
    }
    return null;
  };

  const candidates: unknown[] = [
    raw.subtotalPriceV2,
    raw.subtotalPrice,
    raw.lineItemsSubtotalPrice,
    raw.totalPriceV2,
    raw.totalPrice
  ];

  for (const c of candidates) {
    const n = tryAmount(c);
    if (n != null && n >= 0) return n;
  }

  return null;
}
