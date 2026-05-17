/**
 * Transactional email templates.
 * Template 4: Order Confirmation
 * Template 5: Shipping Confirmation
 */

import {
  BRAND,
  escapeHtml,
  emailShell,
  header,
  heroSection,
  productShowcase,
  orderSummaryTable,
  trackingInfo,
  ctaButton,
  secondaryButton,
  benefitsList,
  trustSection,
  guaranteeBanner,
  bodyText,
  spacer,
  divider,
  footer,
} from './email-design-system.shared.js'

/**
 * Template 4: Order Confirmation
 */
export function buildOrderConfirmationEmail({
  firstName,
  orderNumber,
  orderDate,
  items,
  subtotal,
  shipping,
  discount,
  total,
  shippingAddress,
  siteBaseUrl = 'https://aerotouch.com',
  productImageUrl,
}) {
  const safeName = escapeHtml(firstName)
  const base = siteBaseUrl.replace(/\/+$/, '')
  const safeOrderNumber = escapeHtml(orderNumber)

  const addressBlock = shippingAddress ? `
    <div style="padding:16px 20px;background:${BRAND.lightBg};border-radius:12px;border:1px solid ${BRAND.border};">
      <p style="margin:0 0 6px 0;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${BRAND.muted};font-weight:600;">Shipping to</p>
      <p style="margin:0;color:${BRAND.dark};font-size:14px;line-height:1.5;">
        ${escapeHtml(shippingAddress.name || firstName)}<br/>
        ${escapeHtml(shippingAddress.address1 || '')}
        ${shippingAddress.address2 ? '<br/>' + escapeHtml(shippingAddress.address2) : ''}<br/>
        ${escapeHtml(shippingAddress.city || '')}, ${escapeHtml(shippingAddress.province || '')} ${escapeHtml(shippingAddress.zip || '')}<br/>
        ${escapeHtml(shippingAddress.country || '')}
      </p>
    </div>
  ` : ''

  const subject = `Order confirmed — #${orderNumber}`

  const content =
    header() +
    heroSection({
      title: `Thanks for Your Order, ${safeName}!`,
      subtitle: "We're getting everything ready. You'll receive a shipping confirmation once your order is on its way.",
      badge: 'ORDER CONFIRMED',
    }) +
    spacer(8) +
    bodyText(`
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding:16px 20px;background:${BRAND.orangeLight};border-radius:12px;border:1px solid ${BRAND.orangeBorder};">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <span style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${BRAND.muted};font-weight:600;">Order Number</span><br/>
                  <span style="font-size:20px;font-weight:800;color:${BRAND.orange};letter-spacing:1px;">#${safeOrderNumber}</span>
                </td>
                ${orderDate ? `<td style="text-align:right;vertical-align:bottom;"><span style="font-size:13px;color:${BRAND.muted};">${escapeHtml(orderDate)}</span></td>` : ''}
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `) +
    spacer(12) +
    bodyText(`<p style="margin:0 0 8px 0;font-weight:700;color:${BRAND.dark};">Order summary</p>`) +
    orderSummaryTable({ items, subtotal, shipping, discount, total }) +
    spacer(12) +
    (addressBlock ? bodyText(addressBlock) + spacer(12) : '') +
    ctaButton('Track Your Order', `${base}/track-order`) +
    productShowcase({ imageUrl: productImageUrl, altText: 'AeroTouch insoles' }) +
    bodyText(`<p style="margin:0 0 8px 0;font-weight:700;color:${BRAND.dark};">Getting the most from your insoles:</p>`) +
    benefitsList([
      'Trim to fit if needed — follow the guide lines on the back',
      'Allow 3-5 days for your feet to fully adjust',
      'Replace every 6-12 months for optimal support',
      'Hand wash with mild soap and air dry',
    ]) +
    spacer(8) +
    guaranteeBanner() +
    spacer(8) +
    trustSection([
      { text: 'Fast shipping, beautiful packaging, and the insoles feel incredible. The whole experience was premium.', name: 'Emily C.', role: 'Verified Buyer', rating: 5 },
      { text: 'Ordered on Monday, arrived Wednesday. Already feels like my shoes were custom-made.', name: 'Jake L.', role: 'Verified Buyer', rating: 5 },
    ]) +
    footer({ siteBaseUrl: base })

  return { subject, html: emailShell(content) }
}

