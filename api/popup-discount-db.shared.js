import { createClient } from '@supabase/supabase-js'

const CLAIM_FIELDS_BASE =
  'id, email_normalized, first_name, discount_code, status, created_at'
const CLAIM_FIELDS_FULL = `${CLAIM_FIELDS_BASE}, reminder_sent_at, story_sent_at, expiry_warning_sent_at, redeemed_at, unsubscribed_at, unsubscribe_token`

const VALID_STEP_COLUMNS = new Set([
  'reminder_sent_at',
  'story_sent_at',
  'expiry_warning_sent_at',
])

export function getSupabaseAdmin(supabaseUrl, serviceRoleKey) {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function findClaimByEmail(admin, emailNormalized) {
  const { data, error } = await admin
    .from('popup_discount_claims')
    .select(`${CLAIM_FIELDS_BASE}, unsubscribe_token`)
    .eq('email_normalized', emailNormalized)
    .maybeSingle()

  if (error) {
    console.error('popup_discount_claims select error:', error)
    return null
  }
  return data || null
}

/**
 * Insert a new claim. Returns { ok: true } or { conflict: true } on unique violation.
 */
export async function insertClaim(admin, row) {
  const payload = {
    email_normalized: row.email_normalized,
    first_name: row.first_name,
    discount_code: row.discount_code,
    status: row.status || 'sent',
  }
  if (row.unsubscribe_token) {
    payload.unsubscribe_token = row.unsubscribe_token
  }

  const { error } = await admin.from('popup_discount_claims').insert(payload)

  if (error?.code === '23505') {
    return { conflict: true }
  }
  if (error) {
    console.error('popup_discount_claims insert error:', error)
    return { error: error.message || 'Could not save signup.' }
  }
  return { ok: true }
}

export async function updateClaimResent(admin, id) {
  const { error } = await admin
    .from('popup_discount_claims')
    .update({
      status: 'resent',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('popup_discount_claims resent update error:', error)
  }
}

/**
 * Find claims eligible for a welcome-series step.
 * Filters: signed up within [windowStart, windowEnd), step column still null,
 * not unsubscribed, not flagged as redeemed.
 *
 * @param {*} admin
 * @param {{ column: string }} step
 * @param {string} windowStartIso
 * @param {string} windowEndIso
 */
export async function findClaimsForStep(admin, step, windowStartIso, windowEndIso) {
  if (!VALID_STEP_COLUMNS.has(step?.column)) {
    throw new Error(`Invalid step column: ${step?.column}`)
  }

  const { data, error } = await admin
    .from('popup_discount_claims')
    .select(CLAIM_FIELDS_FULL)
    .gte('created_at', windowStartIso)
    .lt('created_at', windowEndIso)
    .is(step.column, null)
    .is('unsubscribed_at', null)
    .is('redeemed_at', null)
    .order('created_at', { ascending: true })
    .limit(500)

  if (error) {
    console.error('popup_discount_claims findClaimsForStep error:', error)
    return []
  }
  return data || []
}

export async function markStepSent(admin, id, stepColumn) {
  if (!VALID_STEP_COLUMNS.has(stepColumn)) {
    throw new Error(`Invalid step column: ${stepColumn}`)
  }
  const nowIso = new Date().toISOString()
  const { error } = await admin
    .from('popup_discount_claims')
    .update({
      [stepColumn]: nowIso,
      updated_at: nowIso,
    })
    .eq('id', id)

  if (error) {
    console.error(`popup_discount_claims markStepSent (${stepColumn}) error:`, error)
    return { error: error.message }
  }
  return { ok: true }
}

export async function markRedeemed(admin, id) {
  const nowIso = new Date().toISOString()
  const { error } = await admin
    .from('popup_discount_claims')
    .update({
      redeemed_at: nowIso,
      updated_at: nowIso,
    })
    .eq('id', id)

  if (error) {
    console.error('popup_discount_claims markRedeemed error:', error)
  }
}

export async function findClaimByUnsubToken(admin, token) {
  const trimmed = String(token || '').trim()
  if (!trimmed) return null

  const { data, error } = await admin
    .from('popup_discount_claims')
    .select(`${CLAIM_FIELDS_BASE}, unsubscribed_at, unsubscribe_token`)
    .eq('unsubscribe_token', trimmed)
    .maybeSingle()

  if (error) {
    console.error('popup_discount_claims findClaimByUnsubToken error:', error)
    return null
  }
  return data || null
}

export async function markUnsubscribed(admin, id) {
  const nowIso = new Date().toISOString()
  const { error } = await admin
    .from('popup_discount_claims')
    .update({
      unsubscribed_at: nowIso,
      updated_at: nowIso,
    })
    .eq('id', id)

  if (error) {
    console.error('popup_discount_claims markUnsubscribed error:', error)
    return { error: error.message }
  }
  return { ok: true }
}

/**
 * Backfill an unsubscribe token onto an existing claim that doesn't have one.
 * Used when resending a Day-0 email to a duplicate signup whose row predates the
 * welcome-series migration. Returns the token (whether new or already set).
 */
export async function ensureUnsubscribeToken(admin, claim, generateToken) {
  if (claim?.unsubscribe_token) return claim.unsubscribe_token
  if (!claim?.id) return ''

  const newToken = generateToken()
  const { error } = await admin
    .from('popup_discount_claims')
    .update({
      unsubscribe_token: newToken,
      updated_at: new Date().toISOString(),
    })
    .eq('id', claim.id)
    .is('unsubscribe_token', null)

  if (error) {
    console.error('popup_discount_claims ensureUnsubscribeToken error:', error)
    return ''
  }
  return newToken
}
