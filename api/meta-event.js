import { handleMetaEventRequest } from './meta-event.handler.shared.js'
import { extractClientContext } from './meta-capi.shared.js'
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
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
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

  const getEnv = (name) => getEnvValue(name) || readDotEnvValue(name)
  const payload = req.body && typeof req.body === 'object' ? req.body : {}
  const clientContext = extractClientContext(req)
  const result = await handleMetaEventRequest(payload, getEnv, clientContext)
  return res.status(result.status).json(result.body)
}
