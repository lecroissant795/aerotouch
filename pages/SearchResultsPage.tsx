import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { mapShopifyProduct } from '../utils/mapper';
import { getFascilitesBundleGridProduct } from '../utils/bundleKits';
import { useCurrency } from '../utils/CurrencyContext';
import { fetchAllProducts } from '../utils/productFetcher';


const FALLBACK_PRODUCTS: Product[] = [
  { id: 'massage-insoles', name: 'AeroTouch Massage Insoles', tagline: 'Therapeutic acupressure with every step', price: 25, rating: 4.9, reviews: 1540, image: '', features: ['Magnetic Therapy', 'Pressure Point Relief', 'Breathable Design'], description: '' },
  { id: 'massage-roller', name: 'Massage Roller', tagline: 'Deep tissue recovery for sore feet', price: 19, rating: 4.8, reviews: 820, image: '', features: ['Ergonomic Shape', 'Deep Tissue Trigger', 'Portable Size'], description: '' },
  { id: 'heel-cushion-pad', name: 'Heel Cushion Pad', tagline: 'Instant impact protection for heels', price: 24, rating: 4.9, reviews: 2100, image: '', features: ['Shock Absorption', 'Non-Slip Grip', 'All-Day Support'], description: '' },
  { id: 'compression-socks', name: 'Compression Socks', tagline: 'Boost circulation and reduce swelling', price: 29, rating: 4.7, reviews: 940, image: '', features: ['Graduated Compression', 'Moisture Wicking', 'Arch Support'], description: '' },
  getFascilitesBundleGridProduct(),
  { id: 'height-insoles', name: 'Height Insoles', tagline: 'Discreet elevation with maximum comfort', price: 39, rating: 4.8, reviews: 1100, image: '', features: ['Adjustable Height', 'Invisible Fit', 'Shock Absorbing'], description: '' },
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
  const { currency } = useCurrency();

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
        const allProducts = await fetchAllProducts(100, currency);
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
  }, [searchQuery, currency]);

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
