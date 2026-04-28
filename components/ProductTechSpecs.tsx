import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Info, Layers, Activity, Zap, ShieldCheck, Globe, Trophy, Star, Check, X, ThumbsUp, Smile, Truck, Gift, Flame, Heart, Timer, Sparkles, Play, BadgeCheck, MoreHorizontal, MessageSquare, Share2, Quote, Award, Shield, Droplets, Scissors, ArrowLeftRight, ShoppingBag, Users, Copy } from 'lucide-react';
import { ReferralSection } from './ReferralSection';
import { GivingBackSection } from './GivingBackSection';
import { ProductCard } from './ProductCard';
import { Product } from '../types';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { sectionImages, reviewVideos, reviewAvatars, reviewPhotos } from '../utils/mediaUrls';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'massage-insoles',
    name: 'AeroTouch Massage Insoles',
    tagline: 'Therapeutic acupressure with every step',
    price: 34.00,
    rating: 4.9,
    reviews: 1540,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop',
    features: ['Magnetic Therapy', 'Pressure Point Relief', 'Breathable Design'],
    description: ''
  },
  {
    id: 'massage-roller',
    name: 'Massage Roller',
    tagline: 'Deep tissue recovery for sore feet',
    price: 19.00,
    rating: 4.8,
    reviews: 820,
    image: 'https://images.unsplash.com/photo-1544117518-30dd01b92047?q=80&w=800&auto=format&fit=crop',
    features: ['Ergonomic Shape', 'Deep Tissue Trigger', 'Portable Size'],
    description: ''
  },
  {
    id: 'heel-cushion-pad',
    name: 'Heel Cushion Pad',
    tagline: 'Instant impact protection for heels',
    price: 24.00,
    rating: 4.9,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop',
    features: ['Shock Absorption', 'Non-Slip Grip', 'All-Day Support'],
    description: ''
  },
  {
    id: 'compression-socks',
    name: 'Compression Socks',
    tagline: 'Boost circulation and reduce swelling',
    price: 29.00,
    rating: 4.7,
    reviews: 940,
    image: 'https://images.unsplash.com/photo-1582966298431-a1217ec1e695?q=80&w=800&auto=format&fit=crop',
    features: ['Graduated Compression', 'Moisture Wicking', 'Arch Support'],
    description: ''
  },
  {
    id: 'fascilites-relief',
    name: 'Fascilites Relief Kit',
    tagline: 'Complete recovery system',
    price: 48.00,
    rating: 5.0,
    reviews: 3200,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
    features: ['Elite Insoles', 'Massage Ball', 'Instructional Guide'],
    description: ''
  },
  {
    id: 'height-insoles',
    name: 'Height Insoles',
    tagline: 'Discreet elevation with maximum comfort',
    price: 39.00,
    rating: 4.8,
    reviews: 1100,
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
    features: ['Adjustable Height', 'Invisible Fit', 'Shock Absorbing'],
    description: ''
  }
];

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
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=150&h=150&fit=crop",
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
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop",
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
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
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

interface ProductTechSpecsProps {
  currentProductId?: string;
  onProductSelect?: (product: Product) => void;
  onNavigateToBlog?: () => void;
}

