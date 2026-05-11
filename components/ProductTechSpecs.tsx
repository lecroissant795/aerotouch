import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ChevronLeft, ChevronRight, Info, Layers, Activity, Zap, ShieldCheck, Globe, Trophy, Star, Check, X, ThumbsUp, Smile, Truck, Gift, Flame, Heart, Timer, Sparkles, Play, BadgeCheck, MoreHorizontal, MessageSquare, Share2, Quote, Award, Shield, Droplets, Scissors, ArrowLeftRight, ShoppingBag, Users, Copy } from 'lucide-react';
import { ReferralSection } from './ReferralSection';
import { GivingBackSection } from './GivingBackSection';
import { Product } from '../types';
import { sectionImages, reviewVideos, reviewAvatars, reviewPhotos } from '../utils/mediaUrls';

const BUILT_FOR_PURPOSES = [
  { id: 'lifts', label: 'Heavy Lifts', image: sectionImages.heavyLift },
  { id: 'extreme', label: 'Extreme Sports', image: sectionImages.extremeSport },
  { id: 'standout', label: 'Stand Out', image: sectionImages.standOut },
  { id: 'runs', label: 'Nature Runs', image: sectionImages.running },
  { id: 'shifts', label: 'All-Day Comfort', image: sectionImages.allDayComfort },
];

const VIDEO_REVIEWS = [
  {
    id: 1,
    videoSrc: reviewVideos.alexMick,
    avatar: "https://i.pravatar.cc/150?u=alex",
    name: "Alex Mick",
    description: "Good for everyday use",
    time: "4h ago",
    likes: "667",
    comments: "9",
    duration: "0:45"
  },
  {
    id: 2,
    videoSrc: reviewVideos.danielTasker,
    avatar: "https://i.pravatar.cc/150?u=daniel",
    name: "Daniel Tasker",
    description: "Helps with Plantar Fasciitis",
    time: "16h ago",
    likes: "1.1k",
    comments: "13",
    duration: "1:20"
  },
  {
    id: 3,
    videoSrc: reviewVideos.lewis,
    avatar: "",
    name: "Duong Pham",
    description: "Very comfortable",
    time: "2d ago",
    likes: "3.7k",
    comments: "42",
    duration: "0:55"
  },
  {
    id: 4,
    videoSrc: reviewVideos.victorMon,
    avatar: "https://i.pravatar.cc/150?u=victor",
    name: "Victor Mon",
    description: "Glad I change to these cloud insoles as they help with foot pain",
    time: "5h ago",
    likes: "892",
    comments: "15",
    duration: "1:10"
  },
  {
    id: 5,
    videoSrc: reviewVideos.henryTu,
    avatar: "",
    name: "Henry Tu",
    description: "Great support and comfort",
    time: "1d ago",
    likes: "524",
    comments: "7",
    duration: "0:38"
  },
  {
    id: 6,
    videoSrc: reviewVideos.derek,
    avatar: "",
    name: "Derek",
    description: "Solid support all day",
    time: "3d ago",
    likes: "412",
    comments: "5",
    duration: "0:52"
  },
  {
    id: 7,
    videoSrc: reviewVideos.charlieHart,
    avatar: "",
    name: "Charlie Hart",
    description: "Worth every penny",
    time: "1w ago",
    likes: "638",
    comments: "11",
    duration: "1:05"
  }
];

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

/** Pixel tweak per comfort hotspot (index matches map order); folded into tooltip center before viewport clamp. */
const COMFORT_FEATURE_TOOLTIP_SHIFT_PX: readonly number[] = [2, 0, 0, 4];

/** Regular vs AeroTouch — booleans = passes that criterion */
const DIFFERENCE_COMPARISON_ROWS: {
  emoji: string;
  label: string;
  normalPasses: boolean;
  aerotouchPasses: boolean;
}[] = [
  { emoji: '☁️', label: 'Cushioning and comfort', normalPasses: false, aerotouchPasses: true },
  { emoji: '⚖️', label: 'Pressure relief', normalPasses: false, aerotouchPasses: true },
  { emoji: '🦶', label: 'Arch and heel support', normalPasses: false, aerotouchPasses: true },
  { emoji: '🛡️', label: 'Shock absorption', normalPasses: false, aerotouchPasses: true },
  { emoji: '♾️', label: 'Long-term wearability', normalPasses: false, aerotouchPasses: true },
  { emoji: '☀️', label: 'Suited to daily, all-day wear', normalPasses: false, aerotouchPasses: true },
  { emoji: '💵', label: 'Lowest upfront cost', normalPasses: true, aerotouchPasses: false },
];

const DIFFERENCE_FEATURE_HIGHLIGHTS: { icon: typeof Star; title: string; desc: string }[] = [
  { icon: Star, title: 'Improve Posture', desc: 'Proper arch support promotes better spine alignment.' },
  { icon: Zap, title: 'Boost Performance', desc: 'Adds a spring to each step making walking and running easier.' },
  { icon: Scissors, title: 'Size Adjustable', desc: 'Simply cut along the dotted line with scissors.' },
  { icon: Droplets, title: 'Easily Washable', desc: 'Simply hand wash with soap and water.' },
];

interface ProductTechSpecsProps {
  currentProductId?: string;
  onProductSelect?: (product: Product) => void;
  onNavigateToBlog?: () => void;
}

