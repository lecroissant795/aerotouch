import React, { useState } from 'react';
import { BundleKit } from '../types';
import {
  ChevronLeft,
  Zap,
  ShoppingCart,
  ShieldCheck,
  Check,
  Truck,
  Clock3,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/Button';
import { bundleKitBadgeLabel } from '../utils/bundleKitBadge';

interface KitProductPageProps {
  kit: BundleKit;
  onBack: () => void;
  onAddToCart?: (kit: BundleKit, quantity?: number) => void;
}

export const KitProductPage: React.FC<KitProductPageProps> = ({ kit, onBack, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const savingsPercent = Math.round((1 - kit.price / kit.originalPrice) * 100);
  const savingsAmount = (kit.originalPrice - kit.price) * quantity;
  const lineTotal = kit.price * quantity;

  const valuePillars = [
    {
      icon: Zap,
      title: 'Targeted Relief',
      desc: 'Designed to reduce daily foot, heel, and arch stress in minutes.'
    },
    {
      icon: Sparkles,
      title: 'Built To Recover',
      desc: 'Each kit combines support + recovery tools that complement each other.'
    },
    {
      icon: Clock3,
      title: 'Fast Setup',
      desc: 'No complex setup. Open, fit, and start feeling support right away.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500 pb-24 md:pb-0">

      {/* Breadcrumb / Back Navigation */}
      <div className="pt-8 md:pt-16 pb-4 px-4 md:px-6 container mx-auto flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          onClick={onBack}
          className="group flex items-center text-sm font-medium text-slate-500 hover:text-brand-orange transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Bundle Kits
        </button>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:flex lg:gap-12 xl:gap-16 mb-24">

        {/* Left Col: Product Image */}
        <div className="lg:w-3/5">
          <div className="lg:sticky lg:top-40 space-y-4 md:max-w-[550px] lg:max-w-none mx-auto">
            <div className="bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 relative items-center justify-center aspect-[4/5] md:aspect-square object-cover shadow-sm">
              <img
                src={kit.image}
                alt={kit.name}
                className="absolute inset-0 w-full h-full object-cover object-center mix-blend-multiply opacity-95"
              />
              <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm backdrop-blur-sm">
                  {bundleKitBadgeLabel(kit.badge)}
                </span>
                <span className="rounded-full bg-brand-orange px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-orange/25">
                  Save {savingsPercent}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Product Details */}
        <div className="lg:w-2/5 mt-8 lg:mt-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            {/* Header Info */}
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight leading-none mb-4">
              {kit.name}
            </h1>

            <p className="text-slate-600 leading-relaxed mb-6">
              Professional-grade recovery kit with everything you need to reduce pain, improve comfort, and move better every day.
            </p>

            {/* Price Display */}
            <div className="flex items-end gap-3 mb-4">
              <div className="text-4xl font-black text-brand-orange">${kit.price.toFixed(2)}</div>
              <div className="text-xl font-bold text-slate-400 line-through decoration-2 mb-1">${kit.originalPrice.toFixed(2)}</div>
              <div className="mb-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase">
                Save {savingsPercent}% (${(kit.originalPrice - kit.price).toFixed(2)})
              </div>
            </div>

            {/* What's Inside */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                What&apos;s inside
              </h2>
              <ul className="space-y-2">
                {kit.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-lime/35 text-brand-dark">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">Quantity</p>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white">
                <button
                  type="button"
                  className="h-12 w-12 text-xl text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-40"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="flex-1 text-center text-lg font-bold text-slate-900" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="h-12 w-12 text-xl text-slate-600 transition-colors hover:bg-slate-50"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              fullWidth
              size="lg"
              className="h-14 text-lg shadow-lg relative overflow-hidden group bg-black text-white hover:bg-brand-lime hover:text-slate-900 transition-all duration-300"
              onClick={() => onAddToCart?.(kit, quantity)}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 font-black tracking-tight uppercase">
                <ShoppingCart className="w-5 h-5" />
                Add Kit to Cart
                {quantity > 1 ? ` (${quantity})` : ''}
              </span>
              {/* Shine effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine mix-blend-overlay" />
            </Button>

            {/* Order Summary */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-500">Order Total</span>
                <span className="font-black text-slate-900">${lineTotal.toFixed(2)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-500">Total Savings</span>
                <span className="font-black text-brand-orange">${savingsAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                <ShieldCheck className="h-4 w-4 shrink-0 text-brand-orange" />
                <span className="font-semibold">60-Day Guarantee</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                <Truck className="h-4 w-4 shrink-0 text-brand-orange" />
                <span className="font-semibold">Tracked Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Kit Works Section */}
      <div className="container mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
              Why This Kit Works
            </h2>
            <span className="hidden md:inline-flex items-center gap-1 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Built for daily relief <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {valuePillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-lime/35 text-brand-dark">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black tracking-tight text-slate-900">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
