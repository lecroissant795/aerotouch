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
| `utils/pricing.ts` | Tiered pricing calculations (35%/55%/60% off for 2/3/5+ items) |
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
- 2 pairs: 35% off
- 3 pairs: 55% off
- 5+ pairs: 60% off

Bundle kits use fixed prices defined in `pages/BundleKitsPage.tsx`.

### Product Page Logic

The Product page can fetch live data from Shopify on mount (`shopify.product.fetchByHandle`). If the fetch fails, it falls back to locally-defined product data. Size/color options come from Shopify variants or fall back to defaults in the component.

### Development Notes

- Tailwind CSS is loaded via CDN in `index.html` (not a build-time import)
- The app uses ES modules with import maps in the HTML for React and Lucide icons
- Environment variables are loaded via Vite's `loadEnv()` and prefixed with `VITE_` for client access
- The `.env` file contains Shopify, Supabase, and GA credentials

### Track Order API (`api/track-order.js`)

Server-only (e.g. Vercel): **`SHOPIFY_STORE_DOMAIN`** plus either **`SHOPIFY_ADMIN_ACCESS_TOKEN`** (static Admin token) or **`SHOPIFY_CLIENT_ID`** + **`SHOPIFY_CLIENT_SECRET`** (Dev Dashboard app — [client credentials grant](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/client-credentials-grant), token cached ~24h). Plain **`npm run dev`** does not run `/api`; use **`vercel dev`** (with the same env vars) so `POST /api/track-order` works locally.
