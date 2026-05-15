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

function generateCode() {
  return `COMEBACK-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

export async function createAbandonmentDiscount({ email, shopifyConfig }) {
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

  const code = generateCode()
  const startsAt = new Date().toISOString()
  const endsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const variables = {
    basicCodeDiscount: {
      title: `Cart abandonment — ${email}`,
      code,
      startsAt,
      endsAt,
      customerSelection: { all: true },
      customerGets: {
        value: { percentage: 0.15 },
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
    console.error('cart abandonment discountCodeBasicCreate fetch error:', error)
    return { ok: false, status: 502, error: 'Could not connect to Shopify.' }
  }

  if (data.errors) {
    console.error('cart abandonment discountCodeBasicCreate GraphQL errors:', data.errors)
    return { ok: false, status: 502, error: 'Shopify returned an error.' }
  }

  const userErrors = data?.data?.discountCodeBasicCreate?.userErrors || []
  if (userErrors.length > 0) {
    console.error('cart abandonment discountCodeBasicCreate userErrors:', userErrors)
    return { ok: false, status: 502, error: userErrors[0].message || 'Could not create discount code.' }
  }

  return { ok: true, status: 200, code }
}
