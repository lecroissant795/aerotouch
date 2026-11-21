/**
 * Promotional email templates.
 * Template 6: Seasonal Promotion Email
 */

import {
  BRAND,
  escapeHtml,
  emailShell,
  header,
  heroSection,
  productShowcase,
  discountCode,
  ctaButton,
  benefitsList,
  trustSection,
  guaranteeBanner,
  bodyText,
  spacer,
  divider,
  footer,
} from './email-design-system.shared.js'

const SEASONAL_THEMES = {
  summer: {
    badge: 'SUMMER SALE',
    title: 'Stay Cool, Stay Comfortable',
    subtitle: 'Lightweight comfort for every summer adventure — on sale now.',
    headline: 'This summer, give your feet the support they deserve.',
    benefits: [
      'Breathable, moisture-wicking design for hot days',
      'Lightweight cushioning for long walks and travel',
      'Reduces fatigue on hikes, runs, and all-day outings',
      'UV-resistant materials that won\'t break down in the heat',
    ],
    cta: 'Shop the Summer Sale',
  },
  winter: {
    badge: 'WINTER SALE',
    title: 'Warm Feet, Happy Feet',
    subtitle: 'Extra cushioning and support for the cold months ahead.',
    headline: 'Cold floors and heavy boots take a toll — let your insoles do the heavy lifting.',
    benefits: [
      'Extra cushioning for boots and cold-weather shoes',
      'Shock absorption on hard winter surfaces',
      'All-day warmth without adding bulk',
      'Perfect for winter boots, work boots, and snow shoes',
    ],
    cta: 'Shop the Winter Sale',
  },
  spring: {
    badge: 'SPRING REFRESH',
    title: 'Fresh Start for Your Feet',
    subtitle: 'New season, new insoles — refresh your comfort and save.',
    headline: 'Spring is the perfect time to replace worn-out insoles and start fresh.',
    benefits: [
      'Swap out winter wear for fresh arch support',
      'Perfect time to fit new spring sneakers and shoes',
      'Revive tired feet after a long winter',
      'Light, responsive cushioning for the warmer days ahead',
    ],
    cta: 'Shop the Spring Sale',
  },
  fall: {
    badge: 'FALL SAVINGS',
    title: 'Step Into Fall Comfort',
    subtitle: 'Cozy season starts from the ground up — save on AeroTouch insoles.',
    headline: "As the weather cools, make sure your feet are ready for longer days in heavier shoes.",
    benefits: [
      'Ideal support for transitioning to boots and closed-toe shoes',
      'Cushioning that handles fall hikes and outdoor activities',
      'All-day comfort for back-to-school and work routines',
      'Durable enough to carry you through to spring',
    ],
    cta: 'Shop the Fall Sale',
  },
}

/**
 * Template 6: Seasonal Promotion Email
 *
 * @param {object} opts
 * @param {string} opts.firstName
 * @param {string} opts.discountCode - e.g. "SUMMER25"
 * @param {string} opts.discountPercent - e.g. "25%"
 * @param {string} opts.season - "summer" | "winter" | "spring" | "fall"
 * @param {string} [opts.expiryDate] - e.g. "June 30, 2026"
 * @param {string} [opts.unsubscribeUrl]
 * @param {string} [opts.siteBaseUrl]
 * @param {string} [opts.productImageUrl]
 */
export function buildSeasonalPromotionEmail({
  firstName,
  discountCode: code,
  discountPercent = '25%',
  season = 'summer',
  expiryDate,
  unsubscribeUrl,
  siteBaseUrl = 'https://aerotouch.com',
  productImageUrl,
}) {
  const safeName = escapeHtml(firstName)
  const base = siteBaseUrl.replace(/\/+$/, '')
  const theme = SEASONAL_THEMES[season] || SEASONAL_THEMES.summer
  const subject = `${safeName}, ${theme.title} — ${discountPercent} Off`

  const content =
    header() +
    heroSection({
      title: theme.title,
      subtitle: theme.subtitle,
      badge: `${discountPercent} OFF — ${theme.badge}`,
    }) +
    spacer(8) +
    bodyText(`
      <p style="margin:0 0 14px 0;">Hey ${safeName},</p>
      <p style="margin:0 0 14px 0;">${escapeHtml(theme.headline)}</p>
      <p style="margin:0;">For a limited time, take <strong>${escapeHtml(discountPercent)} off</strong> your entire order with this seasonal code:</p>
    `) +
    spacer(4) +
    discountCode(code, { label: theme.badge, description: `${discountPercent} off your entire order` }) +
    spacer(4) +
    ctaButton(theme.cta, base) +
    productShowcase({ imageUrl: productImageUrl, altText: 'AeroTouch seasonal promotion', caption: 'Premium insoles engineered for every season' }) +
    bodyText(`<p style="margin:0 0 8px 0;font-weight:700;color:${BRAND.dark};">Why this season matters for your feet:</p>`) +
    benefitsList(theme.benefits) +
    spacer(12) +
    guaranteeBanner() +
    spacer(8) +
    trustSection([
      { text: "Bought during last year's sale and I'm still wearing the same pair daily. Incredible durability and comfort.", name: 'Alex R.', role: 'Verified Buyer', rating: 5 },
      { text: 'The difference is night and day. My feet used to ache by noon — now I forget I\'m even wearing insoles.', name: 'Patricia M.', role: 'Verified Buyer', rating: 5 },
    ]) +
    (expiryDate ? (
      divider() +
      spacer(8) +
      bodyText(`<p style="margin:0;text-align:center;font-size:14px;color:${BRAND.muted};">This offer expires <strong style="color:${BRAND.dark};">${escapeHtml(expiryDate)}</strong>. Don't miss out.</p>`) +
      spacer(4) +
      ctaButton('Shop Now', base)
    ) : '') +
    spacer(8) +
    footer({ unsubscribeUrl, siteBaseUrl: base })

  return { subject, html: emailShell(content) }
}

export { SEASONAL_THEMES }
