import React, { useState, useRef, useCallback } from 'react';
import type { BundleKit } from '../types';
import { KitBundleCard } from './KitBundleCard';

const KIT_CARD_WIDTH_MOBILE = 300;
const KIT_CAROUSEL_GAP = 16;

export interface BundleKitCardsRowProps {
  kits: BundleKit[];
  onKitSelect?: (kit: BundleKit) => void;
  onAddKitToCart?: (kit: BundleKit) => void;
}

/**
 * Horizontal snap carousel on mobile + 2/4-column grid on md+ — matches LimitedTimeKits on the landing page.
 */
export const BundleKitCardsRow: React.FC<BundleKitCardsRowProps> = ({ kits, onKitSelect, onAddKitToCart }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeKitIndex, setActiveKitIndex] = useState(0);

  const updateActiveKitIndex = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = KIT_CARD_WIDTH_MOBILE + KIT_CAROUSEL_GAP;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveKitIndex(Math.min(Math.max(0, index), Math.max(0, kits.length - 1)));
  }, [kits.length]);

  const goToKitIndex = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const itemWidth = KIT_CARD_WIDTH_MOBILE + KIT_CAROUSEL_GAP;
    el.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    setActiveKitIndex(index);
  };

  if (kits.length === 0) return null;

  return (
    <>
      <div
        ref={carouselRef}
        onScroll={updateActiveKitIndex}
        className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4 md:overflow-visible md:px-0 md:pb-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {kits.map((kit) => (
          <div key={kit.id} className="w-[300px] flex-none snap-start md:w-auto">
            <KitBundleCard kit={kit} onKitSelect={onKitSelect} onAddKitToCart={onAddKitToCart} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2 md:hidden" aria-hidden>
        {kits.map((_, index) => (
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
    </>
  );
};
