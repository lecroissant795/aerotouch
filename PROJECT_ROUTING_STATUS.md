# AeroTouch URL Routing Implementation - Status & Next Steps

## Date: 2026-04-29

---

## What We've Accomplished

### ✅ Completed Features

1. **Custom Router Implementation** (`utils/router.ts`)
   - Created a fully functional History API-based router
   - Supports SEO-friendly URLs for all pages
   - Includes URL parameter parsing and query string support
   - Provides `useRouter` hook with `navigate`, `replace`, `back`, `forward` functions
   - Routes defined for all page types: PRODUCT, SHOP, CATEGORY, BLOG, etc.

2. **App.tsx Refactor**
   - Removed state-based routing (`currentPage`, `selectedCategory`, etc.)
   - Integrated `useRouter` hook to derive page/params from URL
   - Implemented data fetching based on URL parameters:
     - Products: fetch by `handle` from URL
     - Blog posts: look up by `slug`
     - Bundle kits: look up by `kitId`
   - Maintained cart/checkout functionality unchanged

3. **Navigation Components Updated**
   - **Navbar**: All links converted to anchor tags with proper `href` attributes
   - **Footer**: Shop and Support links now use correct URLs
   - **ProductCard**: Restructured to use `<a>` tag for navigation to `/product/:handle`
   - **BundleKitsPage**: Kit cards now link to `/bundle/:kitId`

4. **404 Handling**
   - Created `NotFoundPage` component
   - Router returns `Page.NOT_FOUND` for unmatched routes

5. **Comprehensive Debugging**
   - Added extensive console logging in product fetching flow
   - Dual fetch strategy: try `fetchByHandle` first, fall back to `fetch(productHandle)`
   - Fallback to local product data if Shopify returns null

---

## Current Issue: Products Not Loading

### Problem Description

When navigating to a product page (e.g., `/product/massage-insoles`):
- URL changes correctly
- Page shows **"Product Not Found"** error
- Console logs indicate: `Shopify fetchByHandle result: NULL`
- Fallback to local `FEATURED_PRODUCTS` also fails

### Root Cause Analysis

Based on console output, the Shopify Buy SDK's `fetchByHandle(handle)` returns `null` for the handle `"massage-insoles"`. This means **the product with that handle does not exist in the connected Shopify store**.

The code expects the product handle to match exactly between:
1. The URL parameter (e.g., `massage-insoles`)
2. The Shopify product's `handle` field
3. The local fallback product `id`

If there's a mismatch (e.g., Shopify product has a numeric ID instead of a handle, or the handle differs), the fetch fails.

### Evidence from Logs

- `productHandle from URL params: "massage-insoles"`
- `Shopify fetchByHandle result: NULL`
- `Product not in Shopify, checking fallback data...`
- `Product not found in fallback data either`

---

## What To Do Next

### Step 1: Verify Shopify Store Product Data

**Check what products exist in your Shopify store:**

```bash
# If you have access to Shopify admin, go to:
# Products → All products
# Find the "AeroTouch Massage Insoles" product
# Check its "Handle" field in the URL or SEO settings
```

**Or use the Shopify API/GraphQL to list products:**

```ts
// Temporarily add to your App.tsx or a test file:
const products = await shopify.product.fetchAll();
console.log('All Shopify products:', products.map(p => ({ id: p.id, handle: p.handle, title: p.title })));
```

This will show you the actual `handle` values stored in Shopify.

### Step 2: Identify the Mismatch

**Possible scenarios:**

1. **Shopify product handle is different** (e.g., `aero-touch-massage-insoles`, `massage_insoles`, etc.)
   - Solution: Update the product `id` used in ProductCard to match Shopify handle
   - Or: Create a mapping from your local IDs to Shopify handles

2. **Shopify product ID is numeric** (e.g., `123456789`)
   - The Buy SDK's `fetchByHandle` expects a handle (string), not a numeric ID
   - Solution: Use `shopify.product.fetch(id)` with the global ID (usually `gid://shopify.com/Product/123456789`)
   - But your URLs would then need to encode that ID (ugly)
   - Better: Use handles consistently

3. **Products not in Shopify at all** (only in local fallback data)
   - The fallback should work, but maybe the ID doesn't match
   - Check that `FEATURED_PRODUCTS` includes an entry with `id: 'massage-insoles'` ✅ (it does)
   - Check the product navigation: are you clicking a product that exists in `FEATURED_PRODUCTS`?

### Step 3: Quick Fix Options

#### Option A: Use Local Fallback Only (Temporary)

If you want to test the routing without Shopify connectivity:

```ts
// In App.tsx fetchProduct effect, comment out Shopify fetch and use fallback directly:
// const shopifyProduct = await shopify.product.fetchByHandle(productHandle);
// ...
// Use:
const fallbackProduct = FEATURED_PRODUCTS.find(p => p.id === productHandle);
if (fallbackProduct) {
  setSelectedProduct(fallbackProduct);
  return;
}
```

This will load products from the local array only.

#### Option B: Map Local IDs to Shopify Handles

If Shopify handles differ from your local IDs, create a mapping:

```ts
const PRODUCT_HANDLE_MAP: Record<string, string> = {
  'massage-insoles': 'aero-touch-massage-insoles', // actual Shopify handle
  // ... other mappings
};

// In fetchProduct:
const shopifyHandle = PRODUCT_HANDLE_MAP[productHandle] || productHandle;
const shopifyProduct = await shopify.product.fetchByHandle(shopifyHandle);
```

