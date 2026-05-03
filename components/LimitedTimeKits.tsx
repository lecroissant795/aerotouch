import React, { useState, useRef, useCallback } from 'react';
import { Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { type BundleKit } from '../types';
import { KitBundleCard } from './KitBundleCard';
import { useShopifyBundleKits } from '../hooks/useShopifyBundleKits';

const KIT_CARD_WIDTH_MOBILE = 300;
const KIT_CAROUSEL_GAP = 16;

interface LimitedTimeKitsProps {
  /** When provided, clicking a kit card navigates to the kit product page */
  onKitSelect?: (kit: BundleKit) => void;
  onAddKitToCart?: (kit: BundleKit) => void;
}

export const LimitedTimeKits: React.FC<LimitedTimeKitsProps> = ({ onKitSelect, onAddKitToCart }) => {
  const kits = useShopifyBundleKits();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeKitIndex, setActiveKitIndex] = useState(0);

  const updateActiveKitIndex = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = KIT_CARD_WIDTH_MOBILE + KIT_CAROUSEL_GAP;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveKitIndex(Math.min(Math.max(0, index), kits.length - 1));
  }, [kits.length]);

  const goToKitIndex = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const itemWidth = KIT_CARD_WIDTH_MOBILE + KIT_CAROUSEL_GAP;
    el.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    setActiveKitIndex(index);
  };

  return (
    <section id="recovery-kits" className="relative overflow-hidden bg-brand-light pb-20 pt-0 md:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
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
