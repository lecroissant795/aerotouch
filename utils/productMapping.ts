import { Product } from './types';

/**
 * Product mapping utility
 *
 * Maps local/product IDs to Shopify data (handle + numeric ID).
 * This bridges the gap between our URL parameters and Shopify's API requirements.
 *
 * TO SETUP:
 * 1. Check browser console for "===== ALL SHOPIFY PRODUCTS ====="
 * 2. For each product, note: ID (global/gid), Handle, Title
 * 3. Fill in the PRODUCT_DATA_MAP below with actual values
 */

interface ShopifyProductInfo {
  /** Shopify numeric/global ID - used for fetch() and cart operations */
  shopifyId: string;
  /** SEO-friendly handle - used in URLs */
  handle: string;
  /** Local/display product data */
  product: Omit<Product, 'id' | 'handle'>;
}

/**
 * Complete mapping of local product identifiers to Shopify data.
 *
 * IMPORTANT: Fill in the actual Shopify IDs and handles from your store.
 *
 * From your diagnostic screenshot, for "AeroTouch Massage Insoles":
 * - Shopify ID: gid://shopify.com/Products/13909372927915 (use: 13909372927915)
 * - Shopify Handle: aero-touch-massage-insoles
 * - Your current local ID: massage-insoles (from ProductCard product.id)
 */
export const PRODUCT_DATA_MAP: Record<string, ShopifyProductInfo> = {
  'massage-insoles': {
    shopifyId: '13909372927915', // <-- Your actual Shopify product ID from diagnostic
    handle: 'aero-touch-massage-insoles', // <-- Your actual Shopify handle from diagnostic
    product: {
      name: 'AeroTouch Massage Insoles',
      tagline: 'Therapeutic acupressure with every step',
      price: 34.00,
      rating: 4.9,
      reviews: 1540,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
      features: ['Magnetic Therapy', 'Pressure Point Relief', 'Breathable Design'],
      description: 'Experience the healing power of acupressure with every step. Our massage insoles combine therapeutic magnetic fields with strategically placed pressure points to relieve tension and improve circulation.'
    }
  },
  // Add other products here as you get their data:
  // 'massage-roller': {
  //   shopifyId: 'YOUR_SHOPIFY_NUMERIC_ID',
  //   handle: 'your-shopify-handle',
  //   product: {
  //     name: 'Massage Roller',
  //     tagline: 'Deep tissue recovery for sore feet',
  //     price: 19.00,
  //     rating: 4.8,
  //     reviews: 820,
  //     image: 'https://images.unsplash.com/photo-1544117518-30dd01b92047?q=80&w=800&auto=format&fit=crop',
  //     features: ['Ergonomic Shape', 'Deep Tissue Trigger', 'Portable Size'],
  //     description: 'Target sore muscles and speed up recovery...'
  //   }
  // },
  // 'heel-cushion-pad': { ... },
  // 'compression-socks': { ... },
};

/**
 * Get Shopify handle for a product identifier (local ID or existing handle)
 */
export const getShopifyHandle = (identifier: string): string => {
  const info = PRODUCT_DATA_MAP[identifier];
  return info?.handle || identifier; // If not in map, assume identifier IS the handle
};

/**
 * Get Shopify numeric ID for a product identifier
 */
export const getShopifyId = (identifier: string): string | undefined => {
  const info = PRODUCT_DATA_MAP[identifier];
  return info?.shopifyId;
};

/**
 * Check if we have Shopify data mapping for this identifier
 */
export const hasShopifyMapping = (identifier: string): boolean => {
  return identifier in PRODUCT_DATA_MAP;
};

/**
 * Get complete Product object from fallback data
 */
export const getFallbackProduct = (id: string): Product | undefined => {
  const info = PRODUCT_DATA_MAP[id];
  if (!info) return undefined;
  return {
    ...info.product,
    id: info.shopifyId,
    handle: info.handle
  } as Product;
};

/**
 * Build complete Product object from Shopify API response
 */
export const buildProductFromShopify = (shopifyProduct: any, identifier: string): Product => {
  const info = PRODUCT_DATA_MAP[identifier];
  const handle = info?.handle || shopifyProduct.handle || identifier;
  const shopifyId = info?.shopifyId || shopifyProduct.id;

  return {
    id: shopifyId,
    handle: handle,
    name: shopifyProduct.title,
    tagline: shopifyProduct.variants?.[0]?.title || '',
    price: Number(shopifyProduct.variants?.[0]?.price?.amount) || 0,
    rating: 0,
    reviews: 0,
    image: shopifyProduct.images?.[0]?.src || '',
    images: shopifyProduct.images?.map((img: any) => img.src),
    features: [],
    description: shopifyProduct.description || '',
    tags: shopifyProduct.tags?.filter(Boolean) || [],
  };
};

/**
 * Get all known local product identifiers
 */
export const KNOWN_PRODUCT_IDS = Object.keys(PRODUCT_DATA_MAP);

/**
 * Diagnostic helper - call from browser console
 */
export const debugProductMapping = () => {
  console.log('=== Product Mapping Debug Info ===');
  console.log('Product mappings (Local ID -> Shopify data):');
  Object.entries(PRODUCT_DATA_MAP).forEach(([localId, info]) => {
    console.log(`  ${localId}:`);
    console.log(`    Shopify ID: ${info.shopifyId}`);
    console.log(`    Handle: ${info.handle}`);
    console.log(`    Name: ${info.product.name}`);
  });
  console.log('Known local IDs:', KNOWN_PRODUCT_IDS);
  console.log('================================');
};

// Auto-run diagnostic in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  console.info('[ProductMapping] Loaded. Call debugProductMapping() in console for details.');
}
