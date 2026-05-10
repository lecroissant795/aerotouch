import { BlogPost, Page, Product } from '../types';

type SeoInput = {
  page: Page;
  params?: Record<string, string>;
  query?: Record<string, string>;
  category?: string;
  searchQuery?: string;
  selectedProduct?: Product | null;
  selectedBlogPost?: BlogPost | null;
};

type SeoPayload = {
  title: string;
  description: string;
  path: string;
  image: string;
  type: 'website' | 'article' | 'product';
};

const SITE_NAME = 'AeroTouch';
const DEFAULT_TITLE = 'AeroTouch | Unlock Your Potential';
const DEFAULT_DESCRIPTION = 'Premium athletic insoles for peak performance.';
const DEFAULT_IMAGE = '/favicon.svg';

function sanitizeText(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

function upsertMetaByName(name: string, content: string): void {
  let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertMetaByProperty(property: string, content: string): void {
  let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  let el = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id: string, schema: Record<string, unknown>): void {
  let el = document.head.querySelector(`script[data-seo-jsonld="${id}"]`) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-seo-jsonld', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
}

function removeJsonLd(id: string): void {
  const el = document.head.querySelector(`script[data-seo-jsonld="${id}"]`);
  if (el) el.remove();
}

function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${window.location.origin}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

function createSeoPayload(input: SeoInput): SeoPayload {
  const { page, category, searchQuery, selectedProduct, selectedBlogPost } = input;

  switch (page) {
    case Page.HOME:
      return {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        path: '/',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.SHOP:
      return {
        title: 'Shop Performance Insoles | AeroTouch',
        description: 'Shop premium insoles and accessories designed for comfort, support, and all-day performance.',
        path: '/shop',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.CATEGORY: {
      const categoryName = category || 'Products';
      return {
        title: `${categoryName} | AeroTouch`,
        description: `Browse ${categoryName.toLowerCase()} from AeroTouch to improve comfort, mobility, and performance.`,
        path: window.location.pathname + window.location.search,
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    }
    case Page.PRODUCT: {
      if (selectedProduct) {
        const productTitle = sanitizeText(selectedProduct.name);
        const productDesc = sanitizeText(selectedProduct.tagline || selectedProduct.description || DEFAULT_DESCRIPTION);
        return {
          title: `${productTitle} | AeroTouch`,
          description: productDesc,
          path: window.location.pathname + window.location.search,
          image: selectedProduct.image || DEFAULT_IMAGE,
          type: 'product'
        };
      }
      return {
        title: 'Product | AeroTouch',
        description: 'Explore AeroTouch products engineered for comfort and performance.',
        path: window.location.pathname + window.location.search,
        image: DEFAULT_IMAGE,
        type: 'product'
      };
    }
    case Page.BLOG:
      return {
        title: 'The Edge Blog | AeroTouch',
        description: 'Insights on performance, recovery, and gear technology from the AeroTouch team.',
        path: '/blog',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.BLOG_POST: {
      if (selectedBlogPost) {
        return {
          title: `${sanitizeText(selectedBlogPost.title)} | AeroTouch`,
          description: sanitizeText(selectedBlogPost.excerpt || DEFAULT_DESCRIPTION),
          path: window.location.pathname + window.location.search,
          image: selectedBlogPost.image || DEFAULT_IMAGE,
          type: 'article'
        };
      }
      return {
        title: 'Article | AeroTouch',
        description: 'Read the latest AeroTouch insights on movement, recovery, and performance.',
        path: window.location.pathname + window.location.search,
        image: DEFAULT_IMAGE,
        type: 'article'
      };
    }
    case Page.TECHNOLOGY:
      return {
        title: 'Technology | AeroTouch',
        description: 'See how AeroTouch design and materials deliver support, energy return, and comfort.',
        path: '/technology',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.BEST_SELLERS:
      return {
        title: 'Best Sellers | AeroTouch',
        description: 'Discover our most popular insoles and accessories chosen by active customers.',
        path: '/best-sellers',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.SEARCH: {
      const q = sanitizeText(searchQuery || '');
      return {
        title: q ? `Search "${q}" | AeroTouch` : 'Search | AeroTouch',
        description: q ? `Search results for "${q}" on AeroTouch.` : 'Search AeroTouch products and articles.',
        path: window.location.pathname + window.location.search,
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    }
    case Page.BUNDLE_KITS:
      return {
        title: 'Bundle Kits | AeroTouch',
        description: 'Save more with AeroTouch bundle kits built for complete foot care and recovery.',
        path: '/bundles',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.KIT_PRODUCT:
      return {
        title: 'Bundle Kit | AeroTouch',
        description: 'Explore AeroTouch bundle kit details, included items, and value pricing.',
        path: window.location.pathname + window.location.search,
        image: DEFAULT_IMAGE,
        type: 'product'
      };
    case Page.ACCESSORIES:
      return {
        title: 'Accessories | AeroTouch',
        description: 'Shop massage rollers and support accessories for recovery and daily comfort.',
        path: '/accessories',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.SUPPORT:
      return {
        title: 'Support | AeroTouch',
        description: 'Get help with orders, sizing, shipping, returns, and product support.',
        path: '/support',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.TRACK_ORDER:
      return {
        title: 'Track Order | AeroTouch',
        description: 'Track your AeroTouch order status and shipping progress.',
        path: '/track-order',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.ORDER_STATUS:
      return {
        title: 'Order Status | AeroTouch',
        description: 'Check your AeroTouch order details and fulfillment updates.',
        path: '/order-status',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.RETURNS_EXCHANGE:
      return {
        title: 'Returns & Exchanges | AeroTouch',
        description: 'Review AeroTouch return and exchange options before you submit a request.',
        path: '/returns',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.SIZE_GUIDE:
      return {
        title: 'Size Guide | AeroTouch',
        description: 'Find your best insole fit with the AeroTouch sizing guide.',
        path: '/size-guide',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.WARRANTY:
      return {
        title: 'Warranty | AeroTouch',
        description: 'Learn what is covered under the AeroTouch warranty and how to claim support.',
        path: '/warranty',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.ACCOUNT:
      return {
        title: 'Account | AeroTouch',
        description: 'Manage your AeroTouch account and preferences.',
        path: '/account',
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    case Page.NOT_FOUND:
      return {
        title: 'Page Not Found | AeroTouch',
        description: 'The page you are looking for could not be found.',
        path: window.location.pathname + window.location.search,
        image: DEFAULT_IMAGE,
        type: 'website'
      };
    default:
      return {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        path: window.location.pathname + window.location.search,
        image: DEFAULT_IMAGE,
        type: 'website'
      };
  }
}

export function applyPageSeo(input: SeoInput): void {
  const payload = createSeoPayload(input);
  const canonical = absoluteUrl(payload.path);
  const imageUrl = absoluteUrl(payload.image);

  document.title = payload.title;
  upsertMetaByName('description', payload.description);
  upsertCanonical(canonical);

  upsertMetaByProperty('og:site_name', SITE_NAME);
  upsertMetaByProperty('og:type', payload.type);
  upsertMetaByProperty('og:title', payload.title);
  upsertMetaByProperty('og:description', payload.description);
  upsertMetaByProperty('og:url', canonical);
  upsertMetaByProperty('og:image', imageUrl);

  upsertMetaByName('twitter:card', 'summary_large_image');
  upsertMetaByName('twitter:title', payload.title);
  upsertMetaByName('twitter:description', payload.description);
  upsertMetaByName('twitter:image', imageUrl);

  if (input.page === Page.PRODUCT && input.selectedProduct) {
    const product = input.selectedProduct;
    const productSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: sanitizeText(product.name),
      description: sanitizeText(product.description || product.tagline || DEFAULT_DESCRIPTION),
      image: [absoluteUrl(product.image || DEFAULT_IMAGE)],
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: SITE_NAME
      },
      offers: {
        '@type': 'Offer',
        url: canonical,
        priceCurrency: 'USD',
        price: product.price.toFixed(2),
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition'
      }
    };

    if (typeof product.rating === 'number' && typeof product.reviews === 'number' && product.reviews > 0) {
      productSchema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toFixed(1),
        reviewCount: String(product.reviews)
      };
    }

    upsertJsonLd('product', productSchema);
  } else {
    removeJsonLd('product');
  }
}
