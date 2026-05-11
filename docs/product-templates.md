# Product Templates & Mapping

This document describes the available product page templates, how products are mapped to them, and the plan for making the system configurable.

---

## Available Templates

### `primary` — Main Product Page
**File:** `pages/ProductPage.tsx`

Used for core products like insoles and orthotics. Full-featured layout.

- Size selector (M 5–15 / W 6–16)
- Color selector (Signature Orange, Grey, Stealth Black)
- Tiered quantity pricing (10% / 18% / 24% off for 2+ / 3+ / 5+ items)
- Product video player
- Tech specs component
- "Built For" use-case carousel
- Add to Bundle (insoles + socks + gel combo)
- Buy Now direct checkout

---

### `secondary` — Accessory / Recovery Page
**File:** `pages/SecondaryProductPage.tsx`

Used for accessories and recovery products. Simplified, conversion-focused layout.

- Quantity bundles (1, 2, or 3 units)
- One Size default (minimal size options)
- Countdown timer + urgency bar
- Hardcoded testimonials and FAQs
- Trust badges (Tracked Shipping, 60-Day Guarantee, 24/7 Support)
- Marquee trust banner
- Related products (up to 3)

---

### `kit` — Bundle Kit Page
**File:** `pages/KitProductPage.tsx`

Used for pre-configured bundle kits. Shows kit contents and savings.

- Kit contents list
- Fixed pricing (no tiered discounts)
- Simple quantity selector (1–10)
- Value pillars section
- No Shopify live fetch — uses local BundleKit data

---

## How Mapping Works (Current)

Products are automatically detected using `utils/productDetection.ts`:

```
Product tags checked → isSecondaryProduct() → true/false
```

| Tag contains | Template |
|---|---|
| `insole`, `insert`, `orthotic`, `height` | primary |
| `accessory`, `recovery`, `tool`, `massage`, `compression` | secondary |
| No tags | Name-based fallback, defaults to primary |

The routing in `App.tsx` (line ~312):

```tsx
isSecondaryProduct(selectedProduct)
  ? <SecondaryProductPage ... />
  : <ProductPage ... />
```

Kit products are handled separately via `Page.KIT_PRODUCT`, not through this detection.

---

## Proposed: Configurable Template Mapping

### New Config File: `utils/productTemplateMap.ts`

A single file you can manually edit to control which tags map to which template.

```typescript
export const templateMapping = {
  tagToTemplate: {
    // PRIMARY: Main products
    'insole':    'primary',
    'insert':    'primary',
    'orthotic':  'primary',

    // SECONDARY: Accessories
    'accessory':   'secondary',
    'recovery':    'secondary',
    'tool':        'secondary',
    'massage':     'secondary',
    'compression': 'secondary',

    // KIT: Bundles
    'kit':    'kit',
    'bundle': 'kit',
  },

  // Fallback if no tags match
  defaultTemplate: 'primary',
};
```

**Matching rules:**
- Case-insensitive
- Partial match: tag `premium-insole` matches key `insole`
- First match wins (order matters)

---

### New Resolver: `getProductTemplate(product)`

Replaces `isSecondaryProduct()` everywhere. Priority order:

1. Explicit `product.template` field (manual override)
2. Tag-based lookup in `templateMapping.tagToTemplate`
3. Legacy `isSecondaryProduct()` fallback
4. `defaultTemplate` (primary)

---

### Updated Routing in `App.tsx`

```tsx
import { getProductTemplate } from './utils/productTemplateMap';

const template = getProductTemplate(selectedProduct);

{template === 'primary'   && <ProductPage ... />}
{template === 'secondary' && <SecondaryProductPage ... />}
{template === 'kit'       && <KitProductPage ... />}
```

---

## Files to Change

| File | What Changes |
|---|---|
| `utils/productTemplateMap.ts` | **New file** — config + resolver |
| `types.ts` | Add optional `template?: 'primary' \| 'secondary' \| 'kit'` to Product |
| `App.tsx` | Replace `isSecondaryProduct()` with `getProductTemplate()` |
| `utils/productDetection.ts` | Keep as-is (used as legacy fallback) |

---

## How to Add a New Template

1. Create the new page component, e.g. `pages/PremiumProductPage.tsx`
2. Add the template name to the union type in `types.ts`:
   ```typescript
   template?: 'primary' | 'secondary' | 'kit' | 'premium';
   ```
3. Add tag mappings in `utils/productTemplateMap.ts`:
   ```typescript
   'premium': 'premium',
   'limited-edition': 'premium',
   ```
4. Add the render case in `App.tsx`:
   ```tsx
   {template === 'premium' && <PremiumProductPage ... />}
   ```
