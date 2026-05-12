import Client from 'shopify-buy';
import { normalizeShopifyStoreDomain } from './shopifyStoreDomain';

const domain = normalizeShopifyStoreDomain(import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '');
const storefrontAccessToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';
const hasShopifyConfig = Boolean(domain && storefrontAccessToken);

if (!hasShopifyConfig) {
    console.warn('⚠️ Shopify configuration missing. Please check .env file.');
}

export const shopify = hasShopifyConfig
    ? Client.buildClient({
        domain,
        storefrontAccessToken,
        apiVersion: '2024-01'
    })
    : null;
