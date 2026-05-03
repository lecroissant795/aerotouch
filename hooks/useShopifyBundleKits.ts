import { useEffect, useState } from 'react';
import type { BundleKit } from '../types';
import { BUNDLE_KITS } from '../utils/bundleKits';
import { shopify } from '../utils/shopify';

/**
 * Hydrates bundle kit cards from Shopify (title, price, compare-at, primary image, availability).
 */
export function useShopifyBundleKits(): BundleKit[] {
  const [kits, setKits] = useState<BundleKit[]>(BUNDLE_KITS);

  useEffect(() => {
    if (!shopify) return;
    let cancelled = false;

    (async () => {
      const updated = await Promise.all(
        BUNDLE_KITS.map(async (kit) => {
          try {
            const p = await shopify.product.fetchByHandle(kit.handle);
            const v = p?.variants?.[0];
            if (!p || !v || cancelled) return kit;

            const price = parseFloat(String(v.price?.amount ?? kit.price));
            const rawCompare = v.compareAtPrice?.amount;
            const compareAt = rawCompare != null ? parseFloat(String(rawCompare)) : kit.originalPrice;
            const image =
              p.images?.[0]?.src || (v as { image?: { src?: string } }).image?.src || kit.image;

            return {
              ...kit,
              name: p.title || kit.name,
              price,
              originalPrice: compareAt > price ? compareAt : kit.originalPrice,
              image: image || kit.image,
              availableForSale: v.available !== false,
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
  }, []);

  return kits;
}
