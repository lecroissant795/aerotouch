/**
 * Cart-abandonment drip runner. Called by /api/cron/cart-abandonment (hourly).
 *
 * For each step in CART_ABANDONMENT_STEPS:
 *   1. Pull candidates whose signup falls in an hour-based window (hoursAfterSignup ago + 2h buffer).
 *   2. Skip anyone whose code was already redeemed in Shopify.
 *   3. Send the step email via Resend.
 *   4. Mark the step column so we never resend.
 *
 * Step 1 (reminder) is normally sent by the handler on submit; the cron acts as a backup.
 */

import {
  findAbandonmentsForStep,
  markAbandonmentRedeemed,
  markAbandonmentStepSent,
} from './cart-abandonment-db.shared.js'
import { getDiscountUsage } from './shopify-discount-usage.shared.js'
import { readShopifyConfig } from './shopify-admin.shared.js'
import { CART_ABANDONMENT_STEPS } from './cart-abandonment-templates.shared.js'

const HOUR_MS = 60 * 60 * 1000
const BUFFER_HOURS = 2

function readResendConfig(getEnv) {
  const apiKey = getEnv('RESEND_API_KEY') || getEnv('VITE_RESEND_API_KEY')
  const fromEmail =
    getEnv('RESEND_FROM_EMAIL') ||
    getEnv('VITE_RESEND_FROM_EMAIL') ||
    'AeroTouch <onboarding@resend.dev>'
  return { apiKey, fromEmail }
}

function buildUnsubscribeUrl(siteBaseUrl, token) {
  if (!token || !siteBaseUrl) return ''
  const base = String(siteBaseUrl).replace(/\/+$/, '')
  return `${base}/api/unsubscribe?token=${encodeURIComponent(token)}`
}

async function sendResendEmail({ apiKey, fromEmail, to, subject, html, headers }) {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [to],
        subject,
        html,
        ...(headers ? { headers } : {}),
      }),
    })

    let data = {}
    try { data = await response.json() } catch { data = {} }

    if (!response.ok) {
      const message = data?.message || `Resend ${response.status}`
      return { ok: false, error: message }
    }
    return { ok: true, id: data?.id || null }
  } catch (error) {
    console.error('cart-abandonment-series sendResendEmail error:', error)
    return { ok: false, error: 'Could not connect to email provider.' }
  }
}

async function processStep({ admin, step, resend, shopifyConfig, siteBaseUrl, now }) {
  const windowEnd = new Date(now.getTime() - step.hoursAfterSignup * HOUR_MS)
  const windowStart = new Date(windowEnd.getTime() - BUFFER_HOURS * HOUR_MS)

  const candidates = await findAbandonmentsForStep(
    admin,
    step,
    windowStart.toISOString(),
    windowEnd.toISOString()
  )

  const stats = {
    step: step.id,
    window: { start: windowStart.toISOString(), end: windowEnd.toISOString() },
    attempted: candidates.length,
    sent: 0,
    redeemed_skipped: 0,
    errors: 0,
  }

  for (const claim of candidates) {
    const usage = await getDiscountUsage(claim.discount_code, shopifyConfig)
    if (usage.ok && usage.used) {
      await markAbandonmentRedeemed(admin, claim.id)
      stats.redeemed_skipped += 1
      continue
    }
    if (!usage.ok) {
      stats.errors += 1
      continue
    }

    const unsubscribeUrl = buildUnsubscribeUrl(siteBaseUrl, claim.unsubscribe_token)
    const firstName = claim.first_name || 'there'
    const html = step.build({
      firstName,
      discountCode: claim.discount_code,
      cartSnapshot: claim.cart_snapshot,
      unsubscribeUrl,
      siteBaseUrl,
    })
    const subject = step.subject(firstName)

    const headers = unsubscribeUrl
      ? {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        }
      : undefined

    const result = await sendResendEmail({
      apiKey: resend.apiKey,
      fromEmail: resend.fromEmail,
      to: claim.email_normalized,
      subject,
      html,
      headers,
    })

    if (!result.ok) {
      console.error(
        `cart-abandonment step=${step.id} send failed for ${claim.email_normalized}:`,
        result.error
      )
      stats.errors += 1
      continue
    }

    await markAbandonmentStepSent(admin, claim.id, step.column)
    stats.sent += 1
  }

  return stats
}

/**
 * @param {{ admin: any, getEnv: (name: string) => string, siteBaseUrl?: string, now?: Date }} args
 */
export async function runCartAbandonmentSeries({ admin, getEnv, siteBaseUrl, now }) {
  const resend = readResendConfig(getEnv)
  if (!resend.apiKey) {
    return { ok: false, status: 500, error: 'RESEND_API_KEY is not configured.' }
  }

  const shopifyConfig = readShopifyConfig(getEnv)
  if (!shopifyConfig.shopDomain) {
    return { ok: false, status: 500, error: 'SHOPIFY_STORE_DOMAIN is not configured.' }
  }

  const baseUrl =
    siteBaseUrl || getEnv('SITE_BASE_URL') || getEnv('VITE_SITE_BASE_URL') || ''

  const runAt = now instanceof Date ? now : new Date()
  const perStep = []
  for (const step of CART_ABANDONMENT_STEPS) {
    const result = await processStep({
      admin,
      step,
      resend,
      shopifyConfig,
      siteBaseUrl: baseUrl,
      now: runAt,
    })
    perStep.push(result)
  }

  return { ok: true, status: 200, ranAt: runAt.toISOString(), steps: perStep }
}