/**
 * Template 5: Shipping Confirmation
 */
export function buildShippingConfirmationEmail({
  firstName,
  orderNumber,
  carrier,
  trackingNumber,
  trackingUrl,
  estimatedDelivery,
  items,
  siteBaseUrl = 'https://aerotouch.com',
  productImageUrl,
}) {
  const safeName = escapeHtml(firstName)
  const base = siteBaseUrl.replace(/\/+$/, '')
  const safeOrderNumber = escapeHtml(orderNumber)

  const subject = `Your AeroTouch order #${orderNumber} has shipped!`

  const content =
    header() +
    heroSection({
      title: `${safeName}, Your Order Is on Its Way!`,
      subtitle: "Your AeroTouch insoles have shipped. Here's everything you need to track your package.",
      badge: 'SHIPPED',
    }) +
    spacer(8) +
    bodyText(`
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="padding:12px 20px;background:${BRAND.orangeLight};border-radius:12px;border:1px solid ${BRAND.orangeBorder};text-align:center;">
            <span style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${BRAND.muted};font-weight:600;">Order</span>
            <span style="font-size:16px;font-weight:700;color:${BRAND.orange};margin-left:8px;">#${safeOrderNumber}</span>
          </td>
        </tr>
      </table>
    `) +
    spacer(12) +
    trackingInfo({ carrier, trackingNumber, trackingUrl, estimatedDelivery }) +
    spacer(8) +
    ctaButton('Track My Package', trackingUrl || `${base}/track-order`) +
    (items && items.length > 0 ? (
      divider() +
      spacer(8) +
      bodyText(`<p style="margin:0 0 4px 0;font-weight:700;color:${BRAND.dark};">What's in your package:</p>`)
    ) : '') +
    (items && items.length > 0 ? (() => {
      const rows = items.slice(0, 5).map(item => {
        const img = item.image
          ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name || '')}" width="56" height="56" style="border-radius:10px;object-fit:cover;display:block;" />`
          : ''
        return `
              <tr>
                ${img ? `<td style="padding:8px 12px 8px 0;vertical-align:middle;width:56px;">${img}</td>` : ''}
                <td style="padding:8px 0;vertical-align:middle;">
                  <span style="font-weight:600;color:${BRAND.dark};font-size:14px;">${escapeHtml(item.name)}</span>
                  ${item.quantity > 1 ? `<span style="font-size:12px;color:${BRAND.muted};"> x${item.quantity}</span>` : ''}
                </td>
              </tr>`
      }).join('')
      return `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr><td style="padding:4px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">${rows}</table>
          </td></tr>
        </table>`
    })() : '') +
    spacer(12) +
    productShowcase({ imageUrl: productImageUrl, altText: 'AeroTouch insoles', caption: 'Comfort is almost here' }) +
    bodyText(`<p style="margin:0 0 8px 0;font-weight:700;color:${BRAND.dark};">While you wait — quick setup tips:</p>`) +
    benefitsList([
      'Remove your existing insoles before inserting AeroTouch',
      'Trim along the guide lines for a perfect fit',
      'Wear for a few hours initially while your feet adjust',
      'Full comfort typically sets in within 3-5 days',
    ]) +
    spacer(8) +
    guaranteeBanner() +
    spacer(8) +
    trustSection([
      { text: 'Got mine in two days. The packaging was great and the insoles fit perfectly right out of the box.', name: 'Karen W.', role: 'Verified Buyer', rating: 5 },
    ]) +
    footer({ siteBaseUrl: base })

  return { subject, html: emailShell(content) }
}
