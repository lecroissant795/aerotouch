/**
 * Width-capped URLs for Shopify CDN and Supabase Storage so the browser
 * can pick a reasonable size via srcSet + sizes.
 */

const SHOPIFY_HOST_RE = /\.(shopify\.com|shopifycdn\.com)$/i;
const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif|avif|bmp|tiff?)(\?|$)/i;
const VIDEO_EXT_RE = /\.(mov|mp4|webm|m4v|avi)(\?|$)/i;

/** Shopify / Supabase: larger cap for hero & product photography */
const SHOPIFY_MAX_WIDTH = 5760;

export type ImageTransformOptions = {
  quality?: number;
  /** Supabase render only: 'webp' saves bytes; 'origin' keeps PNG/JPEG for max fidelity */
  supabaseFormat?: 'webp' | 'origin';
};

const DEFAULT_TRANSFORM: ImageTransformOptions = {
  quality: 82,
  supabaseFormat: 'webp',
};

/** Hero + PDP gallery + product cards: high quality, preserve Supabase codec */
export const HIGH_FIDELITY: ImageTransformOptions = {
  quality: 96,
  supabaseFormat: 'origin',
};

function normalizeTransformOpts(qualityOrOpts?: number | ImageTransformOptions): ImageTransformOptions {
  if (qualityOrOpts == null) return { ...DEFAULT_TRANSFORM };
  if (typeof qualityOrOpts === 'number') {
    return { quality: qualityOrOpts, supabaseFormat: 'webp' };
  }
  return {
    quality: qualityOrOpts.quality ?? DEFAULT_TRANSFORM.quality,
    supabaseFormat: qualityOrOpts.supabaseFormat ?? DEFAULT_TRANSFORM.supabaseFormat,
  };
}

export function isShopifyCdnUrl(url: string): boolean {
  if (!url || url.startsWith('/')) return false;
  try {
    return SHOPIFY_HOST_RE.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/** Supabase public object URL pointing at a raster image (safe for /render/image). */
export function isSupabaseObjectImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (!u.pathname.includes('/storage/v1/object/public/')) return false;
    if (VIDEO_EXT_RE.test(u.pathname)) return false;
    return IMAGE_EXT_RE.test(u.pathname);
  } catch {
    return false;
  }
}

export function isSupabaseRenderImageUrl(url: string): boolean {
  try {
    return new URL(url).pathname.includes('/storage/v1/render/image/public/');
  } catch {
    return false;
  }
}

/** True if we can append width (and optionally format) for a smaller response. */
export function isOptimizableImageUrl(url: string): boolean {
  return isShopifyCdnUrl(url);
}

/**
 * Returns a URL scaled to at most `width` CSS pixels (Shopify `width` param;
 * Supabase image renderer). Non-CDN URLs are returned unchanged.
 */
export function withDisplayWidth(
  url: string,
  width: number,
  qualityOrOpts?: number | ImageTransformOptions
): string {
  if (!url) return url;
  const maxW = isShopifyCdnUrl(url) ? SHOPIFY_MAX_WIDTH : 4096;
  const w = Math.max(32, Math.min(maxW, Math.round(width)));
  const { quality, supabaseFormat } = normalizeTransformOpts(qualityOrOpts);
  try {
    if (isShopifyCdnUrl(url)) {
      const u = new URL(url);
      u.searchParams.set('width', String(w));
      return u.toString();
    }
    if (isSupabaseObjectImageUrl(url)) {
      const u = new URL(url);
      u.pathname = u.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      u.searchParams.set('width', String(w));
      u.searchParams.set('quality', String(quality));
      u.searchParams.set('format', supabaseFormat === 'origin' ? 'origin' : 'webp');
      return u.toString();
    }
    if (isSupabaseRenderImageUrl(url)) {
      const u = new URL(url);
      u.searchParams.set('width', String(w));
      if (!u.searchParams.has('quality')) u.searchParams.set('quality', String(quality));
      if (supabaseFormat === 'origin') u.searchParams.set('format', 'origin');
      return u.toString();
    }
  } catch {
    return url;
  }
  return url;
}

export function buildResponsiveSrcSet(
  url: string,
  widths: readonly number[],
  qualityOrOpts?: number | ImageTransformOptions
): string {
  if (!url || !isOptimizableImageUrl(url)) return '';
  const unique = [...new Set(widths.map((n) => Math.round(n)).filter((n) => n > 0))].sort((a, b) => a - b);
  return unique.map((wi) => `${withDisplayWidth(url, wi, qualityOrOpts)} ${wi}w`).join(', ');
}

/** Main PDP gallery — single column mobile, ~half desktop inside lg:w-3/5. */
export const SIZES_GALLERY_MAIN = '(max-width: 768px) 100vw, (max-width: 1280px) 55vw, 760px';

export const WIDTHS_GALLERY_MAIN = [480, 800, 1200, 1600] as const;

/** Product gallery / zoom: prioritize sharpness (Shopify up to 5760w). */
export const WIDTHS_GALLERY_MAIN_HI = [960, 1440, 1920, 2560, 3840] as const;

export const SIZES_GALLERY_THUMB = '100px';
export const WIDTHS_GALLERY_THUMB = [100, 200] as const;
export const WIDTHS_GALLERY_THUMB_HI = [200, 400] as const;

/** Product grid cards — ~2 cols mobile, 3 tablet, fixed max on desktop. */
export const SIZES_PRODUCT_CARD = '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px';
export const WIDTHS_PRODUCT_CARD = [400, 600, 800] as const;
export const WIDTHS_PRODUCT_CARD_HI = [640, 960, 1280, 1600, 1920] as const;

export const SIZES_CART_LINE = '80px';
export const WIDTHS_CART_THUMB = [80, 160] as const;

/** Full-viewport marketing hero. */
export const SIZES_HERO_FULL = '100vw';
export const WIDTHS_HERO = [800, 1200, 1600, 1920] as const;
export const WIDTHS_HERO_HI = [1280, 1920, 2560, 3840] as const;

/** Horizontal "Built for" cards on PDP (~280–320px slot). */
export const SIZES_BUILT_FOR_CARD = '(max-width: 768px) 280px, 320px';
export const WIDTHS_BUILT_FOR_CARD = [400, 560, 720] as const;
