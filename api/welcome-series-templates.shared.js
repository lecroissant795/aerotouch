/**
 * Welcome-series email templates. Each template returns { subject, html } and is
 * intentionally inline-styled (no external CSS) so it renders consistently in Gmail,
 * Outlook, Apple Mail, etc. Style matches the Day-0 popup code email.
 */

const BRAND_ORANGE = '#ea580c'
const BRAND_ORANGE_LIGHT = '#fff7ed'
const BRAND_ORANGE_BORDER = '#fed7aa'
const TEXT_DARK = '#0f172a'
const TEXT_MUTED = '#64748b'

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function unsubscribeFooter(unsubscribeUrl) {
  if (!unsubscribeUrl) {
    return `
      <p style="margin:20px 0 0 0;font-size:12px;color:${TEXT_MUTED};">
        AeroTouch &middot; You're receiving this because you signed up for our welcome offer.
      </p>
    `
  }
  return `
    <p style="margin:24px 0 0 0;font-size:12px;color:${TEXT_MUTED};line-height:1.5;">
      AeroTouch &middot; You're receiving this because you signed up for our welcome offer.<br/>
      No longer interested? <a href="${escapeHtml(unsubscribeUrl)}" style="color:${TEXT_MUTED};text-decoration:underline;">Unsubscribe</a>.
    </p>
  `
}

function codeBlock(discountCode) {
  return `
    <div style="margin:16px 0;padding:14px 16px;background:${BRAND_ORANGE_LIGHT};border:1px solid ${BRAND_ORANGE_BORDER};border-radius:10px;display:inline-block;">
      <span style="font-size:24px;font-weight:700;letter-spacing:1px;color:${BRAND_ORANGE};">${escapeHtml(discountCode)}</span>
    </div>
  `
}

function shopButton() {
  return `
    <p style="margin:16px 0 0 0;">
      <a href="https://aerotouch.com/" style="display:inline-block;padding:12px 22px;background:${BRAND_ORANGE};color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">
        Shop AeroTouch
      </a>
    </p>
  `
}

function wrap(content) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:${TEXT_DARK};max-width:600px;margin:0 auto;padding:16px;">
      ${content}
    </div>
  `
}

/**
 * Day 2: light reminder. Goal: nudge anyone who saved the email and forgot.
 */
export function buildReminderEmail({ firstName, discountCode, unsubscribeUrl }) {
  const safeName = escapeHtml(firstName)
  const subject = `${firstName}, your AeroTouch 20% off is still waiting`
  const html = wrap(`
    <h2 style="margin:0 0 12px 0;">Still here, ${safeName}.</h2>
    <p style="margin:0 0 12px 0;">A quick reminder that your welcome discount is ready when you are. 20% off your first order, no minimum.</p>
    ${codeBlock(discountCode)}
    <p style="margin:12px 0 0 0;">Drop it in at checkout and you're done.</p>
    ${shopButton()}
    ${unsubscribeFooter(unsubscribeUrl)}
  `)
  return { subject, html }
}

/**
 * Day 7: brand story / social proof. Re-includes the code so the email is self-contained.
 */
export function buildStoryEmail({ firstName, discountCode, unsubscribeUrl }) {
  const safeName = escapeHtml(firstName)
  const subject = `Why ${firstName ? firstName + ' should' : 'people'} swear by AeroTouch insoles`
  const html = wrap(`
    <h2 style="margin:0 0 12px 0;">Built for the way you actually move.</h2>
    <p style="margin:0 0 12px 0;">Hey ${safeName} &mdash; quick story before your code expires.</p>
    <p style="margin:0 0 12px 0;">
      AeroTouch insoles use targeted arch support and shock-absorbing cushioning to take pressure off your feet, knees, and lower back. Runners, nurses, retail workers, and lifters tell us the same thing: their feet stop hurting after a couple of days.
    </p>
    <blockquote style="margin:16px 0;padding:12px 16px;border-left:3px solid ${BRAND_ORANGE};background:${BRAND_ORANGE_LIGHT};color:${TEXT_DARK};font-style:italic;">
      "I'm on my feet 12 hours a day. These are the first insoles that actually held up." &mdash; Sarah J.
    </blockquote>
    <p style="margin:0 0 12px 0;">Your 20% off code is still good:</p>
    ${codeBlock(discountCode)}
    ${shopButton()}
    ${unsubscribeFooter(unsubscribeUrl)}
  `)
  return { subject, html }
}

/**
 * Day 25: expiry urgency. Goal: convert with deadline pressure.
 */
export function buildExpiryWarningEmail({ firstName, discountCode, unsubscribeUrl, daysLeft }) {
  const safeName = escapeHtml(firstName)
  const days = Number.isFinite(daysLeft) && daysLeft > 0 ? daysLeft : 5
  const dayWord = days === 1 ? 'day' : 'days'
  const subject = `${days} ${dayWord} left on your AeroTouch discount`
  const html = wrap(`
    <h2 style="margin:0 0 12px 0;">${safeName}, your code is about to expire.</h2>
    <p style="margin:0 0 12px 0;">
      Your welcome 20% off ends in <strong>${days} ${dayWord}</strong>. Once it's gone, it's gone &mdash; here it is one more time:
    </p>
    ${codeBlock(discountCode)}
    <p style="margin:12px 0 0 0;">Free shipping on orders over $50. Risk-free 60-day returns.</p>
    ${shopButton()}
    ${unsubscribeFooter(unsubscribeUrl)}
  `)
  return { subject, html }
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
