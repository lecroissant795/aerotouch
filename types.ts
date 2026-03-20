export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  features: string[];
  description: string;
  descriptionHtml?: string;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
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
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
  items: string[];
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
  ACCESSORIES = 'ACCESSORIES'
}
