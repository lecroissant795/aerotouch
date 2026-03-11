import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { ReferralSection } from '../components/ReferralSection';
import { GivingBackSection } from '../components/GivingBackSection';
import { PageHero } from '../components/PageHero';

// Fallback products for when Shopify is unavailable
const SECONDARY_PRODUCTS: Product[] = [
  {
    id: 'massage-roller',
    name: 'Massage Roller',
    tagline: 'Deep tissue recovery for sore feet',
    price: 19.00,
    rating: 4.8,
    reviews: 820,
    image: 'https://images.unsplash.com/photo-1544117518-30dd01b92047?q=80&w=800&auto=format&fit=crop',
    features: ['Ergonomic Shape', 'Deep Tissue Trigger', 'Portable Size'],
    description: 'Professional-grade massage roller designed for targeted foot relief and recovery.'
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
    description: 'Medical-grade compression socks that improve circulation and reduce fatigue.'
  },
  {
    id: 'recovery-gel',
    name: 'Recovery Gel',
    tagline: 'Soothing relief for tired muscles',
    price: 24.00,
    rating: 4.9,
    reviews: 1200,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop',
    features: ['Natural Ingredients', 'Fast Absorption', 'Cooling Effect'],
    description: 'Therapeutic gel formulated to relieve muscle tension and accelerate recovery.'
  }
];

interface AccessoriesPageProps {
  onProductSelect: (product: Product) => void;
  onQuickAddToCart?: (product: Product) => void;
  onNavigateToBlog?: () => void;
}

const isAccessoryProduct = (product: any) => {
  const tags = (product.tags || []).map((t: string) => t.toLowerCase());
  const hasAccessoryTag = tags.some((tag: string) =>
    ['accessories', 'recovery', 'tools', 'massage', 'compression'].includes(tag)
  );
  const isInsole = tags.some((tag: string) =>
    tag.includes('insole')
  );
  return hasAccessoryTag && !isInsole;
};

export const AccessoriesPage: React.FC<AccessoriesPageProps> = ({
  onProductSelect,
  onQuickAddToCart,
  onNavigateToBlog
}) => {
  const [products, setProducts] = useState<Product[]>(SECONDARY_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const shopifyProducts = await shopify.product.fetchAll(50);
        if (shopifyProducts && shopifyProducts.length > 0) {
          const filtered = shopifyProducts.filter(isAccessoryProduct);
          const mapped = filtered.map(mapShopifyProduct);

          if (mapped.length > 0) {
            setProducts(mapped);
          } else {
            // No accessories found, use fallback
            setProducts(SECONDARY_PRODUCTS);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch Shopify products, using local data:', err);
        setProducts(SECONDARY_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pt-24">
      <PageHero
        title="Accessories & Recovery"
        description="Complete your recovery routine with our premium massage tools, compression gear, and therapeutic accessories."
        image="https://images.unsplash.com/photo-1544117518-30dd01b92047?q=80&w=1920&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 md:px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-slate-100 rounded-2xl h-[400px] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onProductSelect}
                onAddToCart={onQuickAddToCart}
                compactOnMobile
              />
            ))}
          </div>
        )}

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-500">No accessories found at this time.</p>
          </div>
        )}
      </div>

      <ReferralSection />
      <GivingBackSection onLearnMore={onNavigateToBlog} />
    </div>
  );
};
