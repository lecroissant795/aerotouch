/**
 * Track order via Shopify Admin GraphQL.
 *
 * Auth (pick one):
 * - SHOPIFY_ADMIN_ACCESS_TOKEN — legacy static Admin API token
 * - SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET — Dev Dashboard app (client_credentials grant, ~24h token, cached server-side)
 *
 * Always: SHOPIFY_STORE_DOMAIN (e.g. your-store.myshopify.com, no https://)
 */

import {
  getShopifyAdminAccessToken,
  readShopifyConfig,
} from './shopify-admin.shared.js'

const getProcessEnv = (name) => process.env[name]?.trim() || ''

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { orderNumber, email } = req.body

  if (!orderNumber || !email) {
    return res.status(400).json({ error: 'Order number and email are required.' })
  }

  const shopifyConfig = readShopifyConfig(getProcessEnv)
  const shopDomain = shopifyConfig.shopDomain

  if (!shopDomain) {
    console.error('Missing SHOPIFY_STORE_DOMAIN')
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  let adminAccessToken
  try {
    adminAccessToken = await getShopifyAdminAccessToken(shopifyConfig)
  } catch {
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  if (!adminAccessToken) {
    console.error(
      'Missing Shopify auth: set SHOPIFY_ADMIN_ACCESS_TOKEN or SHOPIFY_CLIENT_ID + SHOPIFY_CLIENT_SECRET'
    )
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  try {
    const cleanOrderNumber = orderNumber.replace(/#/g, '').trim()

    const query = `
      query {
        orders(first: 1, query: "name:#${cleanOrderNumber} AND email:${email}") {
          edges {
            node {
              name
              email
              displayFulfillmentStatus
              createdAt
              currentTotalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
                presentmentMoney {
                  amount
                  currencyCode
                }
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                    originalUnitPriceSet {
                      shopMoney {
                        amount
                        currencyCode
                      }
                      presentmentMoney {
                        amount
                        currencyCode
                      }
                    }
                    variant {
                      image {
                        url
                        altText
                      }
                    }
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
              fulfillments(first: 1) {
                status
                trackingInfo(first: 1) {
                  number
                  url
                  company
                }
              }
            }
          }
        }
      }
    `

    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminAccessToken,
        },
        body: JSON.stringify({ query }),
      }
    )

    const data = await response.json()

    if (data.errors) {
      console.error('Shopify API Errors:', data.errors)
      return res.status(500).json({ error: 'Failed to fetch order.' })
    }

    const orders = data.data.orders.edges

    if (orders.length === 0) {
      return res.status(404).json({
        error: 'Order not found. Please check your details.',
      })
    }

    const order = orders[0].node

    let status = 'Processing'
    let estimatedDelivery = 'Calculating...'

    if (order.displayFulfillmentStatus === 'FULFILLED') {
      status = 'Delivered'
    } else if (order.displayFulfillmentStatus === 'PARTIALLY_FULFILLED') {
      status = 'Shipped'
    } else if (order.displayFulfillmentStatus === 'IN_PROGRESS') {
      status = 'Processing'
    } else if (order.displayFulfillmentStatus === 'UNFULFILLED') {
      status = 'Processing'
    }

    if (status === 'Shipped' || status === 'Processing') {
      const deliveryDate = new Date()
      deliveryDate.setDate(deliveryDate.getDate() + 4)
      estimatedDelivery = deliveryDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    } else if (status === 'Delivered') {
      estimatedDelivery = 'Delivered'
    }

    return res.status(200).json({
      orderNumber: order.name,
      email: order.email,
      status: status,
      estimatedDelivery: estimatedDelivery,
      rawData: order,
    })
  } catch (error) {
    console.error('Server Error:', error)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}
