/**
 * Shopify Storefront / Admin URLs expect a bare host (no protocol, no path).
 * `.env` values often include `https://` by mistake.
 */
export function normalizeShopifyStoreDomain(raw: string | undefined | null): string {
  let d = String(raw ?? '').trim();
  if (!d) return '';
  d = d.replace(/^https?:\/\//i, '');
  const slash = d.indexOf('/');
  if (slash >= 0) d = d.slice(0, slash);
  d = d.replace(/:\d+$/, '');
  return d;
}
