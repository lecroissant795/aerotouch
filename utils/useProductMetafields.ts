import { Product } from '../types';
import { ProductMetafields, DEFAULT_METAFIELDS } from './productMetafields';

/**
 * Hook to access product metafields with defaults
 * Returns a complete ProductMetafields object with all properties defined
 */
export function useProductMetafields(product: Product | null | undefined): ProductMetafields {
  const metafields = product?.metafields || {};

  return {
    // Description & Features
    custom_description: metafields.custom_description || product?.description || '',
    custom_description_points: metafields.custom_description_points || [],
    custom_features: metafields.custom_features || [],

    // Layout & Sections (defaults from DEFAULT_METAFIELDS)
    page_layout: (metafields.page_layout || DEFAULT_METAFIELDS.page_layout || 'auto') as 'primary' | 'secondary' | 'auto',
    show_kit_combo: metafields.show_kit_combo !== undefined ? metafields.show_kit_combo : DEFAULT_METAFIELDS.show_kit_combo,
    show_tech_specs: metafields.show_tech_specs !== undefined ? metafields.show_tech_specs : DEFAULT_METAFIELDS.show_tech_specs,
    show_videos: metafields.show_videos !== undefined ? metafields.show_videos : DEFAULT_METAFIELDS.show_videos,
    show_expert_section: metafields.show_expert_section !== undefined ? metafields.show_expert_section : DEFAULT_METAFIELDS.show_expert_section,
    show_trust_badges: metafields.show_trust_badges !== undefined ? metafields.show_trust_badges : DEFAULT_METAFIELDS.show_trust_badges,
    show_faq: metafields.show_faq !== undefined ? metafields.show_faq : DEFAULT_METAFIELDS.show_faq,
    show_testimonials: metafields.show_testimonials !== undefined ? metafields.show_testimonials : DEFAULT_METAFIELDS.show_testimonials,

    // Content Customization
    timer_title: metafields.timer_title || DEFAULT_METAFIELDS.timer_title,
    timer_subtitle: metafields.timer_subtitle || DEFAULT_METAFIELDS.timer_subtitle,
    scarcity_message: metafields.scarcity_message || DEFAULT_METAFIELDS.scarcity_message,

    // Bundle Options
    bundle_options_override: metafields.bundle_options_override || undefined,

    // Trust Badges
    trust_badges_override: metafields.trust_badges_override || undefined,

    // FAQ
    faq_override: metafields.faq_override || undefined,

    // CTA Buttons
    primary_cta_text: metafields.primary_cta_text || undefined,
    secondary_cta_text: metafields.secondary_cta_text || undefined,
  };
}
