import React from 'react';
import { Product, Page } from '../types';
import { Star, ShoppingBag } from 'lucide-react';
import { createUrl } from '../utils/router';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  /** When true, shows a "Bestseller" badge on the card (e.g. in Best Seller section) */
  bestSeller?: boolean;
  /** When true, card is ~5% narrower and ~10% shorter on mobile (e.g. Category page) */
  compactOnMobile?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAddToCart, bestSeller, compactOnMobile }) => {
  const keyFeature = product.features[0] || 'Premium support';
  const compareAt =
    product.compareAtPrice != null && product.compareAtPrice > product.price
      ? product.compareAtPrice
      : null;
  // Use handle if available for SEO-friendly URLs, fall back to id
  const productHref = createUrl(Page.PRODUCT, { handle: product.handle || product.id });

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(product);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      onClick(product);
    }
  };

  return (
    <article
      className={`group relative flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${compactOnMobile ? 'w-[95%] md:w-full mx-auto md:mx-0' : ''}`}
    >
      {/* Main clickable area: image + content (except button) */}
      <a
        href={productHref}
        onClick={handleCardClick}
        className="block flex flex-col flex-grow"
      >
        {/* Image block */}
        <div className={`relative w-full bg-slate-50 overflow-hidden ${compactOnMobile ? 'aspect-[0.9] md:aspect-square' : 'aspect-square'}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Subtle gradient overlay at bottom for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* Bestseller badge */}
          {bestSeller && (
            <div
              className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 shadow-sm border border-slate-100"
              aria-label="High demand bestseller"
            >
              <span className="text-sm leading-none" aria-hidden>
                🔥
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                Bestseller
              </span>
            </div>
          )}

          {/* Secondary image on hover (if available) */}
          {product.images && product.images.length > 1 && (
            <img
              src={product.images[1]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-hidden
            />
          )}
        </div>

        {/* Content */}
        <div className={`flex flex-col flex-grow ${compactOnMobile ? 'p-3 md:p-5' : 'p-4 md:p-5'}`}>
          {/* Rating pill */}
          <div className={`flex items-center gap-1.5 ${compactOnMobile ? 'mb-2 md:mb-3' : 'mb-3'}`}>
            <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5">
              <Star className={`fill-amber-400 text-amber-400 ${compactOnMobile ? 'w-3 h-3 md:w-3.5 md:h-3.5' : 'w-3.5 h-3.5'}`} />
              <span className={`font-bold text-slate-800 ${compactOnMobile ? 'text-[10px] md:text-xs' : 'text-xs'}`}>{product.rating}</span>
            </div>
            <span className={`text-slate-400 ${compactOnMobile ? 'text-[10px] md:text-xs' : 'text-xs'}`}>({product.reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-slate-900 leading-snug line-clamp-2 ${compactOnMobile ? 'text-sm mb-0.5 md:text-lg md:mb-1' : 'text-base md:text-lg mb-1'}`}>
            {product.name}
          </h3>

          {/* Tagline or key feature */}
          <p className={`text-slate-500 line-clamp-1 ${compactOnMobile ? 'text-xs mb-2 md:text-sm md:mb-4' : 'text-sm mb-4'}`}>
            {product.tagline || keyFeature}
          </p>

          {/* Price — sale + Shopify compare-at when present */}
          <div className={`mt-auto`}>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className={`font-black tracking-tight ${compareAt != null ? 'text-brand-orange' : 'text-slate-900'} ${compactOnMobile ? 'text-lg md:text-xl' : 'text-xl'}`}
              >
                ${product.price.toFixed(2)}
              </span>
              {compareAt != null && (
                <span
                  className={`text-slate-400 line-through font-bold ${compactOnMobile ? 'text-sm md:text-base' : 'text-base'}`}
                >
                  ${compareAt.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </a>

      {/* Add to Cart button */}
      <div className={`${compactOnMobile ? 'px-3 pb-3 md:px-5 md:pb-5' : 'px-4 pb-4 md:px-5 md:pb-5'}`}>
        <button
          type="button"
          className={`flex items-center justify-center gap-2 w-full px-4 rounded-xl bg-slate-900 text-white font-bold transition-all duration-200 hover:bg-brand-orange hover:shadow-lg hover:shadow-brand-orange/25 active:scale-[0.98] ${compactOnMobile ? 'py-2 text-xs md:py-2.5 md:text-sm' : 'py-2.5 text-sm'}`}
          onClick={handleAddToCartClick}
        >
          <ShoppingBag className={compactOnMobile ? 'w-3.5 h-3.5 md:w-4 md:h-4' : 'w-4 h-4'} />
          Add to cart
        </button>
      </div>
    </article>
  );
};

