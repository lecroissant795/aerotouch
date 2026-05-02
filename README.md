# AeroTouch — Performance Insoles

AeroTouch is a high-performance e-commerce React application for selling premium insoles and related products. It integrates directly with Shopify for product catalog management and checkout, while delivering a fast, custom single-page app experience powered by Vite and React.

## Features

- **Custom SPA routing** — lightweight client-side router without React Router
- **Shopify Storefront API integration** — live product data, inventory, and checkout
- **Tiered pricing engine** — automatic quantity discounts (35% off 2 pairs, 55% off 3, 60% off 5+)
- **Bundle kits** — pre-configured product bundles with fixed pricing
- **Slide-out cart drawer** — seamless cart experience without leaving the page
- **Google Analytics 4** — full traffic and conversion tracking
- **Supabase-powered reviews** — customer review data stored in Supabase
- **Social proof hooks** — simulated viewer counts and review highlights
- **Responsive design** — Tailwind CSS loaded via CDN for rapid styling
- **Framer Motion animations** — smooth page transitions and micro-interactions

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | React 19 |
| Build tool | Vite 6 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS (CDN) |
| E-commerce | Shopify Storefront API (`shopify-buy`) |
| Database | Supabase |
| Analytics | Google Analytics 4 (`react-ga4`) |
| Animation | Framer Motion |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 18+
- A Shopify store with the Storefront API enabled
- (Optional) A Supabase project for review storage

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

### Deploy to Shopify

```bash
npm run shopify:dev
```

Requires the [Shopify CLI](https://shopify.dev/docs/apps/tools/cli) to be installed and authenticated.

## Project Structure

```
aerotouch-main/
├── App.tsx                  # App shell, routing, cart/checkout logic
├── index.html               # Entry HTML with import maps & Tailwind CDN
├── types.ts                 # TypeScript interfaces (Product, CartItem, Page enum)
├── pages/                   # Page components
│   ├── LandingPage.tsx      # Hero, features, testimonials
│   ├── ProductPage.tsx      # Main product detail page
│   ├── SecondaryProductPage.tsx
│   ├── ShopPage.tsx         # Product catalog
│   ├── BundleKitsPage.tsx   # Pre-configured bundles
│   ├── CartDrawer.tsx       # Slide-out cart
│   └── ...                  # Support, blog, tracking pages
├── utils/
│   ├── shopify.ts           # Shopify Storefront API client
│   ├── pricing.ts           # Tiered pricing calculations
│   ├── mapper.ts            # Shopify → app type mapper
│   ├── analytics.ts         # GA4 tracking
│   └── supabase/            # Supabase client & helpers
└── hooks/
    └── useSocialProof.ts    # Viewer counts & review data
```

## Architecture Overview

### Routing

The app uses a custom client-side router based on a `Page` enum defined in `types.ts`. `App.tsx` maintains `currentPage` state and renders the appropriate page component — no React Router needed.

### State Management

- **Global state** lives in `App.tsx` (cart, checkout, selected products, navigation)
- **Page components** receive data and callbacks via props
- **Local state** is used within components for UI interactions


### Product Data

The `ProductPage` fetches live data from Shopify on mount via `shopify.product.fetchByHandle`. If the fetch fails, it gracefully falls back to locally-defined product data. Size and color options are sourced from Shopify variants or sensible defaults.
