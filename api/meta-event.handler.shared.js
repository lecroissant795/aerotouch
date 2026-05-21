import { sendCapiEvent } from './meta-capi.shared.js'

const ALLOWED_EVENTS = new Set(['ViewContent', 'AddToCart', 'InitiateCheckout', 'PageView'])

/**
 * Server-side mirror for browser pixel events. The caller passes the same eventId
 * used in the browser fbq() call so Meta can deduplicate the pair.
 *
 * @param {{ eventName: string, eventId?: string, customData?: Record<string, unknown> }} payload
 * @param {(name: string) => string} getEnv
 * @param {{ clientIp?: string, clientUserAgent?: string, fbp?: string, fbc?: string, eventSourceUrl?: string }} clientContext
 */
export async function handleMetaEventRequest(payload, getEnv, clientContext = {}) {
  const { eventName, eventId, customData } = payload || {}

  if (!eventName || !ALLOWED_EVENTS.has(eventName)) {
    return { status: 400, body: { error: 'Invalid or missing eventName.' } }
  }

  const result = await sendCapiEvent({
    eventName,
    eventId,
    eventSourceUrl: clientContext.eventSourceUrl,
    clientIp: clientContext.clientIp,
    clientUserAgent: clientContext.clientUserAgent,
    fbp: clientContext.fbp,
    fbc: clientContext.fbc,
    customData,
    getEnv,
  })

  return { status: 200, body: { ok: result.ok } }
}
