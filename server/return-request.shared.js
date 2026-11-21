import {
  adminGraphQL,
  getShopifyAdminAccessToken,
  readShopifyConfig,
} from './shopify-admin.shared.js'

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function normalizeOrderNumber(orderNumber) {
  return String(orderNumber || '').trim().replace(/^#/, '').trim()
}

function isValidEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidOrderNumber(orderNumber) {
  // Accept common Shopify-like order ids such as #AT12345, 12345, ORDER-1234
  return /^[A-Za-z0-9-]{4,32}$/.test(orderNumber)
}

function escapeGraphQl(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
}

async function sendReturnRequestReceivedEmail({
  resendApiKey,
  fromEmail,
  toEmail,
  requestType,
  orderNumber,
  reason,
}) {
  if (!resendApiKey || !fromEmail || !toEmail) return { ok: false, skipped: true }

  const subject = `AeroTouch ${requestType} request received (${orderNumber})`
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:620px;margin:0 auto;padding:16px;">
      <h2 style="margin:0 0 12px 0;">We've received your ${requestType} request.</h2>
      <p style="margin:0 0 12px 0;">Order: <strong>${orderNumber}</strong></p>
      <p style="margin:0 0 12px 0;">Reason: <strong>${String(reason || 'N/A')}</strong></p>
      <p style="margin:0;">Our support team will review your request and follow up with next steps within 24 hours.</p>
    </div>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        html,
      }),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      const message = typeof data?.message === 'string' ? data.message : 'Could not send confirmation email.'
      return { ok: false, skipped: false, error: message }
    }
    return { ok: true, skipped: false }
  } catch (error) {
    console.error('return-request: confirmation email provider error', error)
    return { ok: false, skipped: false, error: 'Could not connect to email provider.' }
  }
}

/**
 * @param {{
 *  orderNumber?: string,
 *  email?: string,
 *  requestType?: string,
 *  reason?: string,
 *  items?: string,
 *  comments?: string,
 *  exchangeSize?: string,
 *  exchangeColor?: string
 * }} payload
 * @param {(name: string) => string} getEnv
 * @returns {Promise<{status:number, body: Record<string, unknown>}>}
 */
export async function handleReturnRequest(payload, getEnv) {
  const rawOrderNumber = String(payload?.orderNumber || '')
  const cleanOrderNumber = normalizeOrderNumber(rawOrderNumber)
  const email = normalizeEmail(payload?.email)
  const requestType = String(payload?.requestType || '').trim().toLowerCase()
  const reason = String(payload?.reason || '').trim()
  const items = String(payload?.items || '').trim()
  const comments = String(payload?.comments || '').trim()
  const exchangeSize = String(payload?.exchangeSize || '').trim()
  const exchangeColor = String(payload?.exchangeColor || '').trim()

  if (!cleanOrderNumber || !email || !requestType || !reason || !items) {
    return { status: 400, body: { error: 'Missing required fields.' } }
  }
  if (!isValidEmailFormat(email)) {
    return { status: 400, body: { error: 'Please enter a valid email address.' } }
  }
  if (!isValidOrderNumber(cleanOrderNumber)) {
    return { status: 400, body: { error: 'Please enter a valid order number.' } }
  }
  if (!['return', 'exchange'].includes(requestType)) {
    return { status: 400, body: { error: 'Invalid request type.' } }
  }

  const shopifyConfig = readShopifyConfig(getEnv)
  if (!shopifyConfig.shopDomain) {
    console.error('return-request: missing SHOPIFY_STORE_DOMAIN')
    return { status: 500, body: { error: 'Server configuration error.' } }
  }

  try {
    const verifyQuery = `
      query {
        orders(first: 1, query: "name:#${escapeGraphQl(cleanOrderNumber)} AND email:${escapeGraphQl(email)}") {
          edges {
            node {
              id
              name
              email
              note
            }
          }
        }
      }
    `

    const adminAccessToken = await getShopifyAdminAccessToken(shopifyConfig)
    if (!adminAccessToken) {
      console.error('return-request: no usable Shopify admin credentials')
      return { status: 500, body: { error: 'Server configuration error.' } }
    }

    const verifyData = await adminGraphQL({
      shopDomain: shopifyConfig.shopDomain,
      accessToken: adminAccessToken,
      query: verifyQuery,
    })

    if (verifyData.errors) {
      console.error('return-request: verify graphql errors', verifyData.errors)
      return { status: 500, body: { error: 'Failed to verify order.' } }
    }

    const orderNode = verifyData?.data?.orders?.edges?.[0]?.node
    if (!orderNode?.id) {
      return { status: 404, body: { error: 'Order not found. Please check your order number and email.' } }
    }

    const timestamp = new Date().toISOString()
    const newBlock = `[${requestType.toUpperCase()} REQUEST - ${timestamp}]
Reason: ${reason}
Items: ${items}
${requestType === 'exchange' ? `Exchange Size: ${exchangeSize || 'Same'}, Color: ${exchangeColor || 'Same'}` : ''}
Comments: ${comments || 'None'}
Status: Pending`
    const existingNote = String(orderNode.note || '').trim()
    const combinedNote = existingNote ? `${existingNote}\n\n${newBlock}` : newBlock

    const updateMutation = `
      mutation {
        orderUpdate(input: {
          id: "${escapeGraphQl(orderNode.id)}",
          note: "${escapeGraphQl(combinedNote)}"
        }) {
          order {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const updateData = await adminGraphQL({
      shopDomain: shopifyConfig.shopDomain,
      accessToken: adminAccessToken,
      query: updateMutation,
    })
    const updateErrors = updateData?.errors || updateData?.data?.orderUpdate?.userErrors
    if (updateErrors?.length) {
      console.error('return-request: failed to append order note', updateErrors)
    }

    const resendApiKey = getEnv('RESEND_API_KEY')
    const resendFrom = getEnv('RESEND_FROM_EMAIL') || 'AeroTouch <onboarding@resend.dev>'
    const emailResult = await sendReturnRequestReceivedEmail({
      resendApiKey,
      fromEmail: resendFrom,
      toEmail: email,
      requestType,
      orderNumber: cleanOrderNumber,
      reason,
    })

    return {
      status: 200,
      body: {
        success: true,
        message: 'Return request submitted successfully',
        requestType,
        orderNumber: cleanOrderNumber,
        confirmationEmailSent: Boolean(emailResult.ok),
      },
    }
  } catch (error) {
    console.error('return-request: server error', error)
    return { status: 500, body: { error: 'Internal server error.' } }
  }
}
