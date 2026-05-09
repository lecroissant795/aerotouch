import React from 'react';
import { Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { type BundleKit } from '../types';
import { BundleKitCardsRow } from './BundleKitCardsRow';
import { useShopifyBundleKits } from '../hooks/useShopifyBundleKits';

interface LimitedTimeKitsProps {
  /** When provided, clicking a kit card navigates to the kit product page */
  onKitSelect?: (kit: BundleKit) => void;
  onAddKitToCart?: (kit: BundleKit) => void;
}

export const LimitedTimeKits: React.FC<LimitedTimeKitsProps> = ({ onKitSelect, onAddKitToCart }) => {
  const kits = useShopifyBundleKits();

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

        <BundleKitCardsRow kits={kits} onKitSelect={onKitSelect} onAddKitToCart={onAddKitToCart} />

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
