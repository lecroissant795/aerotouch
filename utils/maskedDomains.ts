export interface MaskedDomainConfig {
  /** Matches a `BlogPost.id` in the BLOG_POSTS array */
  slug: string;
  title: string;
  description: string;
  /** CTA button text */
  ctaText: string;
  /** Absolute URL the CTA points to */
  ctaUrl: string;
}

export const MASKED_DOMAINS: Record<string, MaskedDomainConfig> = {
  // Replace the key with your actual *.vercel.app project URL once created
  'your-project-name.vercel.app': {
    slug: '3',
    title: 'How to Make Your Foot Pain Go Away',
    description: 'Doctor-backed guide to ending plantar fasciitis and heel pain for good.',
    ctaText: 'Fix My Foot Pain — Shop AeroTouch',
    ctaUrl: 'https://aerotouch.shop',
  },
  // Local preview — visit http://localhost:5173 after adding to /etc/hosts, or use query param trick
  'masked.localhost': {
    slug: '3',
    title: 'How to Make Your Foot Pain Go Away',
    description: 'Doctor-backed guide to ending plantar fasciitis and heel pain for good.',
    ctaText: 'Fix My Foot Pain — Shop AeroTouch',
    ctaUrl: 'https://aerotouch.shop',
  },
};

export function getMaskedDomain(): MaskedDomainConfig | null {
  return MASKED_DOMAINS[window.location.hostname] ?? null;
}
