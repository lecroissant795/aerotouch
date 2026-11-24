/**
 * Track-order lookup via Shopify Admin GraphQL.
 *
 * Shared by api/track-order.js (Vercel) and the Vite dev middleware.
 * Auth/env: see server/shopify-admin.shared.js (SHOPIFY_STORE_DOMAIN + Admin token or client credentials).
 *
 * NOTE: Admin `orders` only returns the last 60 days unless the app has the
 * `read_all_orders` scope. Add it in the Shopify app config for older orders.
 */

import {
  adminGraphQL,
  getShopifyAdminAccessToken,
  readShopifyConfig,
} from './shopify-admin.shared.js'

const ORDER_NUMBER_RE = /^[A-Za-z0-9-]{1,24}$/
const EMAIL_RE = /^[^\s"'\\:()<>,;]{1,64}@[^\s"'\\:()<>,;@]{1,255}$/

const ORDER_QUERY = `
  query TrackOrder($search: String!) {
    orders(first: 1, query: $search) {
      edges {
        node {
          name
          email
          createdAt
          cancelledAt
          displayFulfillmentStatus
          displayFinancialStatus
          currentTotalPriceSet {
            shopMoney { amount currencyCode }
            presentmentMoney { amount currencyCode }
          }
          currentSubtotalPriceSet {
            shopMoney { amount currencyCode }
            presentmentMoney { amount currencyCode }
          }
          totalShippingPriceSet {
            shopMoney { amount currencyCode }
            presentmentMoney { amount currencyCode }
          }
          currentTotalTaxSet {
            shopMoney { amount currencyCode }
            presentmentMoney { amount currencyCode }
          }
          currentTotalDiscountsSet {
            shopMoney { amount currencyCode }
            presentmentMoney { amount currencyCode }
          }
          lineItems(first: 20) {
            edges {
              node {
                title
                variantTitle
                quantity
                originalUnitPriceSet {
                  shopMoney { amount currencyCode }
                  presentmentMoney { amount currencyCode }
                }
                image { url altText }
              }
            }
          }
          shippingAddress {
            name
            address1
            address2
            city
            province
            zip
            country
          }
          fulfillments(first: 5) {
            status
            displayStatus
            estimatedDeliveryAt
            deliveredAt
            trackingInfo(first: 1) { number url company }
          }
        }
      }
    }
  }
`

function formatDate(value) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

/** Derive a customer-facing status from the order + its fulfillments. */
export function deriveStatus(order) {
  if (order.cancelledAt) return 'Cancelled'
  if (order.displayFinancialStatus === 'REFUNDED') return 'Refunded'

  const fulfillments = Array.isArray(order.fulfillments) ? order.fulfillments : []
  const display = fulfillments.map((f) => f.displayStatus)

  const allDelivered = fulfillments.length > 0 && display.every((s) => s === 'DELIVERED')
  if (allDelivered) return 'Delivered'
  if (display.includes('OUT_FOR_DELIVERY')) return 'Out for Delivery'
  // FULFILLED / PARTIALLY_FULFILLED only means a label exists or goods left the warehouse.
  if (
    fulfillments.length > 0 ||
    order.displayFulfillmentStatus === 'FULFILLED' ||
    order.displayFulfillmentStatus === 'PARTIALLY_FULFILLED'
  ) {
    return 'Shipped'
  }
  return 'Processing'
}

function deriveEstimate(status, order) {
  if (status === 'Delivered') return 'Delivered'
  if (status === 'Cancelled' || status === 'Refunded') return status
  const estimates = (order.fulfillments || [])
    .map((f) => f.estimatedDeliveryAt)
    .filter(Boolean)
    .sort()
  if (estimates.length) return formatDate(estimates[estimates.length - 1]) || 'See carrier tracking'
  return status === 'Processing' ? 'Provided once your order ships' : 'See carrier tracking'
}

/**
 * @param {unknown} body parsed JSON body
 * @param {(name: string) => string | undefined} getEnv
 * @returns {Promise<{ status: number, body: object }>}
 */
export async function handleTrackOrderRequest(body, getEnv) {
  const input = body && typeof body === 'object' ? body : {}
  const orderNumber = String(input.orderNumber ?? '').replace(/#/g, '').trim()
  const email = String(input.email ?? '').trim().toLowerCase()

  if (!orderNumber || !email) {
    return { status: 400, body: { error: 'Order number and email are required.' } }
  }
  if (!ORDER_NUMBER_RE.test(orderNumber) || !EMAIL_RE.test(email)) {
    return { status: 400, body: { error: 'Please enter a valid order number and email address.' } }
  }

  const config = readShopifyConfig((name) => getEnv(name)?.trim?.() || '')
  if (!config.shopDomain) {
    console.error('Missing SHOPIFY_STORE_DOMAIN')
    return { status: 500, body: { error: 'Server configuration error.' } }
  }

  let accessToken
  try {
    accessToken = await getShopifyAdminAccessToken(config)
  } catch {
    return { status: 500, body: { error: 'Server configuration error.' } }
  }
  if (!accessToken) {
    console.error('Missing Shopify auth: set SHOPIFY_ADMIN_ACCESS_TOKEN or SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET')
    return { status: 500, body: { error: 'Server configuration error.' } }
  }

  try {
    // Both values are validated above to contain no quotes/whitespace, and are quoted here.
    const search = `name:"#${orderNumber}" email:"${email}"`
    const data = await adminGraphQL({
      shopDomain: config.shopDomain,
      accessToken,
      query: ORDER_QUERY,
      variables: { search },
    })

    // Optional fields (e.g. images) can be access-denied without invalidating the order data.
    // Only fail hard when the order itself didn't come back or an error isn't an ACCESS_DENIED.
    if (data.errors) {
      console.error('Shopify API Errors:', JSON.stringify(data.errors))
      const onlyAccessDenied = data.errors.every((e) => e?.extensions?.code === 'ACCESS_DENIED')
      if (!data.data?.orders || !onlyAccessDenied) {
        return { status: 500, body: { error: 'Failed to fetch order.' } }
      }
    }

    const order = data.data?.orders?.edges?.[0]?.node
    // Defence in depth: never return an order whose email doesn't match exactly.
    if (!order || String(order.email || '').trim().toLowerCase() !== email) {
      return { status: 404, body: { error: 'Order not found. Please check your details.' } }
    }

    const status = deriveStatus(order)
    return {
      status: 200,
      body: {
        orderNumber: order.name,
        email: order.email,
        status,
        estimatedDelivery: deriveEstimate(status, order),
        rawData: order,
      },
    }
  } catch (error) {
    console.error('Server Error:', error)
    return { status: 500, body: { error: 'Internal server error.' } }
  }
}
