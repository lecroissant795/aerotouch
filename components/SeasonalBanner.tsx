import React from 'react';
import { Sun, ArrowRight, Truck, ShieldCheck, Percent } from 'lucide-react';
import { InteractivePlusGridBackground } from './InteractivePlusGridBackground';

interface SeasonalBannerProps {
  onShopSaleClick?: () => void;
  /** Headline discount, e.g. "Up to 60% Off". */
  discountLabel?: string;
}

export const SeasonalBanner: React.FC<SeasonalBannerProps> = ({
  onShopSaleClick,
  discountLabel = 'Up to 60% Off',
}) => {
  return (
    <section
      className="relative w-full overflow-hidden bg-brand-dark text-white"
      aria-labelledby="seasonal-banner-heading"
    >
      <InteractivePlusGridBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-sky-600/30 via-transparent to-orange-500/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 z-[1] h-[28rem] w-[28rem] rounded-full bg-amber-400/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 z-[1] h-[32rem] w-[32rem] rounded-full bg-brand-orange/20 blur-[140px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-1/2 z-[1] hidden -translate-y-1/2 lg:block"
      >
        <Sun className="h-72 w-72 fill-amber-400/10 text-amber-300/15 xl:h-96 xl:w-96" strokeWidth={1} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute left-[42%] top-10 z-[1] hidden xl:block"
      >
        <Sun className="h-10 w-10 fill-brand-orange/15 text-brand-orange/25" strokeWidth={1} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-12 left-[18%] z-[1] hidden lg:block"
      >
        <Sun className="h-6 w-6 fill-white/10 text-white/10" strokeWidth={1} />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-12 lg:py-24 xl:px-20">
        <div className="min-w-0 flex-1 text-center lg:text-left">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/15 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-sky-100 backdrop-blur-sm">
              <Sun className="h-3.5 w-3.5 text-amber-300" aria-hidden />
              Summer Seasonal Sale
            </span>
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-lime">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-lime" aria-hidden />
              Live now · All summer long
            </span>
          </div>

          <h2
            id="seasonal-banner-heading"
            className="mb-5 text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem]"
          >
            Step into
            <br className="hidden sm:block" />{' '}
            <span className="bg-gradient-to-r from-sky-300 via-brand-orange to-amber-300 bg-clip-text text-transparent">
              summer.
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-xl text-base font-medium leading-relaxed text-slate-300 sm:text-lg lg:mx-0">
            Hot days, long miles, and every shoe in your rotation—save{' '}
            <span className="font-bold text-white">{discountLabel.toLowerCase()}</span> on performance insoles with our
            summer bundle pricing on best sellers.
          </p>

          <div className="flex justify-center lg:justify-start">
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
          </div>
        </div>

        <div className="w-full max-w-md flex-shrink-0 lg:max-w-sm xl:max-w-md">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-sky-500/35 via-brand-orange/30 to-amber-400/20 blur-md"
            />
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8">
              <div className="mb-6 flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">Seasonal savings</p>
                  <p className="mt-2 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
                    {discountLabel}
                  </p>
                </div>
                <Sun className="h-10 w-10 flex-shrink-0 text-brand-lime" strokeWidth={1.5} aria-hidden />
              </div>

              <ul className="space-y-3 border-t border-white/10 pt-5">
                {[
                  { icon: Percent, text: 'Huge Discounts' },
                  { icon: Truck, text: 'Free Shipping' },
                  { icon: ShieldCheck, text: '60-Day Comfort Guarantee' },
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
