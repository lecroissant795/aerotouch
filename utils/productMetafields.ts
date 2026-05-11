/**
 * Shopify Metafield Definitions for Product Pages
 *
 * These metafields can be set per product in Shopify Admin
 * Namespace: custom
 */

export interface ProductMetafields {
  // Description & Features
  custom_description?: string;                    // Override full description
  custom_description_points?: string[];          // Array of bullet points
  custom_features?: Array<{ label: string; value: string }>; // Structured features

  // Layout & Sections
  page_layout?: 'primary' | 'secondary' | 'auto'; // Force layout type (default: auto-detect)
  show_kit_combo?: boolean;                      // Show/hide kit bundle section (primary only)
  show_tech_specs?: boolean;                     // Show/hide ProductTechSpecs (primary only)
  show_videos?: boolean;                         // Show/hide video section (primary only)
  show_expert_section?: boolean;                 // Show/hide expert recommendation (primary only)
  show_trust_badges?: boolean;                   // Show/hide trust badges grid (secondary only)
  show_faq?: boolean;                            // Show/hide FAQ section (secondary only)
  show_testimonials?: boolean;                   // Show/hide testimonial card (secondary only)

  // Content Customization
  timer_title?: string;                          // Override "OFFER ENDS SOON" title
  timer_subtitle?: string;                       // Override "Limited Time Discount"
  scarcity_message?: string;                     // Override "X people viewing this"

  // Bundle Options (for primary layout)
  bundle_options_override?: Array<{
    quantity: number;
    label: string;
    savings_text?: string;
    highlight?: 'none' | 'popular' | 'good-value' | 'best-value';
  }>;

  // Trust Badges (for secondary layout)
  trust_badges_override?: Array<{
    icon: 'truck' | 'shield' | 'headphones' | 'refresh' | 'star' | 'clock';
    label: string;
  }>;

  // FAQ Items (for secondary layout)
  faq_override?: Array<{ question: string; answer: string }>;

  // CTA Buttons
  primary_cta_text?: string;                     // Override "ADD TO CART" text
  secondary_cta_text?: string;                  // Override button text when size not selected
}

// Helper to get a safe default metafields object
export const DEFAULT_METAFIELDS: ProductMetafields = {
  page_layout: 'auto',
  show_kit_combo: true,
  show_tech_specs: true,
  show_videos: true,
  show_expert_section: true,
  show_trust_badges: true,
  show_faq: true,
  show_testimonials: true,
  timer_title: 'OFFER ENDS SOON',
  timer_subtitle: 'Limited Time Discount',
  scarcity_message: 'people viewing this',
};
