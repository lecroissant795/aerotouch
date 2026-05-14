import crypto from 'crypto'

const GRAPH_API_VERSION = 'v18.0'

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex')
}

// Meta requires PII fields to be lowercased + trimmed before hashing,
// except phone (digits-only). See: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
function hashEmail(email) {
  if (!email) return undefined
  return sha256Hex(String(email).trim().toLowerCase())
}

function hashName(name) {
  if (!name) return undefined
  return sha256Hex(String(name).trim().toLowerCase())
}

function pickFirstIp(forwarded) {
  if (!forwarded) return undefined
  const first = String(forwarded).split(',')[0]?.trim()
  return first || undefined
}

function parseCookieHeader(cookieHeader) {
  if (!cookieHeader) return {}
  const out = {}
  for (const part of String(cookieHeader).split(';')) {
    const eq = part.indexOf('=')
    if (eq <= 0) continue
    const k = part.slice(0, eq).trim()
    const v = part.slice(eq + 1).trim()
    if (k) out[k] = decodeURIComponent(v)
  }
  return out
}

/**
 * Extract Meta-relevant client identifiers from a Node-style request
 * (works for Vercel handlers and Vite dev middleware).
 */
export function extractClientContext(req) {
  const headers = req?.headers || {}
  const cookies = parseCookieHeader(headers.cookie || headers.Cookie)
  const clientIp =
    pickFirstIp(headers['x-forwarded-for']) ||
    headers['x-real-ip'] ||
    req?.socket?.remoteAddress ||
    undefined
  const proto = headers['x-forwarded-proto'] || 'https'
  const host = headers['x-forwarded-host'] || headers.host
  const url = req?.url || '/'
  const eventSourceUrl = host ? `${proto}://${host}${url}` : undefined
  return {
    clientIp,
    clientUserAgent: headers['user-agent'],
    fbp: cookies._fbp,
    fbc: cookies._fbc,
    eventSourceUrl,
  }
}

export function readCapiConfig(getEnv) {
  const pixelId = getEnv('META_PIXEL_ID')
  const accessToken = getEnv('META_CAPI_ACCESS_TOKEN')
  const testEventCode = getEnv('META_CAPI_TEST_EVENT_CODE') || ''
  return { pixelId, accessToken, testEventCode }
}

/**
 * Send a single server-side event to Meta's Conversions API.
 * Logs and swallows failures — callers must not let CAPI break business flows.
 *
 * @param {{
 *   eventName: string,
 *   eventId?: string,
 *   eventSourceUrl?: string,
 *   email?: string,
 *   firstName?: string,
 *   clientIp?: string,
 *   clientUserAgent?: string,
 *   fbp?: string,
 *   fbc?: string,
 *   customData?: Record<string, unknown>,
 *   getEnv: (name: string) => string,
 * }} args
 * @returns {Promise<{ ok: boolean, status?: number, error?: string, eventsReceived?: number }>}
 */
export async function sendCapiEvent({
  eventName,
  eventId,
  eventSourceUrl,
  email,
  firstName,
  clientIp,
  clientUserAgent,
  fbp,
  fbc,
  customData,
  getEnv,
}) {
  const { pixelId, accessToken, testEventCode } = readCapiConfig(getEnv)
  if (!pixelId || !accessToken) {
    return { ok: false, error: 'META_PIXEL_ID or META_CAPI_ACCESS_TOKEN not configured' }
  }

  const hashedEmail = hashEmail(email)
  const userData = {}
  if (hashedEmail) {
    userData.em = [hashedEmail]
    // external_id helps Meta match returning users across events. Hash of email is a stable choice
    // when we don't have a separate customer ID at lead time.
    userData.external_id = [hashedEmail]
  }
  const hashedFirstName = hashName(firstName)
  if (hashedFirstName) userData.fn = [hashedFirstName]
  if (clientIp) userData.client_ip_address = clientIp
  if (clientUserAgent) userData.client_user_agent = clientUserAgent
  if (fbp) userData.fbp = fbp
  if (fbc) userData.fbc = fbc

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    user_data: userData,
  }
  if (eventId) event.event_id = eventId
  if (eventSourceUrl) event.event_source_url = eventSourceUrl
  if (customData) event.custom_data = customData

  const body = { data: [event] }
  if (testEventCode) body.test_event_code = testEventCode

  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await resp.json().catch(() => ({}))
    if (!resp.ok) {
      const msg = json?.error?.message || `HTTP ${resp.status}`
      console.error('Meta CAPI request failed:', msg, json?.error || '')
      return { ok: false, status: resp.status, error: msg }
    }
    return { ok: true, status: resp.status, eventsReceived: json?.events_received }
  } catch (err) {
    console.error('Meta CAPI request threw:', err)
    return { ok: false, error: err instanceof Error ? err.message : String(err) }
  }
}
