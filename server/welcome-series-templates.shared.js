/**
 * Welcome-series drip templates (Day 2, 7, 25).
 * Template 3: Discount Code Reminder (Day 2)
 * Plus brand story (Day 7) and expiry warning (Day 25).
 */

import {
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

const SITE_BASE = 'https://aerotouch.com'

/**
 * Day 2: Discount reminder. Nudge anyone who saved the code but hasn't used it.
 */
export function buildReminderEmail({ firstName, discountCode: code, unsubscribeUrl }) {
  const safeName = escapeHtml(firstName)
  const subject = `${firstName}, your 20% off is still waiting`

  const content =
    header() +
    heroSection({
      title: `Still thinking it over, ${safeName}?`,
      subtitle: 'Your welcome discount is ready whenever you are.',
      badge: '20% OFF',
    }) +
    spacer(8) +
    bodyText(`
      <p style="margin:0 0 12px 0;">Just a friendly reminder&mdash;your personal 20% off code is still active. No minimum purchase, no catch. Drop it in at checkout and you're done.</p>
    `) +
    discountCode(code, { label: 'Your code', description: '20% off your entire order' }) +
    spacer(4) +
    ctaButton('Shop Now', SITE_BASE) +
    productShowcase({ altText: 'AeroTouch insoles' }) +
    bodyText(`<p style="margin:0 0 8px 0;font-weight:700;color:#0f172a;">What makes AeroTouch different:</p>`) +
    benefitsList([
      'Clinically-inspired arch support for lasting comfort',
      'Shock absorption that protects knees, hips, and back',
      'Works in any shoe — sneakers, boots, dress shoes',
      'Designed to last 6-12 months of daily wear',
    ]) +
    spacer(8) +
    guaranteeBanner() +
    spacer(8) +
    trustSection() +
    footer({ unsubscribeUrl, siteBaseUrl: SITE_BASE })

  return { subject, html: emailShell(content) }
}

/**
 * Day 7: Brand story + social proof. Builds trust with a deeper narrative.
 */
export function buildStoryEmail({ firstName, discountCode: code, unsubscribeUrl }) {
  const safeName = escapeHtml(firstName)
  const subject = `Why ${firstName ? firstName + ' should' : 'people'} try AeroTouch insoles`

  const content =
    header() +
    heroSection({
      title: 'Built for the Way You Actually Move',
      subtitle: `${safeName}, here's the story behind the insoles people swear by.`,
    }) +
    spacer(8) +
    bodyText(`
      <p style="margin:0 0 14px 0;">Most insoles are an afterthought&mdash;generic foam that compresses flat in a few weeks. We built AeroTouch to be different.</p>
      <p style="margin:0 0 14px 0;">Our insoles use <strong>targeted arch support</strong> and <strong>multi-layer shock absorption</strong> to redistribute pressure across your foot. The result: less strain on your feet, knees, and lower back from the first step.</p>
      <p style="margin:0 0 14px 0;">Runners, nurses, retail workers, and lifters all tell us the same thing&mdash;their feet stop hurting after a couple of days.</p>
    `) +
    productShowcase({ altText: 'AeroTouch comfort insoles' }) +
    spacer(4) +
    trustSection([
      { text: "I'm on my feet 12 hours a day. These are the first insoles that actually held up past week two. My lower back pain is almost gone.", name: 'Sarah J.', role: 'Nurse, Verified Buyer', rating: 5 },
      { text: "The moment I put them in, the heel pain vanished. I'm back to running 20 miles a week.", name: 'Michael T.', role: 'Marathon Runner, Verified Buyer', rating: 5 },
      { text: "I was skeptical, but these genuinely changed my daily routine. Standing at my desk all day doesn't hurt anymore.", name: 'David R.', role: 'Software Engineer, Verified Buyer', rating: 5 },
    ]) +
    divider() +
    spacer(8) +
    bodyText(`<p style="margin:0;text-align:center;">Your 20% off code is still good&mdash;use it before it expires:</p>`) +
    discountCode(code, { label: 'Your code', description: '20% off your entire order' }) +
    ctaButton('Shop AeroTouch', SITE_BASE) +
    guaranteeBanner() +
    spacer(8) +
    footer({ unsubscribeUrl, siteBaseUrl: SITE_BASE })

  return { subject, html: emailShell(content) }
}

/**
 * Day 25: Expiry urgency. Final push before the 30-day code expires.
 */
export function buildExpiryWarningEmail({ firstName, discountCode: code, unsubscribeUrl, daysLeft }) {
  const safeName = escapeHtml(firstName)
  const days = Number.isFinite(daysLeft) && daysLeft > 0 ? daysLeft : 5
  const dayWord = days === 1 ? 'day' : 'days'
  const subject = `${days} ${dayWord} left on your AeroTouch discount`

  const content =
    header() +
    heroSection({
      title: `${safeName}, Your Code Expires Soon`,
      subtitle: `You have ${days} ${dayWord} left to save 20% on your first order.`,
      badge: `${days} ${dayWord.toUpperCase()} LEFT`,
    }) +
    spacer(8) +
    bodyText(`
      <p style="margin:0 0 14px 0;">Your welcome discount is about to expire. Once it's gone, it's gone&mdash;we can't extend or reissue it.</p>
      <p style="margin:0 0 4px 0;">Here it is one more time:</p>
    `) +
    discountCode(code, { label: 'Expiring soon', description: `20% off — ${days} ${dayWord} remaining` }) +
    spacer(4) +
    ctaButton('Use My Code Now', SITE_BASE) +
    productShowcase({ altText: 'AeroTouch insoles' }) +
    benefitsList([
      'Immediate comfort from the first step',
      'Reduces foot, knee, and lower back pain',
      'Fits any shoe style you already own',
      'Backed by our 60-day money-back guarantee',
    ]) +
    spacer(8) +
    guaranteeBanner() +
    spacer(8) +
    trustSection([
      { text: "I almost let my code expire and I'm so glad I didn't. These insoles are the real deal.", name: 'James K.', role: 'Verified Buyer', rating: 5 },
      { text: 'Best money I\'ve spent on my feet. Period. The arch support is incredible.', name: 'Lisa M.', role: 'Verified Buyer', rating: 5 },
    ]) +
    footer({ unsubscribeUrl, siteBaseUrl: SITE_BASE })

  return { subject, html: emailShell(content) }
}

export const WELCOME_SERIES_STEPS = [
  {
    id: 'reminder',
    column: 'reminder_sent_at',
    daysAfterSignup: 2,
    build: buildReminderEmail,
  },
  {
    id: 'story',
    column: 'story_sent_at',
    daysAfterSignup: 7,
    build: buildStoryEmail,
  },
  {
    id: 'expiry_warning',
    column: 'expiry_warning_sent_at',
    daysAfterSignup: 25,
    build: buildExpiryWarningEmail,
  },
]
