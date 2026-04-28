import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { Button } from '../components/Button';
import { Star, ChevronLeft, Truck, RotateCcw, Check, ShoppingBag, ShieldCheck, Timer, Users, CreditCard, Lock, ChevronDown, ChevronUp, Flame, BadgeCheck, Smile, Headphones, X, Play, Volume2, VolumeX, MapPin, Box, CircleDollarSign, Activity, Wrench, Tag } from 'lucide-react';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { ProductCard } from '../components/ProductCard';
import { getLinePricing } from '../utils/pricing';
import { SplitTestimonials } from '../components/SplitTestimonials';
import { StaggeredTestimonials } from '../components/StaggeredTestimonials';
import { ProductDescription } from '../components/ProductDescription';

interface SecondaryProductPageProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  onBack: () => void;
  onProductSelect?: (product: Product) => void;
  isLoading?: boolean;
  error?: string | null;
}

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Fitness Enthusiast',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    quote: 'Great product! Really helps with recovery after my workouts.',
    result: 'Improved recovery time'
  },
  {
    name: 'Mike T.',
    role: 'Office Worker',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
    quote: 'Use these daily at work. Makes a huge difference in comfort.',
    result: 'All-day comfort achieved'
  },
  {
    name: 'Emily R.',
    role: 'Athlete',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    quote: 'Excellent quality and durability. Would highly recommend!',
    result: 'Perfect for athletic use'
  }
];

const FAQs = [
  {
    question: 'How do I use this product?',
    answer: 'Simply follow the included instructions. Most products are designed for easy at-home use.'
  },
  {
    question: 'What is the return policy?',
    answer: 'We offer a 60-day risk-free guarantee. If you\'re not satisfied, contact us for a full refund.'
  },
  {
    question: 'Is this product safe for daily use?',
    answer: 'Yes, all our products are designed for regular use and made with body-safe materials.'
  }
];

