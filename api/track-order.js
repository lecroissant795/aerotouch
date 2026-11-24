/**
 * Track order via Shopify Admin GraphQL. Logic lives in server/track-order.shared.js.
 *
 * Auth (pick one):
 * - SHOPIFY_ADMIN_ACCESS_TOKEN — legacy static Admin API token
 * - SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET — Dev Dashboard app (client_credentials grant)
 * Always: SHOPIFY_STORE_DOMAIN
 */

import { handleTrackOrderRequest } from '../server/track-order.shared.js'

const getProcessEnv = (name) => process.env[name]?.trim() || ''

export default async function handler(req, res) {
  // Same-origin only: the site calls this from its own domain, so no CORS headers are needed.
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body.' })
    }
  }

  const result = await handleTrackOrderRequest(body, getProcessEnv)
  return res.status(result.status).json(result.body)
}
