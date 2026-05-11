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

## Email & Promotions

### Day-0 Welcome Discount

The discount popup (`api/send-popup-email.js`) creates a single-use 20% off Shopify code per signup and emails it via Resend. Subscribers are stored in `popup_discount_claims` (Supabase, service-role only).

### Welcome-Series Drip

A daily Vercel Cron (`api/cron/welcome-series.js`, scheduled at `0 15 * * *` UTC) sends three follow-ups:

| Day | Email | Skipped if |
|-----|-------|------------|
| 2 | Reminder — your code is still waiting | code already redeemed, expired, unsubscribed |
| 7 | Brand story / social proof | code already redeemed, expired, unsubscribed |
| 25 | "Your code expires in 5 days" urgency | code already redeemed, expired, unsubscribed |

Redemption is detected by querying Shopify Admin (`codeDiscountNodeByCode → asyncUsageCount`) per recipient. Per-step `*_sent_at` columns make the runner idempotent — a missed cron self-heals on the next day's 24h lookback window.

### Required env vars

Add these to your Vercel project (and `.env` for local dev):

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (server only — never ship to client) |
| `SHOPIFY_STORE_DOMAIN` | e.g. `your-store.myshopify.com` |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Admin token with `read_orders`, `read_discounts`, `write_discounts` (or use `SHOPIFY_CLIENT_ID` + `SHOPIFY_CLIENT_SECRET`) |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `AeroTouch <hello@aerotouch.com>`. Required for production deliverability — the default `onboarding@resend.dev` is fine for local testing but Resend will throttle real sends |
| `CRON_SECRET` | Random string. Vercel passes it as `Authorization: Bearer …` on cron invocations |
| `SITE_BASE_URL` | e.g. `https://aerotouch.com` — used to build absolute unsubscribe URLs in emails |

### Database migration

Before the first cron run, apply both migrations in `utils/supabase/migrations/` to your Supabase project:

```bash
supabase db push
# or paste each .sql file into the Supabase SQL editor
```

### Testing the cron locally

```bash
# Trigger the cron manually (mimics Vercel)
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/welcome-series
```

The endpoint only runs under `vercel dev`, not `npm run dev`. Response is structured JSON: `{ ok, ranAt, steps: [{ step, attempted, sent, redeemed_skipped, expired_skipped, errors }] }`.

### Compliance

Every promotional email includes a footer unsubscribe link plus `List-Unsubscribe` and `List-Unsubscribe-Post: One-Click` headers. The unsubscribe endpoint is `GET /api/unsubscribe?token=<token>`.
