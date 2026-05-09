import { Product } from '../types';

/**
 * Product type detection utilities based on Shopify tags
 *
 * Tag convention:
 * - Products with tags containing: 'accessory', 'recovery', 'tool', 'massage', 'compression' → Secondary Product
 * - Products with tags containing: 'insole', 'insert', 'orthotic' → Main Product
 *
 * Fallback: If tags are missing OR don't match any keywords, uses name/ID-based detection
 */

// Tag-based detection - more flexible matching
const SECONDARY_TAG_KEYWORDS = ['accessory', 'recovery', 'tool', 'massage', 'compression'];
const MAIN_TAG_KEYWORDS = ['insole', 'insert', 'orthotic', 'height'];

// Secondary product keywords (fallback - only for products without tags)
const SECONDARY_NAME_KEYWORDS = [
  // Multi-word phrases
  'massage roller', 'massage-roller', 'compression sock', 'compression socks', 'recovery gel',
  'massage ball', 'foot cream', 'heel cushion', 'heel pad', 'fascilites relief', 'plantar fasciitis',
  'toe spacer', 'toe spacers', 'toe-spacer', 'toe-spacers',
  // Single-word indicators
  'massage', 'compression', 'recovery', 'roller', 'ball', 'gel', 'cream', 'sock', 'socks', 'pad', 'cushion',
  // Specific product IDs (hyphenated)
  'massage-insoles', 'heel-cushion-pad', 'fascilites-relief', 'toe-spacers'
];

// Primary product keywords (fallback — full insole / orthotic products only).
// Do not use "height booster(s)" here: Height Boosters PDP uses SecondaryProductPage (handles below).
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
/** Shopify / local handle for the Massage Roller PDP (custom page + compare-at pricing). */
export const MASSAGE_ROLLER_HANDLE = 'massage-roller';

/** Height Boosters / lift insoles — accessory-style PDP (`SecondaryProductPage`), not full `ProductPage`. */
export const HEIGHT_BOOSTER_HANDLES = ['height-insoles', 'height-insoles-1'] as const;

export const isHeightBoosterProduct = (product: Product): boolean => {
  const handle = (product.handle || '').toLowerCase();
  const id = String(product.id || '').toLowerCase();
  return HEIGHT_BOOSTER_HANDLES.some((h) => handle === h || id === h);
};

export const isMassageRollerProduct = (product: Product): boolean => {
  const handle = (product.handle || '').toLowerCase();
  if (handle === MASSAGE_ROLLER_HANDLE) return true;
  const name = (product.name || '').toLowerCase();
  if (name.includes('massage roller') && !name.includes('insole')) return true;
  const id = String(product.id || '').toLowerCase();
  if (id === MASSAGE_ROLLER_HANDLE) return true;
  return false;
};

export const isSecondaryProduct = (product: Product): boolean => {
  // Explicit PDP templates (override tag/name heuristics)
  if (isHeightBoosterProduct(product)) {
    return true;
  }

  // 1. If product has 'insole' in tags, it's NOT secondary
  if (tagsMatchAny(product, MAIN_TAG_KEYWORDS)) {
    return false;
  }

  // 2. If product has secondary-related tags, it's secondary
  if (tagsMatchAny(product, SECONDARY_TAG_KEYWORDS)) {
    return true;
  }

  // 3. Has tags but unclear, or no tags - fallback to name/ID check
  const nameLower = (product.name || '').toLowerCase();
  const idLower = (product.id || '').toLowerCase();

  // Check for known primary products by name/ID first (primary takes precedence)
  if (PRIMARY_NAME_KEYWORDS.some(kw => nameLower.includes(kw) || idLower.includes(kw))) {
    return false; // Has primary indicator → NOT secondary
  }

  // Check secondary keywords in name or ID
  if (SECONDARY_NAME_KEYWORDS.some(kw => nameLower.includes(kw) || idLower.includes(kw))) {
    return true;
  }

  // Default: not secondary (safer - assumes it's a main product if unclear)
  return false;
};

/**
 * Determine if product is a main/primary product
 */
export const isMainProduct = (product: Product): boolean => {
  if (isHeightBoosterProduct(product)) {
    return false;
  }

  // 1. If has 'insole' tag, it's main
  if (tagsMatchAny(product, MAIN_TAG_KEYWORDS)) {
    return true;
  }

  // 2. If has secondary tags, it's NOT main
  if (tagsMatchAny(product, SECONDARY_TAG_KEYWORDS)) {
    return false;
  }

  // 3. Has tags but unclear, or no tags - fallback to name/ID check
  const nameLower = (product.name || '').toLowerCase();
  const idLower = (product.id || '').toLowerCase();

  // Check primary keywords in name or ID
  if (PRIMARY_NAME_KEYWORDS.some(kw => nameLower.includes(kw) || idLower.includes(kw))) {
    return true;
  }

  // Check secondary keywords in name or ID
  if (SECONDARY_NAME_KEYWORDS.some(kw => nameLower.includes(kw) || idLower.includes(kw))) {
    return false;
  }

  // Default: not main (safer - unclear products go to secondary)
  return false;
};

/**
 * Get the product type as a string for debugging
 */
export const getProductType = (product: Product): 'main' | 'secondary' | 'unknown' => {
  if (isMainProduct(product)) return 'main';
  if (isSecondaryProduct(product)) return 'secondary';
  return 'unknown';
};

/**
 * Debug: Get detailed classification info for a product
 */
export const getProductClassificationDebug = (product: Product): {
  type: 'main' | 'secondary' | 'unknown';
  reasons: string[];
  matchedKeywords: string[];
  tagKeywords: string[];
  nameKeywords: string[];
} => {
  const reasons: string[] = [];
  const matchedKeywords: string[] = [];
  const tagKeywords: string[] = [];
  const nameKeywords: string[] = [];

  // Check tag matches
  if (product.tags && Array.isArray(product.tags)) {
    const tags = product.tags.map(t => String(t).toLowerCase());

    for (const keyword of MAIN_TAG_KEYWORDS) {
      if (tags.some(t => t.includes(keyword.toLowerCase()))) {
        tagKeywords.push(`main:${keyword}`);
        matchedKeywords.push(keyword);
      }
    }

    for (const keyword of SECONDARY_TAG_KEYWORDS) {
      if (tags.some(t => t.includes(keyword.toLowerCase()))) {
        tagKeywords.push(`secondary:${keyword}`);
        matchedKeywords.push(keyword);
      }
    }
  }

  // Check name/ID fallback
  const nameLower = (product.name || '').toLowerCase();
  const idLower = (product.id || '').toLowerCase();

  for (const keyword of [...SECONDARY_NAME_KEYWORDS, ...PRIMARY_NAME_KEYWORDS]) {
    if (nameLower.includes(keyword.toLowerCase()) || idLower.includes(keyword.toLowerCase())) {
      nameKeywords.push(keyword);
      if (!matchedKeywords.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    }
  }

  if (tagKeywords.length > 0) {
    reasons.push(`Tag keywords: ${tagKeywords.join(', ')}`);
  }
  if (nameKeywords.length > 0) {
    reasons.push(`Name/ID keywords: ${nameKeywords.join(', ')}`);
  }

  return {
    type: getProductType(product),
    reasons,
    matchedKeywords,
    tagKeywords,
    nameKeywords
  };
};
