# Product Page Logic & Pricing Reference

This document describes how the Product page works and how pricing is applied across all products and bundles in the app.

---

## 1. Product Page Logic

### 1.1 Entry & Props

- **When shown:** App renders `ProductPage` when `currentPage === Page.PRODUCT` and `selectedProduct` is set.
- **Props:**
  - `product` — Initial product (from `selectedProduct` in App).
  - `onAddToCart(product, size, color, quantity?)` — Adds item(s) to cart; cart/checkout live in App.
  - `onBack()` — Navigate back (e.g. to Shop).
  - `onProductSelect?` — Navigate to another product.
  - `onNavigateToBlog?` — Navigate to blog.

### 1.2 Data Flow: Local vs Shopify

| Concern | Logic |
|--------|--------|
| **Display product** | Stored in local state `product`, initialized from `initialProduct`. |
| **Shopify enrichment** | On mount, `shopify.product.fetchByHandle(initialProduct.id)` runs. On success: raw product → `shopifyProduct`, variants → `variants`, and `product` is replaced with `mapShopifyProduct(fetchedProduct)`. |
| **Fallback** | If fetch fails (e.g. no API key), the initial product and fallback size/color options are used. |
| **Size / Color options** | From `shopifyProduct.options` (Size, Color) when available; otherwise `DEFAULT_SIZES` and `DEFAULT_COLORS` in `ProductPage.tsx`. |

### 1.3 Quantity (Bundle Selector) & Tier Pricing

- User selects **1, 2, or 3 pairs** via the “Select Quantity” UI (`bundle` state = 1 | 2 | 3).
- **Tier rules** (from `utils/pricing.ts`):
  - **1 pair:** No tier discount (0%).
  - **2+ items:** 10% off.
  - **3+ items:** 18% off.
  - **5+ items:** 24% off (not exposed in the 1/2/3 selector but used by `getLinePricing` and cart-wide tiers).

Displayed price and savings are computed with:

- `getLinePricing(product.price, bundle)` → `unitPrice`, `savings`, `discountPercent`, etc.
- **Compare-at** = `product.price` (per pair).
- **Selling price** = tier-discounted unit price × quantity (shown as “per pair” and in total where applicable).

### 1.4 Add to Cart

| Action | Logic |
|--------|--------|
| **Add to Cart (main CTA)** | Requires `selectedSize`. Calls `onAddToCart(product, selectedSize, selectedColor, bundle)`. `bundle` is the selected quantity (1, 2, or 3). |
| **Add Bundle to Cart (Recovery Kit)** | Adds three separate line items: (1) current insole product × 1, (2) Recovery Socks × 1 at $15, (3) Recovery Gel × 1 at $12.50. Size/color for insoles come from selectors; socks/gel use `'Standard'` / `'One Size'`. |

### 1.5 Social Proof & Urgency

- **`useSocialProof(product.id)`:** Provides `viewers`, `reviewCount`, `rating`. Viewers are simulated (baseline + jitter every 4s). Reviews can merge Supabase data with a mock baseline.
- **“Offer ends soon” timer:** Local countdown state (hours/minutes/seconds), decremented every second. Presentational only.
- **“Selling fast” / “High demand”:** Use the same `viewers` value.

### 1.6 UI Behavior (summary)

- **Hash scroll:** If URL has `#best-for` (or similar), page scrolls to that section.
- **Image gallery:** Mobile = horizontal carousel with `activeImgIndex` synced to scroll and dots; desktop = static bento grid.
- **Sections / FAQ / Testimonials:** Each uses local state for open item or active index.
- **Modals:** Size guide and payment methods toggled by `isSizeGuideOpen` and `paymentMethodsOpen`.

### 1.7 Bottom Sections

- **“The Complete Recovery Kit” (on Product page):** Same bundle as “Add Bundle to Cart” (insoles + Recovery Socks + Recovery Gel). Displayed bundle price is **$39.98**; compare-at is `product.price + 27.50`. CTA calls `handleAddBundleToCart`.
- **ProductTechSpecs:** Renders “best for”, specs, and cross-links; uses `product.id`, `onProductSelect`, `onNavigateToBlog`.

---

## 2. Pricing System (Tiered Quantity Discounts)

**Source:** `utils/pricing.ts`

### 2.1 Tiers

| Min quantity | Discount | Label   |
|-------------|----------|--------|
| 1           | 0%       | —      |
| 2           | 10%      | 10% OFF |
| 3           | 18%      | 18% OFF |
| 5           | 24%      | 24% OFF |

- **1 pair:** Full compare-at price (no discount).
- **2+ items:** 10% off per unit.
- **3+ items:** 18% off per unit.
- **5+ items:** 24% off per unit.

### 2.2 Helper: `getLinePricing(compareAtUnitPrice, qty)`

- **Inputs:** `compareAtUnitPrice` (e.g. `product.price`), `qty` (number of units).
- **Returns:**  
  `qty`, `tier`, `unitPrice`, `total`, `compareAtTotal`, `savings`, `discountPercent`.

**Formula:**  
`unitPrice = compareAtUnitPrice × (1 - tier.discountPercent / 100)`  
`total = unitPrice × qty`  
`savings = compareAtTotal - total`

Used on the Product page for the 1/2/3 pair selector and any “Save X%” / “$X each” display.

---

## 3. Products & Base Prices

Products are defined in multiple places (LandingPage, ShopPage, etc.); Shopify can override at runtime. Below are the **fallback / default** values used when Shopify is not used or fetch fails.

