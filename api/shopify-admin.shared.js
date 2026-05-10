let cachedClientCredentials = { token: null, expiresAtMs: 0 }

export function normalizeShopDomain(domain) {
  if (!domain) return ''
  let d = String(domain).trim().toLowerCase()
  d = d.replace(/^https?:\/\//, '')
  d = d.split('/')[0]
  return d
}

export async function getShopifyAdminAccessToken({ shopDomain, staticToken, clientId, clientSecret }) {
  if (staticToken) return staticToken
  if (!clientId || !clientSecret) return null

  const bufferMs = 5 * 60 * 1000
  if (
    cachedClientCredentials.token &&
    Date.now() < cachedClientCredentials.expiresAtMs - bufferMs
  ) {
    return cachedClientCredentials.token
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: clientId,
    client_secret: clientSecret,
  })

  const response = await fetch(`https://${shopDomain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  const text = await response.text()
  if (!response.ok) {
    console.error('Shopify client_credentials failed:', response.status, text)
    throw new Error('Failed to obtain Shopify access token')
  }

  let json
  try {
    json = JSON.parse(text)
  } catch {
    console.error('Shopify token response not JSON:', text)
    throw new Error('Invalid Shopify token response')
  }

  const expiresIn = Number(json.expires_in) || 86399
  cachedClientCredentials = {
    token: json.access_token,
    expiresAtMs: Date.now() + expiresIn * 1000,
  }
  return cachedClientCredentials.token
}

export async function adminGraphQL({ shopDomain, accessToken, query, variables }) {
  const response = await fetch(`https://${shopDomain}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify(variables ? { query, variables } : { query }),
  })
  return response.json()
}

/** Resolve Admin API credentials from env. Supports aliases used elsewhere in this repo / Vercel. */
export function readShopifyConfig(getEnv) {
  const shopDomain = normalizeShopDomain(
    getEnv('SHOPIFY_STORE_DOMAIN') || getEnv('VITE_SHOPIFY_STORE_DOMAIN')
  )
  const staticToken =
    getEnv('SHOPIFY_ADMIN_ACCESS_TOKEN') ||
    getEnv('SHOPIFY_ACCESS_TOKEN') ||
    /* common typo seen in env files */
    getEnv('ADIMN_ACCESS_TOKEN')
  const clientId =
    getEnv('SHOPIFY_CLIENT_ID') ||
    getEnv('SHOPIFY_ADMIN_CLIENT_ID') ||
    getEnv('VITE_SHOPIFY_CLIENT_ID')
  const clientSecret =
    getEnv('SHOPIFY_CLIENT_SECRET') ||
    getEnv('SHOPIFY_ADMIN_CLIENT_SECRET') ||
    getEnv('VITE_SHOPIFY_CLIENT_SECRET') ||
    getEnv('VITE_VITE_SHOPIFY_CLIENT_SECRET')

  return {
    shopDomain,
    staticToken,
    clientId,
    clientSecret,
  }
}
