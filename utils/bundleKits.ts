import type { BundleKit, Product } from '../types';

/**
 * Bundle kits: handles and numeric IDs match the live Shopify store (Storefront API).
 * Prices/compare-at are baseline; `useShopifyBundleKits` refreshes from Shopify on the client.
 */
export const BUNDLE_KITS: BundleKit[] = [
  {
    id: 'fascilites-relief',
    handle: 'fascilites-relief',
    shopifyProductId: '9037334708481',
    name: 'Plantar Fasciitis Relief Kit',
    price: 77,
    originalPrice: 120,
    image:
      'https://cdn.shopify.com/s/files/1/0805/2332/9793/files/1777814018972-nhdkd6i9e0r_png.jpg?v=1777814051',
    badge: 'Best For Rehab',
    items: [
      '1× AeroTouch massage insoles',
      '1× Massage ball',
      '1× Compression socks',
    ],
  },
  {
    id: 'heel-relief',
    handle: 'heel-relief',
    shopifyProductId: '9037334741249',
    name: 'Heel Relief Kit',
    price: 63,
    originalPrice: 96,
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=900&auto=format&fit=max',
    badge: 'Top Rated',
    items: ['1× Heel cushions', '1× Daily insole', '1× Arch support'],
  },
  {
    id: 'toe-relief',
    handle: 'toe-relief',
    shopifyProductId: '9037334774017',
    name: 'Toe Relief Kit',
    price: 63,
    originalPrice: 96,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=900&auto=format&fit=max',
    badge: 'Doctor Choice',
    items: ['1× Toe spacers', '1× Sport insole', '1× Fabric sleeve'],
  },
  {
    id: 'complete-recovery-kit',
    handle: 'complete-recovery-kit',
    shopifyProductId: '9037334806785',
    name: 'Ultimate Foot Relief Kit',
    price: 156,
    originalPrice: 240,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=max',
    badge: 'Ultimate Value',
    items: [
      '2× AeroTouch massage insoles',
      '2× Compression socks',
      '1× Massage roller',
    ],
  },
];

/** Featured grid / search card for the primary bundle (Plantar Fasciitis kit). */
export function getFascilitesBundleGridProduct(): Product {
  const kit = BUNDLE_KITS.find((k) => k.id === 'fascilites-relief')!;
  return bundleKitToGridProduct(kit);
}

export function bundleKitToGridProduct(kit: BundleKit): Product {
  return {
    id: kit.shopifyProductId,
    handle: kit.handle,
    name: kit.name,
    tagline: 'Bundle kit — recovery essentials',
    price: kit.price,
    compareAtPrice: kit.originalPrice > kit.price ? kit.originalPrice : undefined,
    rating: 5.0,
    reviews: 3200,
    image: kit.image,
    features: [...kit.items],
    description: kit.items.join('. '),
  };
}
