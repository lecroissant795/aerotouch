
import React, { useEffect, useState } from 'react';
import { Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { BundleKitCardsRow } from '../components/BundleKitCardsRow';
import { Product, BundleKit } from '../types';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { BUNDLE_KITS } from '../utils/bundleKits';
import { useShopifyBundleKits } from '../hooks/useShopifyBundleKits';

const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'massage-insoles',
    handle: 'massage-insoles',
    name: 'AeroTouch Massage Insoles',
    tagline: 'Therapeutic acupressure with every step',
    price: 34.00,
    rating: 4.9,
    reviews: 1540,
    image: '',
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
    image: '',
    features: ['Ergonomic Shape', 'Deep Tissue Trigger', 'Portable Size'],
    description: ''
  },
  {
    id: 'heel-cushion-pds',
    handle: 'heel-cushion-pds',
    name: 'Heel Cushion Pad',
    tagline: 'Instant impact protection for heels',
    price: 24.00,
    rating: 4.9,
    reviews: 2100,
    image: '',
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
    image: '',
    features: ['Graduated Compression', 'Moisture Wicking', 'Arch Support'],
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
    image: '',
    features: ['Adjustable Height', 'Invisible Fit', 'Shock Absorbing'],
    description: ''
  }
];

const BUNDLE_KIT_HANDLE_SET = new Set(BUNDLE_KITS.map((k) => k.handle));

function filterOutBundleKitProducts(products: Product[]): Product[] {
  return products.filter((p) => !p.handle || !BUNDLE_KIT_HANDLE_SET.has(p.handle));
}

interface ShopPageProps {
  onProductSelect: (product: Product) => void;
  onQuickAddToCart?: (product: Product) => void;
  onKitSelect?: (kit: BundleKit) => void;
  onAddKitToCart?: (kit: BundleKit) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  onProductSelect,
  onQuickAddToCart,
  onKitSelect,
  onAddKitToCart,
}) => {
  const bundleKits = useShopifyBundleKits();
  const [products, setProducts] = useState<Product[]>(() => filterOutBundleKitProducts(FEATURED_PRODUCTS));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const shopifyProducts = await shopify.product.fetchAll(20);
        if (shopifyProducts && shopifyProducts.length > 0) {
          const mapped = shopifyProducts.map(mapShopifyProduct);
          setProducts(filterOutBundleKitProducts(mapped));
        }
      } catch (err) {
        console.warn('Failed to fetch Shopify products, using local data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pt-24">
      <div className="container mx-auto px-4 md:px-6 pt-6 pb-12 md:pt-8">
        <h2 className="mb-8 text-2xl font-black uppercase tracking-tight text-brand-dark md:text-3xl">All products</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-100 rounded-2xl h-[400px] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600 text-lg">No products available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onProductSelect}
                onAddToCart={onQuickAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      <section className="relative overflow-hidden bg-brand-light pb-20 pt-12 md:pb-24 md:pt-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="mb-12 flex flex-col justify-between gap-8 md:mb-16 md:flex-row md:items-end">
            <div className="max-w-xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-0.5 w-12 bg-brand-orange" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange">
                  Limited Edition Collection
                </span>
              </div>
              <h2 className="mb-4 text-4xl font-black uppercase leading-[0.95] tracking-tighter text-brand-dark md:text-5xl lg:text-6xl">
                Exclusive <br />{' '}
                <span className="bg-gradient-to-r from-brand-orange to-orange-400 bg-clip-text text-transparent">
                  Recovery Kits
                </span>
              </h2>
              <p className="font-medium text-slate-500">
                Professional-grade orthotics and recovery tools bundled for maximum performance. Guaranteed lowest
                pricing for a limited time.
              </p>
            </div>
          </div>

          <BundleKitCardsRow kits={bundleKits} onKitSelect={onKitSelect} onAddKitToCart={onAddKitToCart} />

          <div className="mt-14 flex flex-wrap justify-center gap-x-12 gap-y-6 md:mt-16">
            {[
              { icon: ShieldCheck, text: '60-Day Performance Guarantee' },
              { icon: Zap, text: 'Instant Recovery Support' },
              { icon: ArrowRight, text: 'Premium Doctor Approved' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-brand-orange" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
