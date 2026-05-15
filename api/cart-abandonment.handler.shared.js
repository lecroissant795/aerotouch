import crypto from 'crypto'
import { createAbandonmentDiscount } from './create-abandonment-discount.shared.js'
import { readShopifyConfig } from './shopify-admin.shared.js'
import { sendCapiEvent } from './meta-capi.shared.js'
import {
  findAbandonmentByEmail,
  getSupabaseAdmin,
  upsertAbandonment,
  markAbandonmentStepSent,
} from './cart-abandonment-db.shared.js'
import { CART_ABANDONMENT_STEPS } from './cart-abandonment-templates.shared.js'
import {
  normalizeEmail,
  isValidEmailFormat,
  sanitizeFirstName,
} from './popup-discount-validation.shared.js'

function getResendConfig(getEnv) {
  const resendApiKey = getEnv('RESEND_API_KEY') || getEnv('VITE_RESEND_API_KEY')
  const fromEmail =
    getEnv('RESEND_FROM_EMAIL') ||
    getEnv('VITE_RESEND_FROM_EMAIL') ||
    'AeroTouch <onboarding@resend.dev>'
  return { resendApiKey, fromEmail }
}

function generateUnsubscribeToken() {
  return crypto.randomBytes(24).toString('base64url')
}

function buildUnsubscribeUrl(siteBaseUrl, token) {
  if (!siteBaseUrl || !token) return ''
  const base = String(siteBaseUrl).replace(/\/+$/, '')
  return `${base}/api/unsubscribe?token=${encodeURIComponent(token)}`
}

async function sendAbandonmentEmail({ to, subject, html, resendApiKey, fromEmail, unsubscribeUrl }) {
  const headers = unsubscribeUrl
    ? {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
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
      to: [to],
      subject,
      html,
      ...(headers ? { headers } : {}),
    }),
  })

  if (!response.ok) {
    let data = {}
    try { data = await response.json() } catch {}
    const msg = data?.message || 'Failed to send email.'
    console.error('cart abandonment email send failed:', response.status, msg)
    return { ok: false, error: msg }
  }
  return { ok: true }
}

/**
 * @param {{ email?: string, firstName?: string, cartItems?: any[], cartTotal?: number, checkoutUrl?: string }} payload
 * @param {(name: string) => string} getEnv
 * @param {{ clientIp?: string, clientUserAgent?: string, fbp?: string, fbc?: string, eventSourceUrl?: string }} [clientContext]
 */
export async function handleCartAbandonmentRequest(payload, getEnv, clientContext = {}) {
  const firstName = sanitizeFirstName(payload?.firstName) || 'there'
  const emailNorm = normalizeEmail(payload?.email)

  if (!emailNorm) {
    return { status: 400, body: { error: 'Email is required.' } }
  }
  if (!isValidEmailFormat(emailNorm)) {
    return { status: 400, body: { error: 'Invalid email address.' } }
  }

  const cartItems = Array.isArray(payload?.cartItems) ? payload.cartItems : []
  if (cartItems.length === 0) {
    return { status: 400, body: { error: 'Cart must have at least one item.' } }
  }

  const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL')
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) {
    console.error('cart abandonment: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return { status: 503, body: { error: 'Service temporarily unavailable.' } }
  }

  const admin = getSupabaseAdmin(supabaseUrl, serviceKey)
  const { resendApiKey, fromEmail } = getResendConfig(getEnv)
  const siteBaseUrl = getEnv('SITE_BASE_URL') || getEnv('VITE_SITE_BASE_URL') || ''

  if (!resendApiKey) {
    return { status: 500, body: { error: 'Email service is not configured.' } }
  }

  const existing = await findAbandonmentByEmail(admin, emailNorm)

  // If drip already started (reminder sent), return duplicate
  if (existing?.reminder_sent_at) {
    return {
      status: 200,
      body: { ok: true, duplicate: true, message: 'You already have a cart recovery code. Check your inbox.' },
    }
  }

  // Create or reuse discount code
  let discountCode = existing?.discount_code
  if (!discountCode) {
    const shopifyConfig = readShopifyConfig(getEnv)
    const discountResult = await createAbandonmentDiscount({ email: emailNorm, shopifyConfig })
    if (!discountResult.ok) {
      return { status: discountResult.status, body: { error: discountResult.error } }
    }
    discountCode = discountResult.code
  }

  const unsubToken = existing?.unsubscribe_token || generateUnsubscribeToken()
  const unsubscribeUrl = buildUnsubscribeUrl(siteBaseUrl, unsubToken)

  // Serialize cart snapshot
  const cartSnapshot = cartItems.slice(0, 10).map(item => ({
    name: String(item.name || item.title || '').slice(0, 100),
    image: String(item.image || '').slice(0, 500),
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 1,
    size: String(item.selectedSize || item.size || '').slice(0, 50),
    color: String(item.selectedColor || item.color || '').slice(0, 50),
    handle: String(item.handle || item.productHandle || '').slice(0, 100),
  }))
  const cartTotal = Number(payload?.cartTotal) || cartSnapshot.reduce((s, i) => s + i.price * i.quantity, 0)

  // Upsert the claim (insert new or refresh cart snapshot)
  const upsertResult = await upsertAbandonment(admin, {
    email_normalized: emailNorm,
    first_name: firstName,
    discount_code: discountCode,
    cart_snapshot: cartSnapshot,
    cart_total: cartTotal,
    checkout_url: String(payload?.checkoutUrl || '').slice(0, 1000) || null,
    unsubscribe_token: unsubToken,
  })

  if (upsertResult.error) {
    return { status: 500, body: { error: upsertResult.error } }
  }

  // Send Step 1 (reminder) immediately
  const step = CART_ABANDONMENT_STEPS[0]
  const html = step.build({
    firstName,
    discountCode,
    cartSnapshot,
    unsubscribeUrl,
    siteBaseUrl,
  })

  const emailResult = await sendAbandonmentEmail({
    to: emailNorm,
    subject: step.subject(firstName),
    html,
    resendApiKey,
    fromEmail,
    unsubscribeUrl,
  })

  if (emailResult.ok) {
    // Find the row to get its ID for marking the step
    const row = await findAbandonmentByEmail(admin, emailNorm)
    if (row?.id) {
      await markAbandonmentStepSent(admin, row.id, 'reminder_sent_at')
    }
  }

  // Fire Meta CAPI event (non-blocking)
  const leadEventId = crypto.randomUUID()
  sendCapiEvent({
    eventName: 'Lead',
    eventId: leadEventId,
    eventSourceUrl: clientContext.eventSourceUrl,
    email: emailNorm,
    firstName,
    clientIp: clientContext.clientIp,
    clientUserAgent: clientContext.clientUserAgent,
    fbp: clientContext.fbp,
    fbc: clientContext.fbc,
    customData: { content_name: 'cart_abandonment_popup', currency: 'USD', value: 0 },
    getEnv,
  }).catch(() => {})

  return {
    status: 200,
    body: { ok: true, duplicate: false, leadEventId },
  }
}
