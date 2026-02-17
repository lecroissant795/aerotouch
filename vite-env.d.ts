/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SHOPIFY_STORE_DOMAIN: string
    readonly VITE_SHOPIFY_STOREFRONT_TOKEN: string
    readonly VITE_GOOGLE_ANALYTICS_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
