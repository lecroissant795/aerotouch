/**
 * Vercel Cron entrypoint for the welcome-series drip.
 *
 * Schedule: see vercel.json (`crons` entry, daily at 15:00 UTC).
 *
 * Auth: Vercel attaches `Authorization: Bearer ${CRON_SECRET}` automatically when
 * `CRON_SECRET` is set in project env. We require that header on every request so
 * the endpoint can't be hit anonymously by anyone with the URL.
 *
 * Manual trigger (for testing):
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://aerotouch.com/api/cron/welcome-series
 */

import fs from 'fs'
import path from 'path'
import {
  getSupabaseAdmin,
} from '../popup-discount-db.shared.js'
import { runWelcomeSeries } from '../welcome-series.shared.js'

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

function siteBaseUrlFromRequest(req) {
  const headerHost = req?.headers?.['x-forwarded-host'] || req?.headers?.host
  if (!headerHost) return ''
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim()
  return `${proto}://${headerHost}`
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const getEnv = (name) => getEnvValue(name) || readDotEnvValue(name)

  const cronSecret = getEnv('CRON_SECRET')
  if (cronSecret) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || ''
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized.' })
    }
  } else if (process.env.NODE_ENV === 'production') {
    console.error('welcome-series cron: CRON_SECRET not set in production')
    return res.status(500).json({ error: 'Cron is not configured.' })
  }

  const supabaseUrl = getEnv('SUPABASE_URL') || getEnv('VITE_SUPABASE_URL')
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) {
    console.error('welcome-series cron: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    return res.status(500).json({ error: 'Database is not configured.' })
  }

  const admin = getSupabaseAdmin(supabaseUrl, serviceKey)
  const siteBaseUrl =
    getEnv('SITE_BASE_URL') ||
    getEnv('VITE_SITE_BASE_URL') ||
    siteBaseUrlFromRequest(req)

  try {
    const result = await runWelcomeSeries({ admin, getEnv, siteBaseUrl })
    if (!result.ok) {
      return res.status(result.status || 500).json({ error: result.error })
    }
    return res.status(200).json({
      ok: true,
      ranAt: result.ranAt,
      steps: result.steps,
    })
  } catch (error) {
    console.error('welcome-series cron unhandled error:', error)
    return res.status(500).json({ error: 'Welcome-series run failed.' })
  }
}
