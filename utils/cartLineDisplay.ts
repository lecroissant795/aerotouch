import { CartItem } from '../types';
import { getVolumeAdjustedUnitPrice } from './pricing';

export interface CartLineDisplay {
  quantity: number;
  unitSale: number;
  /** Shopify catalog line (variant sale × qty) before volume tier */
  shopifyCatalogSubtotal: number;
  /** Best pre-promo subtotal: min(Shopify catalog, volume-tier price from reference unit) */
  prePromoBestSubtotal: number;
  promoOff: number;
  finalLineSubtotal: number;
  msrpSubtotal: number | null;
  /** Strikethrough total: MSRP line, or catalog line before volume/promo */
  originalSubtotal: number;
  showStrikethrough: boolean;
  lineSavings: number;
}

const roundMoney = (n: number) => Math.round(n * 100) / 100;

/**
 * Per-line cart display: global volume tiers (total units in cart), compare-at reference,
 * Shopify sale price, and discount code allocations.
 */
export function getCartLineDisplay(item: CartItem, globalItemCount: number): CartLineDisplay {
  const quantity = item.quantity;
  const unitSale = item.price;
  const shopifyCatalogSubtotal = roundMoney(unitSale * quantity);

  const refUnit =
    item.compareAtPrice != null && item.compareAtPrice > unitSale
      ? item.compareAtPrice
      : unitSale;

  const tieredUnit = getVolumeAdjustedUnitPrice(refUnit, globalItemCount);
  const volumeTierSubtotal = roundMoney(tieredUnit * quantity);
  const prePromoBestSubtotal = roundMoney(
    Math.min(shopifyCatalogSubtotal, volumeTierSubtotal)
  );

  const promoOff = roundMoney(item.linePromoDiscountTotal ?? 0);
  const finalLineSubtotal = Math.max(0, roundMoney(prePromoBestSubtotal - promoOff));

  const msrpSubtotal =
    item.compareAtPrice != null && item.compareAtPrice > unitSale
      ? roundMoney(item.compareAtPrice * quantity)
      : null;

  const originalSubtotal = msrpSubtotal != null ? msrpSubtotal : shopifyCatalogSubtotal;
  const showStrikethrough = originalSubtotal > finalLineSubtotal + 0.0001;
  const lineSavings = showStrikethrough
    ? roundMoney(originalSubtotal - finalLineSubtotal)
    : 0;

  return {
    quantity,
    unitSale,
    shopifyCatalogSubtotal,
    prePromoBestSubtotal,
    promoOff,
    finalLineSubtotal,
    msrpSubtotal,
    originalSubtotal,
    showStrikethrough,
    lineSavings
  };
}

export function sumCartFinalSubtotals(items: CartItem[]): number {
  const n = items.reduce((s, i) => s + i.quantity, 0);
  return roundMoney(
    items.reduce((s, item) => s + getCartLineDisplay(item, n).finalLineSubtotal, 0)
  );
}

export function sumCartLineSavings(items: CartItem[]): number {
  const n = items.reduce((s, i) => s + i.quantity, 0);
  return roundMoney(items.reduce((s, item) => s + getCartLineDisplay(item, n).lineSavings, 0));
}
