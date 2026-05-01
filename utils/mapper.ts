import { Product } from '../types';
import { DEFAULT_METAFIELDS } from './productMetafields';

const generateReviewCount = (id: string | number | undefined = ''): number => {
    // Convert to string if it's not already
    const idStr = String(id || '');
    let hash = 0;
    for (let i = 0; i < idStr.length; i++) {
        hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 501) + 500; // Returns number between 500 and 1000
};

/**
 * Extract metafield value from Shopify metafields array
 * Handles both edges format (GraphQL) and direct array format
 */
const getMetafield = (metafields: any[], namespace: string, key: string): any => {
  if (!metafields || !Array.isArray(metafields)) return undefined;

  // Find metafield by namespace and key
  const metafield = metafields.find(m => {
    const mns = m.namespace || m?.node?.namespace;
    const mkey = m.key || m?.node?.key;
    return mns === namespace && mkey === key;
  });

  if (!metafield) return undefined;

  // Get the value - could be in metafield.value or metafield.node.value
  const value = metafield.value || metafield?.node?.value;
  return value;
};

/**
 * Parse JSON string or return as-is
 */
const parseJson = (value: any): any => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

/**
 * Map Shopify product to app Product type, including custom metafields
 */
export const mapShopifyProduct = (shopifyProduct: any): Product => {
    // Basic mapping
    const image = shopifyProduct.images?.edges?.[0]?.node?.url || shopifyProduct.images?.[0]?.src || '';

    // Extract images as array of strings (handle both edges format and direct array)
    let images: string[] = [];
    if (shopifyProduct.images?.edges) {
      images = shopifyProduct.images.edges.map((edge: any) => edge.node?.url || '').filter(Boolean);
    } else if (shopifyProduct.images?.length) {
      images = shopifyProduct.images.map((img: any) => img?.src || '').filter(Boolean);
    }

    const price = parseFloat(shopifyProduct.variants?.edges?.[0]?.node?.price?.amount || shopifyProduct.variants?.[0]?.price?.amount || '0');

    // Extract tags
    const tags = (shopifyProduct.tags || []).map((t: any): string => {
        if (typeof t === 'string') return t;
        return t?.value || t?.node?.value || t?.name || '';
    }).filter((t: string) => t.length > 0);

    // Determine review count
    const isMainProduct = shopifyProduct.title?.toLowerCase().includes('massage insole');
    const reviews = isMainProduct ? 4823 : generateReviewCount(shopifyProduct.id);

    // Extract metafields (supports both edges format and direct array)
    const rawMetafields = shopifyProduct.metafields || shopifyProduct.metafields?.edges?.map((e: any) => e.node) || [];

    // Build custom metafields object
    const customMetafields: Product['metafields'] = {
      // Description & Features
      custom_description: getMetafield(rawMetafields, 'custom', 'description'),
      custom_description_points: parseJson(getMetafield(rawMetafields, 'custom', 'description_points')),
      custom_features: parseJson(getMetafield(rawMetafields, 'custom', 'features')),

      // Layout & Sections
      page_layout: getMetafield(rawMetafields, 'custom', 'page_layout') || 'auto',
      show_kit_combo: getMetafield(rawMetafields, 'custom', 'show_kit_combo') !== false,
      show_tech_specs: getMetafield(rawMetafields, 'custom', 'show_tech_specs') !== false,
      show_videos: getMetafield(rawMetafields, 'custom', 'show_videos') !== false,
      show_expert_section: getMetafield(rawMetafields, 'custom', 'show_expert_section') !== false,
      show_trust_badges: getMetafield(rawMetafields, 'custom', 'show_trust_badges') !== false,
      show_faq: getMetafield(rawMetafields, 'custom', 'show_faq') !== false,
      show_testimonials: getMetafield(rawMetafields, 'custom', 'show_testimonials') !== false,

      // Content Customization
      timer_title: getMetafield(rawMetafields, 'custom', 'timer_title'),
      timer_subtitle: getMetafield(rawMetafields, 'custom', 'timer_subtitle'),
      scarcity_message: getMetafield(rawMetafields, 'custom', 'scarcity_message'),

      // Bundle Options
      bundle_options_override: parseJson(getMetafield(rawMetafields, 'custom', 'bundle_options')),

      // Trust Badges
      trust_badges_override: parseJson(getMetafield(rawMetafields, 'custom', 'trust_badges')),

      // FAQ
      faq_override: parseJson(getMetafield(rawMetafields, 'custom', 'faq')),

      // CTA Buttons
      primary_cta_text: getMetafield(rawMetafields, 'custom', 'primary_cta_text'),
      secondary_cta_text: getMetafield(rawMetafields, 'custom', 'secondary_cta_text'),
    };

    // Remove undefined values
    Object.keys(customMetafields).forEach(key => {
      if (customMetafields[key as keyof typeof customMetafields] === undefined) {
        delete customMetafields[key as keyof typeof customMetafields];
      }
    });

    return {
        id: shopifyProduct.id,
        handle: shopifyProduct.handle,
        name: shopifyProduct.title,
        tagline: shopifyProduct.description || '',
        price: price,
        rating: 5.0,
        reviews: reviews,
        image: image,
        images: images,
        features: [],
        description: shopifyProduct.descriptionHtml || shopifyProduct.description || '',
        descriptionHtml: shopifyProduct.descriptionHtml || '',
        tags: tags,
        metafields: Object.keys(customMetafields).length > 0 ? customMetafields : undefined
    };
};

export const mapShopifyLineItem = (lineItem: any): any => {
    const isMainProduct = lineItem.title?.toLowerCase().includes('massage insole');
    const reviews = isMainProduct ? 4823 : generateReviewCount(lineItem.id || '');

    return {
        id: lineItem.id,
        quantity: lineItem.quantity,
        title: lineItem.title,
        name: lineItem.title,
        price: parseFloat(lineItem.variant?.price?.amount || lineItem.variant?.price || '0'),
        image: lineItem.variant?.image?.src || '',
        selectedSize: lineItem.variant?.selectedOptions?.find((o: any) => o.name === 'Size')?.value || '',
        selectedColor: lineItem.variant?.selectedOptions?.find((o: any) => o.name === 'Color')?.value || '',
        tagline: '',
        rating: 5.0,
        reviews: reviews,
        features: [],
        description: '',
        descriptionHtml: '',
        tags: []
    };
};
