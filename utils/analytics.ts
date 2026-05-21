import ReactGA from "react-ga4";
import { DEFAULT_CURRENCY } from './currency';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

type FbqFn = (...args: unknown[]) => void;
const fbq = (...args: unknown[]) => {
    if (typeof window === 'undefined') return;
    const f = (window as unknown as { fbq?: FbqFn }).fbq;
    if (typeof f === 'function') f(...args);
};

function sendCapiMirror(eventName: string, eventId: string, customData?: Record<string, unknown>) {
    fetch('/api/meta-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventName, eventId, customData }),
    }).catch(() => { /* fire-and-forget: never block the user flow */ });
}

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
    const eventId = crypto.randomUUID();
    const customData = {
        content_name: productName,
        content_type: 'product',
        content_ids: contentId ? [contentId] : undefined,
        value,
        currency,
    };
    fbq('track', 'ViewContent', customData, { eventID: eventId });
    sendCapiMirror('ViewContent', eventId, customData);
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
    const addToCartEventId = crypto.randomUUID();
    const addToCartData = { content_name: productName, content_type: 'product', value, currency };
    fbq('track', 'AddToCart', addToCartData, { eventID: addToCartEventId });
    sendCapiMirror('AddToCart', addToCartEventId, addToCartData);
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
    const checkoutEventId = crypto.randomUUID();
    const checkoutData = {
        value,
        currency,
        num_items: items.reduce((n, item) => n + item.quantity, 0),
        contents: items.map(item => ({
            id: item.name,
            quantity: item.quantity,
            item_price: item.price,
        })),
    };
    fbq('track', 'InitiateCheckout', checkoutData, { eventID: checkoutEventId });
    sendCapiMirror('InitiateCheckout', checkoutEventId, checkoutData);
};
