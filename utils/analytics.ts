import ReactGA from "react-ga4";
import { DEFAULT_CURRENCY } from './currency';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

type FbqFn = (...args: unknown[]) => void;
const fbq = (...args: unknown[]) => {
    if (typeof window === 'undefined') return;
    const f = (window as unknown as { fbq?: FbqFn }).fbq;
    if (typeof f === 'function') f(...args);
};

export const initGA = () => {
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        ReactGA.initialize(GA_MEASUREMENT_ID);
        console.log("Analytics Initialized");
    } else {
        console.warn("GA Measurement ID missing or invalid");
    }
};

export const logPageView = () => {
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
    }
    // The Meta Pixel snippet in index.html fires PageView once at initial load.
    // Refire on every SPA navigation so Meta sees product/cart/checkout views.
    fbq('track', 'PageView');
};

export const logViewContent = (
    productName: string,
    value: number,
    contentId?: string,
    currency = DEFAULT_CURRENCY
) => {
    fbq('track', 'ViewContent', {
        content_name: productName,
        content_type: 'product',
        content_ids: contentId ? [contentId] : undefined,
        value,
        currency,
    });
};

export const logEvent = (category: string, action: string, label?: string) => {
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        ReactGA.event({
            category,
            action,
            label
        });
    }
};

export const logAddToCart = (productName: string, value: number, currency = DEFAULT_CURRENCY) => {
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        ReactGA.event("add_to_cart", {
            currency,
            value,
            items: [
                {
                    item_name: productName,
                    price: value
                }
            ]
        });
    }
    fbq('track', 'AddToCart', {
        content_name: productName,
        content_type: 'product',
        value,
        currency,
    });
};

export const logBeginCheckout = (items: { name: string, price: number, quantity: number }[], value: number, currency = DEFAULT_CURRENCY) => {
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        ReactGA.event("begin_checkout", {
            currency,
            value,
            items: items.map(item => ({
                item_name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        });
    }
    fbq('track', 'InitiateCheckout', {
        value,
        currency,
        num_items: items.reduce((n, item) => n + item.quantity, 0),
        contents: items.map(item => ({
            id: item.name,
            quantity: item.quantity,
            item_price: item.price,
        })),
    });
};
