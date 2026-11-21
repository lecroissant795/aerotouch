import { adminGraphQL, getShopifyAdminAccessToken } from './shopify-admin.shared.js'

const QUERY = `
  query DiscountUsage($code: String!) {
    codeDiscountNodeByCode(code: $code) {
      codeDiscount {
        __typename
        ... on DiscountCodeBasic {
          asyncUsageCount
          status
          endsAt
        }
      }
    }
  }
`

/**
 * Look up redemption status for a single discount code.
 *
 * @param {string} code
 * @param {{ shopDomain: string, staticToken?: string, clientId?: string, clientSecret?: string }} shopifyConfig
 * @returns {Promise<{ ok: boolean, used?: boolean, expired?: boolean, status?: string, endsAt?: string|null, error?: string }>}
 */
export async function getDiscountUsage(code, shopifyConfig) {
  const trimmed = String(code || '').trim()
  if (!trimmed) {
    return { ok: false, error: 'Missing code.' }
  }
  if (!shopifyConfig?.shopDomain) {
    return { ok: false, error: 'Shopify is not configured.' }
  }

  let accessToken
  try {
    accessToken = await getShopifyAdminAccessToken(shopifyConfig)
  } catch {
    return { ok: false, error: 'Could not authenticate with Shopify.' }
  }
  if (!accessToken) {
    return { ok: false, error: 'Shopify is not configured.' }
  }

  let data
  try {
    data = await adminGraphQL({
      shopDomain: shopifyConfig.shopDomain,
      accessToken,
      query: QUERY,
      variables: { code: trimmed },
    })
  } catch (error) {
    console.error('getDiscountUsage fetch error:', error)
    return { ok: false, error: 'Could not connect to Shopify.' }
  }

  if (data?.errors) {
    console.error('getDiscountUsage GraphQL errors:', data.errors)
    return { ok: false, error: 'Shopify returned an error.' }
  }

  const node = data?.data?.codeDiscountNodeByCode
  if (!node) {
    // Code no longer exists in Shopify (manually deleted, expired and purged, etc.).
    // Treat as "used" so the cron stops trying to send for it.
    return { ok: true, used: true, expired: true, status: 'MISSING', endsAt: null }
  }

  const discount = node.codeDiscount
  if (!discount || discount.__typename !== 'DiscountCodeBasic') {
    return { ok: true, used: false, expired: false, status: discount?.status || null, endsAt: null }
  }

  const usage = Number(discount.asyncUsageCount) || 0
  const endsAt = discount.endsAt || null
  const expired = endsAt ? new Date(endsAt).getTime() < Date.now() : false

  return {
    ok: true,
    used: usage > 0,
    expired,
    status: discount.status || null,
    endsAt,
  }
}
