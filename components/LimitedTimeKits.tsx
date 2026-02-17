import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './Button';
import { Zap, Timer, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';

interface Kit {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
  items: string[];
}

const KITS: Kit[] = [
  {
    id: 'fascilites-relief',
    name: 'Fascilites Relief Kit',
    price: 48.00,
    originalPrice: 75.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    badge: 'Best For Rehab',
    items: ['1x Pro Insole', '1x Massage Ball', '1x compression sock']
  },
  {
    id: 'heel-relief',
    name: 'Heel Relief Kit',
    price: 39.00,
    originalPrice: 60.00,
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop',
    badge: 'Top Rated',
    items: ['1x Heel Cushion', '1x Daily Insole', '1x Arch Support']
  },
  {
    id: 'toe-relief',
    name: 'Toe Relief Kit',
    price: 39.00,
    originalPrice: 60.00,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
    badge: 'Doctor Choice',
    items: ['1x Toe Spreader', '1x Sport Insole', '1x Fabric sleeve']
  },
  {
    id: 'complete-recovery-kit',
    name: 'The Complete Recovery Kit',
    price: 97.00,
    originalPrice: 150.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    badge: 'Ultimate Value',
    items: ['2x AeroTouch Massage Insoles', '2x Compression Socks', '1x Massage Roller']
  }
];

const KIT_CARD_WIDTH_MOBILE = 280;
const KIT_CAROUSEL_GAP = 16;

interface LimitedTimeKitsProps {
  /** When provided, clicking a kit card navigates to the kit product page */
  onKitSelect?: (kit: Kit) => void;
  onAddKitToCart?: (kit: Kit) => void;
}

export const LimitedTimeKits: React.FC<LimitedTimeKitsProps> = ({ onKitSelect, onAddKitToCart }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 0 });
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeKitIndex, setActiveKitIndex] = useState(0);

  const updateActiveKitIndex = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const itemWidth = KIT_CARD_WIDTH_MOBILE + KIT_CAROUSEL_GAP;
    const index = Math.round(scrollLeft / itemWidth);
    setActiveKitIndex(Math.min(Math.max(0, index), KITS.length - 1));
  }, []);

  const goToKitIndex = (index: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const itemWidth = KIT_CARD_WIDTH_MOBILE + KIT_CAROUSEL_GAP;
    el.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
    setActiveKitIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="recovery-kits" className="py-24 bg-brand-light relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-orange/30 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header with High Refined Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-200 pb-12">
          <div className="max-w-xl">
             <div className="flex items-center gap-2 mb-4">
               <span className="w-12 h-0.5 bg-brand-orange"></span>
               <span className="text-brand-orange font-black uppercase tracking-[0.3em] text-[10px]">Limited Edition Collection</span>
             </div>
             <h2 className="text-5xl md:text-6xl font-black text-brand-dark uppercase tracking-tighter leading-[0.9] mb-4">
               Exclusive <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-orange-400">Recovery Kits</span>
             </h2>
             <p className="text-slate-500 font-medium">
               Professional-grade orthotics and recovery tools bundled for maximum performance. Guaranteed lowest pricing for a limited time.
             </p>
          </div>

          {/* Premium Glass Timer */}
          <div className="w-full min-w-0 bg-white/40 backdrop-blur-xl border border-white p-5 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-wrap items-center gap-4 sm:gap-6 animate-urgent">
             <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="flex-shrink-0 bg-brand-orange/10 p-2.5 sm:p-3 rounded-2xl">
                   <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange animate-pulse" />
                </div>
                <div className="min-w-0">
                   <span className="block text-[10px] sm:text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Ends In</span>
                   <div className="flex gap-1.5 sm:gap-2">
                      {[
                        { val: timeLeft.hours, label: 'h' },
                        { val: timeLeft.minutes, label: 'm' },
                        { val: timeLeft.seconds, label: 's' }
                      ].map((u, i) => (
                        <div key={i} className="flex items-baseline gap-0.5">
                           <span className="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tighter">{u.val.toString().padStart(2, '0')}</span>
                           <span className="text-[10px] font-bold text-slate-500">{u.label}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
             <div className="h-8 sm:h-10 w-px bg-slate-200 flex-shrink-0 hidden sm:block" aria-hidden />
             <div className="hidden sm:block flex-shrink-0">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                <span className="text-xs font-bold text-brand-orange">Limited quantity — order soon</span>
             </div>
          </div>
        </div>

        {/* Enhanced Kit Grid / Mobile Carousel */}
        <div
          ref={carouselRef}
          onScroll={updateActiveKitIndex}
          className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-4 md:pb-0 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide md:overflow-visible"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {KITS.map((kit) => (
            <div
              key={kit.id}
              className="group relative flex-none w-[280px] md:w-auto snap-start"
            >
               {/* Card Container - full width in carousel, 90% in grid on md */}
               <div
                 role={onKitSelect ? 'button' : undefined}
                 tabIndex={onKitSelect ? 0 : undefined}
                 onClick={() => onKitSelect?.(kit)}
                 onKeyDown={(e) => onKitSelect && e.key === 'Enter' && onKitSelect(kit)}
                 className={`w-full bg-white rounded-xl md:rounded-[2rem] p-3 md:p-4 h-full border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-brand-orange/10 md:hover:-translate-y-2 flex flex-col ${onKitSelect ? 'cursor-pointer' : ''}`}
               >
                  {/* Visual Header */}
                  <div className="relative aspect-[3/4] md:aspect-[4/5] bg-slate-50 rounded-xl md:rounded-[1.5rem] overflow-hidden mb-4 md:mb-6">
                     {/* Badge Overlay */}
                     <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10">
                        <span className="bg-white/90 backdrop-blur-sm text-[8px] md:text-[9px] font-black text-slate-900 px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                           {kit.badge}
                        </span>
                     </div>

                     {/* Image with sophisticated effect */}
                     <img 
                        src={kit.image} 
                        alt={kit.name}
                        className="w-full h-full object-cover mix-blend-multiply opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700"
                     />
                     
                     {/* Gradient Bottom */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-50"></div>
                     
                     {/* Quick Savings Bubble */}
                     <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-brand-orange text-white text-[8px] md:text-[10px] font-black w-10 h-10 md:w-14 md:h-14 rounded-full flex flex-col items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                        <span>SAVE</span>
                        <span className="text-xs md:text-sm">40%</span>
                     </div>
                  </div>

                  {/* Content Section */}
                  <div className="px-1 md:px-2 flex-grow">
                     <h3 className="text-base md:text-lg font-black text-slate-900 leading-tight mb-2 md:mb-3 uppercase tracking-tight">
                        {kit.name}
                     </h3>
                     
                     {/* In-kit list */}
                     <div className="space-y-1 md:space-y-1.5 mb-4 md:mb-6">
                        {kit.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                             <Zap className="w-2 h-2 md:w-2.5 md:h-2.5 text-brand-lime fill-current flex-shrink-0" />
                             {item}
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-auto px-1 md:px-2 pt-3 md:pt-4 border-t border-slate-50 flex items-center justify-between">
                     <div>
                        <span className="block text-[9px] md:text-[10px] font-bold text-slate-400 line-through tracking-tighter mb-0.5">${kit.originalPrice.toFixed(2)}</span>
                        <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter leading-none">${kit.price.toFixed(2)}</span>
                     </div>
                     <button
                       type="button"
                       className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 text-white rounded-xl md:rounded-2xl flex items-center justify-center transition-all hover:bg-brand-orange hover:shadow-lg hover:shadow-brand-orange/30 active:scale-95"
                       onClick={(e) => {
                         e.stopPropagation();
                         onAddKitToCart?.(kit);
                       }}
                       aria-label={`Add ${kit.name} to cart`}
                     >
                        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Carousel dots - mobile only */}
        <div className="flex justify-center gap-2 mt-4 md:hidden" aria-hidden>
          {KITS.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToKitIndex(index)}
              className={`h-2 rounded-full transition-all duration-200 ${
                index === activeKitIndex
                  ? 'w-6 bg-brand-orange'
                  : 'w-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to kit ${index + 1}`}
            />
          ))}
        </div>

        {/* Footer Trust Bar inside Section */}
        <div className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6">
           {[
             { icon: ShieldCheck, text: "60-Day Performance Guarantee" },
             { icon: Zap, text: "Instant Recovery Support" },
             { icon: ArrowRight, text: "Premium Doctor Approved" }
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-brand-orange" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.text}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};
