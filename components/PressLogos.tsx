import React from 'react';

export const PressLogos: React.FC = () => {
  const logos = (
    <div className="flex items-center gap-20 mx-10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
        {/* Sports Illustrated */}
        <div className="flex items-center flex-shrink-0">
        <span className="font-serif font-black text-3xl italic tracking-tighter text-slate-900">Sports Illustrated</span>
        </div>
        
        {/* Runner's World */}
        <div className="flex items-center flex-shrink-0">
            <span className="font-sans font-black text-2xl uppercase tracking-tight text-slate-900 italic">RUNNER'S WORLD</span>
        </div>
        
        {/* Travel + Leisure */}
        <div className="flex items-center flex-shrink-0">
            <span className="font-sans font-bold text-lg uppercase tracking-widest text-slate-900">TRAVEL + LEISURE</span>
        </div>
        
        {/* CNN Underscored */}
        <div className="flex items-center gap-2 flex-shrink-0">
            <span className="font-sans font-black text-3xl text-red-600">CNN</span>
            <span className="font-sans font-bold text-xl text-slate-900 underline decoration-4 underline-offset-4">underscored</span>
        </div>
        
        {/* Men's Health */}
        <div className="flex items-center flex-shrink-0">
            <span className="font-sans font-black text-2xl uppercase tracking-tighter text-slate-900">Men'sHealth</span>
        </div>

        {/* Vogue */}
        <div className="flex items-center flex-shrink-0">
            <span className="font-serif font-bold text-3xl uppercase tracking-widest text-slate-900">VOGUE</span>
        </div>
    </div>
  );

  return (
    <section className="pt-6 pb-12 bg-white border-b border-slate-100 overflow-hidden">
      <div className="relative w-full overflow-hidden">
        {/* Gradient Masks for fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        <div className="flex whitespace-nowrap animate-marquee">
           {logos}
           {logos}
        </div>
      </div>
    </section>
  );
};
