import { CartItem, Product } from '../types';
import { getFallbackProduct } from './productMapping';

/** Cart lines that are the primary AeroTouch massage insoles (upsell target). */
export function isMassageInsoleCartLine(item: CartItem): boolean {
  const h = (item.productHandle || '').toLowerCase();
  if (h === 'massage-insoles') return true;
  const n = (item.name || '').toLowerCase();
  return (
    (n.includes('massage') && n.includes('insole')) ||
    (n.includes('aerotouch') && n.includes('insole') && !n.includes('roller'))
  );
}

/**
 * Product + qty context for checkout upsell (2 more pairs at tiered pricing).
 */
export function resolveMassageInsoleUpsell(cartItems: CartItem[]): {
  product: Product;
  defaultSize: string;
  defaultColor: string;
} | null {
  const fallback = getFallbackProduct('massage-insoles');
  if (!fallback) return null;

  const insoleLines = cartItems.filter(isMassageInsoleCartLine);
  const template = insoleLines[0];

  if (template) {
    const product: Product = {
      ...fallback,
      name: template.name || fallback.name,
      image: template.image || fallback.image,
      price: template.price,
      ...(template.currencyCode ? { currencyCode: template.currencyCode } : {}),
      ...(template.compareAtPrice != null ? { compareAtPrice: template.compareAtPrice } : {}),
      ...(template.compareAtCurrencyCode ? { compareAtCurrencyCode: template.compareAtCurrencyCode } : {})
    };
    return {
      product,
      defaultSize: template.selectedSize || '',
      defaultColor: template.selectedColor || ''
    };
  }

  return {
    product: fallback,
    defaultSize: '',
    defaultColor: ''
  };
}
