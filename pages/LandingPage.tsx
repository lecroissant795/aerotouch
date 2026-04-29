import React, { useEffect, useRef, useState } from 'react';
import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { Features } from '../components/Features';
import { ProductCard } from '../components/ProductCard';
import { Newsletter } from '../components/Newsletter';
import { TrustedPartners } from '../components/TrustedPartners';
import { PressLogos } from '../components/PressLogos';
import { Product, BundleKit } from '../types';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { LimitedTimeKits } from '../components/LimitedTimeKits';
import { ValueProps } from '../components/ValueProps';
import { ComparisonTable } from '../components/ComparisonTable';
import { Star, Play, BadgeCheck, Globe, MoreHorizontal, ThumbsUp, Heart, Smile, MessageSquare, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { reviewVideos } from '../utils/mediaUrls';
import { FAQSection } from '../components/FAQSection';
import { ReferralSection } from '../components/ReferralSection';

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

interface LandingPageProps {
  onProductSelect: (product: Product) => void;
  onQuickAddToCart?: (product: Product) => void;
  onCategorySelect: (category: string) => void;
  onShopSaleClick?: () => void;
  onKitSelect?: (kit: BundleKit) => void;
  onAddKitToCart?: (kit: BundleKit) => void;
}

const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'massage-insoles',
    handle: 'aero-touch-massage-insoles',
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
    handle: 'massage-roller',
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
    handle: 'heel-cushion-pad',
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
    handle: 'compression-socks',
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
    handle: 'fascilites-relief',
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
    handle: 'height-insoles',
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

export const LandingPage: React.FC<LandingPageProps> = ({ onProductSelect, onQuickAddToCart, onCategorySelect, onShopSaleClick, onKitSelect, onAddKitToCart }) => {
  const [products, setProducts] = useState<Product[]>(FEATURED_PRODUCTS);
  const bestSellerSectionRef = useRef<HTMLElement | null>(null);

  // Video review carousel state
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null);
  const [videoReviewSlideIndex, setVideoReviewSlideIndex] = useState(0);
  const videoReviewRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const videoReviewScrollRef = useRef<HTMLDivElement>(null);
  const videoReviewCardRefs = useRef<(HTMLElement | null)[]>([]);

  const scrollVideoReviewTo = (index: number) => {
    const i = Math.max(0, Math.min(index, VIDEO_REVIEWS.length - 1));
    const card = videoReviewCardRefs.current[i];
    if (card && videoReviewScrollRef.current) {
      const container = videoReviewScrollRef.current;
      const scrollLeft = card.offsetLeft - container.offsetLeft;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  const handleVideoReviewScroll = () => {
    const container = videoReviewScrollRef.current;
    if (!container) return;
    let activeIndex = 0;
    let minDist = Infinity;
    videoReviewCardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const dist = Math.abs(card.offsetLeft - container.scrollLeft - container.offsetLeft);
      if (dist < minDist) { minDist = dist; activeIndex = idx; }
    });
    setVideoReviewSlideIndex(Math.max(0, Math.min(activeIndex, VIDEO_REVIEWS.length - 1)));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const shopifyProducts = await shopify.product.fetchAll(20);
        if (shopifyProducts && shopifyProducts.length > 0) {
           const mapped = shopifyProducts.map(mapShopifyProduct);
           setProducts(mapped);
        }
      } catch (err) {
        // Fallback to local data if fetch fails (e.g. invalid creds)
        console.warn('Failed to fetch Shopify products, using local data:', err);
      }
    };
    
    fetchProducts();
  }, []);

  const handleHeroPrimaryCta = () => {
    bestSellerSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Hero onPrimaryCtaClick={handleHeroPrimaryCta} />
      {/* Best Seller Section with Rolling Text */}
      <section
        ref={bestSellerSectionRef}
        className="py-24 bg-brand-light relative overflow-hidden"
      >
        {/* Background Rolling Text */}
        <div className="absolute top-8 left-0 w-full overflow-hidden opacity-[0.04] pointer-events-none select-none">
          <div className="whitespace-nowrap animate-marquee flex w-[200%]">
             <span className="text-[8rem] md:text-[12rem] font-black uppercase leading-none tracking-tighter">
               Best Sellers &bull; Best Sellers &bull; Best Sellers &bull; Best Sellers &bull;&nbsp;
             </span>
             <span className="text-[8rem] md:text-[12rem] font-black uppercase leading-none tracking-tighter">
               Best Sellers &bull; Best Sellers &bull; Best Sellers &bull; Best Sellers &bull;&nbsp;
             </span>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Best Seller</h2>
            <p className="text-slate-600 text-lg">
              Select the perfect insole for your activity from our top-rated collection.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory px-4 md:px-[10vw] best-seller-scroll">
            {products.map(product => (
              <div key={product.id} className="flex-none w-[280px] md:w-[320px] snap-center">
                <ProductCard
                  product={product}
                  onClick={onProductSelect}
                  onAddToCart={onQuickAddToCart}
                  bestSeller
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <LimitedTimeKits onKitSelect={onKitSelect} onAddKitToCart={onAddKitToCart} />
      <Categories onCategoryClick={onCategorySelect} />
      <ValueProps />

      <Features />
      <PressLogos />
      <TrustedPartners />

      {/* Facebook-style Video Reviews Section */}
      <section className="pt-24 pb-12 md:pb-16 bg-white border-t border-slate-100 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="flex justify-center items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-brand-orange text-brand-orange" />)}
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Real Stories. Real Relief.</h2>
            <p className="text-slate-500 text-lg">Real comfort for real life—see why <span className="font-bold text-slate-900">15,420+ Verified Buyers</span> choose AeroTouch.</p>
          </div>
        </div>

        {/* Video Reviews Carousel */}
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

                {/* Post text */}
                <div className="px-3 pb-2">
                  <p className="text-[15px] text-[#050505] leading-[1.3333] translate-y-0 group-hover:-translate-y-0.5 transition-all duration-300">{video.description}</p>
                </div>

                {/* Video */}
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

                  {/* Play button */}
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

          {/* Carousel dots */}
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
      </section>

      <ComparisonTable onShopNow={handleHeroPrimaryCta} />

      {/* FAQ Section */}
      <section className="py-24 bg-white border-t border-slate-100 relative">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Got Questions? We've Got Answers</h2>
          </div>
          <FAQSection />
        </div>
      </section>

      <ReferralSection />
      <Newsletter />
    </div>
  );
};
