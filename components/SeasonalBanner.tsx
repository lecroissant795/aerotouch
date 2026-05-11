import React from 'react';
import { Heart, ArrowRight, Truck, ShieldCheck, Gift } from 'lucide-react';

interface SeasonalBannerProps {
  onShopSaleClick?: () => void;
  /** Promo code shown in the banner. */
  code?: string;
  /** Headline discount, e.g. "Up to 60% Off". */
  discountLabel?: string;
}

export const SeasonalBanner: React.FC<SeasonalBannerProps> = ({
  onShopSaleClick,
  code = 'LOVE20',
  discountLabel = 'Up to 60% Off',
}) => {
  return (
    <section
      className="relative w-full overflow-hidden bg-brand-dark text-white"
      aria-labelledby="seasonal-banner-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-rose-600/40 via-brand-dark to-brand-dark"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-rose-500/25 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-[32rem] w-[32rem] rounded-full bg-brand-orange/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-1/2 hidden -translate-y-1/2 lg:block"
      >
        <Heart className="h-72 w-72 fill-rose-500/15 text-rose-500/15 xl:h-96 xl:w-96" strokeWidth={1} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-[42%] top-10 hidden xl:block"
      >
        <Heart className="h-10 w-10 fill-brand-orange/20 text-brand-orange/20" strokeWidth={1} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-12 left-[18%] hidden lg:block"
      >
        <Heart className="h-6 w-6 fill-white/10 text-white/10" strokeWidth={1} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-12 lg:py-24 xl:px-20">
        <div className="min-w-0 flex-1 text-center lg:text-left">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/30 bg-rose-500/15 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-rose-100 backdrop-blur-sm">
              <Heart className="h-3.5 w-3.5 fill-rose-300 text-rose-300" aria-hidden />
              Valentine&apos;s Seasonal Sale
            </span>
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-lime">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-lime" aria-hidden />
              Live now · Ends Feb 14
            </span>
          </div>

          <h2
            id="seasonal-banner-heading"
            className="mb-5 text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem]"
          >
            Love at first
            <br className="hidden sm:block" />{' '}
            <span className="bg-gradient-to-r from-rose-300 via-brand-orange to-orange-300 bg-clip-text text-transparent">
              step.
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-xl text-base font-medium leading-relaxed text-slate-300 sm:text-lg lg:mx-0">
            Treat the feet you love—or someone else&apos;s. Save{' '}
            <span className="font-bold text-white">{discountLabel.toLowerCase()}</span> on every pair this Valentine&apos;s
            with bundle pricing on best sellers.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <button
              type="button"
              onClick={() => onShopSaleClick?.()}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-lime px-8 py-4 text-sm font-black uppercase tracking-widest text-brand-dark shadow-[0_0_30px_rgba(193,241,29,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-white sm:w-auto sm:px-10"
            >
              Shop the sale
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </button>

            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 backdrop-blur-sm">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Code</span>
              <span className="font-mono text-sm font-black tracking-[0.2em] text-white">{code}</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md flex-shrink-0 lg:max-w-sm xl:max-w-md">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-rose-500/40 via-brand-orange/30 to-transparent blur-md"
            />
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8">
              <div className="mb-6 flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-rose-300">Seasonal savings</p>
                  <p className="mt-2 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
                    {discountLabel}
                  </p>
                </div>
                <Gift className="h-10 w-10 flex-shrink-0 text-brand-lime" strokeWidth={1.5} aria-hidden />
              </div>

              <ul className="space-y-3 border-t border-white/10 pt-5">
                {[
                  { icon: Heart, text: '35–60% off bundle pricing' },
                  { icon: Truck, text: 'Free shipping over $50' },
                  { icon: ShieldCheck, text: '60-day comfort guarantee' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                      <item.icon className="h-3.5 w-3.5 text-brand-lime" aria-hidden />
                    </span>
                    <span className="text-sm font-medium text-slate-200">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
