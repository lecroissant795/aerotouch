import React from 'react';
import { Zap, ArrowRight, Truck, ShieldCheck, Percent } from 'lucide-react';

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
      className="relative flex w-full min-h-[650px] items-center overflow-hidden bg-brand-dark text-white sm:min-h-[650px] lg:min-h-0"
      aria-labelledby="seasonal-banner-heading"
    >
      <img
        src="/images/black-friday-hero.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[60%_70%] max-lg:object-[45%_70%]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent max-lg:bg-brand-dark/30"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-12 lg:py-24 xl:px-20">
        <div className="min-w-0 flex-1 text-center lg:text-left">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/15 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-sky-100 backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-amber-300" aria-hidden />
              Black Friday Event
            </span>
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-brand-lime">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-lime" aria-hidden />
              Live now · Limited time only
            </span>
          </div>

          <h2
            id="seasonal-banner-heading"
            className="mb-5 text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem]"
          >
            Black Friday
            <br className="hidden sm:block" />{' '}
            <span className="bg-gradient-to-r from-sky-300 via-brand-orange to-amber-300 bg-clip-text text-transparent">
              deals.
            </span>
          </h2>

          <p className="mx-auto mb-8 max-w-xl text-base font-medium leading-relaxed text-slate-300 sm:text-lg lg:mx-0">
            Our biggest event of the year—save{' '}
            <span className="font-bold text-white">{discountLabel.toLowerCase()}</span> on performance insoles with
            exclusive Black Friday bundle pricing on best sellers.
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

        <div className="hidden w-full max-w-md flex-shrink-0 lg:block lg:max-w-sm xl:max-w-md">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-sky-500/35 via-brand-orange/30 to-amber-400/20 blur-md"
            />
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md sm:p-8">
              <div className="mb-6 flex items-baseline justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sky-300">Black Friday savings</p>
                  <p className="mt-2 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl">
                    {discountLabel}
                  </p>
                </div>
                <Zap className="h-10 w-10 flex-shrink-0 text-brand-lime" strokeWidth={1.5} aria-hidden />
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
