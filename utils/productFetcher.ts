import { shopify } from './shopify';
import {
  fetchPresentmentProductByHandle,
  fetchPresentmentProductById,
  fetchPresentmentProducts,
} from './storefrontPresentment';

/**
 * Fetch a product by handle, using standard SDK methods with fallbacks
 */
export async function fetchProductByHandle(handle: string, currencyCode?: string): Promise<any> {
  if (!shopify) {
    console.warn('[Fetcher] Shopify client not available');
    return null;
  }

  console.log('[Fetcher] Attempting to fetch product with handle:', handle);

  try {
    try {
      const presentmentProduct = await fetchPresentmentProductByHandle(handle, currencyCode);
      if (presentmentProduct) {
        console.log('[Fetcher] ✅ Storefront presentment fetch succeeded');
        return presentmentProduct;
      }
    } catch (presentmentError) {
      console.warn('[Fetcher] Presentment product fetch failed, falling back to SDK:', presentmentError);
    }

    // Strategy 1: Use the handle directly with fetchByHandle
    console.log('[Fetcher] Strategy 1: shopify.product.fetchByHandle');
    const product = await shopify.product.fetchByHandle(handle);
    if (product) {
      console.log('[Fetcher] ✅ Strategy 1 succeeded');
      return product;
    }
    console.log('[Fetcher] ❌ Strategy 1 returned null');

    // Strategy 2: Try fetching by numeric ID if handle contains digits
    const numericId = handle.replace(/\D/g, '');
    if (numericId) {
      console.log('[Fetcher] Strategy 2: shopify.product.fetch with numeric ID:', numericId);
      try {
        const presentmentProductById = await fetchPresentmentProductById(numericId, currencyCode);
        if (presentmentProductById) {
          console.log('[Fetcher] ✅ Storefront presentment ID fetch succeeded');
          return presentmentProductById;
        }
        const productById = await shopify.product.fetch(numericId);
        if (productById) {
          console.log('[Fetcher] ✅ Strategy 2 succeeded');
          return productById;
        }
        console.log('[Fetcher] ❌ Strategy 2 returned null');
      } catch (e) {
        console.log('[Fetcher] ❌ Strategy 2 threw error:', e);
      }
    }

    // Strategy 3: Try direct fetch with the original handle (in case it's a GID)
    console.log('[Fetcher] Strategy 3: shopify.product.fetch with original handle');
    const directFetch = await shopify.product.fetch(handle);
    if (directFetch) {
      console.log('[Fetcher] ✅ Strategy 3 succeeded');
      return directFetch;
    }
    console.log('[Fetcher] ❌ Strategy 3 returned null');
  } catch (error: any) {
    console.warn(`[Fetcher] Failed to fetch product "${handle}":`, error);
    // Log more details if available
    if (error?.data || error?.message) {
      console.warn('[Fetcher] Error details:', error.data || error.message);
    }
  }

  console.log('[Fetcher] All strategies failed');
  return null;
}

/**
 * Fetch multiple products
 */
export async function fetchAllProducts(limit: number = 20, currencyCode?: string): Promise<any[]> {
  if (!shopify) {
    console.warn('[Fetcher] Shopify client not available');
    return [];
  }

  try {
    try {
      const presentmentProducts = await fetchPresentmentProducts(limit, currencyCode);
      if (presentmentProducts?.length) return presentmentProducts;
    } catch (presentmentError) {
      console.warn('[Fetcher] Presentment products fetch failed, falling back to SDK:', presentmentError);
    }

    const products = await shopify.product.fetchAll(limit) || [];
    return products;
  } catch (error) {
    console.warn('[Fetcher] Failed to fetch products:', error);
    return [];
  }
}

/**
 * Fetch a product by ID
 */
export async function fetchProductById(id: string, currencyCode?: string): Promise<any> {
  if (!shopify) {
    console.warn('[Fetcher] Shopify client not available');
    return null;
  }

  try {
    try {
      const presentmentProduct = await fetchPresentmentProductById(id, currencyCode);
      if (presentmentProduct) return presentmentProduct;
    } catch (presentmentError) {
      console.warn(`[Fetcher] Presentment product by ID fetch failed for "${id}", falling back to SDK:`, presentmentError);
    }

    const product = await shopify.product.fetch(id);
    return product || null;
  } catch (error) {
    console.warn(`[Fetcher] Failed to fetch product by ID "${id}":`, error);
    return null;
  }
}
