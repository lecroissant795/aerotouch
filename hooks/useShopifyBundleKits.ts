import { useEffect, useState } from 'react';
import type { BundleKit } from '../types';
import { BUNDLE_KITS } from '../utils/bundleKits';
import { useCurrency } from '../utils/CurrencyContext';
import { fetchProductByHandle } from '../utils/productFetcher';
import { variantCompareAtCurrencyCode, variantSaleCurrencyCode } from '../utils/shopifyVariantMoney';

/**
 * Hydrates bundle kit cards from Shopify (title, price, compare-at, primary image, availability).
 */
export function useShopifyBundleKits(): BundleKit[] {
  const [kits, setKits] = useState<BundleKit[]>(BUNDLE_KITS);
  const { currency } = useCurrency();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const updated = await Promise.all(
        BUNDLE_KITS.map(async (kit) => {
          try {
            const p = await fetchProductByHandle(kit.handle, currency);
            const v = p?.variants?.[0];
            if (!p || !v || cancelled) return kit;

            const price = parseFloat(String(v.price?.amount ?? kit.price));
            const rawCompare = v.compareAtPrice?.amount;
            const compareAt = rawCompare != null ? parseFloat(String(rawCompare)) : kit.originalPrice;
            const image =
              p.images?.[0]?.src ||
              p.images?.edges?.[0]?.node?.url ||
              (v as { image?: { src?: string; url?: string } }).image?.src ||
              (v as { image?: { src?: string; url?: string } }).image?.url ||
              kit.image;

            return {
              ...kit,
              name: p.title || kit.name,
              price,
              currencyCode: variantSaleCurrencyCode(v) ?? kit.currencyCode,
              originalPrice: compareAt > price ? compareAt : kit.originalPrice,
              originalCurrencyCode:
                compareAt > price ? variantCompareAtCurrencyCode(v) ?? variantSaleCurrencyCode(v) : kit.originalCurrencyCode,
              image: image || kit.image,
              availableForSale: v.available !== false && v.availableForSale !== false,
            };
          } catch {
            return kit;
          }
        })
      );

      if (!cancelled) setKits(updated);
    })();

    return () => {
      cancelled = true;
    };
  }, [currency]);

  return kits;
}
