/**
 * Welcome-series runner. Pure logic, called by /api/cron/welcome-series.
 *
 * For each step in WELCOME_SERIES_STEPS:
 *   1. Pull candidates whose signup date falls in a 24h window (daysAfterSignup ago).
 *   2. Skip anyone whose code has already been redeemed in Shopify.
 *   3. Send the step email via Resend.
 *   4. Mark the step column so we never resend.
 *
 * The 24h window means a missed cron run self-heals on the next day.
 */

import {
  findClaimsForStep,
  markRedeemed,
  markStepSent,
} from './popup-discount-db.shared.js'
import { getDiscountUsage } from './shopify-discount-usage.shared.js'
import { readShopifyConfig } from './shopify-admin.shared.js'
import { WELCOME_SERIES_STEPS } from './welcome-series-templates.shared.js'

const DISCOUNT_TOTAL_DAYS = 30
const DAY_MS = 24 * 60 * 60 * 1000

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

function daysLeftForClaim(claim) {
  if (!claim?.created_at) return null
  const createdMs = new Date(claim.created_at).getTime()
  if (!Number.isFinite(createdMs)) return null
  const expiresMs = createdMs + DISCOUNT_TOTAL_DAYS * DAY_MS
  const remainingMs = expiresMs - Date.now()
  return Math.max(0, Math.ceil(remainingMs / DAY_MS))
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
    try {
      data = await response.json()
    } catch {
      data = {}
    }

    if (!response.ok) {
      const message =
        typeof data?.message === 'string' && data.message.trim()
          ? data.message
          : `Resend ${response.status}`
      return { ok: false, error: message }
    }
    return { ok: true, id: data?.id || null }
  } catch (error) {
    console.error('welcome-series sendResendEmail error:', error)
    return { ok: false, error: 'Could not connect to email provider.' }
  }
}

async function processStep({
  admin,
  step,
  resend,
  shopifyConfig,
  siteBaseUrl,
  now,
}) {
  const windowEnd = new Date(now.getTime() - step.daysAfterSignup * DAY_MS)
  const windowStart = new Date(windowEnd.getTime() - DAY_MS)

  const candidates = await findClaimsForStep(
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
    expired_skipped: 0,
    errors: 0,
  }

  for (const claim of candidates) {
    const usage = await getDiscountUsage(claim.discount_code, shopifyConfig)
    if (usage.ok && usage.used) {
      await markRedeemed(admin, claim.id)
      stats.redeemed_skipped += 1
      continue
    }
    // If we can't reach Shopify, fail closed (don't risk emailing a redeemed code).
    if (!usage.ok) {
      stats.errors += 1
      continue
    }

    if (step.id === 'expiry_warning' && usage.expired) {
      // Past expiry: warning is moot. Mark step done so we stop scanning this row.
      await markStepSent(admin, claim.id, step.column)
      stats.expired_skipped += 1
      continue
    }

    const unsubscribeUrl = buildUnsubscribeUrl(siteBaseUrl, claim.unsubscribe_token)
    const daysLeft = daysLeftForClaim(claim)
    const { subject, html } = step.build({
      firstName: claim.first_name,
      discountCode: claim.discount_code,
      unsubscribeUrl,
      daysLeft,
    })

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
        `welcome-series step=${step.id} send failed for ${claim.email_normalized}:`,
        result.error
      )
      stats.errors += 1
      continue
    }

    await markStepSent(admin, claim.id, step.column)
    stats.sent += 1
  }

  return stats
}

/**
 * Run the full welcome series. Idempotent per-row via the step columns.
 *
 * @param {{ admin: any, getEnv: (name: string) => string, siteBaseUrl?: string, now?: Date }} args
 */
export async function runWelcomeSeries({ admin, getEnv, siteBaseUrl, now }) {
  const resend = readResendConfig(getEnv)
  if (!resend.apiKey) {
    return {
      ok: false,
      status: 500,
      error: 'RESEND_API_KEY is not configured.',
    }
  }

  const shopifyConfig = readShopifyConfig(getEnv)
  if (!shopifyConfig.shopDomain) {
    return {
      ok: false,
      status: 500,
      error: 'SHOPIFY_STORE_DOMAIN is not configured.',
    }
  }

  const baseUrl =
    siteBaseUrl ||
    getEnv('SITE_BASE_URL') ||
    getEnv('VITE_SITE_BASE_URL') ||
    ''

  const runAt = now instanceof Date ? now : new Date()
  const perStep = []
  for (const step of WELCOME_SERIES_STEPS) {
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

  return {
    ok: true,
    status: 200,
    ranAt: runAt.toISOString(),
    steps: perStep,
  }
}
