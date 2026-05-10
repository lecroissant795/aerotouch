import type { BundleKit, Product } from '../types';

/** Cart line attributes — fulfillment sees insole choice when the kit SKU is single-variant. */
export const BUNDLE_KIT_INSOLE_SIZE_ATTR = 'Insole size';
export const BUNDLE_KIT_INSOLE_COLOR_ATTR = 'Insole color';

export function bundleKitInsoleLineAttributes(size: string, color: string) {
  return [
    { key: BUNDLE_KIT_INSOLE_SIZE_ATTR, value: size },
    { key: BUNDLE_KIT_INSOLE_COLOR_ATTR, value: color },
  ];
}

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
      '1× AeroTouch Massage Insoles',
      '1× Massage Roller',
    ],
  },
  {
    id: 'heel-relief',
    handle: 'heel-relief',
    shopifyProductId: '9037334741249',
    name: 'Heel Relief Kit',
    price: 63,
    originalPrice: 96,
    image: '',
    badge: 'Top Rated',
    items: [
      '1× AeroTouch Massage Insoles',
      '2× Heel Cushions',
    ],
  },
  {
    id: 'toe-relief',
    handle: 'toe-relief',
    shopifyProductId: '9037334774017',
    name: 'Toe Relief Kit',
    price: 63,
    originalPrice: 96,
    image: '',
    badge: 'Doctor Choice',
    items: [
      '1× AeroTouch Massage Insoles',
      '2× Toe Cushion Pads',
    ],
  },
  {
    id: 'complete-recovery-kit',
    handle: 'complete-recovery-kit',
    shopifyProductId: '9037334806785',
    name: 'Ultimate Foot Relief Kit',
    price: 156,
    originalPrice: 240,
    image: '',
    badge: 'Ultimate Value',
    items: [
      '3× AeroTouch Massage Insoles',
      '1× Massage Roller',
      '2× Heel Cushions',
      '2× Toe Cushion Pads',
    ],
  },
];

const BUNDLE_KIT_HANDLE_SET = new Set(BUNDLE_KITS.map((k) => k.handle));

/** True when the product is one of our Shopify bundle kit PDPs (by handle). */
export function isBundleKitProductByHandle(handle: string | undefined): boolean {
  if (!handle) return false;
  return BUNDLE_KIT_HANDLE_SET.has(handle);
}

export function isBundleKitProductByProduct(product: { handle?: string }): boolean {
  return isBundleKitProductByHandle(product.handle);
}

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
