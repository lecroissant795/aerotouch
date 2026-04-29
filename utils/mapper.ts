import { Product } from '../types';

const generateReviewCount = (id: string = '') => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 501) + 500; // Returns number between 500 and 1000
};

export const mapShopifyProduct = (shopifyProduct: any): Product => {
    // Basic mapping - expand as needed based on actual Shopify data structure and Metafields
    const image = shopifyProduct.images?.edges?.[0]?.node?.url || shopifyProduct.images?.[0]?.src || '';

    // Try to find a price from the first variant
    const price = parseFloat(shopifyProduct.variants?.edges?.[0]?.node?.price?.amount || shopifyProduct.variants?.[0]?.price?.amount || '0');

    // Map all images
    const images = shopifyProduct.images?.edges?.map((edge: any) => edge.node.url) || shopifyProduct.images?.map((img: any) => img.src) || [];

    // Extract tags: shopify-buy typically returns an array of objects or strings
    // Ensure tags are always an array of strings for product detection
    const tags = (shopifyProduct.tags || []).map((t: any): string => {
        if (typeof t === 'string') return t;
        return t?.value || t?.node?.value || t?.name || '';
    }).filter((t: string) => t.length > 0);

    const isMainProduct = shopifyProduct.title?.toLowerCase().includes('massage insole');
    const reviews = isMainProduct ? 4823 : generateReviewCount(shopifyProduct.id);

    return {
        id: shopifyProduct.id,
        handle: shopifyProduct.handle,  // SEO-friendly URL handle
        name: shopifyProduct.title,
        tagline: shopifyProduct.description || '', // Use description or a metafield
        price: price,
        rating: 5.0, // Hardcoded for now, or fetch from metafields/app
        reviews: reviews,
        image: image,
        images: images,
        features: [], // Needs to be extracted from description or metafields
        description: shopifyProduct.descriptionHtml || shopifyProduct.description || '',
        descriptionHtml: shopifyProduct.descriptionHtml || '',
        tags: tags
    };
};

export const mapShopifyLineItem = (lineItem: any): any => {
    const isMainProduct = lineItem.title?.toLowerCase().includes('massage insole');
    const reviews = isMainProduct ? 4823 : generateReviewCount(lineItem.id || '');

    return {
        id: lineItem.id, // Line Item ID
        quantity: lineItem.quantity,
        title: lineItem.title,
        // Mapping to CartItem shape
        name: lineItem.title,
        price: parseFloat(lineItem.variant?.price?.amount || lineItem.variant?.price || '0'),
        image: lineItem.variant?.image?.src || '',
        selectedSize: lineItem.variant?.selectedOptions?.find((o: any) => o.name === 'Size')?.value || '',
        selectedColor: lineItem.variant?.selectedOptions?.find((o: any) => o.name === 'Color')?.value || '',
        // Mocking missing Product fields required by CartItem interface
        tagline: '',
        rating: 5.0,
        reviews: reviews,
        features: [],
        description: '',
        descriptionHtml: '',
        tags: []
    };
};
