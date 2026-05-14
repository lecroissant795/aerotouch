# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AeroTouch is an e-commerce React application for selling performance insoles and related products. It integrates with Shopify for the storefront/checkout and uses a custom SPA routing system.

## Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Shopify theme (requires Shopify CLI)
npm run shopify:dev
```

**Note:** This project uses Vite (not Bun), despite the global preference for Bun in other projects.

## Architecture

### Routing
The app uses a custom client-side router based on a `Page` enum (defined in `types.ts`). The `App.tsx` component maintains `currentPage` state and renders the appropriate page component. This is a single-page app without React Router.

### State Management
- **Global state:** Managed in `App.tsx` (cart, checkout, selected products, navigation state)
- **Page components:** Receive data and callbacks via props from App
- **Local state:** Used within individual components for UI interactions

### Key Files

| File | Purpose |
|------|---------|
| `App.tsx` | Main application shell, routing, cart/checkout logic, Shopify integration |
| `types.ts` | TypeScript interfaces (Product, CartItem, Page enum, etc.) |
| `utils/shopify.ts` | Shopify Storefront API client |
| `utils/analytics.ts` | Google Analytics 4 tracking |
| `utils/pricing.ts` | Tiered pricing calculations (10%/18%/24% off for 2+/3+/5+ items) |
| `utils/mapper.ts` | Converts Shopify API responses to app types |
| `hooks/useSocialProof.ts` | Provides simulated viewer counts and review data |

### Pages (`pages/`)

- **LandingPage** - Hero, features, testimonials, featured products
- **ProductPage** - Main product detail with size/color selectors, quantity tiers, upsells
- **SecondaryProductPage** - Simplified product page for accessories
- **ShopPage / CategoryPage / BestSellersPage** - Product catalog browsing
- **BundleKitsPage / KitProductPage** - Pre-configured product bundles
- **BlogPage / BlogPostPage** - Content pages
- **SupportPage / WarrantyPage / SizeGuidePage** - Customer service pages
- **TrackOrderPage / OrderStatusPage / ReturnsExchangePage** - Order management
- **CartDrawer** - Slide-out cart overlay (not a full page)

### External Integrations

1. **Shopify** - Product catalog, inventory, checkout via Storefront API
2. **Supabase** - Review data storage (see `utils/supabase/`)
3. **Google Analytics 4** - Traffic and conversion tracking

### Pricing System

All tiered quantity discounts are defined in `utils/pricing.ts`:
- 1 pair: 0% off
- 2+ items: 10% off
- 3+ items: 18% off
- 5+ items: 24% off

Bundle kits use fixed prices defined in `pages/BundleKitsPage.tsx`.

### Product Page Logic

The Product page can fetch live data from Shopify on mount (`shopify.product.fetchByHandle`). If the fetch fails, it falls back to locally-defined product data. Size/color options come from Shopify variants or fall back to defaults in the component.

### Development Notes

- Tailwind CSS is loaded via CDN in `index.html` (not a build-time import)
- The app uses ES modules with import maps in the HTML for React and Lucide icons
- Environment variables are loaded via Vite's `loadEnv()` and prefixed with `VITE_` for client access
- The `.env` file contains Shopify, Supabase, and GA credentials

### Track Order API (`api/track-order.js`) and Discount Popup (`api/send-popup-email.js`)

Both endpoints share the Shopify Admin API helper in `api/shopify-admin.shared.js`. Server-only env vars: **`SHOPIFY_STORE_DOMAIN`** plus either **`SHOPIFY_ADMIN_ACCESS_TOKEN`** (static Admin token — needs `read_orders` for tracking, `write_discounts` for the popup, and `read_discounts` for the welcome-series redemption check) or **`SHOPIFY_CLIENT_ID`** + **`SHOPIFY_CLIENT_SECRET`** (Dev Dashboard app — [client credentials grant](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant), token cached ~24h). The popup also needs **`RESEND_API_KEY`** and optionally **`RESEND_FROM_EMAIL`**. The popup endpoint runs under plain `npm run dev` (via Vite middleware in `vite.config.ts`) and Vercel; `/api/track-order` only runs under `vercel dev`.

On popup submit, the server mints a real single-use 20%-off Shopify code (`WELCOME-XXXXXX`, 30-day expiry) via `discountCodeBasicCreate`, then emails it via Resend.

### Welcome-Series Drip (`api/cron/welcome-series.js`)

A daily Vercel Cron (`0 15 * * *` UTC = 8am Pacific, registered in `vercel.json`) sends a 3-step drip on top of the popup signup: Day 2 reminder, Day 7 brand story, Day 25 expiry warning. The runner lives in `api/welcome-series.shared.js`; templates in `api/welcome-series-templates.shared.js`. For each candidate it queries Shopify Admin (`codeDiscountNodeByCode → asyncUsageCount`) and skips anyone who already redeemed, then sends via Resend and writes the per-step `*_sent_at` column on `popup_discount_claims` so a row never gets the same email twice (idempotent).

Required additional env vars:
- **`CRON_SECRET`** — random secret. Vercel attaches `Authorization: Bearer ${CRON_SECRET}` to scheduled invocations; the endpoint returns 401 without it.
- **`SITE_BASE_URL`** — e.g. `https://aerotouch.com`. Used to build absolute unsubscribe URLs in emails.

Compliance: every promotional email (Day 0 popup + the 3 drip steps) includes a footer unsubscribe link plus `List-Unsubscribe` / `List-Unsubscribe-Post: One-Click` headers. The unsubscribe endpoint is `GET/POST /api/unsubscribe?token=<token>` and flips `unsubscribed_at` on the row. Tokens are generated on signup and stored unique in `popup_discount_claims.unsubscribe_token` (see migration `utils/supabase/migrations/20260512_welcome_series.sql`).

Production Resend tip: don't ship the welcome series with the default `onboarding@resend.dev` from-address — verify a domain (e.g. `hello@aerotouch.com`) in Resend and set `RESEND_FROM_EMAIL` before the first cron run, otherwise deliverability tanks after the first dozen sends.

### Meta Conversions API (`api/meta-capi.shared.js`)

Server-side Meta CAPI helper. Currently called from `send-popup-email.handler.shared.js` to fire a **Lead** event on first-time popup signups (skipped for duplicates). Storefront events (ViewContent / AddToCart / InitiateCheckout / Purchase) on `aerotouch.shop` are sent by Shopify's Meta sales channel app, not from this repo.

Required env vars (server-only — do **not** prefix with `VITE_`):
- **`META_PIXEL_ID`** — dataset ID from Events Manager (currently `1026449477008373`).
- **`META_CAPI_ACCESS_TOKEN`** — generate at Events Manager > dataset > Settings > Conversions API > "Generate access token". Shown once; treat as a secret.
- **`META_CAPI_TEST_EVENT_CODE`** — *temporary*. Set to the value from Events Manager > Test Events to make events show up there during verification. **Remove for production** or events won't go to the live dataset.

PII (email, first name) is SHA-256 hashed before sending per Meta's requirements. Match quality is improved by forwarding `client_ip_address`, `client_user_agent`, and the `_fbp` / `_fbc` cookies — `extractClientContext(req)` does this for both Vercel and the Vite dev middleware. Each event includes a UUID `event_id` and is returned in the API response as `leadEventId` so a future browser-side `fbq('track','Lead', ..., {eventID})` can dedupe against it.

CAPI failures are logged but never break the signup flow — the helper always resolves with `{ ok: false, error }` rather than throwing.
