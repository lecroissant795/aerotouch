# Shopify Metafields for Product Pages

This document explains how to set up and use Shopify metafields to customize product page content without code changes.

## Setup in Shopify Admin

### 1. Create Metafield Definitions

Go to **Settings > Metafields > Products** in your Shopify admin and create the following metafields:

#### Namespace: `custom`

| Key | Type | Description |
|-----|------|-------------|
| `description` | Single line text | Override the product description |
| `description_points` | List of strings | Custom bullet points for description (JSON array) |
| `features` | JSON | Custom structured features with label/value pairs |
| `page_layout` | Dropdown | Force layout: `primary`, `secondary`, or `auto` |
| `show_kit_combo` | Boolean | Show/hide the kit bundle section (primary only) |
| `show_tech_specs` | Boolean | Show/hide ProductTechSpecs section (primary only) |
| `show_videos` | Boolean | Show/hide video testimonials section (primary only) |
| `show_expert_section` | Boolean | Show/hide expert recommendation (primary only) |
| `show_trust_badges` | Boolean | Show/hide trust badges grid (secondary only) |
| `show_faq` | Boolean | Show/hide FAQ section (secondary only) |
| `show_testimonials` | Boolean | Show/hide testimonial card (secondary only) |
| `timer_title` | Single line text | Override "OFFER ENDS SOON" title |
| `timer_subtitle` | Single line text | Override "Limited Time Discount" subtitle |
| `scarcity_message` | Single line text | Override "X people viewing this" text |
| `bundle_options` | JSON | Override bundle tier options |
| `trust_badges` | JSON | Override trust badge icons and labels |
| `faq` | JSON | Override FAQ accordion items |
| `primary_cta_text` | Single line text | Override "ADD TO CART" button text |
| `secondary_cta_text` | Single line text | Override disabled button text |

### 2. Add Metafield Values to Products

Edit each product and fill in the metafields under the "Metafields" section.

**Example JSON values:**

```json
// description_points (List of strings)
["Therapeutic acupressure with every step", "Deep tissue recovery for sore feet", "Portable for on-the-go relief"]

// features (JSON)
[{"label": "Material", "value": "Medical-grade silicone"}, {"label": "Warranty", "value": "2 years"}]

// bundle_options (JSON)
[
  {"quantity": 1, "label": "1 Pair", "savings_text": "Save 10%", "highlight": "none"},
  {"quantity": 2, "label": "2 Pairs", "savings_text": "Save 25% + Free Socks", "highlight": "popular"},
  {"quantity": 3, "label": "3 Pairs", "savings_text": "Save 35% + Free Kit", "highlight": "best-value"}
]

// trust_badges (JSON)
[
  {"icon": "truck", "label": "Free Shipping"},
  {"icon": "shield", "label": "60-Day Guarantee"},
  {"icon": "headphones", "label": "24/7 Support"}
]

// faq (JSON)
[
  {"question": "How do I clean the insoles?", "answer": "Hand wash with mild soap and air dry."},
  {"question": "Do I need to trim them?", "answer": "Yes, trim along the guidelines for a perfect fit."}
]
```

## How It Works

### Data Flow

1. **App.tsx** fetches products using `fetchProductByHandle()` which includes metafields
2. Metafields are mapped to `product.metafields` by `utils/mapper.ts`
3. Product pages receive `product` prop with `metafields` optional property
4. Use `useProductMetafields()` hook to access values with defaults

### In Product Pages

```tsx
import { useProductMetafields } from '../utils/useProductMetafields';

const ProductPage = ({ product }) => {
  const meta = useProductMetafields(product);

  // Use metafields with fallbacks
  return (
    <>
      <h1>{product.name}</h1>

      {/* Custom description points */}
      <ul>
        {meta.custom_description_points.map((point, i) => (
          <li key={i}>{point}</li>
        ))}
      </ul>

      {/* Timer section */}
      <TimerSection
        title={meta.timer_title}
        subtitle={meta.timer_subtitle}
      />

      {/* Conditionally show sections */}
      {meta.show_kit_combo && <KitCombo />}
      {meta.show_tech_specs && <ProductTechSpecs />}
    </>
  );
};
```

## Available Metafield Keys

See `utils/productMetafields.ts` for the complete `ProductMetafields` interface.

## Testing

1. Open browser DevTools Console
2. Navigate to a product page
3. Check console for `product.metafields` output to verify metafields are loaded

If metafields are not appearing:
- Verify the metafields exist in Shopify admin for that product
- Check GraphQL query includes metafields (use Network tab)
- Ensure namespace is `custom`

## Fallback Behavior

- If a metafield is not set, the hook falls back to product's default values (description, tagline, etc.)
- Boolean flags default to `true` (sections shown by default)
- Layout defaults to `'auto'` (uses `isSecondaryProduct()` detection)
