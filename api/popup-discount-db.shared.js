import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin(supabaseUrl, serviceRoleKey) {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function findClaimByEmail(admin, emailNormalized) {
  const { data, error } = await admin
    .from('popup_discount_claims')
    .select('id, email_normalized, first_name, discount_code, status, created_at')
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
  const { error } = await admin.from('popup_discount_claims').insert({
    email_normalized: row.email_normalized,
    first_name: row.first_name,
    discount_code: row.discount_code,
    status: row.status || 'sent',
  })

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
