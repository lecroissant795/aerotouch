import { Product } from '../types';
import { BUNDLE_KITS } from './bundleKits';
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

function bundleKitToShopifyProductInfo(
  kit: (typeof BUNDLE_KITS)[number]
): ShopifyProductInfo {
  return {
    shopifyId: kit.shopifyProductId,
    handle: kit.handle,
    product: {
      name: kit.name,
      tagline: 'Bundle kit — recovery essentials',
      price: kit.price,
      ...(kit.originalPrice > kit.price ? { compareAtPrice: kit.originalPrice } : {}),
      rating: 5.0,
      reviews: 3200,
      image: kit.image,
      features: [...kit.items],
      description: kit.items.join('. ')
    }
  };
}

const BUNDLE_KIT_PRODUCT_ENTRIES: Record<string, ShopifyProductInfo> = Object.fromEntries(
  BUNDLE_KITS.map((k) => [k.id, bundleKitToShopifyProductInfo(k)])
) as Record<string, ShopifyProductInfo>;

/** Local PDP + card copy for Massage Gun (re-applied after Shopify fetch in SecondaryProductPage). */
export const MASSAGE_GUN_PDP_COPY = {
  tagline: 'Percussion relief built for feet, arches, and calves',
  customDescription:
    'Your feet work overtime. Give them the recovery they deserve.\n' +
    '\n' +
    'You already know the pain — long shifts, endless walking, that deep ache in your arches that never quite lets up. Stretching only goes so far. Rolling a tennis ball under your desk only does so much.\n' +
    '\n' +
    'The AeroTouch massage gun delivers rapid, targeted deep-tissue relief right where your feet and lower legs need it most. Plantar fasciitis tension, sore arches, tight calves — aim, press, and feel tight spots release in minutes, not hours.\n' +
    '\n' +
    "What's included:",
  features: [
    '4 interchangeable massage heads: Ball, fork, bullet, and flat — each shaped for a different area of your foot and calf',
    '6 speed settings: Dial intensity from a gentle flush to deep percussion you control',
    'Lightweight, portable design: Stows in your gym bag, desk drawer, or nightstand so relief is always within reach',
    'USB-C rechargeable: Skip the disposable batteries — plug in and you are ready for the next session',
    'Whisper-quiet motor: Use it at home, after a shift, or before bed without rattling the room'
  ],
  description:
    'Your feet work overtime. Give them the recovery they deserve. The AeroTouch massage gun delivers targeted deep-tissue relief for sore arches, tight calves, and tired lower legs — portable, USB-C rechargeable, and quiet enough for home or work.'
} as const;

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
      image: '',
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
      image: '',
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
      image: ''
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
      image: '',
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
      image: '',
      features: ['Cashmere Lining', 'Memory Foam', 'Temperature Regulation'],
      description: 'Premium insoles with cashmere-soft lining for ultimate everyday comfort.'
    }
  },
  'toe-cushion-pds': {
    shopifyId: '9134310162689',
    handle: 'toe-cushion-pds',
    product: {
      name: 'Toe Cushion Pads',
      tagline: 'Low-profile protection where shoes rub most',
      price: 12.00,
      rating: 4.7,
      reviews: 890,
      image: '',
      features: [
        'Friction shield: Helps reduce rubbing and pressure on sensitive toe zones',
        'Soft cushioning: Adds comfort without making your shoes feel tight',
        'Invisible profile: Low‑key fit that stays discreet inside most footwear',
        'Skin-friendly feel: Smooth material designed to minimize irritation',
        'Reusable wear: Easy to clean and ready for repeat use'
      ],
      description:
        'Shoes shouldn’t punish your toes.\n' +
        '\n' +
        'That sharp rubbing at the front of your shoe can turn a normal day into a painful one—especially when you’re walking, standing, or training. Toe Cushion Pads create a soft barrier between your toes and friction points so you can move without constantly thinking about discomfort.\n' +
        '\n' +
        'Built for all-day wear, they help cushion pressure, reduce irritation, and keep you comfortable in everything from sneakers to dress shoes.'
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
      image: '',
      features: ['Ergonomic Design', 'Medical-Grade Silicone', 'Pain Relief'],
      description: ''
    }
  },
  'heel-cushion-pds': {
    shopifyId: '9134310293761',
    handle: 'heel-cushion-pds',
    product: {
      name: 'Heel Cushions',
      tagline: 'Invisible heel protection for long days',
      price: 22.00,
      rating: 4.9,
      reviews: 2100,
      image: '',
      features: [
        'Premium cotton cushioning: Soft, cloud-like layer between your heel and the shoe base',
        'Friction-reducing design: Helps prevent rubbing that can lead to blisters and irritation',
        'Self-adhesive backing: Sticks firmly inside your shoe — no sliding, no repositioning',
        'Non-slip grip: Helps keep your foot stable so your shoe stays where it should',
        'Universal fit: Works in sneakers, dress shoes, boots, heels, and more'
      ],
      description:
        'Your heels take a beating every day — it’s time to protect them.\n' +
        '\n' +
        'Hard floors. Long shifts. Shoes that weren’t designed with your comfort in mind. By the end of the day, your heels feel it — that deep ache that makes every step a reminder.\n' +
        '\n' +
        'AeroTouch Heel Cushions sit quietly inside your shoe and absorb the punishment so your heels don’t have to.\n' +
        '\n' +
        'Small addition. Big difference.\n' +
        '\n' +
        'Slip them in before you leave the house and forget they’re there. That’s the point — invisible protection that lets you focus on your day, not your feet.'
    }
  },
  'massage-gun': {
    shopifyId: '9134530461953',
    handle: 'massage-gun',
    product: {
      name: 'Massage Gun',
      tagline: MASSAGE_GUN_PDP_COPY.tagline,
      price: 79.00,
      rating: 4.8,
      reviews: 650,
      image: '',
      features: [...MASSAGE_GUN_PDP_COPY.features],
      description: MASSAGE_GUN_PDP_COPY.description,
      metafields: {
        custom_description: MASSAGE_GUN_PDP_COPY.customDescription
      }
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
      image: ''
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
      image: '',
      features: ['Natural Ingredients', 'Fast Absorption', 'Cooling Effect'],
      description: 'Therapeutic gel formulated to relieve muscle tension and accelerate recovery.'
    }
  },
  ...BUNDLE_KIT_PRODUCT_ENTRIES
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
