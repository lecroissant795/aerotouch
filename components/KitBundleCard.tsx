import React from 'react';
import { createUrl } from '../utils/router';
import { Page, type BundleKit } from '../types';
import { bundleKitBadgeLabel } from '../utils/bundleKitBadge';
import { useCurrency } from '../utils/CurrencyContext';
import { DEFAULT_CURRENCY } from '../utils/currency';

function savingsPercent(price: number, original: number): number {
  if (original <= 0 || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

export interface KitBundleCardProps {
  kit: BundleKit;
  onKitSelect?: (kit: BundleKit) => void;
  onAddKitToCart?: (kit: BundleKit) => void;
}

/**
 * Shared bundle kit product card — landing (LimitedTimeKits), BundleKitsPage, and bundle category grid.
 */
export const KitBundleCard: React.FC<KitBundleCardProps> = ({ kit, onKitSelect, onAddKitToCart }) => {
  const { formatMoney } = useCurrency();
  const kitHref = createUrl(Page.KIT_PRODUCT, { kitId: kit.id });
  const savePct = savingsPercent(kit.price, kit.originalPrice);
  const kitCurrency = kit.currencyCode || DEFAULT_CURRENCY;
  const originalCurrency = kit.originalCurrencyCode || kitCurrency;

  const handleKitNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onKitSelect?.(kit);
  };

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg md:hover:-translate-y-1 ${onKitSelect ? 'cursor-pointer' : ''}`}
    >
      {onKitSelect && (
        <a
          href={kitHref}
          onClick={handleKitNavigate}
          className="absolute inset-0 z-[1] rounded-2xl"
          aria-label={`View ${kit.name}`}
        />
      )}

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col pointer-events-none">
        {/* Hero: fixed aspect, image covers full box (no letterboxing). Center crop only — no stretch. */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 sm:aspect-[5/6]">
          {kit.image ? (
            <img
              src={kit.image}
              alt={kit.name}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
              decoding="async"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-100" />
          )}
          {kit.badge && (
            <span className="absolute left-3 top-3 z-10 max-w-[calc(100%-5rem)] rounded-md border border-slate-200/80 bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-900 shadow-sm backdrop-blur-sm sm:left-4 sm:top-4 sm:text-[10px]">
              {bundleKitBadgeLabel(kit.badge)}
            </span>
          )}
          {savePct > 0 && (
            <span className="absolute right-3 top-3 z-10 rounded-md bg-brand-orange px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:right-4 sm:top-4 sm:text-[10px]">
              Save {savePct}%
            </span>
          )}
        </div>

        <div className="pointer-events-auto border-t border-slate-100 bg-white px-3 py-2 sm:px-4 sm:py-2">
          <p className="mb-1.5 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            What&apos;s included
          </p>
          <ul className="list-none space-y-1 text-left">
            {kit.items.map((item, i) => (
              <li
                key={i}
                className="border-l-2 border-brand-orange/40 pl-2.5 text-xs font-medium leading-snug text-slate-600"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 flex-col border-t border-slate-100 bg-white px-4 pb-2 pt-2.5 sm:px-5 sm:pt-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-400">Recovery bundle</p>

          <h3 className="mt-1.5 text-left text-[15px] font-semibold leading-snug text-slate-900 sm:text-base">
            {kit.name}
          </h3>

          <div className="mt-2.5 flex flex-col items-start gap-0.5 sm:mt-3">
            {kit.originalPrice > kit.price && (
              <span className="text-[11px] font-medium tabular-nums text-slate-400 line-through sm:text-xs">
                {formatMoney(kit.originalPrice, originalCurrency as any)}
              </span>
            )}
            <span className="text-xl font-black tabular-nums leading-none tracking-tight text-[#E45B08] sm:text-2xl">
              {formatMoney(kit.price, kitCurrency as any)}
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-[3] border-t border-slate-100 bg-white px-4 pb-3 pt-1.5 sm:px-5 sm:pb-3">
        <button
          type="button"
          disabled={kit.availableForSale === false}
          className="min-h-[46px] w-full rounded-[10px] bg-brand-dark py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-[background-color,transform,box-shadow] duration-300 ease-out hover:bg-[#E45B08] hover:shadow-lg hover:shadow-[#E45B08]/30 enabled:hover:-translate-y-0.5 enabled:hover:scale-[1.02] active:enabled:translate-y-0 active:enabled:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:translate-y-0 sm:min-h-[48px] sm:py-3 sm:text-xs"
          onClick={() => onAddKitToCart?.(kit)}
        >
          {kit.availableForSale === false ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
};
