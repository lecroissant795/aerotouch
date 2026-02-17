import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

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

export const logAddToCart = (productName: string, value: number, currency = 'USD') => {
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
        ReactGA.event("add_to_cart", {
            currency,
            value,
            items: [
                {
                    item_name: productName
                }
            ]
        });
    }
}
