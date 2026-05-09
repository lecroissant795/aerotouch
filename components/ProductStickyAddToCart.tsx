import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';

export interface ProductStickyAddToCartProps {
  visible: boolean;
  /** Main product photo (e.g. active gallery image). */
  imageSrc: string;
  imageAlt: string;
  productName: string;
  lineTotal: number;
  variantSummary: string;
  ctaLabel: string;
  ctaAriaLabel: string;
  isLoading: boolean;
  disabled?: boolean;
  onCtaClick: () => void;
}

const formatMoney = (n: number) => n.toFixed(2);

export const ProductStickyAddToCart: React.FC<ProductStickyAddToCartProps> = ({
  visible,
  imageSrc,
  imageAlt,
  productName,
  lineTotal,
  variantSummary,
  ctaLabel,
  ctaAriaLabel,
  isLoading,
  disabled = false,
  onCtaClick,
}) => {
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
      className={`fixed bottom-0 left-0 right-0 z-[45] border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.08)] ${
        reducedMotion ? '' : 'transition-transform duration-300 ease-out'
      } ${visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'}`}
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:h-16 sm:w-16">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900 md:text-base">{productName}</p>
            <p className="mt-0.5 truncate text-xs text-slate-600 md:text-sm">{variantSummary}</p>
            <p className="mt-1 text-base font-black text-brand-orange md:text-lg">
              ${formatMoney(lineTotal)}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 sm:min-w-[200px]">
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
