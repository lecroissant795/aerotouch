import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { PageHero } from '../components/PageHero';

const FALLBACK_PRODUCTS: Product[] = [
  { id: 'massage-insoles', name: 'AeroTouch Massage Insoles', tagline: 'Therapeutic acupressure with every step', price: 34, rating: 4.9, reviews: 1540, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop', features: ['Magnetic Therapy', 'Pressure Point Relief', 'Breathable Design'], description: '' },
  { id: 'massage-roller', name: 'Massage Roller', tagline: 'Deep tissue recovery for sore feet', price: 19, rating: 4.8, reviews: 820, image: 'https://images.unsplash.com/photo-1544117518-30dd01b92047?q=80&w=800&auto=format&fit=crop', features: ['Ergonomic Shape', 'Deep Tissue Trigger', 'Portable Size'], description: '' },
  { id: 'heel-cushion-pad', name: 'Heel Cushion Pad', tagline: 'Instant impact protection for heels', price: 24, rating: 4.9, reviews: 2100, image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop', features: ['Shock Absorption', 'Non-Slip Grip', 'All-Day Support'], description: '' },
  { id: 'compression-socks', name: 'Compression Socks', tagline: 'Boost circulation and reduce swelling', price: 29, rating: 4.7, reviews: 940, image: 'https://images.unsplash.com/photo-1582966298431-a1217ec1e695?q=80&w=800&auto=format&fit=crop', features: ['Graduated Compression', 'Moisture Wicking', 'Arch Support'], description: '' },
  { id: 'fascilites-relief', name: 'Fascilites Relief Kit', tagline: 'Complete recovery system', price: 48, rating: 5.0, reviews: 3200, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', features: ['Elite Insoles', 'Massage Ball', 'Instructional Guide'], description: '' },
  { id: 'height-insoles', name: 'Height Insoles', tagline: 'Discreet elevation with maximum comfort', price: 39, rating: 4.8, reviews: 1100, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop', features: ['Adjustable Height', 'Invisible Fit', 'Shock Absorbing'], description: '' },
];

function filterProductsByQuery(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  const q = query.trim().toLowerCase();
  return products.filter((p) => {
    const name = (p.name || '').toLowerCase();
    const tagline = (p.tagline || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const features = (p.features || []).join(' ').toLowerCase();
    return name.includes(q) || tagline.includes(q) || desc.includes(q) || features.includes(q);
  });
}

interface SearchResultsPageProps {
  searchQuery: string;
  onProductSelect: (product: Product) => void;
  onQuickAddToCart?: (product: Product) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ searchQuery, onProductSelect, onQuickAddToCart }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);
      try {
        try {
          const shopifyProducts = await shopify.product.fetchQuery({ query, first: 20 });
          if (shopifyProducts && shopifyProducts.length > 0) {
            setProducts(shopifyProducts.map(mapShopifyProduct));
            setLoading(false);
            return;
          }
        } catch {
          // fall through
        }
        const shopifyProducts = await shopify.product.fetchAll(20);
        if (shopifyProducts && shopifyProducts.length > 0) {
          setProducts(filterProductsByQuery(shopifyProducts.map(mapShopifyProduct), query));
        } else {
          setProducts(filterProductsByQuery(FALLBACK_PRODUCTS, query));
        }
      } catch (err) {
        console.warn('Search fallback to local data:', err);
        setProducts(filterProductsByQuery(FALLBACK_PRODUCTS, query));
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [searchQuery]);

  const hasQuery = searchQuery.trim().length > 0;

  return (
    <div className="animate-in fade-in duration-500 pt-24">
      <PageHero
        title={hasQuery ? `Search results for "${searchQuery.trim()}"` : 'Search'}
        description={
          hasQuery
            ? loading
              ? 'Finding products...'
              : products.length > 0
                ? `${products.length} product${products.length === 1 ? '' : 's'} found.`
                : 'Try a different search or browse the shop.'
            : 'Enter a search term to find products.'
        }
        image="https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?q=80&w=1920&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 md:px-6 py-12">
        {!hasQuery ? (
          <div className="text-center py-12 text-slate-600">
            <p>Enter a search term in the navbar to find products.</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-100 rounded-2xl h-[400px] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-slate-600 text-lg font-medium">No results</p>
            <p className="text-slate-500 mt-2">
              We couldn't find any products matching "{searchQuery.trim()}". Try different keywords or browse the shop.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onClick={onProductSelect} onAddToCart={onQuickAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
