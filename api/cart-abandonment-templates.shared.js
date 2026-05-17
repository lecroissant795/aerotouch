/**
 * Cart abandonment drip templates (1h, 24h, 72h).
 * Template 2: Abandoned Cart Email series.
 */

import {
  escapeHtml,
  emailShell,
  header,
  heroSection,
  cartItemsTable,
  discountCode,
  ctaButton,
  trustSection,
  guaranteeBanner,
  bodyText,
  spacer,
  divider,
  footer,
} from './email-design-system.shared.js'

/**
 * Step 1 (1h): Reminder — "You left something behind"
 */
function buildReminderHtml({ firstName, discountCode: code, cartSnapshot, unsubscribeUrl, siteBaseUrl }) {
  const safeName = escapeHtml(firstName)
  const base = (siteBaseUrl || 'https://aerotouch.com').replace(/\/+$/, '')

  const content =
    header() +
    heroSection({
      title: `${safeName}, You Left Something Behind`,
      subtitle: "Your cart is saved and waiting for you — plus we've added a little extra incentive.",
      badge: '15% OFF',
    }) +
    spacer(8) +
    bodyText(`<p style="margin:0 0 4px 0;font-weight:700;color:#0f172a;">Your items:</p>`) +
    cartItemsTable(cartSnapshot) +
    spacer(8) +
    bodyText(`<p style="margin:0;text-align:center;">Use this exclusive code to save <strong>15% off</strong> your order:</p>`) +
    discountCode(code, { label: 'Cart recovery code', description: '15% off your order' }) +
    spacer(4) +
    ctaButton('Complete Your Order', base) +
    guaranteeBanner() +
    spacer(8) +
    trustSection([
      { text: "I was on the fence, but I'm so glad I went through with it. My feet feel brand new after just a few days.", name: 'Rachel P.', role: 'Verified Buyer', rating: 5 },
      { text: 'The comfort is unreal. I stand on concrete floors all day and these saved my knees.', name: 'Chris D.', role: 'Warehouse Worker, Verified Buyer', rating: 5 },
    ]) +
    bodyText(`<p style="margin:0;font-size:13px;color:#64748b;text-align:center;">This code expires in 7 days and can only be used once.</p>`) +
    spacer(8) +
    footer({ unsubscribeUrl, siteBaseUrl: base })

  return emailShell(content)
}

/**
 * Step 2 (24h): Social proof — reviews and testimonials
 */
function buildSocialProofHtml({ firstName, discountCode: code, cartSnapshot, unsubscribeUrl, siteBaseUrl }) {
  const safeName = escapeHtml(firstName)
  const base = (siteBaseUrl || 'https://aerotouch.com').replace(/\/+$/, '')

  const content =
    header() +
    heroSection({
      title: 'People Are Loving What You Picked',
      subtitle: `${safeName}, thousands of customers agree — AeroTouch insoles deliver real relief.`,
    }) +
    spacer(8) +
    trustSection([
      { text: "The heel pain that kept me up at night is gone. Completely gone. I ordered a second pair for my work boots.", name: 'Michael T.', role: 'Construction Worker, Verified Buyer', rating: 5 },
      { text: "I've tried every insole brand out there. AeroTouch is the only one that lasted more than a month and still feels like new.", name: 'Jennifer W.', role: 'Nurse, Verified Buyer', rating: 5 },
      { text: 'My plantar fasciitis was ruining my mornings. Two weeks with these and I can walk pain-free again.', name: 'Robert A.', role: 'Teacher, Verified Buyer', rating: 5 },
    ]) +
    divider() +
    spacer(8) +
    bodyText(`<p style="margin:0 0 4px 0;font-weight:700;color:#0f172a;">Still in your cart:</p>`) +
    cartItemsTable(cartSnapshot) +
    spacer(4) +
    bodyText(`<p style="margin:0;text-align:center;">Your 15% off code is still active:</p>`) +
    discountCode(code, { label: 'Your code', description: '15% off your order' }) +
    ctaButton('Complete Your Order', base) +
    guaranteeBanner() +
    spacer(8) +
    footer({ unsubscribeUrl, siteBaseUrl: base })

  return emailShell(content)
}

/**
 * Step 3 (72h): Final nudge — last chance urgency
 */
function buildFinalNudgeHtml({ firstName, discountCode: code, cartSnapshot, unsubscribeUrl, siteBaseUrl }) {
  const safeName = escapeHtml(firstName)
  const base = (siteBaseUrl || 'https://aerotouch.com').replace(/\/+$/, '')

  const content =
    header() +
    heroSection({
      title: 'Last Chance — Your 15% Off Expires Soon',
      subtitle: `${safeName}, this is your final reminder before your discount goes away.`,
      badge: 'FINAL REMINDER',
    }) +
    spacer(8) +
    bodyText(`
      <p style="margin:0 0 14px 0;">We've been holding your cart, but your exclusive <strong>15% off</strong> code is about to expire. After this, we won't email you about this cart again.</p>
    `) +
    bodyText(`<p style="margin:0 0 4px 0;font-weight:700;color:#0f172a;">Your items:</p>`) +
    cartItemsTable(cartSnapshot) +
    spacer(4) +
    discountCode(code, { label: 'Expiring soon', description: '15% off — last chance' }) +
    ctaButton('Use My Code Now', base) +
    guaranteeBanner() +
    spacer(8) +
    trustSection([
      { text: "Almost didn't buy these. So glad I pulled the trigger — my feet haven't felt this good in years.", name: 'Amanda S.', role: 'Verified Buyer', rating: 5 },
    ]) +
    footer({ unsubscribeUrl, siteBaseUrl: base })

  return emailShell(content)
}

export const CART_ABANDONMENT_STEPS = [
  {
    id: 'reminder',
    column: 'reminder_sent_at',
    hoursAfterSignup: 1,
    subject: (firstName) => `${firstName}, you left something behind`,
    build: buildReminderHtml,
  },
  {
    id: 'social_proof',
    column: 'social_proof_sent_at',
    hoursAfterSignup: 24,
    subject: () => 'People are loving what you picked',
    build: buildSocialProofHtml,
  },
  {
    id: 'final_nudge',
    column: 'final_nudge_sent_at',
    hoursAfterSignup: 72,
    subject: () => 'Last chance — your 15% off expires soon',
    build: buildFinalNudgeHtml,
  },
]
