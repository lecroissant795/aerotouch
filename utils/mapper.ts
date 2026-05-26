import { Product } from '../types';
import {
  getVariantsArray,
  variantSalePrice,
  variantCompareAt,
  variantSaleCurrencyCode,
  variantCompareAtCurrencyCode,
  parseMoneyCurrencyCode
} from './shopifyVariantMoney';
import { BUNDLE_KIT_INSOLE_COLOR_ATTR, BUNDLE_KIT_INSOLE_SIZE_ATTR } from './bundleKits';
import { PRODUCT_DATA_MAP } from './productMapping';

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

const normalizeMetafields = (metafields: any): any[] => {
  if (!metafields) return [];
  if (Array.isArray(metafields)) return metafields.map((m) => m?.node ?? m).filter(Boolean);
  if (Array.isArray(metafields.edges)) {
    return metafields.edges.map((edge: any) => edge?.node).filter(Boolean);
  }
  return [];
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

    const variantsList = getVariantsArray(shopifyProduct);
    const firstVariant = variantsList[0];
    const price = firstVariant
      ? variantSalePrice(firstVariant)
      : parseFloat(
          shopifyProduct.variants?.edges?.[0]?.node?.price?.amount ||
            shopifyProduct.variants?.[0]?.price?.amount ||
            '0'
        );
    const currencyCode = firstVariant
      ? variantSaleCurrencyCode(firstVariant)
      : parseMoneyCurrencyCode(
          shopifyProduct.variants?.edges?.[0]?.node?.price ||
            shopifyProduct.variants?.[0]?.price
        );
    let compareAtPrice: number | undefined;
    let compareAtCurrencyCode: string | undefined;
    if (firstVariant) {
      const cap = variantCompareAt(firstVariant);
      if (cap != null && cap > price) {
        compareAtPrice = cap;
        compareAtCurrencyCode = variantCompareAtCurrencyCode(firstVariant) ?? currencyCode;
      }
    }

    // Extract tags
    const tags = (shopifyProduct.tags || []).map((t: any): string => {
        if (typeof t === 'string') return t;
        return t?.value || t?.node?.value || t?.name || '';
    }).filter((t: string) => t.length > 0);

    // Determine review count
    const isMainProduct = shopifyProduct.title?.toLowerCase().includes('massage insole');
    const reviews = isMainProduct ? 4823 : generateReviewCount(shopifyProduct.id);

    // Extract metafields (supports both edges format and direct array)
    const rawMetafields = normalizeMetafields(shopifyProduct.metafields);

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

    const handle = shopifyProduct.handle || '';
    const localData = PRODUCT_DATA_MAP[handle]?.product;

    return {
        id: shopifyProduct.id,
        handle: handle,
        name: shopifyProduct.title,
        tagline: shopifyProduct.description || localData?.tagline || '',
        price: price,
        ...(currencyCode ? { currencyCode } : {}),
        ...(compareAtPrice != null ? { compareAtPrice } : {}),
        ...(compareAtCurrencyCode ? { compareAtCurrencyCode } : {}),
        rating: 5.0,
        reviews: reviews,
        image: image,
        images: images,
        features: localData?.features ?? [],
        description: shopifyProduct.descriptionHtml || shopifyProduct.description || localData?.description || '',
        descriptionHtml: shopifyProduct.descriptionHtml || '',
        tags: tags,
        metafields: Object.keys(customMetafields).length > 0 ? customMetafields : undefined
    };
};

const sumLineItemDiscountAllocations = (lineItem: any): number => {
    const allocs = lineItem.discountAllocations;
    if (!Array.isArray(allocs) || allocs.length === 0) return 0;
    let sum = 0;
    for (const a of allocs) {
        const money = a?.allocatedAmount ?? a?.discountedAmount;
        const raw =
            typeof money === 'object' && money != null && 'amount' in money
                ? (money as { amount?: string }).amount
                : money;
        if (raw != null) {
            const n = parseFloat(String(raw));
            if (!Number.isNaN(n)) sum += n;
        }
    }
    return Math.round(sum * 100) / 100;
};

export const mapShopifyLineItem = (lineItem: any, fallbackCurrencyCode?: string): any => {
    const isMainProduct = lineItem.title?.toLowerCase().includes('massage insole');
    const reviews = isMainProduct ? 4823 : generateReviewCount(lineItem.id || '');
    const sale = variantSalePrice(lineItem.variant) || parseFloat(lineItem.variant?.price?.amount || lineItem.variant?.price || '0');
    const currencyCode =
        variantSaleCurrencyCode(lineItem.variant) ||
        parseMoneyCurrencyCode(lineItem.variant?.price) ||
        parseMoneyCurrencyCode(lineItem.originalTotalPrice) ||
        fallbackCurrencyCode;
    const cap = variantCompareAt(lineItem.variant);
    const compareAtPrice = cap != null && cap > sale ? cap : undefined;
    const compareAtCurrencyCode =
        compareAtPrice != null
            ? variantCompareAtCurrencyCode(lineItem.variant) ?? currencyCode
            : undefined;
    const productRef = lineItem.variant?.product;
    const promoDiscount = sumLineItemDiscountAllocations(lineItem);
    const attrs = lineItem.customAttributes || [];
    const attrVal = (key: string) => attrs.find((a: any) => a.key === key)?.value;

    return {
        id: lineItem.id,
        quantity: lineItem.quantity,
        title: lineItem.title,
        name: lineItem.title,
        price: sale,
        ...(currencyCode ? { currencyCode } : {}),
        ...(compareAtPrice != null ? { compareAtPrice } : {}),
        ...(compareAtCurrencyCode ? { compareAtCurrencyCode } : {}),
        ...(promoDiscount > 0 ? { linePromoDiscountTotal: promoDiscount } : {}),
        image: lineItem.variant?.image?.src || lineItem.variant?.image?.url || '',
        variantId: lineItem.variant?.id,
        customAttributes: attrs,
        selectedSize:
            lineItem.variant?.selectedOptions?.find((o: any) => o.name === 'Size')?.value ||
            attrVal(BUNDLE_KIT_INSOLE_SIZE_ATTR) ||
            '',
        selectedColor:
            lineItem.variant?.selectedOptions?.find((o: any) => o.name === 'Color')?.value ||
            attrVal(BUNDLE_KIT_INSOLE_COLOR_ATTR) ||
            '',
        ...(productRef?.id ? { productShopifyId: productRef.id } : {}),
        ...(productRef?.handle ? { productHandle: productRef.handle } : {}),
        tagline: '',
        rating: 5.0,
        reviews: reviews,
        features: [],
        description: '',
        descriptionHtml: '',
        tags: []
    };
};