export const SecondaryProductPage: React.FC<SecondaryProductPageProps> = ({
  product: initialProduct,
  onAddToCart,
  onBack,
  onProductSelect,
  isLoading = false,
  error = null
}) => {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [shopifyProduct, setShopifyProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>('One Size');
  const [selectedColor, setSelectedColor] = useState<string>('Black');
  const [bundle, setBundle] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [viewers] = useState(Math.floor(Math.random() * 50) + 15);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 12, seconds: 45 });
  const [paymentMethodsOpen, setPaymentMethodsOpen] = useState(false);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  // Fetch product from Shopify
  useEffect(() => {
    const fetchShopifyData = async () => {
      const handle = initialProduct.id;
      try {
        const fetchedProduct = await shopify.product.fetchByHandle(handle);
        if (fetchedProduct) {
          setShopifyProduct(fetchedProduct);
          setProduct(mapShopifyProduct(fetchedProduct));

          const firstVariant = fetchedProduct.variants?.[0];
          if (firstVariant) {
            const sizeOption = firstVariant.selectedOptions?.find((o: any) => o.name === 'Size');
            const colorOption = firstVariant.selectedOptions?.find((o: any) => o.name === 'Color');
            if (sizeOption) setSelectedSize(sizeOption.value);
            if (colorOption) setSelectedColor(colorOption.value);
          }
        }
      } catch (err) {
        console.warn('Could not fetch product from Shopify, using local data', err);
      }
    };
    fetchShopifyData();
  }, [initialProduct.id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const shopifyProducts = await shopify.product.fetchAll(20);
        if (shopifyProducts && shopifyProducts.length > 0) {
          const filtered = shopifyProducts
            .filter((p: any) => p.id !== initialProduct.id)
            .slice(0, 3)
            .map(mapShopifyProduct);
          if (filtered.length > 0) {
            setRelatedProducts(filtered);
          }
        }
      } catch (err) {
        console.warn('Could not fetch related products', err);
      }
    };
    fetchRelated();
  }, [initialProduct.id]);

  // Timer logic
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  // Testimonial auto-scroll
  useEffect(() => {
    if (isTestimonialHovered) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTestimonialHovered]);

  const sizeOption = shopifyProduct?.options?.find((o: any) => o.name === 'Size');
  const colorOption = shopifyProduct?.options?.find((o: any) => o.name === 'Color');

  const availableSizes = sizeOption?.values?.map((v: any) => v.value) || ['One Size'];
  const availableColors = colorOption?.values?.map((v: any) => ({
    name: v.value,
    value: v.value
  })) || [{ name: 'Black', value: '#1E293B', label: 'Black' }];

  const fallbackImage = product.image || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop';
  const images = Array.from(
    new Set([...(product.images || []), fallbackImage].filter((img) => Boolean(img && img.trim())))
  );
  const secondaryImages = images.slice(1, 5);

  const getBundlePricing = (qty: number) => getLinePricing(product.price, qty);
  const selectedBundlePricing = getBundlePricing(bundle);

  const handleScroll = () => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      const newIndex = Math.round(scrollRef.current.scrollLeft / width);
      if (newIndex !== activeImgIndex) {
        setActiveImgIndex(newIndex);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = activeImgIndex * width;
      if (Math.abs(currentScroll - targetScroll) > 20) {
        scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
    }
  }, [activeImgIndex]);

  const handleAddToCart = () => {
    if (selectedSize) {
      onAddToCart(product, selectedSize, selectedColor, bundle);
    }
  };

  const currentTestimonial = TESTIMONIALS[activeTestimonial];

  return (
    <div className="min-h-screen bg-slate-50 animate-in fade-in duration-500 pb-24 md:pb-0">
      
      {/* Sticky Promo Bar */}
      <div className="bg-brand-dark text-white text-center py-2 text-xs font-bold uppercase tracking-widest sticky top-[64px] z-30">
        <span className="animate-pulse text-brand-lime mr-2">●</span> High Demand: {viewers} Sold in the last hour
      </div>

      {/* Breadcrumb / Back Navigation */}
      <div className="pt-8 md:pt-16 pb-4 px-4 md:px-6 container mx-auto flex flex-wrap items-center gap-x-4 gap-y-2">
        <button 
          onClick={onBack}
          className="group flex items-center text-sm font-medium text-slate-500 hover:text-brand-orange transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Shop
        </button>
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
                        {/* Dots */}
                        {images.length > 1 && (
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
                        )}
                    </div>
                </div>

                {/* --- DESKTOP: Vertical Thumbnails View --- */}
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
                      {product.reviews} Verified Reviews
                    </span>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight leading-none mb-4">{product.name}</h1>
                
                {/* Price Display */}
                <div className="flex items-end gap-3 mb-4">
                   <div className="text-4xl font-black text-brand-orange">${selectedBundlePricing.unitPrice.toFixed(2)}</div>
                   {bundle > 1 && (
                     <>
                       <div className="text-xl font-bold text-slate-400 line-through decoration-2 mb-1">${product.price.toFixed(2)}</div>
                       <div className="text-sm font-bold text-slate-500 mb-1">each</div>
                       <div className="mb-2 bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase">
                          Save {selectedBundlePricing.discountPercent}% (${selectedBundlePricing.savings.toFixed(2)})
                       </div>
                     </>
                   )}
                </div>

                {/* Scarcity / Views */}
                <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                   <div className="flex items-center gap-2">
                       <Users className="w-4 h-4 text-brand-dark" />
                       <span><span className="font-bold text-brand-dark">{viewers} people</span> viewing this</span>
                   </div>
                   <div className="flex items-center gap-2 text-red-500 font-bold animate-pulse">
                       <Flame className="w-4 h-4 fill-current flex-shrink-0" />
                       <span>Selling Fast</span>
                   </div>
                </div>

                {/* Description Snippet */}
                <p className="text-slate-600 leading-relaxed mb-6">{product.tagline || product.description}</p>
                {product.features && product.features.length > 0 && (
                  <ul className="text-slate-600 leading-relaxed mb-6 space-y-2">
                     {product.features.map((feature, idx) => (
                       <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-brand-dark mt-1 flex-shrink-0" />
                          <span><span className="font-bold text-slate-900">{feature.split(':')[0]}:</span> {feature.split(':').slice(1).join(':')}</span>
                       </li>
                     ))}
                  </ul>
                )}

                {/* Bundle Selector - Dropshipping Style */}
                <div className="space-y-3 mb-6">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Quantity</p>
                    {[1, 2, 3].map((qty) => (
                      <div 
                          key={qty}
                          onClick={() => setBundle(qty)}
                          className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${bundle === qty ? 'border-brand-orange bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                          {qty === 2 && (
                             <div className="absolute top-0 right-0 -translate-y-1/2 z-10" style={{ transform: 'translateY(-50%) rotate(-3deg)' }}>
                                <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2 shadow-lg">
                                    <span className="text-base leading-none" aria-hidden>🔥</span>
                                    <span className="text-[11px] font-bold text-white">Most Popular</span>
                                </div>
                             </div>
                          )}
                          {qty === 3 && (
                             <div className="absolute top-0 right-0 -translate-y-1/2 z-10" style={{ transform: 'translateY(-50%) rotate(3deg)' }}>
                                <div className="flex items-center gap-2 rounded-full bg-black px-4 py-2 shadow-lg">
                                    <BadgeCheck className="h-4 w-4 shrink-0 text-brand-lime" />
                                    <span className="text-[11px] font-bold text-white">Best Value</span>
                                </div>
                             </div>
                          )}
                          <div className="flex justify-between items-center w-full">
                              <div className="flex items-center gap-4">
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bundle === qty ? 'border-brand-orange' : 'border-slate-300'}`}>
                                      {bundle === qty && <div className="w-2.5 h-2.5 rounded-full bg-brand-orange" />}
                                  </div>
                                  <div className="flex flex-col">
                                      <div className="flex items-center">
                                          <span className="text-xl font-black text-slate-900 leading-none">{qty} {qty === 1 ? 'Item' : 'Items'}</span>
                                          {qty > 1 && <span className="bg-brand-orange text-white text-[10px] font-black px-2.5 py-1 rounded-md ml-3 uppercase tracking-wider">SAVE {getBundlePricing(qty).discountPercent}%</span>}
                                      </div>
                                      {qty > 1 && (
                                        <p className="text-sm font-bold text-slate-600 mt-1.5">
                                            Save ${(getBundlePricing(qty).savings).toFixed(2)} at checkout
                                        </p>
                                      )}
                                  </div>
                              </div>
                              <div className="text-right">
                                  <span className="font-bold text-brand-orange block text-xl">${getBundlePricing(qty).unitPrice.toFixed(2)}</span>
                                  {qty > 1 && <span className="text-xs text-slate-400 line-through font-bold">${product.price.toFixed(2)} each</span>}
                              </div>
                          </div>
                      </div>
                    ))}
                </div>

                {/* Color Selector */}
                {availableColors.length > 1 && (
                  <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Color: <span className="text-brand-orange">{selectedColor}</span></span>
                      </div>
                      <div className="flex gap-3">
                          {availableColors.map((color: any) => (
                              <button
                                  key={color.name}
                                  onClick={() => setSelectedColor(color.name)}
                                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                                      selectedColor === color.name 
                                      ? 'border-brand-orange shadow-lg scale-110' 
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                  title={color.name}
                              >
                                  <div 
                                      className="w-8 h-8 rounded-full shadow-inner" 
                                      style={{ backgroundColor: color.value || (color.name === 'White' ? '#fff' : color.name === 'Black' ? '#000' : '#ccc') }}
                                  />
                              </button>
                          ))}
                      </div>
                  </div>
                )}

                {/* Size Selector */}
                {availableSizes.length > 1 && (
                  <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">Select Size</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                          {availableSizes.map((size: any) => (
                              <button
                                  key={size}
                                  onClick={() => setSelectedSize(size)}
                                  className={`h-11 rounded-lg border-2 font-black text-xs sm:text-sm uppercase tracking-tight transition-all ${
                                  selectedSize === size 
                                  ? 'border-black bg-brand-orange text-white shadow-md' 
                                  : 'border-black text-black hover:border-brand-orange bg-white shadow-sm'
                                  }`}
                              >
                                  {size}
                              </button>
                          ))}
                      </div>
                  </div>
                )}

                {/* Offer Ends Soon Section */}
                <div className="mb-6 bg-brand-orange/5 border-2 border-dashed border-brand-orange/30 rounded-2xl p-4 overflow-hidden relative group hover:border-brand-orange/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="bg-brand-orange text-white p-1.5 rounded-lg animate-pulse">
                                <Timer className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-brand-dark uppercase tracking-tighter leading-none text-lg">OFFER ENDS SOON</h3>
                                <p className="text-[10px] font-bold text-brand-orange uppercase tracking-widest mt-0.5">Limited Time Discount</p>
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
                    onClick={handleAddToCart}
                    disabled={!selectedSize || isLoading || typeof selectedSize === 'undefined'}
                >
                   <span className="relative z-10 flex items-center justify-center gap-2 font-black tracking-tight uppercase">
                       {isLoading && <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                       {isLoading ? 'PROCESSING...' : (selectedSize ? `ADD TO CART - $${selectedBundlePricing.total.toFixed(2)}` : 'SELECT SIZE')}
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setPaymentMethodsOpen(false)} aria-hidden />
                        <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 id="payment-methods-title" className="text-lg font-bold text-slate-900">Payment methods</h2>
                                <button
                                    type="button"
                                    onClick={() => setPaymentMethodsOpen(false)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 items-center">
                                {['visa.svg', 'mastercard.svg', 'amex.svg', 'applepay.svg', 'googlepay.svg', 'shoppay.svg', 'paypal.svg'].map(logo => (
                                  <div key={logo} className="h-9 px-3 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                                      <img src={`/payment-logos/${logo}`} alt={logo.split('.')[0]} className="h-5 w-auto object-contain" />
                                  </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Trust Badges Grid */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                    <div className="grid grid-cols-3 gap-2 mb-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 flex items-center justify-center mb-2">
                                <Truck className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] md:text-xs font-black uppercase leading-tight tracking-tight">Tracked Insured Shipping</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 flex items-center justify-center mb-2">
                                <Smile className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] md:text-xs font-black uppercase leading-tight tracking-tight">Try Risk-Free for 60 Days</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 flex items-center justify-center mb-2">
                                <Headphones className="w-8 h-8 text-brand-dark" strokeWidth={1.5} />
                            </div>
                            <span className="text-[10px] md:text-xs font-black uppercase leading-tight tracking-tight">24/7 Customer Support</span>
                        </div>
                    </div>

                    <div className="space-y-0 border-t border-slate-100">
                        {FAQs.map((item, idx) => (
                            <div key={idx} className="border-b border-slate-100">
                                <button 
                                    className="w-full py-4 flex items-center justify-between text-left group"
                                    onClick={() => setOpenFaq(openFaq === idx.toString() ? null : idx.toString())}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-sm md:text-base uppercase tracking-tight group-hover:text-brand-orange transition-colors">{item.question}</span>
                                    </div>
                                    {openFaq === idx.toString() ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                </button>
                                {openFaq === idx.toString() && (
                                    <div className="pb-4 text-sm text-slate-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

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
                    </div>

                </div>
             </div>
        </div>
      </div>

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

      <StaggeredTestimonials />

      <ProductDescription product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && onProductSelect && (
        <div className="container mx-auto px-4 md:px-6 mb-24 max-w-7xl pt-16">
          <h2 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight text-center md:text-left">You May Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                onClick={onProductSelect}
                compactOnMobile
              />
            ))}
          </div>
        </div>
      )}
      
    </div>
  );
};