export const ProductTechSpecs: React.FC<ProductTechSpecsProps> = ({ onNavigateToBlog }) => {
  const [activeFeature, setActiveFeature] = useState(-1);
  const [builtForIndex, setBuiltForIndex] = useState(0);
  const [splitPos, setSplitPos] = useState(50);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false);
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' ? (window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT) : false);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [videoReviewSlideIndex, setVideoReviewSlideIndex] = useState(0);
  const [textReviewSlideIndex, setTextReviewSlideIndex] = useState(0);
  const [visibleRealResultReviews, setVisibleRealResultReviews] = useState(6);
  const splitRef = useRef<HTMLDivElement>(null);
  const comfortInteractiveRef = useRef<HTMLDivElement>(null);
  const comfortTooltipRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [comfortTooltipNudgeX, setComfortTooltipNudgeX] = useState(0);
  const videoReviewRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const videoReviewScrollRef = useRef<HTMLDivElement>(null);
  const videoReviewCardRefs = useRef<(HTMLElement | null)[]>([]);
  const textReviewScrollRef = useRef<HTMLDivElement>(null);
  const textReviewCardRefs = useRef<(HTMLElement | null)[]>([]);
  const TEXT_REVIEW_COUNT = 6;
  const INITIAL_REAL_RESULTS_COUNT = 6;
  const REAL_RESULTS_BATCH_SIZE = 6;
  const REAL_RESULTS_TOTAL_COUNT = 57;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < MOBILE_BREAKPOINT);
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useLayoutEffect(() => {
    const shell = comfortInteractiveRef.current;
    if (activeFeature < 0 || !shell) {
      setComfortTooltipNudgeX(0);
      return;
    }
    const tip = comfortTooltipRefs.current[activeFeature];
    if (!tip) {
      setComfortTooltipNudgeX(0);
      return;
    }

    const measure = () => {
      const s = comfortInteractiveRef.current;
      const t = comfortTooltipRefs.current[activeFeature];
      if (!s || !t) return;
      const wrap = t.parentElement;
      if (!wrap) return;

      const shellRect = s.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      const tipRect = t.getBoundingClientRect();
      const cx = wrapRect.left + wrapRect.width / 2;
      const halfW = tipRect.width / 2;

      const vpPad = 10;
      const shellPad = 12;
      const vw = typeof window.visualViewport !== 'undefined' ? window.visualViewport.width : window.innerWidth;

      const shift = COMFORT_FEATURE_TOOLTIP_SHIFT_PX[activeFeature] ?? 0;
      const rawCenter = cx + shift;

      const minCenter = Math.max(vpPad + halfW, shellRect.left + shellPad + halfW);
      const maxCenter = Math.min(vw - vpPad - halfW, shellRect.right - shellPad - halfW);

      if (minCenter > maxCenter) {
        setComfortTooltipNudgeX(vw / 2 - cx);
        return;
      }

      const clampedCenter = Math.min(Math.max(rawCenter, minCenter), maxCenter);
      setComfortTooltipNudgeX(clampedCenter - cx);
    };

    measure();
    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    ro.observe(shell);
    window.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('resize', measure);
    window.visualViewport?.addEventListener('scroll', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('resize', measure);
      window.visualViewport?.removeEventListener('scroll', measure);
    };
  }, [activeFeature, isMobile]);

  const scrollVideoReviewTo = (index: number) => {
    const i = Math.max(0, Math.min(index, VIDEO_REVIEWS.length - 1));
    setVideoReviewSlideIndex(i);
    const container = videoReviewScrollRef.current;
    const card = videoReviewCardRefs.current[i];
    if (container && card) {
      container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }
  };

  const handleVideoReviewScroll = () => {
    const el = videoReviewScrollRef.current;
    if (!el) return;
    const scrollCenter = el.scrollLeft + el.clientWidth / 2;
    let activeIndex = 0;
    for (let i = 0; i < videoReviewCardRefs.current.length; i++) {
      const card = videoReviewCardRefs.current[i];
      if (!card) continue;
      if (scrollCenter < card.offsetLeft + card.offsetWidth) {
        activeIndex = i;
        break;
      }
      activeIndex = i;
    }
    setVideoReviewSlideIndex(Math.max(0, Math.min(activeIndex, VIDEO_REVIEWS.length - 1)));
  };

  const scrollTextReviewTo = (index: number) => {
    const i = Math.max(0, Math.min(index, TEXT_REVIEW_COUNT - 1));
    setTextReviewSlideIndex(i);
    const container = textReviewScrollRef.current;
    const card = textReviewCardRefs.current[i];
    if (container && card) {
      container.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }
  };

  const handleTextReviewScroll = () => {
    const el = textReviewScrollRef.current;
    if (!el) return;
    const scrollCenter = el.scrollLeft + el.clientWidth / 2;
    let activeIndex = 0;
    for (let i = 0; i < textReviewCardRefs.current.length; i++) {
      const card = textReviewCardRefs.current[i];
      if (!card) continue;
      if (scrollCenter < card.offsetLeft + card.offsetWidth) {
        activeIndex = i;
        break;
      }
      activeIndex = i;
    }
    setTextReviewSlideIndex(Math.max(0, Math.min(activeIndex, TEXT_REVIEW_COUNT - 1)));
  };


  const handleSplitMove = (clientX: number) => {
    if (!splitRef.current) return;
    const rect = splitRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSplitPos((x / rect.width) * 100);
  };

  const onSplitPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleSplitMove(e.clientX);
  };

  const onSplitPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    handleSplitMove(e.clientX);
  };
  const builtForScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = builtForScrollRef.current;
    if (!el) return;
    const cardWidth = 320;
    const gap = 24;
    el.scrollTo({ left: builtForIndex * (cardWidth + gap), behavior: 'smooth' });
  }, [builtForIndex]);

  const features = [
    {
      title: "AeroFoam™ Rebound Core",
      desc: "Dual-layer nitrogen-injected cushioning delivers ultimate comfort and 85% energy return in every step.",
      position: { top: '65%', left: '82%' },  // right (white) insole – middle of heel
      mobilePosition: { top: '65%', left: '82%' },  // mobile: more right
      tabletPosition: { top: '65%', left: '82%' }
    },
    {
      title: "Reinforced Stabilizer",
      desc: "Aerospace-grade cap maintains structure and provides torsional rigidity for maximum stability.",
      position: { top: '28%', left: '59%' },  // swapped with point 4
      mobilePosition: { top: '28%', left: '59%' },
      tabletPosition: { top: '28%', left: '59%' }
    },
    {
      title: "Deep Heel Cradle",
      desc: "Anatomically designed heel cup locks the foot in place and absorbs impact shock.",
      position: { top: '75%', left: '47%' },  // left (orange) insole – heel
      mobilePosition: { top: '75%', left: '47%' },
      tabletPosition: { top: '75%', left: '47%' }
    },
    {
      title: "Moisture-Wicking Top",
      desc: "Antimicrobial fabric keeps feet cool, dry, and blister-free during intense activity.",
      position: { top: '34%', left: '22%' },  // swapped with point 2
      mobilePosition: { top: '34%', left: '22%' },  // mobile: more left
      tabletPosition: { top: '34%', left: '22%' }
    }
  ];

  const nextFeature = () => setActiveFeature((prev) => (prev + 1) % features.length);
  const prevFeature = () => setActiveFeature((prev) => (prev - 1 + features.length) % features.length);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* 1. Engineered Section */}
      <section id="engineered-for-everyone" className="pt-12 pb-20 md:pt-16 md:pb-32 bg-[#f8f9fa] overflow-visible">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Targeted Relief</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 uppercase tracking-tight">ENGINEERED FOR COMFORT</h2>
            <p className="mt-5 text-slate-600 text-lg">
              Click the points below to see how our insoles provide all-day pain relief and support.
            </p>
          </div>

        <div className="relative w-full max-w-[1600px] mx-auto">
          <div
            ref={comfortInteractiveRef}
            className="relative w-full overflow-visible md:px-0 pb-6 md:pb-0"
          >
          {/* The base image */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)] rounded-full blur-3xl"></div>
          </div>
          
          <img 
             src="/images/performance-tech.jpeg" 
             alt="AeroTouch Insole Tech" 
             className="block w-full max-w-full h-auto object-contain rounded-3xl md:rounded-[3rem] border border-slate-100/50 drop-shadow-[0_30px_40px_rgba(0,0,0,0.15)] relative z-10 select-none"
             draggable={false}
          />
          
            {/* Hotspots overlay */}
            {[
              {
                id: "shock",
                title: "Shock Absorbing Base",
                desc: "Reduces fatigue and protects your joints from daily impact.",
                icon: "☁️",
                position: isMobile ? { top: '35%', left: '72%' } : { top: '35%', left: '75%' }, // Heel
              },
              {
                id: "arch",
                title: "Firm Arch Support",
                desc: "Aligns your body naturally to ease chronic back and knee pain.",
                icon: "🦶",
                position: isMobile ? { top: '45%', left: '50%' } : { top: '50%', left: '50%' }, // Arch
              },
              {
                id: "pressure",
                title: "Pressure Relief",
                desc: "Evenly distributes your weight to alleviate foot discomfort.",
                icon: "🩹",
                position: isMobile ? { top: '55%', left: '25%' } : { top: '55%', left: '25%' }, // Metatarsal
              },
              {
                id: "custom",
                title: "Custom Fit",
                desc: "Molds perfectly to your unique foot shape over time.",
                icon: "✨",
                position: isMobile ? { top: '70%', left: '70%' } : { top: '75%', left: '70%' }, // Toe
              }
            ].map((f, i) => (
               <div
                 key={i}
                 className={`absolute ${
                   activeFeature < 0 ? 'z-30' : activeFeature === i ? 'z-50' : 'z-20'
                 }`}
                 style={{ top: f.position.top, left: f.position.left, transform: 'translate(-50%, -50%)' }}
               >
                 {/* Tooltip Card: below hotspot on small screens (except shock); shock above on all sizes */}
                 <div
                   ref={(el) => {
                     comfortTooltipRefs.current[i] = el;
                   }}
                   style={{
                     transform:
                       activeFeature === i
                         ? `translateX(calc(-50% + ${comfortTooltipNudgeX}px)) translateY(0) scale(1)`
                         : f.id === 'shock'
                           ? 'translateX(-50%) translateY(1rem) scale(0.95)'
                           : `translateX(-50%) translateY(${isMobile ? '-0.5rem' : '1rem'}) scale(0.95)`,
                   }}
                   className={`absolute z-40 w-[min(17.5rem,calc(100dvw-1.5rem))] left-1/2 box-border bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-slate-100/50 p-3 sm:p-5 md:p-6 max-h-[min(42dvh,20rem)] flex flex-col min-h-0 transition-[opacity,transform] duration-300 ${
                     f.id === 'shock' ? 'origin-bottom' : 'max-md:origin-top md:origin-bottom'
                   } ${
                     f.id === 'shock'
                       ? 'bottom-[calc(100%+16px)] top-auto mb-2 mt-0'
                       : 'top-[calc(100%+14px)] bottom-auto mt-0 md:bottom-[calc(100%+16px)] md:top-auto md:mb-2 md:mt-0'
                   } ${
                     activeFeature === i ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                   }`}
                 >
                   <div className="text-xl sm:text-3xl mb-2 sm:mb-4 shrink-0">{f.icon}</div>
                   <h4 className="font-bold text-slate-900 text-sm sm:text-[17px] mb-1 sm:mb-2 shrink-0">{f.title}</h4>
                   <p className="text-xs sm:text-[15px] text-slate-600 leading-relaxed font-medium overflow-y-auto overscroll-contain min-h-0 pr-0.5">{f.desc}</p>
                   {/* Triangle: up-caret when tooltip is below hotspot (mobile); down-caret when tooltip is above */}
                   <div
                     className={`absolute bottom-full -translate-x-1/2 mb-[-7px] w-4 h-4 bg-white rotate-45 border-l border-t border-slate-100/50 ${
                       f.id === 'shock' ? 'hidden' : 'block md:hidden'
                     }`}
                     style={{
                       left:
                         activeFeature === i ? `calc(50% - ${comfortTooltipNudgeX}px)` : '50%',
                     }}
                     aria-hidden
                   />
                   <div
                     className={`absolute top-full -translate-x-1/2 -mt-1.5 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100/50 ${
                       f.id === 'shock' ? 'block' : 'hidden md:block'
                     }`}
                     style={{
                       left:
                         activeFeature === i ? `calc(50% - ${comfortTooltipNudgeX}px)` : '50%',
                     }}
                     aria-hidden
                   />
                 </div>

                 {/* Hotspot Button */}
                 <button
                   type="button"
                   onClick={() => setActiveFeature(activeFeature === i ? -1 : i)}
                   className="relative w-14 h-14 min-w-[3.5rem] min-h-[3.5rem] flex items-center justify-center rounded-full group outline-none touch-manipulation [-webkit-tap-highlight-color:transparent]"
                   aria-expanded={activeFeature === i}
                   aria-label={`View ${f.title} details`}
                 >
                   {/* Outer Ping Ring */}
                   <div className={`absolute inset-0 rounded-full border-[2.5px] transition-all duration-300 ${activeFeature === i ? 'border-[#0f3c31] scale-110 bg-[#0f3c31]/10' : 'border-white bg-white/20 group-hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.1)]'}`}></div>
                   {activeFeature !== i && (
                     <div className="absolute inset-0 rounded-full border-[2.5px] border-white animate-ping opacity-40 motion-reduce:animate-none"></div>
                   )}
                   
                   {/* Inner Circle */}
                   <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm pointer-events-none">
                     <span className={`text-[#0f3c31] font-medium text-2xl leading-none transition-transform duration-300 transform ${activeFeature === i ? 'rotate-45' : ''}`}>+</span>
                   </div>
                 </button>
               </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      {/* 2. Specs & Lifestyle Split */}
      <section id="best-for" className="bg-brand-dark text-white grid md:grid-cols-2 min-h-[700px] scroll-mt-24">
         {/* Left: Specs */}
         <div className="p-12 lg:p-24 flex flex-col justify-center bg-brand-dark relative z-10">
            <span className="text-brand-lime font-bold tracking-[0.2em] uppercase text-xs mb-4">Best For</span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-12 leading-none">
                Running, Walking,<br/>Training, Athletic<br/>Shoes
            </h2>

            <div className="space-y-10 max-w-md">
                {/* Spec 1: Arch */}
                <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-4">
                            <Activity className="w-8 h-8 text-brand-gray" />
                            <span className="font-bold text-xs uppercase tracking-widest text-slate-400">Arch Support</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Info className="w-4 h-4 text-slate-500" />
                            <span className="font-bold">Medium - High</span>
                         </div>
                    </div>
                    {/* Visualizer */}
                    <svg viewBox="0 0 100 20" className="w-full h-8 stroke-brand-lime fill-none stroke-[3px]">
                        <path d="M0,20 Q50,-15 100,20" />
                    </svg>
                </div>

                {/* Spec 2: Thickness */}
                <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-4">
                            <Layers className="w-8 h-8 text-brand-gray" />
                            <span className="font-bold text-xs uppercase tracking-widest text-slate-400">Thickness</span>
                         </div>
                         <span className="font-bold">Max</span>
                    </div>
                    {/* Visualizer (Bar Chart style) */}
                    <div className="flex gap-1 h-6">
                        <div className="flex-1 bg-brand-lime"></div>
                        <div className="flex-1 bg-brand-lime"></div>
                        <div className="flex-1 bg-brand-lime"></div>
                        <div className="flex-1 bg-white/10"></div>
                    </div>
                </div>

                 {/* Spec 3: Cushioning */}
                 <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-4">
                            <Zap className="w-8 h-8 text-brand-gray" />
                            <span className="font-bold text-xs uppercase tracking-widest text-slate-400">Cushioning</span>
                         </div>
                         <span className="font-bold">Semi-Firm</span>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                             <div className="absolute left-0 top-0 h-full w-3/4 bg-brand-orange"></div>
                        </div>
                    </div>
                </div>
            </div>
         </div>

         {/* Right: Insole image with tech vibe */}
         <div className="relative h-full min-h-[600px] flex items-center justify-center p-6 lg:p-10 bg-slate-900/50 overflow-hidden">
             {/* Tech grid overlay */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" aria-hidden />
             {/* Corner brackets - tech frame */}
             <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-brand-lime/60" aria-hidden />
             <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-brand-lime/60" aria-hidden />
             <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-brand-lime/60" aria-hidden />
             <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-brand-lime/60" aria-hidden />
             {/* Insole product image */}
             <div className="relative z-10 w-[95%] max-w-[30.4rem] aspect-[5/6] rounded-xl overflow-hidden border border-white/10 bg-slate-800/80 shadow-2xl shadow-black/40 ring-1 ring-brand-lime/20">
                 <img
                   src={sectionImages.bestFor}
                   alt="AeroTouch performance insole — best for running, walking, training, athletic shoes"
                   className="w-full h-full object-contain object-center px-2 py-8 lg:px-3 lg:py-10 mix-blend-lighten scale-y-90"
                 />
                 {/* Subtle scan-line effect */}
                 <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.1)_2px,rgba(255,255,255,0.1)_4px)]" aria-hidden />
                 {/* Spec label badge */}
                 <span className="absolute bottom-4 right-4 px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase text-brand-lime/90 bg-brand-dark/90 border border-brand-lime/30 rounded">
                   Spec
                 </span>
             </div>
             {/* Soft glow behind image */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-[80%] h-[60%] rounded-full bg-brand-lime/5 blur-3xl" aria-hidden />
             </div>
         </div>
      </section>

      {/* 3. The Difference - Redesigned (Blueprint / Tech Lab Style) */}
      <section className="bg-[#0B1120] py-24 border-t border-slate-800 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center mb-16">
                <span className="text-brand-lime font-mono text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1 border border-brand-lime/20 rounded-full bg-brand-lime/5">
                    Competitive Advantage
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                    The AeroTouch Standard
                </h2>
                <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                    We don't rely on marketing fluff. We rely on physics, biomechanics, and material science.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-slate-800">
                {[
                    {
                        icon: <Zap className="w-8 h-8" />,
                        title: "Kinetic Return",
                        desc: "Proprietary foam matrix returns 85% of energy, acting like a springboard for your feet.",
                        idx: "01"
                    },
                    {
                        icon: <ShieldCheck className="w-8 h-8" />,
                        title: "Risk-Free Trial",
                        desc: "60 days to test them. Trim them, run in them. If you don't PR, send them back.",
                        idx: "02"
                    },
                    {
                        icon: <Trophy className="w-8 h-8" />,
                        title: "Pro Validated",
                        desc: "Worn by many athletes and trusted by elite physical therapists.",
                        idx: "03"
                    },
                    {
                        icon: <Globe className="w-8 h-8" />,
                        title: "Impact Mission",
                        desc: "We donate 1% of gross sales to provide prosthetics for athletes in developing nations.",
                        idx: "04"
                    }
                ].map((item, i) => (
                    <div key={i} className="group relative border-r border-b border-slate-800 p-8 md:p-10 transition-colors hover:bg-white/[0.02]">
                        {/* Hover Glow Line */}
                        <div className="absolute top-0 left-0 w-full h-0.5 bg-brand-lime transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        
                        <div className="flex justify-between items-start mb-8">
                            <div className="w-14 h-14 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-brand-lime group-hover:border-brand-lime transition-all duration-300 bg-[#0B1120]">
                                {item.icon}
                            </div>
                            <span className="font-mono text-4xl font-bold text-slate-800 group-hover:text-slate-700 transition-colors select-none">
                                {item.idx}
                            </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-lime transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </section>



      {/* 3.5 REVIEWS SECTION (Dropshipping Style) - Like Walking On Clouds */}
      <section className="pt-24 pb-12 md:pb-16 bg-white border-t border-slate-100 relative">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <div className="flex justify-center items-center gap-1 mb-4">
                    {[...Array(5)].map((_,i) => <Star key={i} className="w-6 h-6 fill-brand-orange text-brand-orange" />)}
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">"Like Walking On Clouds"</h2>
                <p className="text-slate-500 text-lg">Join <span className="font-bold text-slate-900">15,420+ Verified Buyers</span> who have eliminated foot pain.</p>
            </div>
        </div>

        {/* Video Reviews Carousel - Full Width */}
        <div className="mb-10 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Play className="w-5 h-5 text-brand-orange fill-brand-orange" />
                    See It In Action
                    </h3>
                    <div className="flex gap-2">
                    <button type="button" onClick={() => scrollVideoReviewTo(videoReviewSlideIndex - 1)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors" aria-label="Previous reviews">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={() => scrollVideoReviewTo(videoReviewSlideIndex + 1)} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors" aria-label="Next reviews">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    </div>
                </div>
            </div>

            <div
              ref={videoReviewScrollRef}
              onScroll={handleVideoReviewScroll}
              className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide px-4 md:px-12 lg:px-24 snap-x snap-mandatory"
            >
            {VIDEO_REVIEWS.map((video, index) => (
                <article
                  key={video.id}
                  ref={(el) => { videoReviewCardRefs.current[index] = el; }}
                  className="flex-shrink-0 w-[300px] md:w-[340px] bg-white rounded-lg border border-[#dddfe2] shadow-[0_1px_2px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col group snap-start"
                >
                    {/* FB Header */}
                    <div className="px-3 pt-3 pb-2 flex items-start gap-2.5">
                        <a href="#" className="flex-shrink-0">
                            {video.avatar ? (
                                <img src={video.avatar} alt={video.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" aria-hidden />
                            )}
                        </a>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <a href="#" className="text-[15px] font-semibold text-[#050505] hover:underline leading-tight">{video.name}</a>
                                <BadgeCheck className="w-3.5 h-3.5 flex-shrink-0 text-[#1877F2]" aria-label="Verified" />
                            </div>
                            <div className="flex items-center gap-1 text-[13px] text-[#65676B] leading-tight mt-0.5">
                                <span>{video.time}</span>
                                <span>·</span>
                                <Globe className="w-3 h-3 text-[#65676B]" />
                            </div>
                        </div>
                        <button type="button" className="p-1 rounded-full hover:bg-[#f0f2f5] text-[#65676B] transition-colors mt-0.5" aria-label="More">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Post text - subtle lift on hover like Categories */}
                    <div className="px-3 pb-2">
                        <p className="text-[15px] text-[#050505] leading-[1.3333] translate-y-0 group-hover:-translate-y-0.5 transition-all duration-300">{video.description}</p>
                    </div>

                    {/* Video — edge-to-edge, no rounding */}
                    <div
                      className="relative aspect-[4/5] overflow-hidden bg-black cursor-pointer"
                      onClick={() => {
                        const el = videoReviewRefs.current[video.id];
                        if (!el) return;
                        if (playingVideoId === video.id) {
                          el.pause();
                          setPlayingVideoId(null);
                        } else {
                          Object.values(videoReviewRefs.current).forEach((v: HTMLVideoElement | null) => { v?.pause(); });
                          el.play().then(() => setPlayingVideoId(video.id)).catch(() => {});
                        }
                      }}
                    >
                        <video
                            ref={(el) => { videoReviewRefs.current[video.id] = el; }}
                            src={video.videoSrc}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            playsInline
                            muted={video.id === 3 || video.id === 5}
                            loop={false}
                            onEnded={() => setPlayingVideoId(null)}
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-opacity duration-300 pointer-events-none" />

                        {/* Play button — hide when this video is playing */}
                        {playingVideoId !== video.id && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 rounded-full bg-brand-orange/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300 delay-75">
                                <Play className="w-7 h-7 fill-current ml-1" />
                            </div>
                          </div>
                        )}

                        {/* Duration */}
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-[13px] font-semibold px-2 py-0.5 rounded pointer-events-none">
                            {video.duration}
                        </div>
                    </div>

                    {/* Reaction summary row */}
                    <div className="px-3 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <div className="flex -space-x-1">
                                <span className="w-[18px] h-[18px] rounded-full bg-[#1877F2] flex items-center justify-center border-[1.5px] border-white z-[3]">
                                    <ThumbsUp className="w-2.5 h-2.5 text-white fill-current" />
                                </span>
                                <span className="w-[18px] h-[18px] rounded-full bg-[#F33E58] flex items-center justify-center border-[1.5px] border-white z-[2]">
                                    <Heart className="w-2.5 h-2.5 text-white fill-current" />
                                </span>
                                <span className="w-[18px] h-[18px] rounded-full bg-[#F7B928] flex items-center justify-center border-[1.5px] border-white z-[1]">
                                    <Smile className="w-2.5 h-2.5 text-white" />
                                </span>
                            </div>
                            <span className="text-[15px] text-[#65676B]">{video.likes}</span>
                        </div>
                        <button type="button" className="text-[15px] text-[#65676B] hover:underline">{video.comments} Comments</button>
                    </div>

                    {/* Divider */}
                    <div className="mx-3 border-t border-[#dddfe2]" />

                    {/* Action bar */}
                    <div className="px-1 py-1 grid grid-cols-3">
                        <button type="button" className="flex items-center justify-center gap-1.5 py-2 rounded-md hover:bg-[#f0f2f5] text-[#65676B] transition-colors">
                            <ThumbsUp className="w-[18px] h-[18px]" />
                            <span className="text-[15px] font-semibold">Like</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-1.5 py-2 rounded-md hover:bg-[#f0f2f5] text-[#65676B] transition-colors">
                            <MessageSquare className="w-[18px] h-[18px]" />
                            <span className="text-[15px] font-semibold">Comment</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-1.5 py-2 rounded-md hover:bg-[#f0f2f5] text-[#65676B] transition-colors">
                            <Share2 className="w-[18px] h-[18px]" />
                            <span className="text-[15px] font-semibold">Share</span>
                        </button>
                    </div>
                </article>
            ))}
            </div>

            {/* Carousel dots (5 dots) - same style as Categories */}
            <div className="flex justify-center gap-2 mt-6 pb-2" aria-hidden>
              {[...Array(5)].map((_, dotIndex) => {
                const slideForDot = VIDEO_REVIEWS.length <= 1 ? 0 : Math.round((dotIndex / 4) * (VIDEO_REVIEWS.length - 1));
                const isActive = VIDEO_REVIEWS.length <= 1 ? dotIndex === 0 : Math.round((videoReviewSlideIndex / (VIDEO_REVIEWS.length - 1)) * 4) === dotIndex;
                return (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => scrollVideoReviewTo(slideForDot)}
                    className={`h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 ${
                      isActive ? 'w-6 bg-brand-lime' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                    aria-current={isActive ? 'true' : undefined}
                  />
                );
              })}
            </div>
        </div>

        <div className="w-full overflow-hidden">
            <div
              ref={textReviewScrollRef}
              onScroll={handleTextReviewScroll}
              className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-4 md:px-12 lg:px-24 snap-x snap-mandatory"
            >
                {/* Review 1 – Michael T. */}
                <div ref={(el) => { textReviewCardRefs.current[0] = el; }} className="flex-shrink-0 w-[min(100%,367px)] md:w-[389px] snap-center bg-white p-7 rounded-2xl border border-slate-200 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3">
                        <img src={reviewAvatars.michaelT} alt="Michael T." className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-900 text-xs">Michael T.</span>
                                <BadgeCheck className="w-3 h-3 text-emerald-500" />
                            </div>
                            <span className="text-[10px] text-slate-400">Verified Buyer · 2 days ago</span>
                        </div>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-2.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />)}
                    </div>
                    {/* Title & body */}
                    <h3 className="font-bold text-slate-900 text-sm mb-2">Instantly cured my plantar fasciitis</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-4 flex-grow line-clamp-3">
                        "I've tried everything. Custom orthotics ($400), Dr. Scholls, Superfeet. Nothing worked like these. The moment I put them in, the heel pain vanished. I'm back to running 20 miles a week."
                    </p>
                    {/* Photo */}
                    <div className="rounded-md overflow-hidden aspect-[5/4] mb-0">
                        <img src={reviewPhotos.michaelT} className="w-full h-full object-cover" alt="Michael T." />
                    </div>
                </div>

                {/* Review 2 – Sarah J. */}
                <div ref={(el) => { textReviewCardRefs.current[1] = el; }} className="flex-shrink-0 w-[min(100%,367px)] md:w-[389px] snap-center bg-white p-7 rounded-2xl border border-slate-200 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <img src={reviewAvatars.sarahJ} alt="Sarah J." className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-900 text-xs">Sarah J.</span>
                                <BadgeCheck className="w-3 h-3 text-emerald-500" />
                            </div>
                            <span className="text-[10px] text-slate-400">Verified Buyer · 1 week ago</span>
                        </div>
                    </div>
                    <div className="flex gap-0.5 mb-2.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">Better than my $500 customs</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-4 flex-grow line-clamp-3">
                        "My podiatrist recommended these as a cheaper alternative to a second pair of customs. Honestly? I prefer these. They have more 'pop' and energy return. Perfect for my morning rotation."
                    </p>
                    {/* Photo */}
                    <div className="rounded-md overflow-hidden aspect-[5/4] mb-0">
                        <img src={reviewPhotos.sarahJ} className="w-full h-full object-cover" alt="Sarah J." />
                    </div>
                </div>

                {/* Review 3 – Emma W. */}
                <div ref={(el) => { textReviewCardRefs.current[2] = el; }} className="flex-shrink-0 w-[min(100%,367px)] md:w-[389px] snap-center bg-white p-7 rounded-2xl border border-slate-200 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <img src={reviewAvatars.emmaW} alt="Emma W." className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-900 text-xs">Emma W.</span>
                                <BadgeCheck className="w-3 h-3 text-emerald-500" />
                            </div>
                            <span className="text-[10px] text-slate-400">Verified Buyer · 5 days ago</span>
                        </div>
                    </div>
                    <div className="flex gap-0.5 mb-2.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">No more morning heel pain</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-4 flex-grow line-clamp-3">
                        "First steps out of bed used to be agony. With these insoles, I can actually walk normally from the moment I get up. Life-changing for my plantar fasciitis."
                    </p>
                    <div className="rounded-md overflow-hidden aspect-[5/4] mb-0">
                        <img src={reviewPhotos.emmaW} className="w-full h-full object-cover" alt="Emma W." />
                    </div>
                </div>

                {/* Review 4 – Marcus T. */}
                <div ref={(el) => { textReviewCardRefs.current[3] = el; }} className="flex-shrink-0 w-[min(100%,367px)] md:w-[389px] snap-center bg-white p-7 rounded-2xl border border-slate-200 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <img src={reviewAvatars.marcusT} alt="Marcus T." className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-900 text-xs">Marcus T.</span>
                                <BadgeCheck className="w-3 h-3 text-emerald-500" />
                            </div>
                            <span className="text-[10px] text-slate-400">Verified Buyer · 1 week ago</span>
                        </div>
                    </div>
                    <div className="flex gap-0.5 mb-2.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">Best support I've ever had</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-4 flex-grow line-clamp-3">
                        "I'm a mail carrier and walk 10+ miles daily. These insoles have held up better than any others and my feet don't ache at the end of the day anymore."
                    </p>
                    <div className="rounded-md overflow-hidden aspect-[5/4] mb-0">
                        <img src={reviewPhotos.marcusT} className="w-full h-full object-cover" alt="Marcus T." />
                    </div>
                </div>

                {/* Review 5 – Nicole P. */}
                <div ref={(el) => { textReviewCardRefs.current[4] = el; }} className="flex-shrink-0 w-[min(100%,367px)] md:w-[389px] snap-center bg-white p-7 rounded-2xl border border-slate-200 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <img src={reviewAvatars.nicoleP} alt="Nicole P." className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-900 text-xs">Nicole P.</span>
                                <BadgeCheck className="w-3 h-3 text-emerald-500" />
                            </div>
                            <span className="text-[10px] text-slate-400">Verified Buyer · 3 days ago</span>
                        </div>
                    </div>
                    <div className="flex gap-0.5 mb-2.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">Finally comfortable at work</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-4 flex-grow line-clamp-3">
                        "I stand behind a counter all day. My feet used to swell and hurt by noon. With AeroTouch I make it through my shift without thinking about my feet once."
                    </p>
                    <div className="rounded-md overflow-hidden aspect-[5/4] mb-0">
                        <img src={reviewPhotos.nicoleP} className="w-full h-full object-cover" alt="Nicole P." />
                    </div>
                </div>

                {/* Review 6 – David K. */}
                <div ref={(el) => { textReviewCardRefs.current[5] = el; }} className="flex-shrink-0 w-[min(100%,367px)] md:w-[389px] snap-center bg-white p-7 rounded-2xl border border-slate-200 flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <img src={reviewAvatars.davidK} alt="David K." className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                                <span className="font-bold text-slate-900 text-xs">David K.</span>
                                <BadgeCheck className="w-3 h-3 text-emerald-500" />
                            </div>
                            <span className="text-[10px] text-slate-400">Verified Buyer · 2 weeks ago</span>
                        </div>
                    </div>
                    <div className="flex gap-0.5 mb-2.5">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />)}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">Worth every penny</h3>
                    <p className="text-slate-600 text-[11px] leading-relaxed mb-4 flex-grow line-clamp-3">
                        "Tried cheap drugstore insoles for years. These are in a different league. The arch support is perfect and they've lasted months with no wear. Highly recommend."
                    </p>
                    <div className="rounded-md overflow-hidden aspect-[5/4] mb-0">
                        <img src={reviewPhotos.davidK} className="w-full h-full object-cover" alt="David K." />
                    </div>
                </div>

            </div>

            {/* Carousel dots for text reviews - same style as Categories */}
            <div className="flex justify-center gap-2 mt-6 pb-2" aria-hidden>
              {[...Array(TEXT_REVIEW_COUNT)].map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTextReviewTo(index)}
                  className={`h-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 ${
                    index === textReviewSlideIndex ? 'w-6 bg-brand-lime' : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                  aria-current={index === textReviewSlideIndex ? 'true' : undefined}
                />
              ))}
            </div>
        </div>
      </section>

      {/* 3.6 Benefits Grid + Promo strip */}
      <section className="bg-[#f8f9fa] border-t border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-12 md:gap-y-16 text-center">
            {[
              {
                icon: '🦶',
                title: 'Foot pain relief',
                desc: 'Arch support and cushioning foam alleviate Plantar Fasciitis, Metatarsalgia, and general pain'
              },
              {
                icon: '🙌',
                title: 'Knee, back, & hip pain reduction',
                desc: 'End overpronation and align your body to ease chronic pain'
              },
              {
                icon: '☁️',
                title: 'All day comfort',
                desc: 'Perfect for long shifts; stand or walk for hours, pain-free.'
              },
              {
                icon: '💸',
                title: 'No more expensive orthotics',
                desc: 'Custom arch support at a fraction of the price'
              },
              {
                icon: '👟',
                title: 'Upgrade any shoe',
                desc: 'Integrating proper support into your daily routine is a critical component of overall wellness.'
              },
              {
                icon: '🏃',
                title: 'Reduce fatigue & protect joints',
                desc: 'Shock absorbing materials means less stress on your body and more energy throughout the day.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-[4.5rem] h-[4.5rem] bg-white rounded-full flex items-center justify-center text-[2rem] mb-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                  <span aria-hidden="true">{item.icon}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Promo marquee strip */}
        <div className="py-3.5 overflow-hidden border-t border-[#a5c918]" style={{ backgroundColor: '#C1F11D' }}>
          <div className="flex animate-marquee whitespace-nowrap w-max" style={{ willChange: 'transform' }}>
            {[...Array(2)].map((_, copy) => (
              <div key={copy} className="flex items-center gap-8 md:gap-12 px-8 md:px-12">
                <span className="flex items-center gap-2 text-brand-dark text-xs font-bold uppercase tracking-wider">
                  <span className="text-base" aria-hidden>🛡️</span>
                  60-day money-back guarantee
                </span>
                <span className="flex items-center gap-2 text-brand-dark text-xs font-bold uppercase tracking-wider">
                  <span className="text-base" aria-hidden>🌍</span>
                  Global shipping
                </span>
                <span className="flex items-center gap-2 text-brand-dark text-xs font-bold uppercase tracking-wider">
                  <span className="text-base" aria-hidden>✈️</span>
                  Tracked insured shipping
                </span>
                <span className="flex items-center gap-2 text-brand-dark text-xs font-bold uppercase tracking-wider">
                  <span className="text-base" aria-hidden>😊</span>
                  10,000+ Happy Customer
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The AeroTouch Difference – Interactive slider + Benefits */}
      <section className="bg-white border-t border-slate-100 py-20 md:py-28 scroll-mt-8">
        <div className="container mx-auto px-4 sm:px-5 md:px-6">
          {/* Top row: interactive split image + headline */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14 lg:gap-16 items-start md:items-center mb-16 md:mb-20">
            {/* Left – interactive before/after slider (labels in flow so they never overlap the image awkwardly) */}
            <div className="w-full max-w-md mx-auto md:max-w-none md:mx-0 min-w-0 flex flex-col gap-2 select-none">
              <p className="text-center text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-slate-500 max-w-[min(100%,28rem)] mx-auto w-full">
                Drag to Compare
              </p>

              <div
                ref={splitRef}
                className="relative w-full max-w-[min(100%,28rem)] mx-auto rounded-2xl overflow-hidden bg-white border border-slate-200/90 aspect-[4/5] cursor-ew-resize touch-none isolate"
                onPointerDown={onSplitPointerDown}
                onPointerMove={onSplitPointerMove}
              >
                {/* "Normal" side – base layer (full image) */}
                <img
                  src={sectionImages.section2}
                  alt="Normal shoe insoles"
                  className="absolute inset-0 z-0 w-full h-full object-cover object-center pointer-events-none"
                  draggable={false}
                />
                {/* "AeroTouch" side – clipped overlay (same geometry as base; no inline offset) */}
                <img
                  src={sectionImages.section3}
                  alt="AeroTouch insoles"
                  className="absolute inset-0 z-[1] w-full h-full object-cover object-center pointer-events-none"
                  draggable={false}
                  style={{ clipPath: `inset(0 0 0 ${splitPos}%)` }}
                />

                {splitPos > 15 && (
                  <span className="absolute top-3 left-3 z-[4] pointer-events-none inline-flex bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm">
                    Normal
                  </span>
                )}
                {splitPos < 85 && (
                  <span className="absolute top-3 right-3 z-[4] pointer-events-none inline-flex bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md shadow-sm">
                    AeroTouch
                  </span>
                )}

                {/* Divider line */}
                <div
                  className="absolute inset-y-0 z-[5] w-0.5 bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.06)] pointer-events-none"
                  style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
                />
                {/* Drag handle */}
                <div
                  className="absolute top-1/2 z-[6] w-10 h-10 rounded-full bg-white border-2 border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.22)] flex items-center justify-center pointer-events-none"
                  style={{ left: `${splitPos}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <ArrowLeftRight className="w-4 h-4 text-slate-900" aria-hidden />
                </div>
              </div>
            </div>

            {/* Right – headline & feature highlights */}
            <div className="min-w-0 pt-2 md:pt-0 w-full">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6 md:mb-8">
                The AeroTouch <span className="text-brand-orange">Difference</span>
              </h2>
              <div className="w-full max-w-xl lg:max-w-2xl mx-auto md:mx-0">
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-9 md:gap-x-8">
                  {DIFFERENCE_FEATURE_HIGHLIGHTS.map((item) => (
                    <div key={item.title} className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-6 h-6 text-brand-orange" />
                      </div>
                      <h3 className="font-black text-slate-900 text-base mb-2">{item.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Normal vs AeroTouch comparison table */}
          <div className="max-w-5xl mx-auto w-full pt-8 md:pt-12 mt-2 md:mt-0 border-t border-slate-100/80">
            <h3 className="text-center text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-5 md:mb-7 px-2 leading-tight max-w-2xl mx-auto">
              Stop guessing—see how <span className="text-brand-orange">AeroTouch Cloud Foam</span> stacks up against ordinary insoles
            </h3>
            <div className="w-full -mx-1 sm:mx-0">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-900/5">
                <table className="w-full min-w-[300px] text-left text-sm">
                  <caption className="sr-only">
                    Comparison of normal insoles versus AeroTouch Cloud Foam insoles on cushioning, support, durability, and cost
                  </caption>
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th scope="col" className="py-3.5 pl-4 pr-2 font-bold text-slate-900 sm:py-4 sm:pl-5">
                        Feature
                      </th>
                      <th scope="col" className="px-2 py-3.5 text-center text-xs font-bold uppercase tracking-wide text-slate-600 sm:px-3 sm:py-4 sm:text-sm sm:normal-case sm:tracking-normal">
                        <span className="hidden sm:inline">Normal insoles</span>
                        <span className="sm:hidden">Normal</span>
                      </th>
                      <th scope="col" className="px-2 py-3.5 pr-4 text-center text-xs font-bold uppercase tracking-wide text-slate-900 sm:px-3 sm:py-4 sm:text-sm sm:normal-case sm:tracking-normal">
                        <span className="hidden md:inline">AeroTouch Cloud Foam</span>
                        <span className="md:hidden">AeroTouch</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {DIFFERENCE_COMPARISON_ROWS.map((row) => (
                      <tr key={row.label} className="bg-white">
                        <th
                          scope="row"
                          className="max-w-[11rem] py-3 pl-4 pr-2 font-medium text-slate-800 sm:max-w-none sm:py-3.5 sm:pl-5 sm:text-[15px] text-left align-middle"
                        >
                          <span className="inline-flex items-center gap-2">
                            <span className="text-[1.125rem] leading-none shrink-0 select-none" aria-hidden="true">
                              {row.emoji}
                            </span>
                            <span>{row.label}</span>
                          </span>
                        </th>
                        <td className="px-2 py-3 text-center sm:px-3 sm:py-3.5">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 sm:h-9 sm:w-9">
                            {row.normalPasses ? (
                              <Check className="h-4 w-4 text-emerald-600 sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} aria-hidden />
                            ) : (
                              <X className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} aria-hidden />
                            )}
                          </span>
                          <span className="sr-only">{row.normalPasses ? 'Yes' : 'No'}</span>
                        </td>
                        <td className="px-2 py-3 pr-4 text-center sm:px-3 sm:py-3.5">
                          <span
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9 ${
                              row.aerotouchPasses ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {row.aerotouchPasses ? (
                              <Check className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.5} aria-hidden />
                            ) : (
                              <X className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.25} aria-hidden />
                            )}
                          </span>
                          <span className="sr-only">{row.aerotouchPasses ? 'Yes' : 'No'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-500 sm:text-sm max-w-3xl">
                Foam pads often cost less upfront but flatten quickly. AeroTouch is built for lasting support—many wearers find the cost per month of use lower than replacing cheap inserts.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Expert Recommendation Section */}
      <section className="bg-slate-50 py-20 border-t border-slate-100 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] relative">
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-lime/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              <div className="grid lg:grid-cols-2 lg:items-center">
                
                {/* Expert Photo */}
                <div className="relative h-[400px] lg:h-full min-h-[500px]">
                  <img 
                    src={sectionImages.drCatherineAris} 
                    alt="Dr. Catherine Aris" 
                    className="absolute inset-0 w-full h-full object-cover object-[45%_65%] lg:object-[45%_18%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent lg:hidden" />
                  <div className="absolute bottom-8 left-8 right-8 lg:hidden">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl">
                      <p className="font-black text-slate-900 uppercase tracking-tight">Dr. Catherine Aris</p>
                      <p className="text-xs font-bold text-brand-orange uppercase tracking-widest">DPT, Senior Orthopedic Specialist</p>
                    </div>
                  </div>
                  
                  {/* Floating Badge */}
                  <div className="absolute top-8 left-8 bg-white py-3 px-5 rounded-full shadow-2xl flex items-center gap-3 animate-bounce-slow">
                    <div className="w-10 h-10 rounded-full bg-brand-lime flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6 text-brand-dark" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 leading-none">Status</p>
                      <p className="text-sm font-black text-slate-900 uppercase">Expert Endorsed</p>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 md:p-12 lg:p-16 relative">
                  <Quote className="w-16 h-16 text-brand-orange/10 absolute top-8 right-12" />
                  
                  <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-8">
                    <Award className="w-4 h-4" />
                    Medical Recommendation
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-8">
                    "The most effective non-invasive solution for <span className="text-brand-orange">Plantar Fasciitis</span> I've encountered in 15 years."
                  </h3>

                  <div className="space-y-6 text-slate-600 leading-relaxed mb-10">
                    <p>
                      As a physical therapist specializing in sports medicine, I see hundreds of patients struggling with chronic foot pain. Most generic insoles offer minimal support that collapses within weeks.
                    </p>
                    <p className="font-bold text-slate-800">
                      AeroTouch is different. The dual-layer cushioning and structured arch support provide the exact biomechanical alignment needed to offload the plantar fascia and promote genuine healing.
                    </p>
                  </div>

                  <div className="hidden lg:block border-t border-slate-100 pt-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-black text-slate-900 uppercase tracking-tight">Dr. Catherine Aris</p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">DPT, Senior Orthopedic Specialist</p>
                      </div>
                      <div className="text-slate-200">
                         {/* Placeholder for Signature-like font if available, or just icon */}
                         <div className="flex items-center gap-2 grayscale opacity-50">
                            <Shield className="w-8 h-8" />
                            <div className="h-0.5 w-16 bg-slate-200" />
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-10 flex flex-wrap gap-6 border-t lg:border-none border-slate-100 pt-10 lg:pt-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                        <BadgeCheck className="w-6 h-6 text-brand-orange" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Clinically<br/>Tested</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-brand-orange" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Orthopedic<br/>Approved</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>


      {/* More Customer Reviews Section */}
      <section className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">Real Results from Real People</h2>
              <p className="text-slate-500 font-medium text-lg">Join 10,000+ happy customers who found relief with AeroTouch.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  name: "Emily Jenkins",
                  role: "Avid Runner",
                  image: reviewPhotos.sarahJenkins,
                  rating: 5,
                  title: "Life Changing!",
                  content: "I've been suffering from plantar fasciitis for years. These insoles are the only thing that allowed me to get back to running without pain. The support is incredible.",
                  date: "2 days ago"
                },
                {
                  id: 2,
                  name: "Michael Chen",
                  role: "Warehouse Manager",
                  image: reviewPhotos.michaelChen,
                  rating: 5,
                  title: "8 Hours on my feet",
                  content: "I spend 8-10 hours a day on concrete floors. My feet used to be throbbing by noon. Since switching to AeroTouch, I feel like I'm walking on clouds all day.",
                  date: "5 days ago"
                },
                {
                  id: 3,
                  name: "Hung Nguyen",
                  role: "Sunday League Player",
                  image: reviewPhotos.hungNguyen,
                  rating: 5,
                  title: "Better than custom!",
                  content: "I used to pay $400 for custom orthotics. These perform just as well, if not better, for a fraction of the price. My back and knee pain has practically vanished.",
                  date: "1 week ago"
                },
                {
                  id: 4,
                  name: "James Rodriguez",
                  role: "Fitness Coach",
                  image: reviewPhotos.jamesR,
                  rating: 5,
                  title: "Unbeatable Support",
                  content: "The stability these add to my cross-training is unmatched. My ankles feel secure and the energy return is noticeable. Every athlete needs a pair.",
                  date: "1 week ago"
                },
                {
                  id: 5,
                  name: "Lisa Thompson",
                  role: "Teacher",
                  image: reviewPhotos.lisaThompson,
                  rating: 5,
                  title: "Finally, relief!",
                  content: "I've tried every brand out there. These are the only ones that actually fit my high arches properly without feeling bulky. Truly a game changer for my daily walks.",
                  date: "2 weeks ago"
                },
                {
                  id: 6,
                  name: "David Miller",
                  role: "Hiking Enthusiast",
                  image: reviewPhotos.davidMiller,
                  rating: 5,
                  title: "Perfect for boots",
                  content: "Slipped these into my hiking boots and just finished a 10-mile trek. Usually my heels are killing me by mile 5, but today was painless. Best investment ever.",
                  date: "2 weeks ago"
                },
                {
                  id: 7,
                  name: "James Carter",
                  role: "Nurse",
                  image: reviewPhotos.sarahJenkins,
                  rating: 5,
                  title: "Shift saver",
                  content: "I'm on my feet for 12-hour shifts and these insoles have been a game changer. My feet no longer ache by the end of the day. Highly recommend to any healthcare worker!",
                  date: "3 days ago"
                },
                {
                  id: 8,
                  name: "Maria Lopez",
                  role: "Teacher",
                  image: reviewPhotos.michaelChen,
                  rating: 5,
                  title: "Less fatigue all day",
                  content: "Standing at the whiteboard all day used to leave my feet throbbing. Since switching to these insoles, I barely notice any fatigue. My students probably wonder why I'm so much more energetic now!",
                  date: "4 days ago"
                },
                {
                  id: 9,
                  name: "David Kim",
                  role: "Chef",
                  image: reviewPhotos.hungNguyen,
                  rating: 5,
                  title: "Kitchen approved",
                  content: "Working in a kitchen means constant standing on hard floors. These insoles provide incredible cushioning and arch support. Best investment I've made for my comfort at work.",
                  date: "6 days ago"
                },
                {
                  id: 10,
                  name: "Queenie Hong",
                  role: "School Teacher",
                  image: reviewAvatars.queenieHong,
                  rating: 4,
                  title: "Keeps me going through the school day",
                  content: "I'm standing and walking the classroom six periods a day, plus playground duty — my heels used to ache by afternoon. These insoles make such a difference: my heels feel supported and I'm not drained when the bell rings.",
                  date: "1 week ago"
                },
                {
                  id: 11,
                  name: "Tom Nguyen",
                  role: "Police Officer",
                  image: reviewPhotos.lisaThompson,
                  rating: 5,
                  title: "Built for long patrols",
                  content: "During long patrols and foot beats, comfort is everything. These insoles keep my feet fresh even on the longest shifts. Solid build quality too - they've held up well after months of heavy use.",
                  date: "1 week ago"
                },
                {
                  id: 12,
                  name: "Linda Brown",
                  role: "Hair Stylist",
                  image: reviewPhotos.davidMiller,
                  rating: 5,
                  title: "Back and feet feel better",
                  content: "I stand behind the chair all day and my lower back used to suffer. These insoles improved my posture noticeably and the back pain has mostly gone. Absolutely worth every cent.",
                  date: "2 weeks ago"
                },
                {
                  id: 13,
                  name: "Carlos Rivera",
                  role: "Warehouse Worker",
                  image: reviewPhotos.sarahJenkins,
                  rating: 5,
                  title: "Built for hard floors",
                  content: "Moving packages all day on concrete is brutal without proper support. These insoles absorbed the shock beautifully. My coworkers saw the difference and several have ordered their own pairs!",
                  date: "2 days ago"
                },
                {
                  id: 14,
                  name: "Emily Zhang",
                  role: "Dental Hygienist",
                  image: reviewPhotos.michaelChen,
                  rating: 5,
                  title: "Comfort through long shifts",
                  content: "Leaning over patients for hours puts strain on your whole body. Having proper arch support from these insoles has helped reduce the fatigue I feel in my legs. Very impressed.",
                  date: "3 days ago"
                },
                {
                  id: 15,
                  name: "Mark Thompson",
                  role: "Firefighter",
                  image: reviewPhotos.hungNguyen,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Our boots are heavy and we're on our feet constantly during calls and training. These insoles fit perfectly and provide excellent stability. My feet feel far less fatigued after a 24-hour shift.",
                  date: "4 days ago"
                },
                {
                  id: 16,
                  name: "Jessica Patel",
                  role: "Flight Attendant",
                  image: reviewPhotos.jamesR,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Walking thousands of steps per flight used to destroy my feet. These insoles fit right in my work shoes and the cushioning is phenomenal. I no longer dread long-haul flights!",
                  date: "5 days ago"
                },
                {
                  id: 17,
                  name: "Brian O'Connor",
                  role: "Construction Worker",
                  image: reviewPhotos.lisaThompson,
                  rating: 4,
                  title: "Built for hard floors",
                  content: "Spending all day on uneven terrain and hard surfaces, I needed real support. These insoles delivered. My knees and ankles feel much better since I started using them.",
                  date: "6 days ago"
                },
                {
                  id: 18,
                  name: "Angela Torres",
                  role: "Pharmacist",
                  image: reviewPhotos.davidMiller,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Standing behind the dispensing counter for hours is tough. These insoles provide the perfect balance of cushioning and arch support. I recommended them to my entire team.",
                  date: "1 week ago"
                },
                {
                  id: 19,
                  name: "Kevin Pham",
                  role: "Security Guard",
                  image: reviewPhotos.sarahJenkins,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Walking and standing for an 8-hour shift used to leave my feet in pain. Now I barely notice any discomfort. These insoles are excellent value and have genuinely improved my workday.",
                  date: "2 weeks ago"
                },
                {
                  id: 20,
                  name: "Natalie Owens",
                  role: "Veterinarian",
                  image: reviewPhotos.michaelChen,
                  rating: 5,
                  title: "Comfort through long shifts",
                  content: "Between surgeries and consultations I'm on my feet all day. These insoles keep me comfortable and focused. The anti-fatigue design is real - I feel a genuine difference by end of day.",
                  date: "2 days ago"
                },
                {
                  id: 21,
                  name: "Ryan Henderson",
                  role: "Mail Carrier",
                  image: reviewPhotos.hungNguyen,
                  rating: 5,
                  title: "Reliable daily comfort",
                  content: "Walking 10+ miles a day means your insoles need to be tough and comfortable. These checked every box. My feet feel great even on the longest routes - absolutely essential gear.",
                  date: "3 days ago"
                },
                {
                  id: 22,
                  name: "Michelle Park",
                  role: "Barista",
                  image: reviewPhotos.jamesR,
                  rating: 4,
                  title: "Great for busy days",
                  content: "Standing on tile floors during a busy cafe shift used to wear me out. These insoles add just the right cushion and support. My feet thank me every morning I put them in.",
                  date: "4 days ago"
                },
                {
                  id: 23,
                  name: "Derek Williams",
                  role: "Plumber",
                  image: reviewPhotos.lisaThompson,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Kneeling and standing on hard floors all day puts a lot of strain on your body. These insoles have reduced the foot fatigue significantly. Tough, durable, and genuinely effective.",
                  date: "5 days ago"
                },
                {
                  id: 24,
                  name: "Sandra Lee",
                  role: "Physical Therapist",
                  image: reviewPhotos.davidMiller,
                  rating: 5,
                  title: "Comfort through long shifts",
                  content: "I treat patients with foot pain all day, so I know how important good insoles are! These are the real deal - excellent arch support, great cushioning, and they fit well in clinical footwear.",
                  date: "6 days ago"
                },
                {
                  id: 25,
                  name: "Aaron Flores",
                  role: "Electrician",
                  image: reviewPhotos.sarahJenkins,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Working on job sites all day in steel-toed boots can be rough. These insoles transformed the experience - my feet stay comfortable even during the longest days on site.",
                  date: "1 week ago"
                },
                {
                  id: 26,
                  name: "Rachel Brooks",
                  role: "Event Coordinator",
                  image: reviewPhotos.michaelChen,
                  rating: 4,
                  title: "Excellent comfort and support",
                  content: "Running around venues all day for events is exhausting on the feet. These insoles provided great support and I made it through a 14-hour wedding day without any foot pain. Amazing!",
                  date: "2 weeks ago"
                },
                {
                  id: 27,
                  name: "Jason Murray",
                  role: "Bus Driver",
                  image: reviewPhotos.hungNguyen,
                  rating: 5,
                  title: "Reliable daily comfort",
                  content: "Even seated roles involve a lot of foot engagement and long hours. On my breaks when I walk around, my feet feel supported and fresh. These insoles are an underrated comfort upgrade.",
                  date: "2 days ago"
                },
                {
                  id: 28,
                  name: "Tiffany Grant",
                  role: "Personal Trainer",
                  image: reviewPhotos.jamesR,
                  rating: 5,
                  title: "Support you can feel",
                  content: "Demonstrating exercises and being on my feet all day in the gym demands quality insoles. These deliver on cushioning and stability. My clients have started asking what brand they are!",
                  date: "3 days ago"
                },
                {
                  id: 29,
                  name: "Patrick Sullivan",
                  role: "Sous Chef",
                  image: reviewPhotos.lisaThompson,
                  rating: 5,
                  title: "Great for busy days",
                  content: "Restaurant kitchens are brutal on feet - hard floors, long hours, constant movement. These insoles are a must-have. The arch support alone made a huge difference to how I feel at end of shift.",
                  date: "4 days ago"
                },
                {
                  id: 30,
                  name: "Vanessa Hart",
                  role: "School Counselor",
                  image: reviewPhotos.davidMiller,
                  rating: 5,
                  title: "All-day support",
                  content: "Walking the halls and standing in meetings all day adds up. These insoles made my shoes significantly more comfortable. I have more energy at the end of the day now. Very happy with this purchase.",
                  date: "5 days ago"
                },
                {
                  id: 31,
                  name: "Chris Yamamoto",
                  role: "Paramedic",
                  image: reviewPhotos.sarahJenkins,
                  rating: 5,
                  title: "Comfort through long shifts",
                  content: "Emergency medical work means you're on your feet and moving fast for hours. These insoles kept me comfortable through back-to-back calls. Durable, supportive, and highly recommended for any first responder.",
                  date: "6 days ago"
                },
                {
                  id: 32,
                  name: "Olivia Bennett",
                  role: "Surgeon",
                  image: reviewPhotos.michaelChen,
                  rating: 5,
                  title: "Comfort through long shifts",
                  content: "Standing at the operating table for 6-8 hour procedures is exhausting on the feet. These insoles provide the arch support I desperately needed. My concentration is better when I'm not fighting foot fatigue - truly a quality product.",
                  date: "1 week ago"
                },
                {
                  id: 33,
                  name: "Marcus Johnson",
                  role: "Factory Worker",
                  image: reviewPhotos.hungNguyen,
                  rating: 5,
                  title: "Built for hard floors",
                  content: "Ten-hour shifts on a concrete factory floor used to wreck my feet and knees. These insoles absorbed the impact perfectly. I've gone from dreading my shift to barely noticing the floor. Excellent product.",
                  date: "2 weeks ago"
                },
                {
                  id: 34,
                  name: "Priya Sharma",
                  role: "Real Estate Agent",
                  image: reviewPhotos.jamesR,
                  rating: 4,
                  title: "Excellent comfort and support",
                  content: "Walking through properties all day in heels or flats takes its toll. These insoles fit in all my shoes and the cushioning is fantastic. My clients probably wonder how I'm so energetic by the fifth showing of the day!",
                  date: "2 days ago"
                },
                {
                  id: 35,
                  name: "Nathan Cole",
                  role: "Landscaper",
                  image: reviewPhotos.lisaThompson,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Outdoor work on uneven terrain all day is brutal without proper foot support. These insoles kept my feet stable and comfortable even during the most demanding jobs. My legs feel much less fatigued at the end of the day.",
                  date: "3 days ago"
                },
                {
                  id: 36,
                  name: "Fiona Walsh",
                  role: "Midwife",
                  image: reviewPhotos.davidMiller,
                  rating: 5,
                  title: "Comfort through long shifts",
                  content: "Long, unpredictable shifts on maternity wards mean you need reliable comfort. These insoles are outstanding - great cushioning and they've held up through months of daily use. I recommended them to my whole department.",
                  date: "4 days ago"
                },
                {
                  id: 37,
                  name: "Ethan Brooks",
                  role: "Airport Ground Crew",
                  image: reviewPhotos.sarahJenkins,
                  rating: 5,
                  title: "Reliable daily comfort",
                  content: "Running across tarmac and standing on jet bridges all day in heavy boots is tough on the feet. These insoles made a huge difference in comfort and reduced end-of-shift aches considerably. Well worth it.",
                  date: "5 days ago"
                },
                {
                  id: 38,
                  name: "Chloe Nguyen",
                  role: "Occupational Therapist",
                  image: reviewPhotos.michaelChen,
                  rating: 5,
                  title: "Comfort through long shifts",
                  content: "I spend my days walking between patients and standing during therapy sessions. These insoles provide exactly the right support without being bulky. My colleagues noticed I stopped complaining about tired feet - says it all!",
                  date: "6 days ago"
                },
                {
                  id: 39,
                  name: "Samuel Davis",
                  role: "Postal Worker",
                  image: reviewPhotos.hungNguyen,
                  rating: 5,
                  title: "Built for hard floors",
                  content: "Delivering mail across a large route on foot every day demands serious insole support. These deliver on every front - cushioning, durability, and arch support. My feet feel fresh even on the longest delivery days.",
                  date: "1 week ago"
                },
                {
                  id: 40,
                  name: "Amelia Foster",
                  role: "Zoo Keeper",
                  image: reviewPhotos.jamesR,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Walking enclosures and standing for animal care all day adds up quickly. These insoles turned my work boots into something I actually look forward to wearing. Incredible difference in how my feet and back feel.",
                  date: "2 weeks ago"
                },
                {
                  id: 41,
                  name: "Leo Martinez",
                  role: "Automotive Technician",
                  image: reviewPhotos.lisaThompson,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Standing on concrete workshop floors under cars all day used to destroy my feet. Since using these insoles my foot pain has almost completely gone. Great quality and they fit perfectly in my steel-capped boots.",
                  date: "2 days ago"
                },
                {
                  id: 42,
                  name: "Hannah Scott",
                  role: "Librarian",
                  image: reviewPhotos.davidMiller,
                  rating: 4,
                  title: "All-day support",
                  content: "Shelving books and assisting patrons means more walking than people realise. These insoles made my sensible work shoes feel like clouds. Comfortable, discreet, and long-lasting. I've ordered a second pair already.",
                  date: "3 days ago"
                },
                {
                  id: 43,
                  name: "Isaac Turner",
                  role: "Military Personnel",
                  image: reviewPhotos.sarahJenkins,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Marching and standing at attention for long periods demands serious foot support. These insoles outperformed everything I've tried before. Even during the toughest field exercises, my feet stayed comfortable and supported.",
                  date: "4 days ago"
                },
                {
                  id: 44,
                  name: "Gabriella Ross",
                  role: "Social Worker",
                  image: reviewPhotos.michaelChen,
                  rating: 5,
                  title: "Built for hard floors",
                  content: "Home visits and office work mean I'm constantly on the go. These insoles provided the comfort boost my feet needed. My lower back pain has noticeably reduced since I started wearing them - genuinely life-changing.",
                  date: "5 days ago"
                },
                {
                  id: 45,
                  name: "Dylan Hughes",
                  role: "Fishing Boat Crew",
                  image: reviewPhotos.hungNguyen,
                  rating: 5,
                  title: "Reliable daily comfort",
                  content: "Standing on wet deck surfaces for long hauls is no joke. These insoles fit snugly in my waterproof boots and provided excellent grip and cushioning. Far less foot and leg fatigue on the long trips now.",
                  date: "6 days ago"
                },
                {
                  id: 46,
                  name: "Sophia Clark",
                  role: "Dance Instructor",
                  image: reviewPhotos.jamesR,
                  rating: 5,
                  title: "Support you can feel",
                  content: "Teaching dance classes back-to-back means hours of standing, jumping and demonstrating. These insoles cushion everything beautifully and my feet recover so much faster after class. My students have started asking about them too!",
                  date: "1 week ago"
                },
                {
                  id: 47,
                  name: "Owen Murphy",
                  role: "Dock Worker",
                  image: reviewPhotos.lisaThompson,
                  rating: 5,
                  title: "Built for hard floors",
                  content: "Loading and unloading cargo all day on hard surfaces is gruelling work. These insoles absorb the shock with every step and my ankles feel far more stable. Genuinely the best insoles I've ever used - buy them.",
                  date: "2 weeks ago"
                },
                {
                  id: 48,
                  name: "Isabella Reed",
                  role: "Childcare Worker",
                  image: reviewPhotos.davidMiller,
                  rating: 5,
                  title: "All-day support",
                  content: "Chasing toddlers around all day keeps you on your feet non-stop. These insoles keep my feet comfortable through the busiest days. I have so much more energy in the afternoons now that foot pain isn't wearing me down.",
                  date: "2 days ago"
                },
                {
                  id: 49,
                  name: "Felix Morgan",
                  role: "Geologist",
                  image: reviewPhotos.sarahJenkins,
                  rating: 4,
                  title: "Excellent comfort and support",
                  content: "Fieldwork means hiking across rough terrain for hours carrying heavy equipment. These insoles provided superb support and cushioning even on the most demanding survey days. My hiking boots have never felt better.",
                  date: "3 days ago"
                },
                {
                  id: 50,
                  name: "Charlotte Price",
                  role: "Tattoo Artist",
                  image: reviewPhotos.michaelChen,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Standing over clients for long sessions used to leave my feet and lower back aching. These insoles sorted the foot pain completely. I can focus entirely on my work without discomfort creeping in. Absolutely recommend.",
                  date: "4 days ago"
                },
                {
                  id: 51,
                  name: "Adrian Bell",
                  role: "Train Driver",
                  image: reviewPhotos.hungNguyen,
                  rating: 5,
                  title: "Reliable daily comfort",
                  content: "Even with a seated role, the standing and walking during checks and platform time adds up. On rest breaks my feet feel great thanks to these insoles. A simple upgrade that makes the working day noticeably better.",
                  date: "5 days ago"
                },
                {
                  id: 52,
                  name: "Megan Cooper",
                  role: "Cruise Ship Staff",
                  image: reviewPhotos.jamesR,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Working on a ship means walking on hard deck surfaces all day across huge distances. These insoles are brilliant - the arch support is excellent and they've lasted months of daily wear. My feet thank me every morning.",
                  date: "6 days ago"
                },
                {
                  id: 53,
                  name: "Tyler Jenkins",
                  role: "Baker",
                  image: reviewPhotos.lisaThompson,
                  rating: 5,
                  title: "Great for busy days",
                  content: "Early morning starts on tiled bakery floors make good insoles essential. These provided brilliant cushioning from the first day. My feet no longer ache by the time the morning rush is over. Brilliant product.",
                  date: "1 week ago"
                },
                {
                  id: 54,
                  name: "Naomi Watson",
                  role: "Speech Therapist",
                  image: reviewPhotos.davidMiller,
                  rating: 5,
                  title: "Comfort through long shifts",
                  content: "Moving between therapy rooms and schools all day means plenty of walking. These insoles made my shoes so much more comfortable. I have more energy left at the end of the day to actually enjoy my evenings.",
                  date: "2 weeks ago"
                },
                {
                  id: 55,
                  name: "Callum Shaw",
                  role: "Ski Instructor",
                  image: reviewPhotos.sarahJenkins,
                  rating: 5,
                  title: "Support you can feel",
                  content: "Standing on slopes in ski boots all day is incredibly demanding on feet and ankles. These insoles added the support and warmth I needed. My feet feel genuinely better at the end of a full day on the mountain.",
                  date: "2 days ago"
                },
                {
                  id: 56,
                  name: "Destiny King",
                  role: "Correction Officer",
                  image: reviewPhotos.michaelChen,
                  rating: 5,
                  title: "Excellent comfort and support",
                  content: "Walking prison blocks and standing post for hours requires dependable foot support. These insoles delivered exactly that. My feet and knees feel significantly better after shifts. Every officer in my unit should have a pair.",
                  date: "3 days ago"
                },
                {
                  id: 57,
                  name: "Leo Timber",
                  role: "Professor",
                  image: reviewPhotos.hungNguyen,
                  rating: 5,
                  title: "Comfort through long lecture days",
                  content: "Between long lectures, office hours, and walking across campus, I spend most of the day on my feet. These insoles add consistent support and cushioning, so I finish the day with far less foot fatigue.",
                  date: "2 days ago"
                }
              ]
                .slice(0, visibleRealResultReviews)
                .map((review) => (
                <div key={review.id} className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl cursor-pointer transition-shadow duration-500" style={{ height: '480px' }}>
                  {/* Keep photos only for the original six reviews; newer entries are text-first until dedicated photos are assigned */}
                  {review.id <= INITIAL_REAL_RESULTS_COUNT ? (
                    <img 
                      src={review.image} 
                      alt={review.name + " using AeroTouch"}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" aria-hidden />
                  )}
                  {/* Dark gradient overlay – deepens on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content overlay – slides up on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-0 group-hover:-translate-y-1 transition-transform duration-500 ease-out">
                    <h5 className="text-xl font-black text-white mb-2">{review.title}</h5>

                    {/* Name row */}
                    <div className="flex items-center gap-3 mb-3">
                      <div>
                        <h4 className="font-black text-white text-sm leading-none">{review.name}</h4>
                        <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest">{review.role}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full">
                        <BadgeCheck className="w-3 h-3 text-brand-lime" />
                        <span className="text-[8px] font-bold text-white/80 uppercase">Verified</span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex text-yellow-400 gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                    </div>

                    {/* Description text – expands on hover inside frosted container */}
                    <div className="relative">
                      <p className="text-white/80 text-xs leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-500">"{review.content}"</p>
                    </div>

                    {/* Frosted "Read more" hint – fades out on hover */}
                    <div className="mt-2 flex items-center gap-1.5 opacity-60 group-hover:opacity-0 transition-opacity duration-300">
                      <span className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Hover to read more</span>
                      <ChevronRight className="w-3 h-3 text-white/50" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleRealResultReviews < REAL_RESULTS_TOTAL_COUNT && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleRealResultReviews((prev) => Math.min(prev + REAL_RESULTS_BATCH_SIZE, REAL_RESULTS_TOTAL_COUNT))}
                  className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-all group"
                >
                  View More Reviews
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>


      {/* 4. Invite Friends – Give 15%, Get 15% */}
      <ReferralSection />

      {/* 5. Giving Back Section */}
      <GivingBackSection onLearnMore={onNavigateToBlog} />
    </div>
  );
};
