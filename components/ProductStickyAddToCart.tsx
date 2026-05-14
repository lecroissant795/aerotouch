import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { useCurrency } from '../utils/CurrencyContext';
import { DEFAULT_CURRENCY } from '../utils/currency';
import {
  buildResponsiveSrcSet,
  withDisplayWidth,
  WIDTHS_CART_THUMB
} from '../utils/imageUrls';

export interface ProductStickyAddToCartProps {
  visible: boolean;
  /** Main product photo (e.g. active gallery image). */
  imageSrc: string;
  imageAlt: string;
  productName: string;
  lineTotal: number;
  currencyCode?: string;
  compareAtLineTotal?: number | null;
  compareAtCurrencyCode?: string;
  variantSummary: string;
  ctaLabel: string;
  ctaAriaLabel: string;
  isLoading: boolean;
  disabled?: boolean;
  onCtaClick: () => void;
}

export const ProductStickyAddToCart: React.FC<ProductStickyAddToCartProps> = ({
  visible,
  imageSrc,
  imageAlt,
  productName,
  lineTotal,
  currencyCode,
  compareAtLineTotal,
  compareAtCurrencyCode,
  variantSummary,
  ctaLabel,
  ctaAriaLabel,
  isLoading,
  disabled = false,
  onCtaClick,
}) => {
  const { formatMoney } = useCurrency();
  const barRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const fn = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.paddingBottom = '';
      return;
    }
    const el = barRef.current;
    const apply = () => {
      const h = el?.getBoundingClientRect().height ?? 88;
      root.style.paddingBottom = `${Math.ceil(h + 4)}px`;
    };
    apply();
    const ro = el ? new ResizeObserver(apply) : null;
    if (el) ro?.observe(el);
    window.addEventListener('resize', apply);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', apply);
      root.style.paddingBottom = '';
    };
  }, [visible]);

  return (
    <div
      ref={barRef}
      role="region"
      aria-label="Quick add to cart"
      aria-hidden={!visible}
      className={`fixed bottom-0 left-0 right-0 z-[45] rounded-t-2xl border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)] ${
        reducedMotion ? '' : 'transition-transform duration-300 ease-out'
      } ${visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3.5 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:h-16 sm:w-16">
            <img
              src={withDisplayWidth(imageSrc, 160)}
              srcSet={buildResponsiveSrcSet(imageSrc, WIDTHS_CART_THUMB)}
              sizes="(max-width: 640px) 56px, 64px"
              alt={imageAlt}
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-900 md:text-base">{productName}</p>
                <p className="mt-0.5 truncate text-xs text-slate-600 md:text-sm">{variantSummary}</p>
              </div>
              <div className="mt-[0.35rem] shrink-0 text-right md:mt-2">
                <div className="flex flex-wrap items-baseline justify-end gap-2">
                  {compareAtLineTotal != null && compareAtLineTotal > lineTotal && (
                    <span className="text-sm font-bold text-slate-400 line-through decoration-2 md:text-base">
                      {formatMoney(compareAtLineTotal, (compareAtCurrencyCode || currencyCode || DEFAULT_CURRENCY) as any)}
                    </span>
                  )}
                  <span className="text-base font-black text-brand-orange md:text-xl">
                    {formatMoney(lineTotal, (currencyCode || DEFAULT_CURRENCY) as any)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full flex-shrink-0 sm:min-w-[200px] sm:w-auto">
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            className="h-12 bg-black text-white shadow-lg hover:bg-brand-lime hover:text-black focus:ring-black sm:h-11"
            onClick={onCtaClick}
            disabled={isLoading || disabled}
            tabIndex={visible ? undefined : -1}
            aria-label={ctaAriaLabel}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Processing…
              </span>
            ) : (
              <span className="font-black uppercase tracking-tight text-sm">{ctaLabel}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
