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
    <div className="min-h-screen bg-brand-light">
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-[#fffdf8] via-[#fff9ef] to-[#f6f8ff]">
        <div className="pointer-events-none absolute -left-28 -top-28 h-72 w-72 rounded-full bg-brand-orange/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand-lime/20 blur-3xl" />

        <div className="container mx-auto px-4 md:px-6 pt-20 md:pt-24 pb-10 md:pb-14">
          <button
            type="button"
            onClick={onBack}
            className="group mb-6 inline-flex items-center text-sm font-medium text-slate-600 hover:text-brand-orange transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Bundle Kits
          </button>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.5)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-50">
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="h-full w-full object-cover mix-blend-multiply opacity-95"
                  />
                  <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-200 bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm backdrop-blur-sm">
                      {kit.badge}
                    </span>
                    <span className="rounded-full bg-brand-orange px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-brand-orange/25">
                      Save {savingsPercent}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  What&apos;s inside
                </h2>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {kit.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-lime/35 text-brand-dark">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm font-semibold text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.5)] lg:sticky lg:top-28">
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-[1.05] text-slate-900">
                  {kit.name}
                </h1>
                <p className="mt-4 text-slate-600">
                  Professional-grade recovery kit with everything you need to reduce pain, improve comfort, and move better every day.
                </p>

                <div className="mt-6 rounded-2xl border border-brand-orange/25 bg-gradient-to-r from-brand-orange/8 to-brand-lime/15 p-4">
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black tracking-tight text-slate-900">${kit.price.toFixed(2)}</span>
                    <span className="text-lg font-bold text-slate-400 line-through">${kit.originalPrice.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-sm font-bold text-brand-orange">
                    You save ${(kit.originalPrice - kit.price).toFixed(2)} per kit
                  </p>
                </div>

                <div className="mt-6">
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

                <Button
                  className="mt-5 w-full rounded-xl bg-slate-900 py-4 text-base font-black uppercase tracking-wide text-white shadow-lg shadow-slate-900/20 transition hover:bg-brand-orange"
                  onClick={() => onAddToCart?.(kit, quantity)}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Add to cart
                    {quantity > 1 ? ` (${quantity})` : ''}
                  </span>
                </Button>

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
        </div>
      </div>

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
