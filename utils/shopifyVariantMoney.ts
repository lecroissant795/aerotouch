/**
 * Normalize Shopify Storefront / shopify-buy variant money fields.
 */

export function getVariantsArray(shopifyProduct: any): any[] {
  if (!shopifyProduct?.variants) return [];
  const v = shopifyProduct.variants;
  if (Array.isArray(v)) return v;
  if (v.edges) return v.edges.map((e: any) => e.node).filter(Boolean);
  return [];
}

export function parseMoneyAmount(money: any): number | null {
  if (money == null) return null;
  const raw = typeof money === 'object' && money.amount != null ? money.amount : money;
  const n = parseFloat(String(raw));
  return Number.isFinite(n) ? n : null;
}

export function variantSalePrice(variant: any): number {
  return parseMoneyAmount(variant?.price) ?? 0;
}

/** Shopify compare-at price on the variant, if set. */
export function variantCompareAt(variant: any): number | null {
  return (
    parseMoneyAmount(variant?.compareAtPrice) ??
    parseMoneyAmount(variant?.compareAtPriceV2) ??
    null
  );
}

/**
 * Match variant by Size + Color options (shopify-buy shape).
 * Falls back to first variant when no match.
 */
export function findVariantBySizeAndColor(
  shopifyProduct: any,
  size: string | null,
  color: string
): any | null {
  const variants = getVariantsArray(shopifyProduct);
  if (!variants.length) return null;

  const match = variants.find((v: any) => {
    const opts = v.selectedOptions || [];
    const vSize = opts.find((o: any) => o.name === 'Size')?.value;
    const vColor = opts.find((o: any) => o.name === 'Color')?.value;
    const sizeMatches = !size || !vSize || vSize === size;
    const colorMatches = !color || !vColor || vColor === color;
    return sizeMatches && colorMatches;
  });

  return match ?? variants[0];
}
