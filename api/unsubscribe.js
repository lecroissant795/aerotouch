/**
 * One-click unsubscribe for the welcome-series and any future promotional email.
 *
 *   GET  /api/unsubscribe?token=<token>   -> sets unsubscribed_at = now(), returns HTML
 *   POST /api/unsubscribe                  -> same, supports List-Unsubscribe-Post one-click
 *
 * Tokens are generated on signup (see send-popup-email.handler.shared.js) and stored
 * unique in popup_discount_claims.unsubscribe_token.
 */

import fs from 'fs'
import path from 'path'
import {
  getSupabaseAdmin,
  findClaimByUnsubToken,
  markUnsubscribed,
} from './popup-discount-db.shared.js'
import {
  findAbandonmentByUnsubToken,
  markAbandonmentUnsubscribed,
} from './cart-abandonment-db.shared.js'

function getEnvValue(name) {
  const value = process.env[name]
  return typeof value === 'string' ? value.trim() : ''
}

function readDotEnvValue(name) {
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    const content = fs.readFileSync(envPath, 'utf8')
    const lines = content.split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const idx = trimmed.indexOf('=')
      if (idx <= 0) continue
      const key = trimmed.slice(0, idx).trim()
      const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')
      if (key === name && value) return value
    }
    return ''
  } catch {
    return ''
  }
}

function renderHtml({ heading, body }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${heading}</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; background:#f8fafc; color:#0f172a; margin:0; padding:0; }
      .card { max-width: 520px; margin: 80px auto; background:#fff; border:1px solid #e2e8f0; border-radius: 14px; padding: 32px; box-shadow: 0 1px 3px rgba(15,23,42,0.04); }
      h1 { margin: 0 0 12px 0; font-size: 22px; }
      p { margin: 0 0 12px 0; line-height: 1.6; color: #334155; }
      a.button { display:inline-block; margin-top: 12px; padding: 10px 18px; background:#ea580c; color:#fff; text-decoration:none; border-radius: 8px; font-weight: 600; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${heading}</h1>
      ${body}
      <p><a class="button" href="https://aerotouch.com/">Back to AeroTouch</a></p>
    </div>
  </body>
</html>`
}

function getToken(req) {
  if (req.method === 'POST') {
    if (req.body && typeof req.body === 'object' && req.body.token) {
      return String(req.body.token)
    }
  }
  const url = req.url || ''
  const queryStart = url.indexOf('?')
  if (queryStart >= 0) {
    const params = new URLSearchParams(url.slice(queryStart + 1))
    return params.get('token') || ''
  }
  return ''
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const token = getToken(req)
  if (!token) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.status(400).send(
      renderHtml({
        heading: 'Invalid unsubscribe link',
        body: '<p>This unsubscribe link is missing a token. If you keep getting promotional emails, reply to one of them and we&rsquo;ll remove you manually.</p>',
      })
    )
  }

  const getEnv = (name) => getEnvValue(name) || readDotEnvValue(name)
  const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL')
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) {
    console.error('unsubscribe: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    return res.status(500).send(
      renderHtml({
        heading: 'Something went wrong',
        body: '<p>We could not process your request right now. Please try again in a few minutes.</p>',
      })
    )
  }

  const admin = getSupabaseAdmin(supabaseUrl, serviceKey)
  const claim = await findClaimByUnsubToken(admin, token)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (!claim) {
    // Check cart abandonment claims too
    const abandonClaim = await findAbandonmentByUnsubToken(admin, token)
    if (abandonClaim) {
      if (!abandonClaim.unsubscribed_at) {
        await markAbandonmentUnsubscribed(admin, abandonClaim.id)
      }
      return res.status(200).send(
        renderHtml({
          heading: "You're unsubscribed",
          body: '<p>You won&rsquo;t receive any more cart recovery emails from AeroTouch. Order confirmations and shipping updates from Shopify are sent separately and are not affected.</p>',
        })
      )
    }

    return res.status(200).send(
      renderHtml({
        heading: "You're unsubscribed",
        body: '<p>You won&rsquo;t receive any more promotional emails from AeroTouch.</p>',
      })
    )
  }

  if (!claim.unsubscribed_at) {
    await markUnsubscribed(admin, claim.id)
  }

  return res.status(200).send(
    renderHtml({
      heading: "You're unsubscribed",
      body: '<p>You won&rsquo;t receive any more promotional emails from AeroTouch. Order confirmations and shipping updates from Shopify are sent separately and are not affected.</p>',
    })
  )
}
