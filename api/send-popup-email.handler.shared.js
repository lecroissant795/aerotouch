import { sendPopupEmail } from './send-popup-email.shared.js'
import { createWelcomeDiscount } from './create-discount-code.shared.js'
import { readShopifyConfig } from './shopify-admin.shared.js'
import {
  findClaimByEmail,
  getSupabaseAdmin,
  insertClaim,
  updateClaimResent,
} from './popup-discount-db.shared.js'
import {
  normalizeEmail,
  isValidEmailFormat,
  sanitizeFirstName,
} from './popup-discount-validation.shared.js'

export const POPUP_DUPLICATE_MESSAGE =
  'This email has already received a discount code. Please check your inbox.'

function getResendConfig(getEnv) {
  const resendApiKey =
    getEnv('RESEND_API_KEY') ||
    getEnv('VITE_RESEND_API_KEY')
  const fromEmail =
    getEnv('RESEND_FROM_EMAIL') ||
    getEnv('VITE_RESEND_FROM_EMAIL') ||
    'AeroTouch <onboarding@resend.dev>'
  return { resendApiKey, fromEmail }
}

/**
 * Server-side popup discount flow: dedupe by email (case-insensitive), optional Resend resend for duplicates.
 * Never returns discount codes in the response body.
 *
 * @param {{ firstName?: string, email?: string }} payload
 * @param {(name: string) => string} getEnv
 * @returns {Promise<{ status: number, body: Record<string, unknown> }>}
 */
export async function handlePopupDiscountRequest(payload, getEnv) {
  const firstName = sanitizeFirstName(payload?.firstName)
  const emailNorm = normalizeEmail(payload?.email)

  if (!firstName || !emailNorm) {
    return { status: 400, body: { error: 'First name and email are required.' } }
  }
  if (!isValidEmailFormat(emailNorm)) {
    return { status: 400, body: { error: 'Invalid email address.' } }
  }

  const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL')
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) {
    console.error('popup discount: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return {
      status: 503,
      body: { error: 'Discount signup is temporarily unavailable.' },
    }
  }

  const admin = getSupabaseAdmin(supabaseUrl, serviceKey)
  const { resendApiKey, fromEmail } = getResendConfig(getEnv)

  if (!resendApiKey) {
    return { status: 500, body: { error: 'Email service is not configured yet.' } }
  }

  const existing = await findClaimByEmail(admin, emailNorm)
  if (existing) {
    const sendFirst = existing.first_name?.trim() || firstName
    const emailResult = await sendPopupEmail({
      firstName: sendFirst,
      email: emailNorm,
      discountCode: existing.discount_code,
      resendApiKey,
      fromEmail,
    })
    if (!emailResult.ok) {
      return { status: emailResult.status, body: { error: emailResult.error } }
    }
    await updateClaimResent(admin, existing.id)
    return {
      status: 200,
      body: {
        ok: true,
        duplicate: true,
        message: POPUP_DUPLICATE_MESSAGE,
        emailResent: true,
      },
    }
  }

  const shopifyConfig = readShopifyConfig(getEnv)
  const discountResult = await createWelcomeDiscount({ firstName, shopifyConfig })
  if (!discountResult.ok) {
    return { status: discountResult.status, body: { error: discountResult.error } }
  }

  const insertOutcome = await insertClaim(admin, {
    email_normalized: emailNorm,
    first_name: firstName,
    discount_code: discountResult.code,
    status: 'sent',
  })

  if (insertOutcome.conflict) {
    const winner = await findClaimByEmail(admin, emailNorm)
    if (!winner) {
      return {
        status: 500,
        body: { error: 'Could not complete signup. Please try again.' },
      }
    }
    const emailResult = await sendPopupEmail({
      firstName: winner.first_name?.trim() || firstName,
      email: emailNorm,
      discountCode: winner.discount_code,
      resendApiKey,
      fromEmail,
    })
    if (!emailResult.ok) {
      return { status: emailResult.status, body: { error: emailResult.error } }
    }
    await updateClaimResent(admin, winner.id)
    return {
      status: 200,
      body: {
        ok: true,
        duplicate: true,
        message: POPUP_DUPLICATE_MESSAGE,
        emailResent: true,
      },
    }
  }

  if (insertOutcome.error) {
    return { status: 500, body: { error: insertOutcome.error } }
  }

  const emailResult = await sendPopupEmail({
    firstName,
    email: emailNorm,
    discountCode: discountResult.code,
    resendApiKey,
    fromEmail,
  })
  if (!emailResult.ok) {
    return { status: emailResult.status, body: { error: emailResult.error } }
  }

  return {
    status: 200,
    body: {
      ok: true,
      duplicate: false,
    },
  }
}
