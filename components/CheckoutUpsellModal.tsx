import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock } from 'lucide-react';
import { Product } from '../types';
import { getLinePricing } from '../utils/pricing';
import { getCartProductLookupKey, getShopifyHandle } from '../utils/productMapping';
import { useCurrency } from '../utils/CurrencyContext';
import { DEFAULT_CURRENCY } from '../utils/currency';
import { fetchProductByHandle } from '../utils/productFetcher';
import { buildResponsiveSrcSet, withDisplayWidth } from '../utils/imageUrls';

const EXTRA_PAIRS = 2;
const OFFER_TIMER_SECONDS = 10 * 60;

interface CheckoutUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  upsellProduct: Product;
  /** Sum of quantities across all cart lines — volume tiers use this + the upsell qty. */
  cartTotalItemCount: number;
  defaultSize: string;
  defaultColor: string;
  onAddPairs: (product: Product, size: string, color: string) => Promise<void>;
  onDecline: () => void;
  isLoading?: boolean;
}

export const CheckoutUpsellModal: React.FC<CheckoutUpsellModalProps> = ({
  isOpen,
  onClose,
  upsellProduct,
  cartTotalItemCount,
  defaultSize,
  defaultColor,
  onAddPairs,
  onDecline,
  isLoading = false
}) => {
  const { currency, formatMoney } = useCurrency();
  const productCurrency = upsellProduct.currencyCode || DEFAULT_CURRENCY;
  const compareCurrency = upsellProduct.compareAtCurrencyCode || productCurrency;
  const [secondsLeft, setSecondsLeft] = useState(OFFER_TIMER_SECONDS);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const compareBase = useMemo(() => {
    const cap = upsellProduct.compareAtPrice;
    if (cap != null && cap > upsellProduct.price) return cap;
    return upsellProduct.price;
  }, [upsellProduct.compareAtPrice, upsellProduct.price]);

  const qtyAfterAdd = Math.max(0, cartTotalItemCount) + EXTRA_PAIRS;
  const tierPricing = useMemo(
    () => getLinePricing(compareBase, qtyAfterAdd),
    [compareBase, qtyAfterAdd]
  );

  const lineTotalExtra = EXTRA_PAIRS * tierPricing.unitPrice;
  const msrpExtra = EXTRA_PAIRS * compareBase;

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(OFFER_TIMER_SECONDS);
    const t = setInterval(() => {
      setSecondsLeft(s => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      try {
        const lookupKey = getCartProductLookupKey(upsellProduct);
        const handle = getShopifyHandle(lookupKey);
        const sp = await fetchProductByHandle(handle, currency);
        if (!sp) return;

        const sizeOpt = sp.options?.find((o: { name: string }) => o.name === 'Size');
        const sizeVals: string[] =
          sizeOpt?.values?.map((v: unknown) =>
            typeof v === 'string' ? v : (v as { value?: string })?.value
          ).filter(Boolean) as string[];
        if (sizeVals.length) setSizes(sizeVals);

        const colorOpt = sp.options?.find((o: { name: string }) => o.name === 'Color');
        const colorVals: string[] =
          colorOpt?.values?.map((v: unknown) =>
            typeof v === 'string' ? v : (v as { value?: string })?.value
          ).filter(Boolean) as string[];
        if (colorVals.length) setColors(colorVals);

        setSelectedSize(prev => {
          if (prev && sizeVals.includes(prev)) return prev;
          if (defaultSize && sizeVals.includes(defaultSize)) return defaultSize;
          return sizeVals[0] || defaultSize || 'Standard';
        });
        setSelectedColor(prev => {
          if (prev && colorVals.includes(prev)) return prev;
          if (defaultColor && colorVals.includes(defaultColor)) return defaultColor;
          const orange =
            colorVals.find(c => /^orange$/i.test(c)) ||
            colorVals.find(c => /orange/i.test(c));
          return orange || colorVals[0] || defaultColor || 'Default';
        });
      } catch {
        setSelectedSize(defaultSize || 'Standard');
        setSelectedColor(defaultColor || 'Default');
      }
    };

    load();
  }, [isOpen, upsellProduct, defaultSize, defaultColor, currency]);

  if (!isOpen) return null;

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const timerLabel = `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;

  const sizeForAdd = selectedSize || defaultSize || 'Standard';
  const colorForAdd = selectedColor || defaultColor || 'Default';
  const canAdd = Boolean(sizeForAdd && colorForAdd && !isLoading);

  return (
    <div
      className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-upsell-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        aria-label="Close offer"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto px-5 pb-6 pt-8 sm:px-8 sm:pb-8">
          <h2
            id="checkout-upsell-title"
            className="pr-10 text-xl font-black uppercase leading-tight tracking-tight text-brand-dark sm:text-2xl"
          >
            Add {EXTRA_PAIRS} more pairs at our best volume price
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Checkout-only suggestion — keep a pair in every shoe. Same tiered savings as the rest of
            your cart.
          </p>

          <div
            className={`mt-4 flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold ${
              secondsLeft <= 60
                ? 'border-red-100 bg-red-50 text-red-700'
                : 'border-rose-100 bg-rose-50 text-rose-800'
            }`}
          >
            <Clock className={`h-4 w-4 shrink-0 ${secondsLeft <= 60 ? 'animate-pulse' : ''}`} />
            <span>
              Offer reserved <span className="font-black tabular-nums">{timerLabel}</span>
            </span>
          </div>

          <div className="mt-6 flex gap-4">
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <img
                src={withDisplayWidth(upsellProduct.image, 280)}
                srcSet={buildResponsiveSrcSet(upsellProduct.image, [160, 280, 400])}
                sizes="112px"
                alt={upsellProduct.name}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-brand-dark">{upsellProduct.name}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Extra pairs lock in your fit everywhere you go — fewer swaps, longer life from each
                set.
              </p>
              <div className="mt-2 flex flex-wrap items-baseline gap-2">
                <span className="text-lg font-black text-brand-orange">
                  {formatMoney(tierPricing.unitPrice, productCurrency as any)}
                  <span className="text-xs font-bold text-slate-500"> / pair</span>
                </span>
                {compareBase > tierPricing.unitPrice && (
                  <span className="text-sm font-bold text-slate-400 line-through">
                    {formatMoney(compareBase, compareCurrency as any)}
                  </span>
                )}
                <span className="rounded-md bg-lime-100 px-2 py-0.5 text-[10px] font-black uppercase text-lime-900">
                  {tierPricing.tier.label}
                </span>
              </div>
              <p className="mt-1 text-[11px] font-semibold text-slate-500">
                {EXTRA_PAIRS} pairs:{' '}
                <span className="text-brand-dark">{formatMoney(lineTotalExtra, productCurrency as any)}</span>
                {msrpExtra > lineTotalExtra + 0.005 && (
                  <span className="ml-1 line-through opacity-70">{formatMoney(msrpExtra, compareCurrency as any)}</span>
                )}
                <span className="block text-[10px] font-normal text-slate-400">
                  ({cartTotalItemCount} items in cart → {qtyAfterAdd} total with this add-on; volume tier
                  uses all items — Shopify total is final)
                </span>
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Color
              </label>
              <select
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-brand-dark focus:border-brand-orange focus:outline-none"
              >
                {colors.length === 0 && <option value="">Loading…</option>}
                {colors.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-black uppercase tracking-wider text-slate-500">
                Shoe size
              </label>
              <select
                value={selectedSize}
                onChange={e => setSelectedSize(e.target.value)}
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-brand-dark focus:border-brand-orange focus:outline-none"
              >
                {sizes.length === 0 && <option value="">Loading…</option>}
                {sizes.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            disabled={!canAdd}
            onClick={() => onAddPairs(upsellProduct, sizeForAdd, colorForAdd)}
            className="mt-6 w-full rounded-xl bg-brand-orange py-3.5 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-brand-orange/30 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? 'Adding…' : `Add ${EXTRA_PAIRS} pairs to order`}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onDecline}
            className="mt-3 w-full rounded-xl border-2 border-slate-200 bg-white py-3 text-sm font-bold text-brand-dark transition hover:bg-slate-50 disabled:opacity-50"
          >
            No thanks — continue to checkout
          </button>
        </div>
      </div>
    </div>
  );
};
