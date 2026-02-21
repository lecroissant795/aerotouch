import React, { useEffect, useRef, useState } from 'react';
import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { FlashSale } from '../components/FlashSale';
import { Features } from '../components/Features';
import { Testimonials } from '../components/Testimonials';
import { ProductCard } from '../components/ProductCard';
import { SocialProof } from '../components/SocialProof';
import { Newsletter } from '../components/Newsletter';
import { TrustedPartners } from '../components/TrustedPartners';
import { PressLogos } from '../components/PressLogos';
import { Product, BundleKit } from '../types';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { LimitedTimeKits } from '../components/LimitedTimeKits';

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

export const LandingPage: React.FC<LandingPageProps> = ({ onProductSelect, onQuickAddToCart, onCategorySelect, onShopSaleClick, onKitSelect, onAddKitToCart }) => {
  const [products, setProducts] = useState<Product[]>(FEATURED_PRODUCTS);
  const bestSellerSectionRef = useRef<HTMLElement | null>(null);

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
      <Categories onCategoryClick={onCategorySelect} />
      <LimitedTimeKits onKitSelect={onKitSelect} onAddKitToCart={onAddKitToCart} />
      <FlashSale onShopSaleClick={onShopSaleClick} />
      
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
          
          <div className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 best-seller-scroll">
            {products.map(product => (
              <div key={product.id} className="flex-none w-[260px] md:w-[280px] snap-center">
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

      <Features />
      <PressLogos />
      <TrustedPartners />
      <Testimonials />
      <SocialProof />
      <Newsletter />
    </div>
  );
};
