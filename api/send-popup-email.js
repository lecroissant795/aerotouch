import { sendPopupEmail } from './send-popup-email.shared.js'
import fs from 'fs'
import path from 'path'

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
      const value = trimmed.slice(idx + 1).trim()
      if (key === name && value) return value
    }
    return ''
  } catch {
    return ''
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const resendApiKey =
    getEnvValue('RESEND_API_KEY') ||
    getEnvValue('VITE_RESEND_API_KEY') ||
    readDotEnvValue('RESEND_API_KEY') ||
    readDotEnvValue('VITE_RESEND_API_KEY')
  const fromEmail =
    getEnvValue('RESEND_FROM_EMAIL') ||
    getEnvValue('VITE_RESEND_FROM_EMAIL') ||
    readDotEnvValue('RESEND_FROM_EMAIL') ||
    readDotEnvValue('VITE_RESEND_FROM_EMAIL') ||
    'AeroTouch <onboarding@resend.dev>'

  const result = await sendPopupEmail({
    firstName: req.body?.firstName,
    email: req.body?.email,
    discountCode: req.body?.discountCode,
    resendApiKey,
    fromEmail,
  })

  if (!result.ok) {
    return res.status(result.status).json({ error: result.error })
  }
  return res.status(200).json({ ok: true, id: result.id })
}
