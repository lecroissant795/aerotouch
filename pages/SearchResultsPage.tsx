import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { getFascilitesBundleGridProduct } from '../utils/bundleKits';


const FALLBACK_PRODUCTS: Product[] = [
  { id: 'massage-insoles', name: 'AeroTouch Massage Insoles', tagline: 'Therapeutic acupressure with every step', price: 25, rating: 4.9, reviews: 1540, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop', features: ['Magnetic Therapy', 'Pressure Point Relief', 'Breathable Design'], description: '' },
  { id: 'massage-roller', name: 'Massage Roller', tagline: 'Deep tissue recovery for sore feet', price: 19, rating: 4.8, reviews: 820, image: 'https://images.unsplash.com/photo-1544117518-30dd01b92047?q=80&w=800&auto=format&fit=crop', features: ['Ergonomic Shape', 'Deep Tissue Trigger', 'Portable Size'], description: '' },
  { id: 'heel-cushion-pad', name: 'Heel Cushion Pad', tagline: 'Instant impact protection for heels', price: 24, rating: 4.9, reviews: 2100, image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop', features: ['Shock Absorption', 'Non-Slip Grip', 'All-Day Support'], description: '' },
  { id: 'compression-socks', name: 'Compression Socks', tagline: 'Boost circulation and reduce swelling', price: 29, rating: 4.7, reviews: 940, image: 'https://images.unsplash.com/photo-1582966298431-a1217ec1e695?q=80&w=800&auto=format&fit=crop', features: ['Graduated Compression', 'Moisture Wicking', 'Arch Support'], description: '' },
  getFascilitesBundleGridProduct(),
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
    const tags = (p.tags || []).join(' ').toLowerCase();
    return name.includes(q) || tagline.includes(q) || desc.includes(q) || features.includes(q) || tags.includes(q);
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
        // Fetch products from Shopify (this works - used elsewhere in the app)
        const allProducts = await shopify.product.fetchAll(100);
        if (allProducts && allProducts.length > 0) {
          const mappedProducts = allProducts.map(mapShopifyProduct);
          const filtered = filterProductsByQuery(mappedProducts, query);
          setProducts(filtered);
        } else {
          // If Shopify returns nothing, use fallback
          setProducts(filterProductsByQuery(FALLBACK_PRODUCTS, query));
        }
      } catch (err) {
        console.warn('Search failed, using fallback data:', err);
        setProducts(filterProductsByQuery(FALLBACK_PRODUCTS, query));
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [searchQuery]);

  const hasQuery = searchQuery.trim().length > 0;

  return (
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
  );
};
