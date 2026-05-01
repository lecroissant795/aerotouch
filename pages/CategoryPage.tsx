
import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { ReferralSection } from '../components/ReferralSection';
import { GivingBackSection } from '../components/GivingBackSection';

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


// ... (existing imports and FEATURED_PRODUCTS)

interface CategoryPageProps {
    category: string;
    onProductSelect: (product: Product) => void;
    onQuickAddToCart?: (product: Product) => void;
    onNavigateToBlog?: () => void;
}

const CATEGORY_IMAGES: Record<string, string> = {
    'Insoles': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1920&auto=format&fit=crop',
    'Footwear': 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1920&auto=format&fit=crop',
    'Tools': 'https://images.unsplash.com/photo-1597423244036-ef5020e83f3c?q=80&w=1920&auto=format&fit=crop',
    'Pads': 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1920&auto=format&fit=crop',
    'Socks': 'https://images.unsplash.com/photo-1582966298431-a1217ec1e695?q=80&w=1920&auto=format&fit=crop',
    'Work': 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1920&auto=format&fit=crop',
    'Plantar Fasciitis': 'https://images.unsplash.com/photo-1616422285623-13ff0162193b?q=80&w=1920&auto=format&fit=crop',
    // Default fallback
    'default': 'https://images.unsplash.com/photo-1556906781-9a412961d289?q=80&w=1920&auto=format&fit=crop'
};

export const CategoryPage: React.FC<CategoryPageProps> = ({ category, onProductSelect, onQuickAddToCart, onNavigateToBlog }) => {
  const [products, setProducts] = useState<Product[]>(FEATURED_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... (existing fetch logic)
    const fetchProducts = async () => {
      setLoading(true);
      const catLower = category.toLowerCase();

      try {
        const shopifyProducts = await shopify.product.fetchAll(50);
        if (shopifyProducts && shopifyProducts.length > 0) {
           const mapped = shopifyProducts.map(mapShopifyProduct);
           const filtered = mapped.filter(p => {
               const nameMatches = p.name.toLowerCase().includes(catLower);
               const tagMatches = p.tags?.some(tag => tag.toLowerCase().includes(catLower));
               return nameMatches || tagMatches;
           });
           setProducts(filtered);
        }
      } catch (err) {
        console.warn('Failed to fetch Shopify products, using local data:', err);
        const filteredLocal = FEATURED_PRODUCTS.filter(p => {
            const nameMatches = p.name.toLowerCase().includes(catLower);
            const tagMatches = p.tags?.some(tag => tag.toLowerCase().includes(catLower));
            const featureMatches = p.features?.some(f => f.toLowerCase().includes(catLower));
            const idMatches = p.id.toLowerCase().includes(catLower);
            return nameMatches || tagMatches || featureMatches || idMatches;
        });
        setProducts(filteredLocal);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [category]);


  return (
    <div className="animate-in fade-in duration-500 pt-24">
      
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
                  compactOnMobile
                />
                ))}
            </div>
        )}
        
        {products.length === 0 && !loading && (
            <div className="text-center py-12">
                <p className="text-slate-500">No products found for this category.</p>
            </div>
        )}
      </div>

      <ReferralSection />
      <GivingBackSection onLearnMore={onNavigateToBlog} />
    </div>
  );
};
