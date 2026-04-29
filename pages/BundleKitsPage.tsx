import React from 'react';
import { Zap, ShoppingCart, ShieldCheck } from 'lucide-react';
import { BundleKit, Page } from '../types';
import { createUrl } from '../utils/router';

export const BUNDLE_KITS: BundleKit[] = [
  {
    id: 'fascilites-relief',
    name: 'Fascilites Relief Kit',
    price: 48.0,
    originalPrice: 75.0,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    badge: 'Best For Rehab',
    items: ['1x Pro Insole', '1x Massage Ball', '1x compression sock'],
  },
  {
    id: 'heel-relief',
    name: 'Heel Relief Kit',
    price: 39.0,
    originalPrice: 60.0,
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop',
    badge: 'Top Rated',
    items: ['1x Heel Cushion', '1x Daily Insole', '1x Arch Support'],
  },
  {
    id: 'toe-relief',
    name: 'Toe Relief Kit',
    price: 39.0,
    originalPrice: 60.0,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
    badge: 'Doctor Choice',
    items: ['1x Toe Spreader', '1x Sport Insole', '1x Fabric sleeve'],
  },
  {
    id: 'complete-recovery-kit',
    name: 'The Complete Recovery Kit',
    price: 97.0,
    originalPrice: 150.0,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    badge: 'Ultimate Value',
    items: ['2x AeroTouch Massage Insoles', '2x Compression Socks', '1x Massage Roller'],
  },
];


interface BundleKitsPageProps {
  onBack?: () => void;
  onAddKitToCart?: (kit: BundleKit) => void;
  onKitSelect?: (kit: BundleKit) => void;
}

export const BundleKitsPage: React.FC<BundleKitsPageProps> = ({ onBack, onAddKitToCart, onKitSelect }) => {
  return (
    <div className="min-h-screen bg-brand-light pt-24">

      <div className="container mx-auto px-4 md:px-6 py-16">
        {/* Intro */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-brand-orange font-bold tracking-widest uppercase text-sm mb-2">
            Limited Edition
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Recovery & relief kits designed for real results
          </h2>
          <p className="text-slate-600">
            Each kit combines our best-selling insoles and accessories so you can target your specific needs and save.
          </p>
        </div>

        {/* Kit grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {BUNDLE_KITS.map((kit) => {
            const kitHref = createUrl(Page.KIT_PRODUCT, { kitId: kit.id });
            const handleKitClick = (e: React.MouseEvent) => {
              e.preventDefault();
              onKitSelect?.(kit);
            };
            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onKitSelect?.(kit);
              }
            };
            return (
              <div
                key={kit.id}
                className="group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-200"
              >
                {/* Main clickable area */}
                <a
                  href={kitHref}
                  onClick={handleKitClick}
                  tabIndex={0}
                  onKeyDown={handleKeyDown}
                  className="block flex flex-col flex-grow"
                >
                  <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
                    <img
                      src={kit.image}
                      alt={kit.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 mix-blend-multiply opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm border border-slate-100">
                        {kit.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-brand-orange text-white text-[10px] font-black w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-lg">
                      <span>SAVE</span>
                      <span className="text-sm">
                        {Math.round((1 - kit.price / kit.originalPrice) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow p-5">
                    <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight leading-tight">
                      {kit.name}
                    </h3>
                    <ul className="space-y-1.5 mb-5">
                      {kit.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                          <Zap className="w-3 h-3 text-brand-lime fill-current flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-baseline">
                        <span className="block text-xs font-bold text-slate-400 line-through">
                          ${kit.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">
                          ${kit.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Add to Cart button */}
                <div className="px-5 pb-5 flex justify-end">
                  <button
                    type="button"
                    className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center transition-all hover:bg-brand-orange hover:shadow-lg hover:shadow-brand-orange/25 active:scale-95 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddKitToCart?.(kit);
                    }}
                    aria-label={`Add ${kit.name} to cart`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6">
          {[
            { icon: ShieldCheck, text: '60-Day Performance Guarantee' },
            { icon: Zap, text: 'Instant Recovery Support' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-brand-orange" />
              <span className="text-sm font-bold text-slate-600">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