#### Option C: Fetch All Shopify Products on App Load

Pre-load all Shopify products into a lookup map, then use that instead of per-request fetches:

```ts
const [shopifyProductMap, setShopifyProductMap] = useState<Record<string, any>>({});

useEffect(() => {
  const loadAll = async () => {
    const all = await shopify.product.fetchAll();
    const map: Record<string, any> = {};
    all.forEach(p => {
      if (p.handle) map[p.handle] = p;
      map[p.id] = p; // also index by ID
    });
    setShopifyProductMap(map);
  };
  loadAll();
}, []);

// Then in fetchProduct:
const shopifyProduct = shopifyProductMap[productHandle];
```

This is more efficient and avoids repeated API calls.

### Step 4: Test the Fix

After making changes:

1. **Restart dev server** (if you changed `.env` or added new files)
2. **Clear browser cache** (or use incognito)
3. **Open DevTools Console** and watch for `[App]` logs
4. **Click a product card** and verify:
   - Console shows: `Shopify fetchByHandle result: SUCCESS` or `Using fallback product`
   - Product page loads with correct data
   - URL shows `/product/massage-insoles` (or appropriate handle)

---

## Recommended Next Steps (Priority Order)

### Immediate (Today)

1. **Run the Shopify product listing script** to see actual handles:
   - Add a temporary `useEffect` in App.tsx to log all products
   - Check console output
   - Compare with your local `FEATURED_PRODUCTS` IDs

2. **Decide on data source strategy**:
   - Should products come from Shopify exclusively? (better for inventory/price sync)
   - Or use local fallback? (faster, but may be outdated)
   - Or both with proper mapping?

3. **Implement the chosen fix** (one of the options above)

### Short-term (This Week)

4. **Update ProductPage** to accept `handle` prop instead of full `product` object
   - This will simplify data flow and avoid duplicate fetching
   - ProductPage will fetch its own product data on mount
   - Reduces props complexity

5. **Expand fallback product data** to include all products in the store
   - If you have a static set of products, move all product data to a shared file
   - Type-safe and complete

6. **Add proper error boundaries** for 404 scenarios:
   - When a product is not found, show a helpful message with related products
   - Track 404s in analytics

7. **Test all navigation flows**:
   - Direct URL access: `/product/:handle`
   - Back/forward buttons
   - Refresh on any page
   - Mobile menu navigation

### Medium-term (Next Sprint)

8. **SEO Optimization**
   - Add meta tags per page (title, description, OG image)
   - Implement structured data (JSON-LD) for products
   - Add canonical URLs

9. **Performance Improvements**
   - Preload critical product data on landing page
   - Lazy-load product images
   - Cache Shopify responses (use React Query or similar)

10. **Analytics Enhancement**
    - Track product page views with product ID/name
    - Track 404 errors
    - Set up Search Console monitoring

11. **Accessibility Audit**
    - Ensure all anchor tags have proper focus states
    - Add ARIA labels where needed
    - Test keyboard navigation

---

## File Changes Summary

### New Files Created
- `utils/router.ts` - Custom router implementation
- `pages/NotFoundPage.tsx` - 404 error page

### Modified Files
- `types.ts` - Added `NOT_FOUND` to `Page` enum
- `App.tsx` - Complete refactor to use router, URL-based data fetching
- `components/Navbar.tsx` - Anchor links with proper hrefs
- `components/Footer.tsx` - SEO-friendly links
- `components/ProductCard.tsx` - Restructured as link + button
- `pages/BundleKitsPage.tsx` - Kit cards with anchor navigation
- `pages/BlogPage.tsx` - Exported `BLOG_POSTS` constant
- `pages/BundleKitsPage.tsx` - Exported `BUNDLE_KITS` constant

### No Changes Needed
- `vercel.json` - Already has rewrites for SPA routing
- `.env` configuration - Verify Shopify credentials exist

---

## Testing Checklist

- [ ] Direct navigation: Enter `/product/massage-insoles` in address bar → product loads
- [ ] Click product card → URL updates to `/product/:handle` and product loads
- [ ] Browser back button returns to previous page correctly
- [ ] Refresh on product page does not lose state
- [ ] Search query `/search?q=insoles` shows results
- [ ] Category page `/category/insoles` works
- [ ] Blog post `/blog/1` loads correctly
- [ ] 404 page shows for unknown routes (e.g., `/unknown`)
- [ ] All navigation works on mobile (hamburger menu)
- [ ] Cart functionality still works
- [ ] Checkout redirect works to Shopify
- [ ] Google Analytics tracks page views with correct paths

---

## Questions to Answer

1. **What is the actual Shopify product handle** for "AeroTouch Massage Insoles"?
2. **Do we want Shopify to be the source of truth** for product data, or is local fallback acceptable?
3. **Should we pre-fetch all products** on app load, or fetch on-demand?
4. **What should happen for 404 products**? Redirect to shop? Show similar products?

---

## Contact Points

- **Frontend Architecture**: Router integration, state management
- **Shopify Integration**: Product data source, API credentials
- **Design/UX**: Error states, loading states, fallback content

---

## Next Meeting

**Please:**
1. Check your Shopify store for the correct product handle
2. Share the output of any product listing script
3. Decide on the data source strategy (Shopify only vs hybrid)
4. We'll implement the fix accordingly

Once we know the actual Shopify product handles, we can resolve the loading issue in minutes.

---

**Status**: ✅ Routing infrastructure complete | ⚠️ Product data sync needs configuration adjustment
