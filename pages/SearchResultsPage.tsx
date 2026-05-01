import React, { useEffect, useState, useMemo } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import { shopify } from '../utils/shopify';
import { mapShopifyProduct } from '../utils/mapper';
import { PageHero } from '../components/PageHero';
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import {
  fuzzySearchProducts,
  applyFilters,
  extractCategories,
  getPriceRange,
  FALLBACK_PRODUCTS,
  SearchFilters,
  SortOption,
} from '../utils/search';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'reviews', label: 'Most Reviewed' },
];

interface SearchResultsPageProps {
  searchQuery: string;
  onProductSelect: (product: Product) => void;
  onQuickAddToCart?: (product: Product) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ searchQuery, onProductSelect, onQuickAddToCart }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ sortBy: 'relevance' });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const shopifyProducts = await shopify.product.fetchAll(50);
        if (shopifyProducts && shopifyProducts.length > 0) {
          setAllProducts(shopifyProducts.map(mapShopifyProduct));
        } else {
          setAllProducts(FALLBACK_PRODUCTS);
        }
      } catch {
        setAllProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, sortBy: 'relevance' }));
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return allProducts;
    return fuzzySearchProducts(allProducts, searchQuery);
  }, [allProducts, searchQuery]);

  const filteredResults = useMemo(() => {
    return applyFilters(searchResults, filters);
  }, [searchResults, filters]);

  const categories = useMemo(() => extractCategories(searchResults), [searchResults]);
  const priceRange = useMemo(() => getPriceRange(allProducts), [allProducts]);

  const hasQuery = searchQuery.trim().length > 0;
  const hasActiveFilters = filters.category || filters.minPrice !== undefined || filters.maxPrice !== undefined;

  const clearFilters = () => {
    setFilters({ sortBy: filters.sortBy });
  };

  return (
    <div className="animate-in fade-in duration-500 pt-24">
      <PageHero
        title={hasQuery ? `Search results for "${searchQuery.trim()}"` : 'Search'}
        description={
          hasQuery
            ? loading
              ? 'Finding products...'
              : filteredResults.length > 0
                ? `${filteredResults.length} product${filteredResults.length === 1 ? '' : 's'} found.`
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
        ) : (
          <>
            {/* Toolbar: Sort + Filter toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-brand-orange" />
                  )}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear filters
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))}
                  className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2 text-sm font-medium text-slate-700 cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Filter panel */}
            {showFilters && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 animate-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price range */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                        <input
                          type="number"
                          placeholder={String(priceRange.min)}
                          value={filters.minPrice ?? ''}
                          onChange={(e) => setFilters((prev) => ({
                            ...prev,
                            minPrice: e.target.value ? Number(e.target.value) : undefined,
                          }))}
                          className="w-full border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                          min={0}
                        />
                      </div>
                      <span className="text-slate-400 text-sm">to</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
                        <input
                          type="number"
                          placeholder={String(priceRange.max)}
                          value={filters.maxPrice ?? ''}
                          onChange={(e) => setFilters((prev) => ({
                            ...prev,
                            maxPrice: e.target.value ? Number(e.target.value) : undefined,
                          }))}
                          className="w-full border border-slate-200 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
                          min={0}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Category filter */}
                  {categories.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 mb-3">Category</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setFilters((prev) => ({ ...prev, category: undefined }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!filters.category ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                        >
                          All
                        </button>
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setFilters((prev) => ({ ...prev, category: prev.category === cat ? undefined : cat }))}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filters.category === cat ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Results */}
            {filteredResults.length === 0 ? (
              <div className="text-center py-16 px-4">
                <p className="text-slate-600 text-lg font-medium">No results</p>
                <p className="text-slate-500 mt-2">
                  {hasActiveFilters
                    ? 'No products match your current filters. Try adjusting or clearing them.'
                    : `We couldn't find any products matching "${searchQuery.trim()}". Try different keywords or browse the shop.`}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-brand-orange font-medium text-sm hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredResults.map((product) => (
                  <ProductCard key={product.id} product={product} onClick={onProductSelect} onAddToCart={onQuickAddToCart} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
