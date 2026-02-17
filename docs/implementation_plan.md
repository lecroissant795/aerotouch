# Shopify Integration Plan

Integration of Shopify Storefront API to replace hardcoded data and local state with real commerce functionality.

## User Review Required

> [!IMPORTANT]
> **API Credentials Needed**: To proceed, we need a **Storefront API Access Token** and the **Shopify Store Domain** (e.g., `your-shop.myshopify.com`). 
> Please provide these values to set up the connection.

> [!NOTE]
> **Discount Logic**: The current "Tiered Discount" logic (45%, 55%, 60%) is implemented in the frontend. For this to work in `Checkout`, corresponding **Automatic Discounts** must be configured in the Shopify Admin. This integration will handle the *display*, but Shopify handles the *application* at checkout.

## Proposed Changes

### 1. Setup & Configuration
- **Install Dependency**: `npm install shopify-buy`
- **Environment Variables**: Add `VITE_SHOPIFY_STORE_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_TOKEN` to `.env`.
- **Client Utility**: Create `utils/shopify.ts` to initialize and export the Shopify client.

### 2. Products ([pages/ProductPage.tsx](file:///Users/lecroissant/Downloads/aerotouch---performance-insoles/pages/ProductPage.tsx))
- [NEW] Fetch product data using `shopify.product.fetchByHandle(handle)`.
- Replace hardcoded `PRODUCT` constant with dynamic data.
- Map Shopify variants to the existing selector UI.

### 3. Cart ([components/CartDrawer.tsx](file:///Users/lecroissant/Downloads/aerotouch---performance-insoles/components/CartDrawer.tsx), [App.tsx](file:///Users/lecroissant/Downloads/aerotouch---performance-insoles/App.tsx))
- **State Management**: Replace local `items` state with a Shopify Checkout object.
- **Initialization**: Create a new Checkout on app load (`shopify.checkout.create()`) and persist the `checkoutId` in localStorage.
- **Add to Cart**: Use `shopify.checkout.addLineItems(checkoutId, lineItems)`.
- **Update Qty**: Use `shopify.checkout.updateLineItems(checkoutId, [...])`.
- **Remove**: Use `shopify.checkout.removeLineItems(checkoutId, [...])`.
- **Checkout Redirect**: The "Checkout" button will redirect to `checkout.webUrl`.

### 4. Customers
- [NEW] Create `utils/customer.ts` for authentication.
- Implement `login(email, password)` using `customerAccessTokenCreate` mutation (raw GraphQL via `shopify-buy`'s `fetch` or custom fetch).
- Implement `register(email, password)` using `customerCreate` mutation.
- Add a generic "Account" placeholder page if one doesn't exist.

### 5. Content
- [NEW] Create `utils/content.ts` to fetch policy pages or metaobjects if needed.
- For now, we will focus on Products and Cart as the "contents" deliverable.

## Verification Plan

### Automated Tests
- None (API integration is hard to unit test without mocking).

### Manual Verification
1. **Config**: Ensure `.env` is loaded.
2. **Product Load**: Verify the Product Page loads real data (title, price, images) from Shopify.
3. **Cart Flow**:
   - Add item: Confirm it appears in the Drawer and console logs a successful Shopify response.
   - Update qty: Confirm the subtotal updates from Shopify.
   - Checkout: Click "Checkout" and verify redirection to the official Shopify checkout page with the correct items and prices.
