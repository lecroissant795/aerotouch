import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Timer } from 'lucide-react';
import { miscImages } from '../utils/mediaUrls';

interface FlashSaleProps {
  onShopSaleClick?: () => void;
}

export const FlashSale: React.FC<FlashSaleProps> = ({ onShopSaleClick }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 45,
    seconds: 22
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev; // Timer finished
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="group relative w-full py-20 md:py-32 overflow-hidden flex items-center justify-center bg-[#0B1120]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={miscImages.runner}
          alt="Athlete jogging"
          className="w-full h-full object-cover object-center opacity-85 mix-blend-normal transition-transform duration-[2000ms] group-hover:scale-110"
        />
        {/* Gradient Overlay - Softer to show background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/70 via-[#0B1120]/40 to-[#0B1120]/70" />
        {/* Subtle Glow */}
        <div className="absolute top-1/2 left-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-orange/10 blur-[120px]" />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          

          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-12">
            {/* Left Column: Heading & Offer */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 uppercase tracking-tighter leading-none">
                End of Season<br />
                <span className="text-brand-lime">Flash Sale</span>
              </h2>
              
              <div className="inline-block bg-brand-orange text-white text-xl md:text-2xl font-black px-4 py-1.5 skew-x-[-12deg] shadow-lg mb-2">
                  20% OFF Your First Order <span className="text-sm block font-bold text-white/90 normal-case tracking-normal">New Customers Only · Use Code: SALE20</span>
              </div>
            </div>

            {/* Right Column: Countdown & Action */}
            <div className="flex flex-col items-center md:items-end gap-6 flex-1">
              {/* Countdown Timer Wrapper */}
              <div className="flex flex-col items-center gap-4">
                {/* Badge above timer */}
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/20 bg-brand-orange/10 px-3 py-1 backdrop-blur-sm">
                <Timer className="h-3.5 w-3.5 animate-pulse text-brand-orange" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                  Limited Time Offer
                </span>
                </div>

              <div className="flex justify-center gap-3 font-mono text-white">
                {[
                  { label: 'Hrs', value: formatTime(timeLeft.hours) },
                  { label: 'Min', value: formatTime(timeLeft.minutes) },
                  { label: 'Sec', value: formatTime(timeLeft.seconds) }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/5 shadow-inner backdrop-blur-sm md:h-16 md:w-16">
                      <span className="text-xl font-bold md:text-2xl">{item.value}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              </div>

              <Button
                className="w-full transform bg-brand-lime px-10 py-3.5 text-base font-bold uppercase tracking-wide shadow-[0_0_20px_rgba(193,241,29,0.2)] transition-all duration-300 hover:scale-105 hover:bg-white hover:text-brand-dark md:w-auto"
                onClick={onShopSaleClick}
              >
                Shop The Sale
              </Button>
            </div>
          </div>
          
          <div className="mt-8 inline-flex max-w-2xl items-center justify-center rounded-xl border border-brand-orange/50 bg-black/35 px-4 py-3 text-center shadow-lg backdrop-blur-sm">
            <p className="text-xs md:text-sm font-bold tracking-wide text-white">
              SALE20 valid for new customers only. One use per customer. While supplies last.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
