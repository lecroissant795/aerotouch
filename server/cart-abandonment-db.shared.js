import { createClient } from '@supabase/supabase-js'

const TABLE = 'cart_abandonment_claims'

const FIELDS_BASE = 'id, email_normalized, first_name, discount_code, cart_snapshot, cart_total, checkout_url, created_at'
const FIELDS_FULL = `${FIELDS_BASE}, reminder_sent_at, social_proof_sent_at, final_nudge_sent_at, redeemed_at, unsubscribed_at, unsubscribe_token`

const VALID_STEP_COLUMNS = new Set([
  'reminder_sent_at',
  'social_proof_sent_at',
  'final_nudge_sent_at',
])

export function getSupabaseAdmin(supabaseUrl, serviceRoleKey) {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function findAbandonmentByEmail(admin, emailNormalized) {
  const { data, error } = await admin
    .from(TABLE)
    .select(`${FIELDS_BASE}, reminder_sent_at, unsubscribe_token`)
    .eq('email_normalized', emailNormalized)
    .maybeSingle()

  if (error) {
    console.error('cart_abandonment_claims select error:', error)
    return null
  }
  return data || null
}

export async function upsertAbandonment(admin, row) {
  const payload = {
    email_normalized: row.email_normalized,
    first_name: row.first_name,
    discount_code: row.discount_code,
    cart_snapshot: row.cart_snapshot,
    cart_total: row.cart_total,
    checkout_url: row.checkout_url || null,
    updated_at: new Date().toISOString(),
  }
  if (row.unsubscribe_token) {
    payload.unsubscribe_token = row.unsubscribe_token
  }

  const { error } = await admin
    .from(TABLE)
    .upsert(payload, { onConflict: 'email_normalized' })

  if (error) {
    console.error('cart_abandonment_claims upsert error:', error)
    return { error: error.message || 'Could not save cart abandonment.' }
  }
  return { ok: true }
}

export async function findAbandonmentsForStep(admin, step, windowStartIso, windowEndIso) {
  if (!VALID_STEP_COLUMNS.has(step?.column)) {
    throw new Error(`Invalid step column: ${step?.column}`)
  }

  const query = admin
    .from(TABLE)
    .select(FIELDS_FULL)
    .gte('created_at', windowStartIso)
    .lt('created_at', windowEndIso)
    .is(step.column, null)
    .is('unsubscribed_at', null)
    .is('redeemed_at', null)
    .order('created_at', { ascending: true })
    .limit(500)

  if (step.column !== 'reminder_sent_at') {
    const prevColumn = step.column === 'social_proof_sent_at'
      ? 'reminder_sent_at'
      : 'social_proof_sent_at'
    query.not(prevColumn, 'is', null)
  }

  const { data, error } = await query

  if (error) {
    console.error('cart_abandonment_claims findAbandonmentsForStep error:', error)
    return []
  }
  return data || []
}

export async function markAbandonmentStepSent(admin, id, stepColumn) {
  if (!VALID_STEP_COLUMNS.has(stepColumn)) {
    throw new Error(`Invalid step column: ${stepColumn}`)
  }
  const nowIso = new Date().toISOString()
  const { error } = await admin
    .from(TABLE)
    .update({ [stepColumn]: nowIso, updated_at: nowIso })
    .eq('id', id)

  if (error) {
    console.error(`cart_abandonment_claims markStepSent (${stepColumn}) error:`, error)
    return { error: error.message }
  }
  return { ok: true }
}

export async function findAbandonmentByUnsubToken(admin, token) {
  const trimmed = String(token || '').trim()
  if (!trimmed) return null

  const { data, error } = await admin
    .from(TABLE)
    .select(`${FIELDS_BASE}, unsubscribed_at, unsubscribe_token`)
    .eq('unsubscribe_token', trimmed)
    .maybeSingle()

  if (error) {
    console.error('cart_abandonment_claims findByUnsubToken error:', error)
    return null
  }
  return data || null
}

export async function markAbandonmentUnsubscribed(admin, id) {
  const nowIso = new Date().toISOString()
  const { error } = await admin
    .from(TABLE)
    .update({ unsubscribed_at: nowIso, updated_at: nowIso })
    .eq('id', id)

  if (error) {
    console.error('cart_abandonment_claims markUnsubscribed error:', error)
    return { error: error.message }
  }
  return { ok: true }
}

export async function markAbandonmentRedeemed(admin, id) {
  const nowIso = new Date().toISOString()
  const { error } = await admin
    .from(TABLE)
    .update({ redeemed_at: nowIso, updated_at: nowIso })
    .eq('id', id)

  if (error) {
    console.error('cart_abandonment_claims markRedeemed error:', error)
  }
}
