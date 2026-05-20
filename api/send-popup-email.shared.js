/**
 * Welcome email (Day 0) — sent immediately when a user submits the discount popup.
 * Template 1: Welcome Email + Discount Code
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
  spacer,
  footer,
  bodyText,
} from './email-design-system.shared.js'

function sanitizeName(name) {
  return String(name || '')
    .trim()
    .replace(/[^a-zA-Z\s'-]/g, '')
    .slice(0, 50)
}

function sanitizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function buildHtml({ firstName, discountCode: code, unsubscribeUrl, siteBaseUrl = 'https://aerotouch.com', productImageUrl }) {
  const safeName = escapeHtml(firstName)
  const base = siteBaseUrl.replace(/\/+$/, '')

  const content =
    header() +
    heroSection({
      title: `Welcome to AeroTouch, ${safeName}!`,
      subtitle: 'Your feet are about to feel a whole lot better.',
      badge: '20% OFF YOUR FIRST ORDER',
    }) +
    spacer(8) +
    bodyText(`
      <p style="margin:0 0 4px 0;">Thanks for joining us. We made you a personal discount code&mdash;use it any time in the next 30 days:</p>
    `) +
    discountCode(code, { label: 'Your welcome code', description: '20% off your entire order' }) +
    spacer(4) +
    ctaButton('Shop Now', base) +
    productShowcase({ imageUrl: productImageUrl, altText: 'AeroTouch performance insoles', caption: 'Engineered for all-day comfort and pain relief' }) +
    bodyText(`<p style="margin:0 0 8px 0;font-weight:700;color:#0f172a;">Why thousands choose AeroTouch:</p>`) +
    benefitsList([
      'Targeted arch support that adapts to your foot',
      'Shock-absorbing cushioning for joints and lower back',
      'Breathable, moisture-wicking design for all-day wear',
      'Fits running shoes, work boots, and everyday sneakers',
    ]) +
    spacer(8) +
    guaranteeBanner() +
    spacer(8) +
    trustSection() +
    footer({ unsubscribeUrl, siteBaseUrl })

  return emailShell(content)
}

export async function sendPopupEmail({ firstName, email, discountCode: code, resendApiKey, fromEmail, unsubscribeUrl, siteBaseUrl, productImageUrl }) {
  const safeFirstName = sanitizeName(firstName)
  const safeEmail = sanitizeEmail(email)
  const safeCode = String(code || '')
    .trim()
    .toUpperCase()
    .slice(0, 32)

  if (!safeFirstName || !safeEmail || !safeCode) {
    return { ok: false, status: 400, error: 'firstName, email and discountCode are required.' }
  }
  if (!isValidEmail(safeEmail)) {
    return { ok: false, status: 400, error: 'Invalid email address.' }
  }
  if (!resendApiKey) {
    return { ok: false, status: 500, error: 'Email service is not configured yet.' }
  }

  try {
    const trimmedUnsubUrl =
      typeof unsubscribeUrl === 'string' ? unsubscribeUrl.trim() : ''
    const headers = trimmedUnsubUrl
      ? {
          'List-Unsubscribe': `<${trimmedUnsubUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        }
      : undefined

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [safeEmail],
        subject: `${safeFirstName}, here's your 20% off welcome code`,
        html: buildHtml({
          firstName: safeFirstName,
          discountCode: safeCode,
          unsubscribeUrl: trimmedUnsubUrl,
          siteBaseUrl,
          productImageUrl,
        }),
        ...(headers ? { headers } : {}),
      }),
    })

    let data = {}
    try {
      data = await response.json()
    } catch {
      data = {}
    }

    if (!response.ok) {
      const resendMessage =
        typeof data?.message === 'string' && data.message.trim()
          ? data.message
          : 'Failed to send discount email.'
      return { ok: false, status: 502, error: resendMessage }
    }

    return { ok: true, status: 200, id: data.id || null }
  } catch (error) {
    console.error('sendPopupEmail provider error:', error)
    return { ok: false, status: 500, error: 'Could not connect to email provider.' }
  }
}
