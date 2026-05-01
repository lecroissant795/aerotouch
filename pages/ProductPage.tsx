import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { Button } from '../components/Button';
import { Star, Check, Truck, RotateCcw, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Ruler, Users, Timer, ShieldCheck, Flame, CreditCard, Plus, Smile, Headphones, Wrench, Tag, Box, CircleDollarSign, Activity, BadgeCheck, ShoppingBag, MapPin, Play, X, Lock, Volume2, VolumeX } from 'lucide-react';
import { ProductTechSpecs } from '../components/ProductTechSpecs';
import { FAQSection } from '../components/FAQSection';
import { useSocialProof } from '../hooks/useSocialProof';
import { getLinePricing } from '../utils/pricing';
import { fetchProductByHandle } from '../utils/productFetcher';
import { mapShopifyProduct } from '../utils/mapper';
import { useProductMetafields } from '../utils/useProductMetafields';
import { productVideos } from '../utils/mediaUrls';

interface ProductPageProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  onBack: () => void;
  onProductSelect?: (product: Product) => void;
  onNavigateToBlog?: () => void;
  isLoading?: boolean;
  error?: string | null;
  onBuyNow?: (product: Product, size: string, color: string, quantity?: number) => void;
}

// Temporary fallback constants until fetching is fully verified for all products
const DEFAULT_SIZES = [
  { label: 'M 5 / W 6', detail: 'US Men 5 / US Women 6' },
  { label: 'M 6 / W 7', detail: 'US Men 6 / US Women 7' },
  { label: 'M 7 / W 8', detail: 'US Men 7 / US Women 8' },
  { label: 'M 8 / W 9', detail: 'US Men 8 / US Women 9' },
  { label: 'M 9 / W 10', detail: 'US Men 9 / US Women 10' },
  { label: 'M 10 / W 11', detail: 'US Men 10 / US Women 11' },
  { label: 'M 11 / W 12', detail: 'US Men 11 / US Women 12' },
  { label: 'M 12 / W 13', detail: 'US Men 12 / US Women 13' },
  { label: 'M 13 / W 14', detail: 'US Men 13 / US Women 14' },
  { label: 'M 14 / W 15', detail: 'US Men 14 / US Women 15' },
  { label: 'M 15 / W 16', detail: 'US Men 15 / US Women 16' }
];

const DEFAULT_COLORS = [
  { name: 'Orange', value: '#FF5722', label: 'Signature Orange' },
  { name: 'Grey', value: '#6B7280', label: 'Grey' },
  { name: 'Black', value: '#1E293B', label: 'Stealth Black' }
];

const TESTIMONIALS = [
  {
    name: 'James R.',
    role: 'Marathon Runner',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
    quote:
      "I've struggled with plantar fasciitis for years, but these insoles changed everything. I can run longer with way less soreness the next day.",
    result: 'Pain noticeably reduced in 1 week'
  },
  {
    name: 'Sofia M.',
    role: 'Nurse, 12hr shifts',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    quote:
      'My feet used to throb by mid-shift. With these, support stays consistent all day and my knees feel less pressure at work.',
    result: 'All-day comfort during long shifts'
  },
  {
    name: 'Daniel K.',
    role: 'Daily Walker',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
    quote:
      'Easy to trim, easy to fit, and they immediately felt stable. Great value compared to other insoles I have tried.',
    result: 'Better stability and less fatigue'
  }
];

