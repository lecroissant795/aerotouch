import { Product } from '../types';

export const mapShopifyProduct = (shopifyProduct: any): Product => {
    // Basic mapping - expand as needed based on actual Shopify data structure and Metafields
    const image = shopifyProduct.images?.edges?.[0]?.node?.url || shopifyProduct.images?.[0]?.src || '';

    // Try to find a price from the first variant
    const price = parseFloat(shopifyProduct.variants?.edges?.[0]?.node?.price?.amount || shopifyProduct.variants?.[0]?.price?.amount || '0');

    // Map all images
    const images = shopifyProduct.images?.edges?.map((edge: any) => edge.node.url) || shopifyProduct.images?.map((img: any) => img.src) || [];

    return {
        id: shopifyProduct.id,
        name: shopifyProduct.title,
        tagline: shopifyProduct.description || '', // Use description or a metafield
        price: price,
        rating: 5.0, // Hardcoded for now, or fetch from metafields/app
        reviews: 4823,  // Mock number below 5000
        image: image,
        images: images,
        features: [], // Needs to be extracted from description or metafields
        description: shopifyProduct.descriptionHtml || shopifyProduct.description || ''
    };
};

export const mapShopifyLineItem = (lineItem: any): any => {
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
        reviews: 4823,
        features: [],
        description: ''
    };
};
