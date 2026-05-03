import React, { useState, useRef, useCallback } from 'react';
import { Zap, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { createUrl } from '../utils/router';
import { Page } from '../types';
import { bundleKitItemStockPhotos } from '../utils/mediaUrls';

interface Kit {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
  items: string[];
  /** One product image per included item (same order as `items`) */
  itemImages: string[];
}

const KITS: Kit[] = [
  {
    id: 'fascilites-relief',
    name: 'Fascilites Relief Kit',
    price: 48.0,
    originalPrice: 75.0,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=max',
    badge: 'Best For Rehab',
    items: ['1x Pro Insole', '1x Massage Ball', '1x compression sock'],
    itemImages: [
      bundleKitItemStockPhotos.insoleRedPerformance,
      bundleKitItemStockPhotos.massageBall,
      bundleKitItemStockPhotos.compressionSocks,
    ],
  },
  {
    id: 'heel-relief',
    name: 'Heel Relief Kit',
    price: 39.0,
    originalPrice: 60.0,
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=900&auto=format&fit=max',
    badge: 'Top Rated',
    items: ['1x Heel Cushion', '1x Daily Insole', '1x Arch Support'],
    itemImages: [
      bundleKitItemStockPhotos.heelCushion,
      bundleKitItemStockPhotos.insoleWhiteSneaker,
      bundleKitItemStockPhotos.archSupport,
    ],
  },
  {
    id: 'toe-relief',
    name: 'Toe Relief Kit',
    price: 39.0,
    originalPrice: 60.0,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=900&auto=format&fit=max',
    badge: 'Doctor Choice',
    items: ['1x Toe Spreader', '1x Sport Insole', '1x Fabric sleeve'],
    itemImages: [
      bundleKitItemStockPhotos.toeAccessory,
      bundleKitItemStockPhotos.insoleSole,
      bundleKitItemStockPhotos.fabricSleeve,
    ],
  },
  {
    id: 'complete-recovery-kit',
    name: 'The Complete Recovery Kit',
    price: 97.0,
    originalPrice: 150.0,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=max',
    badge: 'Ultimate Value',
    items: ['2x AeroTouch Massage Insoles', '2x Compression Socks', '1x Massage Roller'],
    itemImages: [
      bundleKitItemStockPhotos.insoleRedPerformance,
      bundleKitItemStockPhotos.compressionSocks,
      bundleKitItemStockPhotos.foamRoller,
    ],
  },
];

function savingsPercent(price: number, original: number): number {
  if (original <= 0 || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

const KIT_CARD_WIDTH_MOBILE = 300;
const KIT_CAROUSEL_GAP = 16;

interface LimitedTimeKitsProps {
  /** When provided, clicking a kit card navigates to the kit product page */
  onKitSelect?: (kit: Kit) => void;
  onAddKitToCart?: (kit: Kit) => void;
}

interface KitBundleCardProps {
  kit: Kit;
  onKitSelect?: (kit: Kit) => void;
  onAddKitToCart?: (kit: Kit) => void;
}

const KitBundleCard: React.FC<KitBundleCardProps> = ({ kit, onKitSelect, onAddKitToCart }) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const kitHref = createUrl(Page.KIT_PRODUCT, { kitId: kit.id });
  const savePct = savingsPercent(kit.price, kit.originalPrice);
  const itemCount = kit.items.length;

  const handleKitNavigate = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onKitSelect?.(kit);
  };

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg md:hover:-translate-y-1 ${onKitSelect ? 'cursor-pointer' : ''}`}
    >
      {/* Card-wide link layer (hero + copy); thumbs & CTAs sit above with pointer-events */}
      {onKitSelect && (
        <a
          href={kitHref}
          onClick={handleKitNavigate}
          className="absolute inset-0 z-[1] rounded-2xl"
          aria-label={`View ${kit.name}`}
        />
      )}

      <div className="relative z-[2] flex min-h-0 flex-1 flex-col pointer-events-none">
        {/* Hero — white background; image fully visible (object-contain, no crop) */}
        <div className="relative bg-white">
          <div className="relative px-3 pb-2 pt-10 sm:px-4 sm:pb-3 sm:pt-11">
            {kit.badge && (
              <span className="absolute left-3 top-3 z-10 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-900 shadow-sm sm:left-4 sm:top-4 sm:text-[10px]">
                {kit.badge}
              </span>
            )}
            {savePct > 0 && (
              <span className="absolute right-3 top-3 z-10 rounded-md bg-brand-orange px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm sm:right-4 sm:top-4 sm:text-[10px]">
                Save {savePct}%
              </span>
            )}
            <div className="flex h-[168px] w-full items-center justify-center sm:h-[188px] md:h-[200px]">
              <img
                src={kit.image}
                alt={kit.name}
                className="max-h-full max-w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                decoding="async"
              />
            </div>
          </div>

          {/* What's included — product thumbnails */}
          <div className="pointer-events-auto border-t border-slate-100 bg-white px-3 py-3 sm:px-4 sm:py-3.5">
            <p className="mb-2.5 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              What&apos;s included
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {kit.items.map((item, i) => {
                const thumbSrc = kit.itemImages[i] ?? kit.itemImages[0];
                const active = i === activeItemIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    title={item}
                    aria-label={item}
                    aria-pressed={active}
                    onClick={() => setActiveItemIndex(i)}
                    className={`relative flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-slate-50 transition-colors sm:h-14 sm:w-14 ${
                      active ? 'border-brand-orange shadow-sm ring-1 ring-brand-orange/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={thumbSrc}
                      alt=""
                      loading="lazy"
                      className="max-h-full max-w-full object-contain object-center p-1.5 sm:p-2"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Body — category, title + price, included count */}
        <div className="flex flex-1 flex-col border-t border-slate-100 bg-white px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-400">Recovery bundle</p>

          <div className="mt-2 flex items-start justify-between gap-3">
            <h3 className="min-w-0 flex-1 text-left text-[15px] font-semibold leading-snug text-slate-900 sm:text-base">
              {kit.name}
            </h3>
            <div className="shrink-0 text-right">
              {kit.originalPrice > kit.price && (
                <span className="block text-[11px] font-medium text-slate-400 line-through">
                  ${kit.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-[15px] font-bold tabular-nums text-slate-900 sm:text-base">
                ${kit.price.toFixed(2)}
              </span>
            </div>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            <span className="font-semibold text-slate-600">{itemCount} items</span>
            <span className="text-slate-400"> · </span>
            <span className="line-clamp-2">{kit.items.join(' · ')}</span>
          </p>
        </div>
      </div>

      {/* Actions — above overlay link */}
      <div className="relative z-[3] flex gap-2 border-t border-slate-100 bg-white px-4 pb-4 pt-1 sm:px-5 sm:pb-5">
        <button
          type="button"
          className="min-h-[48px] flex-1 rounded-[10px] bg-brand-dark py-3 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-slate-800 active:scale-[0.99] sm:text-xs"
          onClick={() => onAddKitToCart?.(kit)}
        >
          Add to cart
        </button>
        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[10px] border border-slate-200 bg-white text-brand-orange transition-colors hover:bg-slate-50"
          aria-label="Save bundle"
        >
          <Heart className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden />
        </button>
      </div>
    </article>
  );
};

export const LimitedTimeKits: React.FC<LimitedTimeKitsProps> = ({ onKitSelect, onAddKitToCart }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeKitIndex, setActiveKitIndex] = useState(0);

  const updateActiveKitIndex = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = KIT_CARD_WIDTH_MOBILE + KIT_CAROUSEL_GAP;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveKitIndex(Math.min(Math.max(0, index), KITS.length - 1));
  }, []);

  const goToKitIndex = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const itemWidth = KIT_CARD_WIDTH_MOBILE + KIT_CAROUSEL_GAP;
    el.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    setActiveKitIndex(index);
  };

  return (
    <section id="recovery-kits" className="relative overflow-hidden bg-brand-light py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mb-12 flex flex-col justify-between gap-8 border-b border-slate-200 pb-10 md:mb-16 md:flex-row md:items-end md:pb-12">
          <div className="max-w-xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-0.5 w-12 bg-brand-orange" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">
                Limited Edition Collection
              </span>
            </div>
            <h2 className="mb-4 text-4xl font-black uppercase leading-[0.95] tracking-tighter text-brand-dark md:text-5xl lg:text-6xl">
              Exclusive <br />{' '}
              <span className="bg-gradient-to-r from-brand-orange to-orange-400 bg-clip-text text-transparent">
                Recovery Kits
              </span>
            </h2>
            <p className="font-medium text-slate-500">
              Professional-grade orthotics and recovery tools bundled for maximum performance. Guaranteed lowest pricing
              for a limited time.
            </p>
          </div>
        </div>

        <div
          ref={carouselRef}
          onScroll={updateActiveKitIndex}
          className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4 md:overflow-visible md:px-0 md:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {KITS.map((kit) => (
            <div key={kit.id} className="w-[300px] flex-none snap-start md:w-auto">
              <KitBundleCard kit={kit} onKitSelect={onKitSelect} onAddKitToCart={onAddKitToCart} />
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-center gap-2 md:hidden" aria-hidden>
          {KITS.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToKitIndex(index)}
              className={`h-2 rounded-full transition-all duration-200 ${
                index === activeKitIndex ? 'w-6 bg-brand-orange' : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to kit ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-x-12 gap-y-6 md:mt-16">
          {[
            { icon: ShieldCheck, text: '60-Day Performance Guarantee' },
            { icon: Zap, text: 'Instant Recovery Support' },
            { icon: ArrowRight, text: 'Premium Doctor Approved' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className="h-4 w-4 text-brand-orange" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
