/**
 * Reads discount codes from a shopify-buy checkout object (mapped cart payload).
 */
export function extractDiscountCodesFromCheckout(checkout: any): string[] {
  const apps = checkout?.discountApplications;
  if (!Array.isArray(apps)) return [];
  const out: string[] = [];
  for (const d of apps) {
    const c = d?.code;
    if (typeof c === 'string' && c.trim()) {
      out.push(c.trim());
      continue;
    }
    const t = d?.title;
    if (typeof t === 'string' && t.trim()) out.push(t.trim());
  }
  return [...new Set(out)];
}
