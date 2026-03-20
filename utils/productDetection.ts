import { Product } from '../types';

/**
 * Product type detection utilities based on Shopify tags
 *
 * Tag convention:
 * - Products with tags containing: 'accessory', 'recovery', 'tool', 'massage', 'compression' → Secondary Product
 * - Products with tags containing: 'insole', 'insert', 'orthotic' → Main Product
 *
 * Fallback: If tags are missing or unclear, uses name-based detection
 */

// Tag-based detection - more flexible matching
const SECONDARY_TAG_KEYWORDS = ['accessory', 'recovery', 'tool', 'massage', 'compression'];
const MAIN_TAG_KEYWORDS = ['insole', 'insert', 'orthotic', 'height'];

// Secondary product keywords (fallback - only for products without tags)
const SECONDARY_NAME_KEYWORDS = ['massage roller', 'compression sock', 'recovery gel', 'massage ball', 'foot cream'];

// Primary product keywords (fallback - more reliable)
const PRIMARY_NAME_KEYWORDS = ['insole', 'insert', 'orthotic', 'height insole'];

/**
 * Check if any product tag contains a substring (case-insensitive)
 */
const tagContains = (product: Product, substring: string): boolean => {
  if (!product.tags || !Array.isArray(product.tags)) {
    return false;
  }
  return product.tags.some(t => String(t).toLowerCase().includes(substring.toLowerCase()));
};

/**
 * Check if product has any tags
 */
const hasAnyTags = (product: Product): boolean => {
  return Boolean(product.tags && product.tags.length > 0);
};

/**
 * Check if any tag matches any keyword (flexible matching)
 */
const tagsMatchAny = (product: Product, keywords: string[]): boolean => {
  if (!product.tags || !Array.isArray(product.tags)) {
    return false;
  }
  return product.tags.some(t =>
    keywords.some(k => String(t).toLowerCase().includes(k.toLowerCase()))
  );
};

/**
 * Determine if product is a secondary/accessory product
 */
export const isSecondaryProduct = (product: Product): boolean => {
  // 1. If product has 'insole' in tags, it's NOT secondary
  if (tagsMatchAny(product, MAIN_TAG_KEYWORDS)) {
    return false;
  }

  // 2. If product has secondary-related tags, it's secondary
  if (tagsMatchAny(product, SECONDARY_TAG_KEYWORDS)) {
    return true;
  }

  // 3. If NO tags at all, use name-based fallback
  if (!hasAnyTags(product)) {
    const nameLower = (product.name || '').toLowerCase();
    const idLower = (product.id || '').toLowerCase();

    // Check for known secondary products by exact ID
    const knownSecondaryIds = ['massage-roller', 'compression-socks', 'recovery-gel', 'massage-ball', 'foot-cream'];
    if (knownSecondaryIds.some(id => idLower.includes(id))) {
      return true;
    }

    // Check secondary keywords in name (but be conservative)
    if (SECONDARY_NAME_KEYWORDS.some(kw => nameLower.includes(kw))) {
      return true;
    }

    // Default: not secondary (safer)
    return false;
  }

  // 4. Has tags but unclear - default to not secondary
  return false;
};

/**
 * Determine if product is a main/primary product
 */
export const isMainProduct = (product: Product): boolean => {
  // 1. If has 'insole' tag, it's main
  if (tagsMatchAny(product, MAIN_TAG_KEYWORDS)) {
    return true;
  }

  // 2. If has secondary tags, it's NOT main
  if (tagsMatchAny(product, SECONDARY_TAG_KEYWORDS)) {
    return false;
  }

  // 3. No tags? Use name fallback
  if (!hasAnyTags(product)) {
    const nameLower = (product.name || '').toLowerCase();
    const idLower = (product.id || '').toLowerCase();

    if (PRIMARY_NAME_KEYWORDS.some(kw => nameLower.includes(kw) || idLower.includes(kw))) {
      return true;
    }

    return false;
  }

  // 4. Has tags but unclear - default to main (safer)
  return true;
};

/**
 * Get the product type as a string for debugging
 */
export const getProductType = (product: Product): 'main' | 'secondary' | 'unknown' => {
  if (isMainProduct(product)) return 'main';
  if (isSecondaryProduct(product)) return 'secondary';
  return 'unknown';
};
