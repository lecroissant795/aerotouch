import React from 'react';
import { Button } from './Button';
import { Star } from 'lucide-react';

interface HeroProps {
  onPrimaryCtaClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPrimaryCtaClick }) => {
  const RunningBanner = ({ suffix }: { suffix: string }) => (
    <div className="flex items-center min-w-max">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={`${suffix}-${item}`}
          className="mx-8 flex items-center text-xs md:text-sm font-bold uppercase tracking-widest text-white"
        >
          <span className="mr-6">60-day money-back guarantee</span>
          <span className="mr-6">🌍 Global shipping</span>
          <span className="mr-6">✈️ Tracked insured shipping</span>
          <span>😊 10,000+ Happy Customer</span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-end pb-24 lg:pb-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1530143311094-34d807799e8f?q=80&w=2938&auto=format&fit=crop" 
            alt="Runner on wet asphalt" 
            className="w-full h-full object-cover object-[70%_top] md:object-top"
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 fade-in-up">
          <div className="max-w-5xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 md:w-5 md:h-5 fill-[#FFCA28] text-[#FFCA28]" />
                ))}
              </div>
              <span className="text-white font-bold ml-1 text-sm md:text-base tracking-wide uppercase">500,000+ customers</span>
            </div>

            <p className="text-brand-lime font-bold tracking-[0.2em] uppercase mb-4 text-sm md:text-base">
              MADE FOR PERFORMANCE & COMFORT
            </p>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-8">
              ENGINEERED<br />FOR EVERY STEP
            </h1>
            
            <Button 
              className="rounded-full bg-brand-lime text-brand-dark hover:bg-white hover:text-brand-dark border-none px-8 py-4 text-lg font-bold uppercase tracking-wide"
              onClick={onPrimaryCtaClick}
            >
              Get Yours Now
            </Button>
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden whitespace-nowrap border-y border-white/10 bg-gradient-to-r from-[#0B1120] via-[#1A2338] to-[#0B1120] py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.25)_inset,0_8px_30px_rgba(0,0,0,0.25)_inset]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(193,241,29,0.18),transparent_35%),radial-gradient(circle_at_80%_50%,rgba(255,87,34,0.12),transparent_35%)]" />
        <div className="flex animate-marquee">
          <RunningBanner suffix="a" />
          <RunningBanner suffix="b" />
        </div>
      </div>
    </>
  );
};
