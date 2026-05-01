import { Product } from '../types';

interface ScoredProduct {
  product: Product;
  score: number;
}

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
}

function tokenize(text: string): string[] {
  return normalizeText(text).split(/\s+/).filter(Boolean);
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1);

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

function fuzzyMatch(needle: string, haystack: string): number {
  const n = normalizeText(needle);
  const h = normalizeText(haystack);

  if (h.includes(n)) return 1.0;

  const haystackWords = h.split(/\s+/);
  let bestWordScore = 0;
  for (const word of haystackWords) {
    if (word.startsWith(n)) {
      bestWordScore = Math.max(bestWordScore, 0.9);
    } else {
      const maxLen = Math.max(n.length, word.length);
      if (maxLen === 0) continue;
      const dist = levenshtein(n, word);
      const threshold = Math.max(1, Math.floor(n.length / 3));
      if (dist <= threshold) {
        bestWordScore = Math.max(bestWordScore, 0.7 * (1 - dist / maxLen));
      }
    }
  }
  return bestWordScore;
}

function scoreProduct(product: Product, queryTokens: string[]): number {
  let totalScore = 0;

  for (const token of queryTokens) {
    let bestTokenScore = 0;

    const nameScore = fuzzyMatch(token, product.name);
    bestTokenScore = Math.max(bestTokenScore, nameScore * 10);

    const taglineScore = fuzzyMatch(token, product.tagline || '');
    bestTokenScore = Math.max(bestTokenScore, taglineScore * 6);

    const featureScore = fuzzyMatch(token, (product.features || []).join(' '));
    bestTokenScore = Math.max(bestTokenScore, featureScore * 4);

    const descScore = fuzzyMatch(token, product.description || '');
    bestTokenScore = Math.max(bestTokenScore, descScore * 2);

    const tagScore = fuzzyMatch(token, (product.tags || []).join(' '));
    bestTokenScore = Math.max(bestTokenScore, tagScore * 5);

    totalScore += bestTokenScore;
  }

  return totalScore;
}

export function fuzzySearchProducts(products: Product[], query: string): Product[] {
  const q = query.trim();
  if (!q) return products;

  const queryTokens = tokenize(q);
  if (queryTokens.length === 0) return products;

  const scored: ScoredProduct[] = products
    .map((product) => ({ product, score: scoreProduct(product, queryTokens) }))
    .filter((sp) => sp.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map((sp) => sp.product);
}

export function getSearchSuggestions(products: Product[], query: string, limit = 5): Product[] {
  return fuzzySearchProducts(products, query).slice(0, limit);
}

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'reviews';

export interface SearchFilters {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  sortBy: SortOption;
}

export function applyFilters(products: Product[], filters: SearchFilters): Product[] {
  let result = [...products];

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.category) {
    const cat = filters.category.toLowerCase();
    result = result.filter((p) => {
      const tags = (p.tags || []).map((t) => t.toLowerCase());
      const name = p.name.toLowerCase();
      return tags.some((t) => t.includes(cat)) || name.includes(cat);
    });
  }

  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      result.sort((a, b) => b.rating - a.rating);
      break;
    case 'reviews':
      result.sort((a, b) => b.reviews - a.reviews);
      break;
    // 'relevance' keeps the existing order (already sorted by score)
  }

  return result;
}

export function extractCategories(products: Product[]): string[] {
  const cats = new Set<string>();
  for (const p of products) {
    for (const tag of p.tags || []) {
      if (tag) cats.add(tag);
    }
  }
  return Array.from(cats).sort();
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 100 };
  const prices = products.map((p) => p.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}

export const FALLBACK_PRODUCTS: Product[] = [
  { id: 'massage-insoles', name: 'AeroTouch Massage Insoles', tagline: 'Therapeutic acupressure with every step', price: 25, rating: 4.9, reviews: 1540, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop', features: ['Magnetic Therapy', 'Pressure Point Relief', 'Breathable Design'], description: '' },
  { id: 'massage-roller', name: 'Massage Roller', tagline: 'Deep tissue recovery for sore feet', price: 19, rating: 4.8, reviews: 820, image: 'https://images.unsplash.com/photo-1544117518-30dd01b92047?q=80&w=800&auto=format&fit=crop', features: ['Ergonomic Shape', 'Deep Tissue Trigger', 'Portable Size'], description: '' },
  { id: 'heel-cushion-pad', name: 'Heel Cushion Pad', tagline: 'Instant impact protection for heels', price: 24, rating: 4.9, reviews: 2100, image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop', features: ['Shock Absorption', 'Non-Slip Grip', 'All-Day Support'], description: '' },
  { id: 'compression-socks', name: 'Compression Socks', tagline: 'Boost circulation and reduce swelling', price: 29, rating: 4.7, reviews: 940, image: 'https://images.unsplash.com/photo-1582966298431-a1217ec1e695?q=80&w=800&auto=format&fit=crop', features: ['Graduated Compression', 'Moisture Wicking', 'Arch Support'], description: '' },
  { id: 'fascilites-relief', name: 'Fascilites Relief Kit', tagline: 'Complete recovery system', price: 48, rating: 5.0, reviews: 3200, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', features: ['Elite Insoles', 'Massage Ball', 'Instructional Guide'], description: '' },
  { id: 'height-insoles', name: 'Height Insoles', tagline: 'Discreet elevation with maximum comfort', price: 39, rating: 4.8, reviews: 1100, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop', features: ['Adjustable Height', 'Invisible Fit', 'Shock Absorbing'], description: '' },
];
