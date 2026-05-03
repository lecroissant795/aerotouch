
import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { getFascilitesBundleGridProduct } from '../utils/bundleKits';
import { PageHero } from '../components/PageHero';

// Duplicated for now, ideally verified to be moved to a shared constant file
const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'massage-insoles',
    handle: 'massage-insoles',
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
    id: 'heel-cushion-pds',
    handle: 'heel-cushion-pds',
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
  getFascilitesBundleGridProduct(),
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

interface BestSellersPageProps {
  onProductSelect: (product: Product) => void;
  onQuickAddToCart?: (product: Product) => void;
}

export const BestSellersPage: React.FC<BestSellersPageProps> = ({ onProductSelect, onQuickAddToCart }) => {
  const [products, setProducts] = useState<Product[]>(FEATURED_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (existing fetch logic remains the same)
    const fetchProducts = async () => {
      try {
        const shopifyProducts = await shopify.product.fetchAll(20);
        if (shopifyProducts && shopifyProducts.length > 0) {
           const mapped = shopifyProducts.map(mapShopifyProduct);
           // In a real app, we would filter for "Best Sellers" collection or tag
           // For now, we just show all products as best sellers
           setProducts(mapped);
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
      <PageHero 
        title="Best Sellers"
        description="Our most popular products, loved by thousands of customers for their comfort and performance."
        image="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1920&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 md:px-6 py-12">

        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4,5,6].map(i => (
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
                  bestSeller
                />
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
