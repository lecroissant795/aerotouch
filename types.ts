export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  /** ISO currency code for `price`; absent local fallback prices are USD. */
  currencyCode?: string;
  /** Shopify variant compare-at price (MSRP), when higher than `price` */
  compareAtPrice?: number;
  /** ISO currency code for `compareAtPrice`; usually matches `currencyCode`. */
  compareAtCurrencyCode?: string;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  features: string[];
  description: string;
  descriptionHtml?: string;
  tags?: string[];
  /** Shopify product handle for SEO-friendly URLs (optional, falls back to id) */
  handle?: string;
  /** Custom metafields for product page customization */
  metafields?: {
    custom_description?: string;
    custom_description_points?: string[];
    custom_features?: Array<{ label: string; value: string }>;
    page_layout?: 'primary' | 'secondary' | 'auto';
    show_kit_combo?: boolean;
    show_tech_specs?: boolean;
    show_videos?: boolean;
    show_expert_section?: boolean;
    show_trust_badges?: boolean;
    show_faq?: boolean;
    show_testimonials?: boolean;
    timer_title?: string;
    timer_subtitle?: string;
    scarcity_message?: string;
    bundle_options_override?: Array<{
      quantity: number;
      label: string;
      savings_text?: string;
      highlight?: 'none' | 'popular' | 'good-value' | 'best-value';
    }>;
    trust_badges_override?: Array<{
      icon: 'truck' | 'shield' | 'headphones' | 'refresh' | 'star' | 'clock';
      label: string;
    }>;
    faq_override?: Array<{ question: string; answer: string }>;
    primary_cta_text?: string;
    secondary_cta_text?: string;
  };
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  variantId?: string;
  customAttributes?: Array<{ key: string; value: string }>;
  /** Shopify product id (GID) — line item `id` is the checkout line id, not the product */
  productShopifyId?: string;
  productHandle?: string;
  /** Sum of discount allocation amounts on this line (promo / automatic discounts) */
  linePromoDiscountTotal?: number;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  body?: string;
  category: string;
  author: string;
  authorRole?: string;
  date: string;
  readTime: string;
  image: string;
}

export interface BundleKit {
  id: string;
  /** Shopify product handle — used for Storefront fetch and cart resolution */
  handle: string;
  /** Shopify Product legacy numeric id (for mapping / diagnostics) */
  shopifyProductId: string;
  name: string;
  price: number;
  currencyCode?: string;
  originalPrice: number;
  originalCurrencyCode?: string;
  image: string;
  badge: string;
  items: string[];
  /** Set from Shopify variant after refresh; omit when unknown */
  availableForSale?: boolean;
}

export enum Page {
  HOME = 'HOME',
  PRODUCT = 'PRODUCT',
  CHECKOUT = 'CHECKOUT',
  TECHNOLOGY = 'TECHNOLOGY',
  BLOG = 'BLOG',
  BLOG_POST = 'BLOG_POST',
  SUPPORT = 'SUPPORT',
  SHOP = 'SHOP',
  SEARCH = 'SEARCH',
  BEST_SELLERS = 'BEST_SELLERS',
  BUNDLE_KITS = 'BUNDLE_KITS',
  KIT_PRODUCT = 'KIT_PRODUCT',
  CATEGORY = 'CATEGORY',
  ACCOUNT = 'ACCOUNT',
  TRACK_ORDER = 'TRACK_ORDER',
  ORDER_STATUS = 'ORDER_STATUS',
  RETURNS_EXCHANGE = 'RETURNS_EXCHANGE',
  SIZE_GUIDE = 'SIZE_GUIDE',
  WARRANTY = 'WARRANTY',
  TERMS = 'TERMS',
  PRIVACY = 'PRIVACY',
  COOKIES = 'COOKIES',
  ACCESSORIES = 'ACCESSORIES',
  NOT_FOUND = 'NOT_FOUND',
  MASKED_LANDING = 'MASKED_LANDING'
}