export const ProductTechSpecs: React.FC<ProductTechSpecsProps> = ({ currentProductId, onProductSelect, onNavigateToBlog }) => {
  const [activeFeature, setActiveFeature] = useState(-1);
  const [builtForIndex, setBuiltForIndex] = useState(0);
  const [splitPos, setSplitPos] = useState(50);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false);
  const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' ? (window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT) : false);
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [videoReviewSlideIndex, setVideoReviewSlideIndex] = useState(0);
  const [textReviewSlideIndex, setTextReviewSlideIndex] = useState(0);
  const splitRef = useRef<HTMLDivElement>(null);
  const videoReviewRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const videoReviewScrollRef = useRef<HTMLDivElement>(null);
  const videoReviewCardRefs = useRef<(HTMLElement | null)[]>([]);
  const textReviewScrollRef = useRef<HTMLDivElement>(null);
  const textReviewCardRefs = useRef<(HTMLElement | null)[]>([]);
  const TEXT_REVIEW_COUNT = 6;

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const shopifyProducts = await shopify.product.fetchAll(20);
        if (shopifyProducts && shopifyProducts.length > 0) {
          const mapped = shopifyProducts.map(mapShopifyProduct);
          const filtered = mapped.filter(p => p.id !== currentProductId);
          const shuffled = filtered.sort(() => Math.random() - 0.5);
          setSuggestedProducts(shuffled.slice(0, 4));
        } else {
          setFallbackSuggestions();
        }
      } catch {
        setFallbackSuggestions();
      }
    };

    const setFallbackSuggestions = () => {
      const filtered = FALLBACK_PRODUCTS.filter(p => p.id !== currentProductId);
      const shuffled = filtered.sort(() => Math.random() - 0.5);
      setSuggestedProducts(shuffled.slice(0, 4));
    };

    fetchProducts();
  }, [currentProductId]);

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
      <section id="engineered-for-everyone" className="pt-12 pb-20 md:pt-16 md:pb-32 bg-[#f8f9fa] overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 md:mb-24 max-w-3xl mx-auto">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Targeted Relief</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 uppercase tracking-tight">ENGINEERED FOR COMFORT</h2>
            <p className="mt-5 text-slate-600 text-lg">
              Click the points below to see how our insoles provide all-day pain relief and support.
            </p>
          </div>

        <div className="relative w-full max-w-[1600px] mx-auto">
          {/* The base image */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none"></div>
          </div>
          
          <img 
             src="/images/performance-tech.jpeg" 
             alt="AeroTouch Insole Tech" 
             className="w-full h-auto rounded-[3rem] border border-slate-100/50 drop-shadow-[0_30px_40px_rgba(0,0,0,0.15)] relative z-10"
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
                position: isMobile ? { top: '75%', left: '75%' } : { top: '75%', left: '75%' }, // Toe
              }
            ].map((f, i) => (
               <div
                 key={i}
                 className="absolute z-30"
                 style={{ top: f.position.top, left: f.position.left, transform: 'translate(-50%, -50%)' }}
               >
                 {/* Tooltip Card */}
                 <div className={`absolute bottom-[calc(100%+16px)] left-1/2 -translate-x-1/2 mb-2 w-[280px] bg-white rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-slate-100/50 p-6 transition-all duration-400 origin-bottom z-40 ${activeFeature === i ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
                   <div className="text-3xl mb-4">{f.icon}</div>
                   <h4 className="font-bold text-slate-900 text-[17px] mb-2">{f.title}</h4>
                   <p className="text-[15px] text-slate-600 leading-relaxed font-medium">{f.desc}</p>
                   {/* Triangle pointer */}
                   <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100/50"></div>
                 </div>

                 {/* Hotspot Button */}
                 <button
                   onClick={() => setActiveFeature(activeFeature === i ? -1 : i)}
                   className="relative w-14 h-14 flex items-center justify-center rounded-full group outline-none"
                   aria-label={`View ${f.title} details`}
                 >
                   {/* Outer Ping Ring */}
                   <div className={`absolute inset-0 rounded-full border-[2.5px] transition-all duration-300 ${activeFeature === i ? 'border-[#0f3c31] scale-110 bg-[#0f3c31]/10' : 'border-white bg-white/20 group-hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.1)]'}`}></div>
                   {activeFeature !== i && (
                     <div className="absolute inset-0 rounded-full border-[2.5px] border-white animate-ping opacity-40"></div>
                   )}
                   
                   {/* Inner Circle */}
                   <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                     <span className={`text-[#0f3c31] font-medium text-2xl leading-none transition-transform duration-300 transform ${activeFeature === i ? 'rotate-45' : ''}`}>+</span>
                   </div>
                 </button>
               </div>
            ))}
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
      <section className="bg-white border-t border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          {/* Top row: interactive split image + headline */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-16">
            {/* Left – interactive before/after slider */}
            <div className="relative mx-auto w-full max-w-[22.56rem] select-none">
              {/* Normal label */}
              {splitPos > 15 && (
                <span className="absolute top-4 left-4 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md z-10 pointer-events-none">Normal</span>
              )}
              {/* AeroTouch label */}
              {splitPos < 85 && (
                <span className="absolute top-4 right-4 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md z-10 pointer-events-none">AeroTouch</span>
              )}

              <div
                ref={splitRef}
                className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-white cursor-ew-resize touch-none"
                onPointerDown={onSplitPointerDown}
                onPointerMove={onSplitPointerMove}
              >
                {/* "Normal" side – base layer (full image) */}
                <img
                  src={sectionImages.section2}
                  alt="Normal shoe insoles"
                  className="absolute inset-0 w-full h-full object-contain object-bottom pointer-events-none"
                  draggable={false}
                />
                {/* "AeroTouch" side – clipped overlay */}
                <img
                  src={sectionImages.section3}
                  alt="AeroTouch insoles"
                  className="absolute inset-0 w-full h-full object-contain object-bottom pointer-events-none"
                  draggable={false}
                  style={{ clipPath: `inset(0 0 0 ${splitPos}%)`, top: '3px' }}
                />

                {/* Divider line */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-white z-10 pointer-events-none"
                  style={{ left: `${splitPos}%`, transform: 'translateX(-50%)' }}
                />
                {/* Drag handle */}
                <div
                  className="absolute top-1/2 z-20 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-white shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center pointer-events-none"
                  style={{ left: `${splitPos}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <ArrowLeftRight className="w-4 h-4 text-slate-900" />
                </div>
              </div>
            </div>

            {/* Right – headline & description */}
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
                The AeroTouch <span className="text-brand-orange">Difference</span>
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md">
                Experience the transformation for yourself and step into a brighter, pain-free future today.
              </p>
            </div>
          </div>

          {/* Bottom row: 4 benefit cards */}
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Star, title: 'Improve Posture', desc: 'Proper arch support promotes better spine alignment.' },
              { icon: Zap, title: 'Boost Performance', desc: 'Adds a spring to each step making walking and running easier.' },
              { icon: Scissors, title: 'Size Adjustable', desc: 'Simply cut along the dotted line with scissors.' },
              { icon: Droplets, title: 'Easily Washable', desc: 'Simply hand wash with soap and water.' },
            ].map((item) => (
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

      {/* Bundle & Save Redesign */}
      <section className="bg-slate-50 border-t border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50 p-8 md:p-12 lg:p-16 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-lime/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <div className="text-center mb-12 relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase mb-4">Complete Foot Recovery System</h2>
              <p className="text-xl md:text-2xl text-slate-600 font-medium tracking-tight">Recover faster. Move better. Feel zero pain.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
              {/* VISUAL KIT */}
              <div className="relative aspect-square bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center p-8 group overflow-hidden">
                <div className="absolute top-4 left-4 bg-brand-orange text-white text-[10px] font-black uppercase px-3 py-1 rounded-full z-10 tracking-widest shadow-md">
                  3 products &rarr; 1 system
                </div>
                
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600" className="absolute top-0 right-0 w-[65%] h-[65%] object-contain z-10 hover:scale-[1.03] transition-transform origin-bottom-left mix-blend-multiply drop-shadow-xl" alt="Insoles" />
                  <img src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=400" className="absolute bottom-4 left-0 w-[55%] h-[55%] object-contain z-20 hover:scale-[1.03] transition-transform mix-blend-multiply drop-shadow-lg" alt="Socks" />
                  <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400" className="absolute top-1/2 left-1/4 -translate-x-1/4 -translate-y-1/2 w-[45%] h-[45%] object-contain z-30 hover:scale-[1.03] transition-transform rounded-xl border-[6px] border-white shadow-2xl" alt="Gel" />
                </div>
              </div>

              {/* DETAILS & CTA */}
              <div className="flex flex-col justify-center">
                {/* BENEFITS ROW */}
                <div className="grid grid-cols-3 gap-3 mb-10 pb-10 border-b border-slate-100">
                  <div className="text-center group">
                     <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-brand-lime/20 flex items-center justify-center mx-auto mb-3 transition-colors outline flex-shrink-0 outline-4 outline-slate-50 shadow-sm">
                       <span className="text-2xl" aria-hidden>👣</span>
                     </div>
                     <span className="text-[11px] md:text-xs font-black uppercase tracking-wider text-slate-800 break-words">Support</span>
                  </div>
                  <div className="text-center group">
                     <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-brand-lime/20 flex items-center justify-center mx-auto mb-3 transition-colors outline outline-4 outline-slate-50 shadow-sm">
                       <span className="text-2xl" aria-hidden>❤️</span>
                     </div>
                     <span className="text-[11px] md:text-xs font-black uppercase tracking-wider text-slate-800 break-words">Circulation</span>
                  </div>
                  <div className="text-center group">
                     <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-brand-lime/20 flex items-center justify-center mx-auto mb-3 transition-colors outline outline-4 outline-slate-50 shadow-sm">
                       <span className="text-2xl" aria-hidden>⚡</span>
                     </div>
                     <span className="text-[11px] md:text-xs font-black uppercase tracking-wider text-slate-800 break-words">Recovery</span>
                  </div>
                </div>

                {/* PRICE */}
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-5xl md:text-6xl font-black text-brand-orange tracking-tighter">$39.98</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase px-3 py-1.5 rounded tracking-widest border border-emerald-200 shadow-sm animate-pulse">Save 35%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold line-through decoration-slate-300 decoration-2 text-lg">$61.50</span>
                    <span className="text-slate-500 font-black tracking-widest text-sm">&rarr;</span>
                    <span className="text-slate-600 font-bold text-lg border-b-2 border-brand-lime">$39.98</span>
                  </div>
                </div>

                {/* CTA */}
                <button
                  className="relative w-full overflow-hidden bg-black text-white hover:bg-brand-lime hover:text-black hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 py-5 rounded-2xl font-black text-xl md:text-2xl uppercase tracking-tight mb-5 group"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get the Complete Recovery Kit <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                  </span>
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                </button>

                {/* TRUST + URGENCY */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm font-bold mt-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 fill-brand-orange text-brand-orange" />
                    <span className="text-slate-700 tracking-tight text-base font-black">4.8 rating</span>
                  </div>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-4 py-1.5 rounded-full border border-red-100">
                    <Flame className="w-4 h-4 fill-current animate-pulse" />
                    <span className="tracking-widest uppercase text-xs font-black">Only 17 left</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You May Also Like Section */}
      {suggestedProducts.length > 0 && (
        <section className="bg-white py-24 border-t border-slate-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <span className="text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Recommended for you</span>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">You May Also Like</h2>
                </div>
                <p className="text-slate-500 font-medium max-w-sm">Complete your recovery kit with these essential add-ons designed for maximum comfort.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {suggestedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={onProductSelect || (() => {})}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
                }
              ].map((review) => (
                <div key={review.id} className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl cursor-pointer transition-shadow duration-500" style={{ height: '480px' }}>
                  {/* Full-bleed image with zoom on hover */}
                  <img 
                    src={review.image} 
                    alt={review.name + " using AeroTouch"}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
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

            <div className="mt-12 text-center">
              <button className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:border-brand-orange hover:text-brand-orange transition-all group">
                View More Reviews
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* 4. Invite Friends – Give 40%, Get 40% */}
      <ReferralSection />

      {/* 5. Giving Back Section */}
      <GivingBackSection onLearnMore={onNavigateToBlog} />
    </div>
  );
};
