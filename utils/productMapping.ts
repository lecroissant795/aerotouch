import { Product } from '../types';
import { HEIGHT_BOOSTERS_PDP_COPY } from './heightBoostersCopy';

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
 * Filled with actual Shopify data from diagnostic logs.
 */

export const PRODUCT_DATA_MAP: Record<string, ShopifyProductInfo> = {
  // Main Products
  'massage-insoles': {
    shopifyId: '9037334511873',
    handle: 'massage-insoles',
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
  'massage-roller': {
    shopifyId: '9037334577409',
    handle: 'massage-roller',
    product: {
      name: 'Massage Roller',
      tagline: 'Deep tissue recovery for sore feet',
      price: 19.00,
      rating: 4.8,
      reviews: 820,
      image: 'https://images.unsplash.com/photo-1544117518-30dd01b92047?q=80&w=800&auto=format&fit=crop',
      features: ['Ergonomic Shape', 'Deep Tissue Trigger', 'Portable Size'],
      description: 'Professional-grade massage roller designed for targeted foot relief and recovery.'
    }
  },
  // PDP: SecondaryProductPage (see `isHeightBoosterProduct` in productDetection.ts)
  'height-insoles': {
    shopifyId: '9037334675713',
    handle: 'height-insoles',
    product: {
      name: 'Height Boosters',
      tagline: HEIGHT_BOOSTERS_PDP_COPY.tagline,
      description: HEIGHT_BOOSTERS_PDP_COPY.description,
      features: [...HEIGHT_BOOSTERS_PDP_COPY.features],
      price: 39.00,
      rating: 4.8,
      reviews: 1100,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop'
    }
  },
  // Secondary/Accessory Products
  'grip-socks': {
    shopifyId: '9134310031617',
    handle: 'grip-socks',
    product: {
      name: 'Grip Socks',
      tagline: 'Stay stable during your practice',
      price: 24.00,
      rating: 4.6,
      reviews: 560,
      image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=800&auto=format&fit=crop',
      features: ['Non-Slip Grip', 'Breathable Fabric', 'Arch Compression'],
      description: 'High-performance grip socks for yoga, pilates, and home workouts.'
    }
  },
  'cashmere-insoles': {
    shopifyId: '9134310097153',
    handle: 'cashmere-insoles',
    product: {
      name: 'Cashmere Insoles',
      tagline: 'Luxurious comfort all day long',
      price: 49.00,
      rating: 4.9,
      reviews: 720,
      image: 'https://images.unsplash.com/photo-1596700888812-7bd3d9392bbc?q=80&w=800&auto=format&fit=crop',
      features: ['Cashmere Lining', 'Memory Foam', 'Temperature Regulation'],
      description: 'Premium insoles with cashmere-soft lining for ultimate everyday comfort.'
    }
  },
  'toe-cushion-pds': {
    shopifyId: '9134310162689',
    handle: 'toe-cushion-pds',
    product: {
      name: 'Toe Cushion Pads',
      tagline: 'Protect vulnerable toe areas',
      price: 12.00,
      rating: 4.7,
      reviews: 890,
      image: 'https://images.unsplash.com/photo-1517760444937-1e5390c95d0a?q=80&w=800&auto=format&fit=crop',
      features: ['Gel Cushioning', 'Hypoallergenic', 'Reusable'],
      description: 'Soft gel pads that protect toes from rubbing, corns, and calluses.'
    }
  },
  'toe-spacers': {
    shopifyId: '9134310195457',
    handle: 'toe-spacers',
    product: {
      name: 'Toe Spacers',
      tagline: 'Align toes and improve foot posture',
      price: 15.00,
      rating: 4.8,
      reviews: 1100,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=800&auto=format&fit=crop',
      features: ['Ergonomic Design', 'Medical-Grade Silicone', 'Pain Relief'],
      description: 'Toe spacers help realign toes, improve balance, and reduce foot pain.'
    }
  },
  'heel-cushion-pds': {
    shopifyId: '9134310293761',
    handle: 'heel-cushion-pds',
    product: {
      name: 'Heel Cushions',
      tagline: 'Shock absorption for high-impact activities',
      price: 22.00,
      rating: 4.9,
      reviews: 2100,
      image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop',
      features: ['Shock Absorption', 'Non-Slip Grip', 'All-Day Support'],
      description: 'Premium heel cushions that absorb impact and provide all-day comfort.'
    }
  },
  'massage-gun': {
    shopifyId: '9134530461953',
    handle: 'massage-gun',
    product: {
      name: 'Massage Gun',
      tagline: 'Deep tissue percussion therapy',
      price: 79.00,
      rating: 4.8,
      reviews: 650,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
      features: ['Multiple Speed Settings', 'Long Battery Life', 'Quiet Motor'],
      description: 'Professional-grade percussion massage gun for muscle recovery and relaxation.'
    }
  },
  // Same Height Boosters line as `height-insoles`; PDP: SecondaryProductPage
  'height-insoles-1': {
    shopifyId: '9134691254529',
    handle: 'height-insoles-1',
    product: {
      name: 'Height Insoles',
      tagline: HEIGHT_BOOSTERS_PDP_COPY.tagline,
      description: HEIGHT_BOOSTERS_PDP_COPY.description,
      features: [...HEIGHT_BOOSTERS_PDP_COPY.features],
      price: 39.00,
      rating: 4.8,
      reviews: 1100,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop'
    }
  },
  // Recovery/Accessory Products
  'recovery-gel': {
    shopifyId: '9134310097154', // TODO: Get actual ID from Shopify if exists
    handle: 'recovery-gel', // TODO: Get actual handle if different
    product: {
      name: 'Recovery Gel',
      tagline: 'Soothing relief for tired muscles',
      price: 24.00,
      rating: 4.9,
      reviews: 1200,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop',
      features: ['Natural Ingredients', 'Fast Absorption', 'Cooling Effect'],
      description: 'Therapeutic gel formulated to relieve muscle tension and accelerate recovery.'
    }
  },
  // Note: 'fascilites-relief' is a BUNDLE KIT, not a standalone Shopify product
  // It's defined in BundleKitsPage.tsx as BUNDLE_KITS
};

/**
 * Key used to resolve Shopify product for cart/API when `product.id` may be a
 * Storefront GID or numeric id (URL-loaded PDP) while `product.handle` is the real handle.
 */
export const getCartProductLookupKey = (product: Product): string => {
  const rawId = String(product.id ?? '');
  const handle = (product.handle || '').trim();
  const idLooksLikeShopify =
    rawId.includes('gid://shopify/Product/') || /^\d+$/.test(rawId);
  if (idLooksLikeShopify && handle) {
    return handle;
  }
  return rawId || handle;
};

/**
 * Get Shopify handle for a product identifier (local ID or existing handle)
 */
export const getShopifyHandle = (identifier: string): string => {
  // First, check if identifier is a key in the map (local ID)
  const info = PRODUCT_DATA_MAP[identifier];
  if (info) {
    return info.handle;
  }

  // If not found as a key, check if identifier matches a handle value
  // (e.g., URL contains the actual Shopify handle like "aero-touch-massage-insoles")
  for (const key in PRODUCT_DATA_MAP) {
    const entry = PRODUCT_DATA_MAP[key];
    if (entry.handle === identifier) {
      return entry.handle;
    }
  }

  // If not found anywhere, assume identifier IS the Shopify handle
  // (for products not yet in the map)
  return identifier;
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

  const product: Product = {
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

  // Debug: log what we're building
  if (import.meta.env.DEV) {
    console.log('[buildProductFromShopify] identifier:', identifier);
    console.log('[buildProductFromShopify] info?.handle:', info?.handle);
    console.log('[buildProductFromShopify] shopifyProduct.handle:', shopifyProduct.handle);
    console.log('[buildProductFromShopify] final handle:', handle);
    console.log('[buildProductFromShopify] final id:', shopifyId);
  }

  return product;
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