const BUILT_FOR_PURPOSES = [
  { id: 'lifts', label: 'Heavy Lifts', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop' },
  { id: 'extreme', label: 'Extreme Sports', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop' },
  { id: 'standout', label: 'Stand Out', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&auto=format&fit=crop' },
  { id: 'runs', label: 'Nature Runs', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&auto=format&fit=crop' },
  { id: 'shifts', label: 'All-Day Comfort', image: 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=800&auto=format&fit=crop' },
];

export const ProductPage: React.FC<ProductPageProps> = ({ 
  product: initialProduct, 
  onAddToCart, 
  onBack, 
  onProductSelect,
  onNavigateToBlog,
  isLoading = false,
  error = null,
  onBuyNow
}) => {
  const [product, setProduct] = useState<Product>(initialProduct);
  const meta = useProductMetafields(product);
  const [shopifyProduct, setShopifyProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('Orange');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>('details');
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const { viewers } = useSocialProof(initialProduct.id);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 12, seconds: 45 });
  const [paymentMethodsOpen, setPaymentMethodsOpen] = useState(false);
  const [unmutedVideoId, setUnmutedVideoId] = useState<number | null>(null);
  const [expandedVideo, setExpandedVideo] = useState<{ id: number; src: string } | null>(null);
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const expandedVideoRef = useRef<HTMLVideoElement | null>(null);
  const [builtForIndex, setBuiltForIndex] = useState(0);
  const builtForScrollRef = useRef<HTMLDivElement>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchShopifyData = async () => {
      // Use the product's handle if available, otherwise fall back to ID
      // fetchProductByHandle will handle both formats correctly
      const identifier = initialProduct.handle || initialProduct.id;

      console.log('[ProductPage] Fetching Shopify data for identifier:', identifier);

      try {
        const fetchedProduct = await fetchProductByHandle(identifier);
        if (fetchedProduct) {
          console.log('[ProductPage] ✅ Shopify data fetched successfully');
          console.log('[ProductPage] Raw fetchedProduct:', fetchedProduct);
          setShopifyProduct(fetchedProduct);
          setVariants(fetchedProduct.variants || []);
          // Merge Shopify data with initial product, only updating fields that have values
          const shopifyMapped = mapShopifyProduct(fetchedProduct);
          console.log('[ProductPage] Mapped from Shopify:', shopifyMapped);
          setProduct((prev: Product) => {
            const merged: Product = { ...prev };
            // Only update fields that are defined in shopifyMapped
            if (shopifyMapped.name) merged.name = shopifyMapped.name;
            if (shopifyMapped.tagline) merged.tagline = shopifyMapped.tagline;
            if (shopifyMapped.price > 0) merged.price = shopifyMapped.price;
            if (shopifyMapped.image) merged.image = shopifyMapped.image;
            if (shopifyMapped.images && shopifyMapped.images.length > 0) merged.images = shopifyMapped.images;
            if (shopifyMapped.description) merged.description = shopifyMapped.description;
            if (shopifyMapped.descriptionHtml) merged.descriptionHtml = shopifyMapped.descriptionHtml;
            if (shopifyMapped.tags && shopifyMapped.tags.length > 0) merged.tags = shopifyMapped.tags;
            if (shopifyMapped.metafields) merged.metafields = shopifyMapped.metafields;
            // Keep original id/handle
            merged.id = prev.id;
            merged.handle = prev.handle;
            console.log('[ProductPage] Merged product:', merged);
            return merged;
          });
        } else {
          console.log('[ProductPage] ⚠️ fetchProductByHandle returned null, using local data only');
        }
      } catch (err) {
        console.warn('[ProductPage] Could not fetch product from Shopify, using local data:', err);
      }
    };
    fetchShopifyData();
  }, [initialProduct.id, initialProduct.handle]);

  // Derived options from Shopify Variants or Fallback
  const availableSizes = shopifyProduct?.options?.find((o: any) => o.name === 'Size')?.values.map((v: any) => ({ label: v.value, detail: v.value })) || DEFAULT_SIZES;
  const availableColors = shopifyProduct?.options?.find((o: any) => o.name === 'Color')?.values.map((v: any) => ({ name: v.value, value: v.value, label: v.value })) || DEFAULT_COLORS;

  // Scroll to section when opening product page with hash (#engineered-for-everyone or #best-for)
  useEffect(() => {
    const hash = window.location.hash?.slice(1); // e.g. 'best-for' or 'engineered-for-everyone'
    if (!hash) return;
    const t = setTimeout(() => {
      const el = document.getElementById(hash);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
    return () => clearTimeout(t);
  }, []);

  // Scroll to active image when index changes (e.g. via dots)
  useEffect(() => {
    if (builtForScrollRef.current) {
        const el = builtForScrollRef.current;
        const cardWidth = 320;
        const gap = 24;
        el.scrollTo({ left: builtForIndex * (cardWidth + gap), behavior: 'smooth' });
    }
  }, [builtForIndex]);

  useEffect(() => {
    if (scrollRef.current) {
        const width = scrollRef.current.clientWidth;
        // Check if we need to scroll to avoid fighting manual scroll
        const currentScroll = scrollRef.current.scrollLeft;
        const targetScroll = activeImgIndex * width;
        if (Math.abs(currentScroll - targetScroll) > 20) {
            scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
    }
  }, [activeImgIndex]);

  const handleScroll = () => {
    if (scrollRef.current) {
        const width = scrollRef.current.clientWidth;
        const newIndex = Math.round(scrollRef.current.scrollLeft / width);
        if (newIndex !== activeImgIndex) {
            setActiveImgIndex(newIndex);
        }
    }
  };

  // Timer logic
  useEffect(() => {
    // Viewers logic moved to useSocialProof hook

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  }

  // Product gallery: use product imagery only (no stock-photo fallback tiles).
  const fallbackGalleryImage = product.image || '/images/IMG_4813-removebg-preview.png';
  const rawImages = product.images || [];
  // Filter to only strings with content (Shopify may return objects in some formats)
  const validImages: string[] = rawImages.filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
  const images = Array.from(
    new Set([...validImages, fallbackGalleryImage].filter((img) => img && img.trim()))
  );
  const secondaryImages = images.slice(1, 5);

  useEffect(() => {
    if (activeImgIndex >= images.length) {
      setActiveImgIndex(0);
    }
  }, [activeImgIndex, images.length]);

  // Bundles for dropshipping vibe
  const [bundle, setBundle] = useState(1); // 1 = 1 pair, 2 = 2 pairs, 3 = 3 pairs
  
  const formatPrice = (amount: number) => amount.toFixed(2);
  const getBundlePricing = (qty: number) => getLinePricing(product.price, qty);

  const selectedBundlePricing = getBundlePricing(bundle);
  const selectedFinalPrice = selectedBundlePricing.unitPrice;
  const selectedCompareAtPrice = product.price;
  const selectedSavingsAmount = selectedCompareAtPrice - selectedFinalPrice;
  const selectedSavingsPercent = selectedBundlePricing.discountPercent;
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);

  useEffect(() => {
    if (isTestimonialHovered) return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isTestimonialHovered]);

  const currentTestimonial = TESTIMONIALS[activeTestimonial];
  
  const handleAddToCartWrapper = () => {
      if(selectedSize) {
          onAddToCart(product, selectedSize, selectedColor, bundle);
      }
  }

  const handleAddBundleToCart = () => {
      if (!selectedSize) return;

      // Add the primary product (insoles)
      onAddToCart(product, selectedSize, selectedColor, 1);

      // Add Recovery Socks
      onAddToCart(
        { id: 'compression-socks', name: 'Recovery Socks', price: 15, image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=400', description: 'Compression 20-30mmHg', features: ['Graduated Compression', 'Moisture Wicking', 'Arch Support'], rating: 4.7, reviews: 940, tagline: 'Medical-grade compression socks' },
        'Standard', 'One Size', 1
      );

      // Add Recovery Gel
      onAddToCart(
        { id: 'recovery-gel', name: 'Recovery Gel', price: 12.50, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400', description: 'Deep Muscle Relief', features: ['Deep Muscle Relief', 'Fast Absorption'], rating: 4.8, reviews: 650, tagline: 'Deep muscle recovery gel' },
        'Standard', 'One Size', 1
      );
  }

  // Guard against undefined product name during loading
  const productName = product.name || '';
  const isMainProductType = product.id === 'massage-insoles' || productName.toLowerCase().includes('massage insole');

  if (!isMainProductType) {
    return (
      <div className="min-h-screen bg-slate-50 pt-28 pb-24">
        <div className="container mx-auto px-4 md:px-6">
          <button onClick={onBack} className="mb-8 flex items-center text-sm font-medium text-slate-500 hover:text-brand-orange transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Results
          </button>
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm max-w-5xl mx-auto flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="md:w-1/2">
              <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 p-8 flex items-center justify-center">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover object-center" />
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4">{product.name}</h1>
              <div className="text-3xl font-black text-brand-orange mb-6">${formatPrice(product.price)}</div>
              <p className="text-slate-600 leading-relaxed md:text-lg mb-10">{product.description || product.tagline || 'Experience premium comfort and support with our advanced recovery technology designed to help you perform at your best every day.'}</p>
              
              <div className="flex flex-col gap-4">
                <Button
                  size="lg"
                  className="w-full h-14 text-lg font-bold bg-black text-white hover:bg-brand-lime hover:text-black transition-colors shadow-lg"
                  onClick={() => onAddToCart(product, 'Standard', 'Default', 1)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500 pb-24 md:pb-0">
      
      {/* Sticky Promo Bar */}
      <div className="bg-brand-dark text-white text-center py-2 text-xs font-bold uppercase tracking-widest sticky top-[64px] z-30">
        <span className="animate-pulse text-brand-lime mr-2">●</span> High Demand: {viewers} Sold in the last hour
      </div>

      {/* Breadcrumb / Back Navigation */}
      <div className="pt-20 md:pt-28 pb-4 px-4 md:px-6 container mx-auto flex flex-wrap items-center gap-x-4 gap-y-2">
        <button 
          onClick={onBack}
          className="group flex items-center text-sm font-medium text-slate-500 hover:text-brand-orange transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Results
        </button>
        <a
          href="#best-for"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('best-for')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="text-sm font-medium text-slate-500 hover:text-brand-orange transition-colors"
        >
          Jump to: Best for (Running, Walking, Training)
        </a>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:flex lg:gap-12 xl:gap-16 mb-24">
        
        {/* Left Col: Image Gallery - Sticky on Desktop */}
        <div className="lg:w-3/5">
             <div className="lg:sticky lg:top-40 space-y-4 md:max-w-[550px] lg:max-w-none mx-auto">


                {/* --- MOBILE: Carousel View --- */}
                <div className="md:hidden">
                    <div className="aspect-[10/9.92] md:aspect-square bg-slate-50 rounded-2xl overflow-hidden shadow-sm relative border border-slate-100">
                        <div 
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full"
                        >
                            {images.map((img, idx) => (
                                <img 
                                    key={idx} 
                                    src={img} 
                                    className="w-full h-full object-cover object-center flex-shrink-0 snap-center" 
                                    alt={`${product.name} view ${idx + 1}`} 
                                />
                            ))}
                        </div>


                        {/* Dots - inside image, bottom */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImgIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${
                                        activeImgIndex === idx ? 'bg-brand-orange w-4' : 'bg-slate-300'
                                    }`}
                                    aria-label={`Go to image ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- DESKTOP: Side-by-side Vertical Thumbnails View --- */}
                <div className="hidden md:flex gap-4">
                    {/* Thumbnails (Left) */}
                    <div className="flex flex-col gap-3 w-20 lg:w-[100px] flex-shrink-0 max-h-[600px] overflow-y-auto scrollbar-hide py-1">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImgIndex(idx)}
                                className={`w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                                    activeImgIndex === idx
                                    ? 'border-brand-dark shadow-md ring-2 ring-brand-dark/20 ring-offset-1'
                                    : 'border-transparent hover:border-slate-300 opacity-60 hover:opacity-100'
                                } bg-white`}
                            >
                                <img
                                    src={img}
                                    alt={`${product.name} thumbnail ${idx + 1}`}
                                    className="w-full h-full object-cover object-center mix-blend-multiply"
                                />
                            </button>
                        ))}
                    </div>

                    {/* Main Image (Right) */}
                    <div className="flex-1 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 relative items-center justify-center aspect-[4/5] md:aspect-square object-cover shadow-sm">
                        <img
                            src={images[activeImgIndex] || images[0]}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300"
                        />
                    </div>
                </div>
             </div>
        </div>

        {/* Right Col: Product Details */}
        <div className="lg:w-2/5 mt-8 lg:mt-0">
             
             {/* Header Info */}
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-brand-orange">
                      {[...Array(5)].map((_, i) => (
                         <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span
                      className="text-sm text-slate-500 font-bold underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-brand-orange"
                      onClick={() => testimonialsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    >
                      4000+ Verified Reviews
                    </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight leading-none mb-4">{product.name}</h1>
                
                {/* Price Display */}
                <div className="flex items-end gap-3 mb-4">
                   <div className="text-4xl font-black text-brand-orange">${formatPrice(selectedFinalPrice)}</div>
                   <div className="text-xl font-bold text-slate-400 line-through decoration-2 mb-1">${formatPrice(selectedCompareAtPrice)}</div>
                   <div className="text-sm font-bold text-slate-500 mb-1">each</div>
                   <div className="mb-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase">
                      Save {selectedSavingsPercent}% (${formatPrice(selectedSavingsAmount)})
                   </div>
                </div>

                {/* Scarcity / Views */}
                <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                   <div className="flex items-center gap-2">
                       <Users className="w-4 h-4 text-brand-dark" />
                       <span><span className="font-bold text-brand-dark">{viewers} people</span> {meta.scarcity_message}</span>
                   </div>
                   <div className="flex items-center gap-2 text-red-500 font-bold animate-selling-fast">
                       <Flame className="w-4 h-4 fill-current flex-shrink-0" />
                       <span>Selling Fast</span>
                   </div>
                </div>

                {/* Description Snippet */}
                {meta.custom_description_points && meta.custom_description_points.length > 0 ? (
                  <ul className="text-slate-600 leading-relaxed mb-6 space-y-2">
                    {meta.custom_description_points.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-brand-dark mt-1 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="text-slate-600 leading-relaxed mb-6 space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-brand-dark mt-1 flex-shrink-0" />
                      <span><span className="font-bold text-slate-900">Fast pain relief:</span> Cushions impact and supports your arch to reduce daily foot, heel, and knee discomfort.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-brand-dark mt-1 flex-shrink-0" />
                      <span><span className="font-bold text-slate-900">Better performance:</span> Improves stability and energy return so you can walk, train, and recover with less fatigue.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-brand-dark mt-1 flex-shrink-0" />
                      <span><span className="font-bold text-slate-900">Zero-risk purchase:</span> Try them with a <span className="font-bold text-brand-dark">60-Day Risk-Free Guarantee</span>.</span>
                    </li>
                  </ul>
                )}

                {/* Bundle Selector - Dropshipping Style */}
                <div className="space-y-3 mb-6">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Quantity</p>
                    
                    {/* Bundle 1 */}
                    <div 
                        onClick={() => setBundle(1)}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${bundle === 1 ? 'border-brand-orange bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bundle === 1 ? 'border-brand-orange' : 'border-slate-300'}`}>
                                    {bundle === 1 && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <span className="text-xl font-black text-slate-900 leading-none">1 Pair</span>
                                        <span className="bg-brand-orange text-white text-[10px] font-black px-2.5 py-1 rounded-md ml-3 uppercase tracking-wider">SAVE {getBundlePricing(1).discountPercent}%</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 mt-1.5">
                                        Save ${formatPrice(getBundlePricing(1).savings)} + Free Compression Socks
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-brand-orange block text-xl">${formatPrice(getBundlePricing(1).unitPrice)}</span>
                                <span className="text-xs text-slate-400 line-through font-bold">${formatPrice(product.price)} each</span>
                            </div>
                        </div>
                    </div>

                    {/* Bundle 2 */}
                    <div 
                        onClick={() => setBundle(2)}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${bundle === 2 ? 'border-brand-orange bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                         <div className="absolute top-0 right-0 -translate-y-1/2 z-10" style={{ transform: 'translateY(-50%) rotate(-3deg)' }}>
                            <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2 shadow-lg">
                                <span className="text-base leading-none" aria-hidden>🔥</span>
                                <span className="text-[11px] font-bold text-white">Most Popular</span>
                            </div>
                         </div>
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bundle === 2 ? 'border-brand-orange' : 'border-slate-300'}`}>
                                    {bundle === 2 && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <span className="text-xl font-black text-slate-900 leading-none">2 Pairs</span>
                                        <span className="bg-brand-orange text-white text-[10px] font-black px-2.5 py-1 rounded-md ml-3 uppercase tracking-wider">SAVE {getBundlePricing(2).discountPercent}%</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 mt-1.5">
                                        Save ${formatPrice(getBundlePricing(2).savings)} + Free Compression Socks
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-brand-orange block text-xl">${formatPrice(getBundlePricing(2).unitPrice)}</span>
                                <span className="text-xs text-slate-400 line-through font-bold">${formatPrice(product.price)} each</span>
                            </div>
                        </div>
                    </div>

                    {/* Bundle 3 */}
                    <div 
                        onClick={() => setBundle(3)}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${bundle === 3 ? 'border-brand-orange bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                         <div className="absolute top-0 right-0 -translate-y-1/2 z-10" style={{ transform: 'translateY(-50%) rotate(3deg)' }}>
                            <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2 shadow-lg">
                                <BadgeCheck className="h-4 w-4 shrink-0 text-brand-lime" />
                                <span className="text-[11px] font-bold text-white">Best Value</span>
                            </div>
                         </div>
                        <div className="flex justify-between items-center w-full">
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bundle === 3 ? 'border-brand-orange' : 'border-slate-300'}`}>
                                    {bundle === 3 && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center">
                                        <span className="text-xl font-black text-slate-900 leading-none">3 Pairs</span>
                                        <span className="bg-brand-orange text-white text-[10px] font-black px-2.5 py-1 rounded-md ml-3 uppercase tracking-wider">SAVE {getBundlePricing(3).discountPercent}%</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 mt-1.5">
                                        Save ${formatPrice(getBundlePricing(3).savings)} + Free Compression Socks
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-brand-orange block text-xl">${formatPrice(getBundlePricing(3).unitPrice)}</span>
                                <span className="text-xs text-slate-400 line-through font-bold">${formatPrice(product.price)} each</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Color Selector */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Color: <span className="text-brand-orange">{selectedColor}</span></span>
                    </div>
                    <div className="flex gap-3">
                        {availableColors.map((color: any) => (
                            <button
                                key={color.name || color}
                                onClick={() => setSelectedColor(color.name || color)}
                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                                    selectedColor === (color.name || color) 
                                    ? 'border-brand-orange shadow-lg scale-110' 
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                                title={color.label || color}
                            >
                                <div 
                                    className="w-8 h-8 rounded-full shadow-inner" 
                                    style={{ backgroundColor: color.value || (color.name === 'White' ? '#fff' : color.name === 'Black' ? '#000' : '#ccc') }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Size</span>
                        <button 
                            onClick={() => setIsSizeGuideOpen(true)}
                            className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-brand-orange transition-colors"
                        >
                            <Ruler className="w-3 h-3 mr-1" /> Size Guide
                        </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                        {availableSizes.map((size: any) => (
                            <button
                                key={size.label}
                                onClick={() => setSelectedSize(size.label)}
                                className={`h-11 rounded-lg border-2 font-black text-xs sm:text-sm uppercase tracking-tight transition-all ${
                                selectedSize === size.label 
                                ? 'border-black bg-brand-orange text-white shadow-md' 
                                : 'border-black text-black hover:border-brand-orange bg-white shadow-sm'
                                }`}
                            >
                                {size.label}
                            </button>
                        ))}
                    </div>
                     {selectedSize && (
                      <div className="mt-2 text-xs font-bold text-slate-500 animate-in fade-in bg-slate-100 inline-block px-2 py-1 rounded">
                         Fits: {availableSizes.find((s: any) => s.label === selectedSize)?.detail || selectedSize}
                      </div>
                   )}
                </div>

                {/* Offer Ends Soon Section */}
                <div className="mb-6 bg-brand-orange/5 border-2 border-dashed border-brand-orange/30 rounded-2xl p-4 overflow-hidden relative group hover:border-brand-orange/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="bg-brand-orange text-white p-1.5 rounded-lg animate-pulse">
                                <Timer className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-brand-dark uppercase tracking-tighter leading-none text-lg">{meta.timer_title}</h3>
                                <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mt-0.5">{meta.timer_subtitle}</p>
                            </div>
                        </div>
                        <div className="flex gap-1.5">
                            {[
                                { val: timeLeft.hours, label: 'H' },
                                { val: timeLeft.minutes, label: 'M' },
                                { val: timeLeft.seconds, label: 'S' }
                            ].map((unit, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="bg-brand-dark text-white font-mono font-black w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-brand-dark/20">
                                        {unit.val.toString().padStart(2, '0')}
                                    </div>
                                    <span className="text-[8px] font-black text-slate-400 mt-1">{unit.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 relative z-10">
                        <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-2 rounded-lg border border-slate-100">
                           <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                               <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">1 Pair Option</span>
                           </div>
                           <span className="text-xs font-black text-brand-dark bg-slate-100 px-2 py-1 rounded">{getBundlePricing(1).discountPercent}% DISCOUNT</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/60 backdrop-blur-sm p-2 rounded-lg border border-slate-100">
                           <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                               <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">2 Pairs Option</span>
                           </div>
                           <span className="text-xs font-black text-white bg-brand-orange px-2 py-1 rounded shadow-sm shadow-brand-orange/20">{getBundlePricing(2).discountPercent}% DISCOUNT</span>
                        </div>
                        <div className="flex justify-between items-center bg-brand-dark p-2 rounded-lg border border-brand-dark shadow-lg">
                           <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
                               <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">3 Pairs Option</span>
                           </div>
                           <span className="text-xs font-black text-brand-dark bg-brand-lime px-2 py-1 rounded">{getBundlePricing(3).discountPercent}% DISCOUNT</span>
                        </div>
                    </div>
                </div>

                {/* Promo marquee strip */}
                <div className="py-3.5 mb-6 rounded-2xl overflow-hidden border border-[#a5c918]" style={{ backgroundColor: '#C1F11D' }}>
                  <div className="flex animate-marquee whitespace-nowrap w-max" style={{ willChange: 'transform' }}>
                    {[...Array(2)].map((_, copy) => (
                      <div key={copy} className="flex items-center gap-8 md:gap-12 px-8 md:px-12">
                        <span className="flex items-center gap-2 text-brand-dark text-[11px] font-black uppercase tracking-wider">
                          <span className="text-sm" aria-hidden>🛡️</span>
                          60-day money-back guarantee
                        </span>
                        <span className="flex items-center gap-2 text-brand-dark text-[11px] font-black uppercase tracking-wider">
                          <span className="text-sm" aria-hidden>🌍</span>
                          Global shipping
                        </span>
                        <span className="flex items-center gap-2 text-brand-dark text-[11px] font-black uppercase tracking-wider">
                          <span className="text-sm" aria-hidden>✈️</span>
                          Tracked insured shipping
                        </span>
                        <span className="flex items-center gap-2 text-brand-dark text-[11px] font-black uppercase tracking-wider">
                          <span className="text-sm" aria-hidden>😊</span>
                          10,000+ Happy Customer
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm animate-fadeIn">
                        <X className="w-4 h-4 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Main Action - Add to Cart */}
                <Button
                    fullWidth
                    size="lg"
                    className={`h-16 text-xl shadow-xl relative overflow-hidden group bg-black text-white hover:bg-[#C1F11D] hover:text-white transition-all duration-300 ${isLoading ? 'opacity-90 cursor-wait' : ''}`}
                    onClick={() => {
                        if (selectedSize) {
                            onAddToCart(product, selectedSize, selectedColor, bundle);
                        }
                    }}
                    disabled={!selectedSize || isLoading}
                >
                   <span className="relative z-10 flex items-center justify-center gap-2 font-black tracking-tight uppercase">
                       {isLoading && <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                       {isLoading ? 'PROCESSING...' : (selectedSize ? (meta.primary_cta_text || 'ADD TO CART') : (meta.secondary_cta_text || 'SELECT SIZE'))}
                   </span>
                       {/* Shine effect */}
                       {!isLoading && <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine mix-blend-overlay" />}
                    </Button>

                {/* Payment methods under buy button - link opens popup */}
                <div className="mt-4 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setPaymentMethodsOpen(true)}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-brand-dark underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 rounded"
                    >
                        <Lock className="w-4 h-4 shrink-0" aria-hidden />
                        <span>Pay securely with these payment methods</span>
                    </button>
                </div>

                {/* Payment methods popup */}
                {paymentMethodsOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="payment-methods-title">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setPaymentMethodsOpen(false)} aria-hidden />
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 id="payment-methods-title" className="text-lg font-bold text-slate-900">Payment methods</h2>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethodsOpen(false)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                                <div className="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                    <img src="/payment-logos/visa.svg" alt="Visa" className="h-5 w-auto object-contain" />
                                </div>
                                <div className="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                    <img src="/payment-logos/mastercard.svg" alt="Mastercard" className="h-5 w-auto object-contain" />
                                </div>
                                <div className="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden">
                                    <img src="/payment-logos/amex.svg" alt="American Express" className="h-6 w-auto object-contain" />
                                </div>
                                <div className="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                    <img src="/payment-logos/applepay.svg" alt="Apple Pay" className="h-5 w-auto object-contain" />
                                </div>
                                <div className="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                    <img src="/payment-logos/googlepay.svg" alt="Google Pay" className="h-5 w-auto object-contain" />
                                </div>
                                <div className="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden">
                                    <img src="/payment-logos/shoppay.svg" alt="Shop Pay" className="h-6 w-auto object-contain" />
                                </div>
                                <div className="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                    <img src="/payment-logos/paypal.svg" alt="PayPal" className="h-5 w-auto object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* New Trust & FAQ Section - Based on requested design */}
                <div className="mt-8 pt-8 border-t border-slate-200">

                    <FAQSection />

                    {/* Shipping timeline + product snippet (under Q&A, above reviews) */}
                    {(() => {
                        const now = new Date();
                        const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const ordered = new Date(now); ordered.setDate(ordered.getDate() - 10);
                        const shippedStart = new Date(now); shippedStart.setDate(shippedStart.getDate() - 6);
                        const shippedEnd = new Date(now); shippedEnd.setDate(shippedEnd.getDate() - 4);
                        const deliveredStart = new Date(now); deliveredStart.setDate(deliveredStart.getDate() - 1);
                        const deliveredEnd = new Date(now); deliveredEnd.setDate(deliveredEnd.getDate() + 6);
                        return (
                    <div className="mt-10 pt-8 border-t border-slate-200">
                        <div className="flex items-start justify-between gap-4 max-w-2xl mx-auto mb-8">
                            <div className="flex flex-col items-center flex-1">
                                <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center text-white shadow-md">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <span className="mt-2 text-sm font-bold text-slate-900">Ordered</span>
                                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{fmt(ordered)}</span>
                            </div>
                            <div className="flex-1 min-w-[20px] pt-6 flex items-center" aria-hidden>
                                <svg viewBox="0 0 100 2" className="w-full h-1 block" preserveAspectRatio="none">
                                  <line x1="0" y1="1" x2="100" y2="1" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="6 4" strokeLinecap="round" className="animate-running-dash" style={{ strokeDashoffset: 0 }} />
                                </svg>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <div className="w-12 h-12 rounded-full bg-brand-dark flex items-center justify-center text-white shadow-md">
                                    <Truck className="w-5 h-5" />
                                </div>
                                <span className="mt-2 text-sm font-bold text-slate-900">Shipped</span>
                                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{fmt(shippedStart)} – {fmt(shippedEnd)}</span>
                            </div>
                            <div className="flex-1 min-w-[20px] pt-6 flex items-center" aria-hidden>
                                <svg viewBox="0 0 100 2" className="w-full h-1 block" preserveAspectRatio="none">
                                  <line x1="0" y1="1" x2="100" y2="1" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="6 4" strokeLinecap="round" className="animate-running-dash" style={{ strokeDashoffset: 0 }} />
                                </svg>
                            </div>
                            <div className="flex flex-col items-center flex-1">
                                <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-md">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <span className="mt-2 text-sm font-bold text-slate-900">Delivered</span>
                                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{fmt(deliveredStart)} – {fmt(deliveredEnd)}</span>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto text-center">
                            Get all-day support in seconds. AeroTouch insoles slip in and stay put—no trimming hassle for most sizes. Ideal for anyone who wants proven arch and heel support with lasting comfort.
                        </p>
                    </div>
                        );
                    })()}

                    {/* Testimonial Card */}
                    <div
                        ref={testimonialsRef}
                        className="mt-8 rounded-2xl p-5 border border-slate-200 relative bg-gradient-to-br from-slate-50 to-white overflow-hidden"
                        onMouseEnter={() => setIsTestimonialHovered(true)}
                        onMouseLeave={() => setIsTestimonialHovered(false)}
                    >
                        <div className="flex gap-4 items-start relative z-10">
                            <img
                                src={currentTestimonial.image}
                                alt={currentTestimonial.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-black text-slate-900 leading-none">{currentTestimonial.name}</p>
                                        <p className="text-[11px] text-slate-500 mt-1">{currentTestimonial.role}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
                                        <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">Verified</span>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-slate-800 leading-snug mb-3">
                                    "{currentTestimonial.quote}"
                                </p>

                                <div className="mt-3 flex flex-col gap-2">
                                    <div className="flex text-brand-orange gap-0.5">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-700">
                                            {currentTestimonial.result}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-1.5 mt-5 relative z-10">
                            {TESTIMONIALS.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    aria-label={`Show review ${i + 1}`}
                                    onClick={() => setActiveTestimonial(i)}
                                    className={`transition-all rounded-full ${i === activeTestimonial ? 'w-5 h-1.5 bg-brand-dark' : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'}`}
                                />
                            ))}
                        </div>

                    {/* Customer Video Snippets */}
                    <div id="customer-videos-section" className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Play className="w-3.5 h-3.5 text-brand-orange fill-brand-orange" />
                                Customer Videos
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Swipe for more</span>
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
                            {[
                                { id: 2, src: productVideos.video2 },
                                { id: 3, src: productVideos.video3 },
                                { id: 4, src: productVideos.video4 },
                                { id: 5, src: productVideos.video5 },
                                { id: 6, src: productVideos.video6 }
                            ].map((v) => (
                                <div 
                                    key={v.id} 
                                    className="flex-shrink-0 w-32 cursor-pointer relative"
                                    onClick={() => setExpandedVideo({ id: v.id, src: v.src })}
                                    onMouseEnter={() => {
                                        const vid = videoRefs.current[v.id];
                                        if (vid) { vid.muted = false; }
                                        setUnmutedVideoId(v.id);
                                    }}
                                    onMouseLeave={() => {
                                        const vid = videoRefs.current[v.id];
                                        if (vid) { vid.muted = true; }
                                        setUnmutedVideoId(null);
                                    }}
                                >
                                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-sm bg-black">
                                        <video 
                                            ref={(el) => { videoRefs.current[v.id] = el; }}
                                            src={v.src} 
                                            className="w-full h-full object-cover" 
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            preload="metadata"
                                        />
                                        {/* Mobile mute/unmute toggle */}
                                        <button
                                            type="button"
                                            className="md:hidden absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 active:scale-90 transition-transform"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const vid = videoRefs.current[v.id];
                                                if (!vid) return;
                                                if (unmutedVideoId === v.id) {
                                                    vid.muted = true;
                                                    setUnmutedVideoId(null);
                                                } else {
                                                    // Mute all others first
                                                    Object.values(videoRefs.current).forEach((otherVid: HTMLVideoElement | null) => {
                                                        if (otherVid) otherVid.muted = true;
                                                    });
                                                    vid.muted = false;
                                                    setUnmutedVideoId(v.id);
                                                }
                                            }}
                                            aria-label={unmutedVideoId === v.id ? 'Mute' : 'Unmute'}
                                        >
                                            {unmutedVideoId === v.id 
                                                ? <Volume2 className="w-3.5 h-3.5 text-white" /> 
                                                : <VolumeX className="w-3.5 h-3.5 text-white" />
                                            }
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Expanded Video Modal */}
                    {expandedVideo && (
                        <div 
                            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                            onClick={() => setExpandedVideo(null)}
                        >
                            <div 
                                className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <video
                                    ref={expandedVideoRef}
                                    src={expandedVideo.src}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    playsInline
                                    preload="auto"
                                />
                                {/* Close button */}
                                <button
                                    type="button"
                                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 hover:bg-black/70 transition-colors"
                                    onClick={() => setExpandedVideo(null)}
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                                {/* Mute toggle */}
                                <button
                                    type="button"
                                    className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 hover:bg-black/70 active:scale-90 transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const vid = expandedVideoRef.current;
                                        if (vid) vid.muted = !vid.muted;
                                        setUnmutedVideoId(prev => prev === expandedVideo.id ? null : expandedVideo.id);
                                    }}
                                    aria-label="Toggle mute"
                                >
                                    {unmutedVideoId === expandedVideo.id
                                        ? <Volume2 className="w-4 h-4 text-white" />
                                        : <VolumeX className="w-4 h-4 text-white" />
                                    }
                                </button>
                            </div>
                        </div>
                    )}
                </div>

        </div>
      </div>
    </div>
  </div>
      
      {/* Size Guide Modal - Shoe Sizing Chart */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-slate-950/65 backdrop-blur-[6px] animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-t-[2rem] sm:rounded-[2rem] border border-white/15 bg-[#0B1220]/85 backdrop-blur-xl shadow-[0_30px_90px_rgba(2,6,23,0.75)] animate-in zoom-in-95 duration-200 my-auto sm:my-0 overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -left-12 h-44 w-44 rounded-full bg-brand-lime/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-8 h-48 w-48 rounded-full bg-brand-orange/25 blur-3xl" />

            <div className="relative flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-white/10">
              <div className="flex items-start gap-3 pr-10">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/10 border border-white/20 text-brand-lime flex items-center justify-center shrink-0">
                  <Ruler className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-slate-300">AeroTouch Fit Guide</p>
                  <h3 className="text-lg sm:text-2xl font-black text-white leading-tight">Shoe Sizing Chart</h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-300">Match your regular shoe size and trim if needed.</p>
                </div>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="absolute top-4 sm:top-5 right-4 h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center justify-center touch-manipulation"
                aria-label="Close size guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto overflow-x-hidden flex-1 min-h-0">
              <div className="rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md p-3 sm:p-4">
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <table className="w-full min-w-[380px] border-collapse text-xs sm:text-sm text-left">
                    <thead>
                      <tr className="bg-white/10 text-slate-100">
                        <th className="px-2.5 py-3 sm:px-4 font-bold text-left text-xs sm:text-sm uppercase tracking-wide">🇺🇸 US Men&apos;s</th>
                        <th className="px-2.5 py-3 sm:px-4 font-bold text-left text-xs sm:text-sm uppercase tracking-wide">🇺🇸 US Women&apos;s</th>
                        <th className="px-2.5 py-3 sm:px-4 font-bold text-left text-xs sm:text-sm uppercase tracking-wide">🇬🇧 UK</th>
                        <th className="px-2.5 py-3 sm:px-4 font-bold text-left text-xs sm:text-sm uppercase tracking-wide">🇪🇺 EU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { men: '5', women: '6', uk: '4', eu: '35-36' },
                        { men: '6', women: '7', uk: '5', eu: '37-38' },
                        { men: '7', women: '8', uk: '6', eu: '39-40' },
                        { men: '8', women: '9', uk: '7', eu: '41-42' },
                        { men: '9', women: '10', uk: '8', eu: '43-44' },
                        { men: '10', women: '11', uk: '9', eu: '45-46' },
                        { men: '11', women: '12', uk: '10', eu: '47-48' },
                        { men: '12', women: '13', uk: '11', eu: '49-50' },
                        { men: '13', women: '14', uk: '12', eu: '51-52' },
                        { men: '14', women: '15', uk: '13', eu: '53-54' },
                        { men: '15', women: '16', uk: '14', eu: '55-56' },
                      ].map((row, i) => (
                        <tr key={row.men + row.women} className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.04]'}>
                          <td className="px-2.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-100 border-b border-white/10">{row.men}</td>
                          <td className="px-2.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-100 border-b border-white/10">{row.women}</td>
                          <td className="px-2.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-100 border-b border-white/10">{row.uk}</td>
                          <td className="px-2.5 py-2.5 sm:px-4 sm:py-3 font-semibold text-slate-100 border-b border-white/10">{row.eu}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/15 bg-white/[0.05] p-3.5 sm:p-4">
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-slate-300">Trim-to-Fit</p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-100 leading-relaxed">
                    Follow the cut lines on the insole heel and trim gradually with scissors.
                  </p>
                </div>
                <div className="rounded-xl border border-brand-lime/35 bg-brand-lime/10 p-3.5 sm:p-4">
                  <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em] text-brand-lime">Between Sizes</p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-100 leading-relaxed">
                    Pick the larger size for comfort, then trim down for precision.
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 text-center pb-4 sm:pb-0">
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="w-full sm:w-auto rounded-xl bg-brand-lime text-slate-950 font-black uppercase tracking-wider py-3 px-8 text-sm shadow-[0_10px_24px_rgba(193,241,29,0.35)] hover:brightness-95 transition-all touch-manipulation"
                >
                  Got it, thanks!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Built for All Purposes - Carousel (above reviews) - full width */}
      <section className="py-16 md:py-20 bg-white border-t border-slate-100 w-full overflow-hidden">
        <div className="w-full px-4 md:px-6 mb-8">
          <h2 className="text-center text-2xl md:text-4xl font-black text-slate-900">
            Built for <span className="text-brand-orange">All Purposes</span>
          </h2>
        </div>
        <div className="relative w-full">
          <div
            ref={builtForScrollRef}
            className="flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide py-2 px-4 md:px-8"
            style={{ scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {BUILT_FOR_PURPOSES.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-[280px] md:w-[320px] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-lg transition-shadow"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-slate-900 py-4 px-4">
                  <span className="text-white text-base font-bold uppercase tracking-wide">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            aria-label="Previous"
            onClick={() => setBuiltForIndex((i) => Math.max(0, i - 1))}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => setBuiltForIndex((i) => Math.min(BUILT_FOR_PURPOSES.length - 1, i + 1))}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border-2 border-slate-200 shadow-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {BUILT_FOR_PURPOSES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setBuiltForIndex(i)}
              className={`transition-all rounded-full ${i === builtForIndex ? 'w-5 h-1.5 bg-brand-dark' : 'w-1.5 h-1.5 bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
        </div>
      </section>

      {/* Running banner - trust strip */}
      <section className="py-4 overflow-hidden border-y border-[#a5c918]" style={{ backgroundColor: '#C1F11D' }}>
        <div className="flex animate-marquee whitespace-nowrap w-max" style={{ willChange: 'transform' }}>
          {[...Array(2)].map((_, copy) => (
            <div key={copy} className="flex items-center gap-8 md:gap-12 px-8 md:px-12">
              <span className="flex items-center gap-2.5 text-slate-900 text-sm md:text-base font-bold tracking-wide">
                <span className="text-lg leading-none" aria-hidden>🛡️</span>
                60-day money-back guarantee
              </span>
              <span className="flex items-center gap-2.5 text-slate-900 text-sm md:text-base font-bold tracking-wide">
                <span className="text-lg leading-none" aria-hidden>🌍</span>
                Global shipping
              </span>
              <span className="flex items-center gap-2.5 text-slate-900 text-sm md:text-base font-bold tracking-wide">
                <span className="text-lg leading-none" aria-hidden>✈️</span>
                Tracked insured shipping
              </span>
              <span className="flex items-center gap-2.5 text-slate-900 text-sm md:text-base font-bold tracking-wide">
                <span className="text-lg leading-none" aria-hidden>😊</span>
                10,000+ Happy Customer
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Kit Combo Promotion */}
      {meta.show_kit_combo && (
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">

            {/* Section Header */}
            <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-brand-dark text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
              Bundle & Save
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
              The Complete <span className="text-brand-orange">Recovery Kit</span>
            </h2>
          </div>

          {/* Main Card */}
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl">

            {/* Diagonal accent stripe */}
            <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
              <div className="absolute -top-20 -right-20 w-[500px] h-[140px] bg-brand-lime/10 rotate-[-25deg] origin-top-right" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[80px] bg-brand-orange/8 rotate-[-15deg] origin-bottom-left" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* Left: Product Showcase */}
              <div className="relative p-6 md:p-10 lg:p-12 flex items-center justify-center bg-gradient-to-br from-white/[0.04] to-transparent min-h-[280px] lg:min-h-[420px]">

                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                {/* Product Stack — horizontal cards stacked vertically */}
                <div className="relative flex flex-col items-center gap-3 md:gap-4 w-full max-w-md mx-auto">

                  {/* Primary product — insoles */}
                  <div className="relative z-10 group/insole cursor-pointer w-full">
                    <div className="bg-white rounded-2xl p-3 md:p-4 shadow-2xl shadow-black/30 transition-all duration-500 group-hover/insole:translate-y-[-4px] group-hover/insole:shadow-brand-lime/20 flex items-center gap-4">
                      <div className="w-[74px] h-[74px] md:w-[99px] md:h-[99px] flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
                        <img src={images[0]} alt="AeroTouch Insoles" className="w-full h-full object-cover object-center" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wider">AeroTouch Insoles</p>
                        <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-0.5">Performance Support</p>
                        <p className="text-base md:text-lg font-black text-brand-orange mt-2">${formatPrice(product.price)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Plus Connector */}
                  <div className="z-20">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-lime flex items-center justify-center shadow-lg shadow-brand-lime/30">
                      <Plus className="w-4 h-4 md:w-5 md:h-5 text-brand-dark" strokeWidth={3} />
                    </div>
                  </div>

                  {/* Secondary product — socks */}
                  <div className="relative z-10 group/sock cursor-pointer w-full">
                    <div className="bg-white rounded-2xl p-3 md:p-4 shadow-2xl shadow-black/30 transition-all duration-500 group-hover/sock:translate-y-[-4px] group-hover/sock:shadow-brand-orange/20 flex items-center gap-4">
                      <div className="w-[74px] h-[74px] md:w-[99px] md:h-[99px] flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=400" alt="Recovery Compression Socks" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wider">Recovery Socks</p>
                        <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-0.5">Compression 20-30mmHg</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-400 line-through font-bold">$30.00</span>
                          <span className="text-base md:text-lg font-black text-brand-orange">$15.00</span>
                        </div>
                      </div>
                    </div>
                    {/* 50% off badge */}
                    <div className="absolute -top-2.5 -right-2.5 z-30">
                      <div className="bg-brand-orange text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-xl shadow-brand-orange/40 uppercase tracking-wider animate-pulse" style={{ transform: 'rotate(6deg)' }}>
                        50% Off
                      </div>
                    </div>
                  </div>

                  {/* Plus Connector */}
                  <div className="z-20">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-brand-lime flex items-center justify-center shadow-lg shadow-brand-lime/30">
                      <Plus className="w-4 h-4 md:w-5 md:h-5 text-brand-dark" strokeWidth={3} />
                    </div>
                  </div>

                  {/* Third product — Recovery Gel */}
                  <div className="relative z-10 group/gel cursor-pointer w-full">
                    <div className="bg-white rounded-2xl p-3 md:p-4 shadow-2xl shadow-black/30 transition-all duration-500 group-hover/gel:translate-y-[-4px] group-hover/gel:shadow-emerald-500/20 flex items-center gap-4">
                      <div className="w-[74px] h-[74px] md:w-[99px] md:h-[99px] flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
                        <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400" alt="Recovery Muscle Gel" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-wider">Recovery Gel</p>
                        <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-0.5">Deep Muscle Relief</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-400 line-through font-bold">$25.00</span>
                          <span className="text-base md:text-lg font-black text-brand-orange">$12.50</span>
                        </div>
                      </div>
                    </div>
                    {/* 50% off badge */}
                    <div className="absolute -top-2.5 -right-2.5 z-30">
                      <div className="bg-brand-orange text-white text-[9px] font-black px-2.5 py-1 rounded-lg shadow-xl shadow-brand-orange/40 uppercase tracking-wider animate-pulse" style={{ transform: 'rotate(6deg)' }}>
                        50% Off
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Right: Details + CTA */}
              <div className="p-6 md:p-10 lg:p-12 flex flex-col justify-center">

                {/* Social Proof row */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex -space-x-2">
                    {['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop'].map((src, i) => (
                      <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-slate-800 object-cover" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    <span className="font-bold text-white">1000+ athletes bought this combo</span>
                  </p>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-3">
                  Save more when<br />
                  you <span className="bg-gradient-to-r from-brand-lime to-emerald-300 bg-clip-text text-transparent">bundle</span>
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
                  Get our best-selling insoles + medical-grade compression socks together at an exclusive bundle price.
                </p>

                {/* Feature list — icon row */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { icon: Activity, label: '30% More', sub: 'Blood Flow' },
                    { icon: Wrench, label: 'Medical', sub: 'Grade' },
                    { icon: Truck, label: 'Free', sub: 'Shipping' },
                  ].map((feat, i) => (
                    <div key={i} className="bg-white/[0.06] border border-white/[0.08] rounded-xl p-3 text-center backdrop-blur-sm hover:bg-white/[0.1] transition-colors">
                      <feat.icon className="w-5 h-5 text-brand-lime mx-auto mb-1.5" strokeWidth={2} />
                      <p className="text-[11px] font-black text-white uppercase tracking-wider leading-none">{feat.label}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{feat.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Price summary card */}
                <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl p-4 mb-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bundle Price</span>
                    <span className="bg-brand-lime text-brand-dark text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">You Save ${(product.price + 27.50 - 39.98).toFixed(0)}</span>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-black text-white leading-none">$39.98</span>
                    <span className="text-base text-slate-500 line-through font-bold mb-1">${(product.price + 27.50).toFixed(2)}</span>
                  </div>
                  {/* Urgency stock bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3 text-brand-orange fill-brand-orange" />
                        Selling fast
                      </span>
                      <span className="text-[10px] font-bold text-brand-orange">Only a few combos left</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-orange to-red-500 rounded-full animate-bar-stripe-run" style={{ width: '78%', backgroundSize: '11.31px 11.31px', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 6px)' }} />
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-brand-lime/25 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 animate-glow-pulse opacity-50 group-hover:opacity-80" />
                  <button
                    className="relative w-full inline-flex items-center justify-center bg-brand-lime text-brand-dark hover:bg-white hover:shadow-2xl font-black py-4 text-base md:text-lg uppercase tracking-wider rounded-xl shadow-xl shadow-brand-lime/20 transition-all duration-300"
                    onClick={handleAddBundleToCart}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add Bundle to Cart
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 mt-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3 text-brand-lime" /> 60-Day Guarantee
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3 h-3 text-brand-lime" /> Free Returns
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
      )}

      {/* New Tech Specs Section */}
      {meta.show_tech_specs && (
        <ProductTechSpecs currentProductId={product.id} onProductSelect={onProductSelect} onNavigateToBlog={onNavigateToBlog} />
      )}
      
    </div>
  );
};
