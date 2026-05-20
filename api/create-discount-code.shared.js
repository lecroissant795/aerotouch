import crypto from 'crypto'
import { adminGraphQL, getShopifyAdminAccessToken } from './shopify-admin.shared.js'

const MUTATION = `
  mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode { id }
      userErrors { field message }
    }
  }
`

export function generateCode(firstName, date = new Date()) {
  const name = String(firstName || '').trim()
  if (!name) {
    return `WELCOME-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
  }

  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const suffix = String(crypto.randomInt(0, 100)).padStart(2, '0')

  return `${name}-${dd}${mm}-${suffix}`
}

export async function createWelcomeDiscount({ firstName, shopifyConfig }) {
  const { shopDomain } = shopifyConfig
  if (!shopDomain) {
    return { ok: false, status: 500, error: 'Shopify is not configured.' }
  }

  let accessToken
  try {
    accessToken = await getShopifyAdminAccessToken(shopifyConfig)
  } catch {
    return { ok: false, status: 500, error: 'Could not authenticate with Shopify.' }
  }
  if (!accessToken) {
    return { ok: false, status: 500, error: 'Shopify is not configured.' }
  }

  const code = generateCode(firstName)
  const startsAt = new Date().toISOString()
  const endsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  const variables = {
    basicCodeDiscount: {
      title: `Welcome popup — ${firstName}`,
      code,
      startsAt,
      endsAt,
      customerSelection: { all: true },
      customerGets: {
        value: { percentage: 0.20 },
        items: { all: true },
      },
      appliesOncePerCustomer: true,
      usageLimit: 1,
    },
  }

  let data
  try {
    data = await adminGraphQL({
      shopDomain,
      accessToken,
      query: MUTATION,
      variables,
    })
  } catch (error) {
    console.error('discountCodeBasicCreate fetch error:', error)
    return { ok: false, status: 502, error: 'Could not connect to Shopify.' }
  }

  if (data.errors) {
    console.error('discountCodeBasicCreate GraphQL errors:', data.errors)
    return { ok: false, status: 502, error: 'Shopify returned an error.' }
  }

  const userErrors = data?.data?.discountCodeBasicCreate?.userErrors || []
  if (userErrors.length > 0) {
    console.error('discountCodeBasicCreate userErrors:', userErrors)
    return { ok: false, status: 502, error: userErrors[0].message || 'Could not create discount code.' }
  }

  return { ok: true, status: 200, code }
}