### 3.1 Main catalog (e.g. `FEATURED_PRODUCTS` in LandingPage / ShopPage)

| Product ID           | Name                      | Base price (compare-at) |
|----------------------|---------------------------|--------------------------|
| `massage-insoles`    | AeroTouch Massage Insoles | $34.00                   |
| `massage-roller`     | Massage Roller            | $19.00                   |
| `heel-cushion-pad`   | Heel Cushion Pad          | $24.00                   |
| `compression-socks`  | Compression Socks         | $29.00                   |
| `fascilites-relief`  | Fascilites Relief Kit     | $48.00 (bundle)          |
| `height-insoles`     | Height Insoles            | $39.00                   |

### 3.2 In-page “Recovery” items (ProductPage, Add Bundle to Cart)

These are **hardcoded** when adding the “Complete Recovery Kit” from the product page:

| Product ID          | Name           | Price  | Notes                    |
|---------------------|----------------|--------|--------------------------|
| (current product)   | (insoles)      | varies | 1× at selected size/color |
| `compression-socks` | Recovery Socks | $15.00 | 1×, “Standard” / “One Size” |
| `recovery-gel`      | Recovery Gel   | $12.50 | 1×, “Standard” / “One Size” |

- **Displayed bundle total:** $39.98 (fixed on Product page).
- **Compare-at (display):** `product.price + 27.50` (e.g. $34 + $27.50 = $61.50).

---

## 4. Bundle Kits (BundleKitsPage / LimitedTimeKits)

**Source:** `BUNDLE_KITS` in `pages/BundleKitsPage.tsx` (same set in `LimitedTimeKits.tsx`). Each kit has a **single price** and **original price**; no quantity tiers.

| Kit ID                  | Name                      | Price | Original price | Contents (summary)                          |
|-------------------------|---------------------------|-------|----------------|----------------------------------------------|
| `fascilites-relief`     | Fascilites Relief Kit     | $48.00| $75.00         | 1× AeroTouch Massage Insoles, 1× Massage Roller |
| `heel-relief`           | Heel Relief Kit           | $39.00| $60.00         | 1× AeroTouch Massage Insoles, 2× Heel Cushions |
| `toe-relief`            | Toe Relief Kit            | $39.00| $60.00         | 1× AeroTouch Massage Insoles, 2× Toe Cushion Pads |
| `complete-recovery-kit` | The Complete Recovery Kit | $97.00| $150.00        | 3× AeroTouch Massage Insoles, 1× Massage Roller, 2× Heel Cushions, 2× Toe Cushion Pads |

- **Kit product page:** `KitProductPage` uses `kit.price` and `kit.originalPrice`; savings % = `(1 - kit.price / kit.originalPrice) * 100`; line total = `kit.price * quantity`.
- **Add to cart:** App’s `handleAddKitToCart(kit, quantity)` maps the kit to a single “product” and calls `onAddToCart` with that product, `'Standard'`, `'One Size'`, and the chosen quantity (no size/color selector for kits in this flow).

---

## 5. Cart Drawer: Upsells & “Make it a kit”

**Source:** `components/CartDrawer.tsx`

### 5.1 Upsell products (rotating)

| Name            | Price | Compare-at |
|-----------------|-------|------------|
| Massage Roller  | $29   | $45        |
| Recovery Band   | $19   | $32        |
| Travel Case     | $15   | $24        |

### 5.2 “Make it a kit” offer

- **Kit:** Fascilites Relief Kit  
- **Price:** $48  
- **Original price:** $75  
- **Blurb:** “Massage Insoles + Massage Roller. Save more when you bundle.”

---

## 6. Quick Reference: Where Prices Live

| What                    | Where defined / used                          |
|-------------------------|-----------------------------------------------|
| Tier rules (10%, 18%, 24%) | `utils/pricing.ts` → `PRICING_TIERS`         |
| Product page 1/2/3 pricing | `getLinePricing(product.price, bundle)`      |
| Catalog product prices | `FEATURED_PRODUCTS` (LandingPage, ShopPage, etc.) or Shopify |
| Recovery Socks / Gel    | Hardcoded in `ProductPage.tsx` ($15, $12.50)  |
| In-page Recovery bundle display | ProductPage: $39.98, compare-at `product.price + 27.50` |
| Bundle kits (4 kits)    | `BUNDLE_KITS` in BundleKitsPage / LimitedTimeKits |
| Cart upsells            | `UPSELL_PRODUCTS` in CartDrawer               |
| Make it a kit           | `MAKE_IT_A_KIT_OFFER` in CartDrawer (Fascilites $48/$75) |

---

## 7. Summary

- **Product page:** Shows one product; can enrich from Shopify. User picks size, color, and quantity (1/2/3 pairs). Tiered pricing applies via `getLinePricing(product.price, bundle)`. Add to cart sends that product + options to App. “Add Bundle to Cart” adds insoles + Recovery Socks ($15) + Recovery Gel ($12.50); UI shows bundle at $39.98.
- **Pricing:** All quantity-based discounts for single-SKU products go through `utils/pricing.ts` (tiers: 2→10%, 3→18%, 5→24%).
- **Bundles:** Four named kits use fixed `price` / `originalPrice`; the in-page “Complete Recovery Kit” uses fixed $39.98 and fixed add-on prices for socks and gel.
- **Cart:** Upsells and “Make it a kit” use the prices listed in CartDrawer; cart and checkout state and Shopify checkout live in App.
