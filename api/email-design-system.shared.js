/**
 * Shared email design system for all AeroTouch email templates.
 * All styles are inline for Gmail/Outlook/Apple Mail compatibility.
 * Every email is built from these primitives to ensure visual consistency.
 */

export const BRAND = {
  orange: '#ea580c',
  orangeHover: '#c2410c',
  orangeLight: '#fff7ed',
  orangeBorder: '#fed7aa',
  dark: '#0f172a',
  text: '#334155',
  muted: '#64748b',
  lightBg: '#f8fafc',
  white: '#ffffff',
  border: '#e2e8f0',
  starGold: '#f59e0b',
  green: '#16a34a',
  greenLight: '#f0fdf4',
  greenBorder: '#bbf7d0',
  warmGradientStart: '#fff7ed',
  warmGradientEnd: '#fef3c7',
}

export function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function emailShell(bodyContent) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>AeroTouch</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <tr>
            <td>${bodyContent}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function header() {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:28px 32px 20px 32px;text-align:center;border-bottom:1px solid ${BRAND.border};">
          <a href="https://aerotouch.com" style="text-decoration:none;">
            <span style="font-size:22px;font-weight:800;letter-spacing:3px;color:${BRAND.dark};">AERO</span><span style="font-size:22px;font-weight:800;letter-spacing:3px;color:${BRAND.orange};">TOUCH</span>
          </a>
        </td>
      </tr>
    </table>`
}

export function heroSection({ title, subtitle, badge }) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:44px 32px;background-color:${BRAND.warmGradientStart};background:linear-gradient(135deg, ${BRAND.warmGradientStart} 0%, ${BRAND.warmGradientEnd} 100%);text-align:center;">
          ${badge ? `<div style="display:inline-block;padding:6px 18px;background:${BRAND.orange};color:${BRAND.white};border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">${escapeHtml(badge)}</div><br/>` : ''}
          <h1 style="margin:0 0 10px 0;font-size:28px;font-weight:800;color:${BRAND.dark};line-height:1.25;">${title}</h1>
          ${subtitle ? `<p style="margin:0;font-size:16px;color:${BRAND.text};line-height:1.5;">${subtitle}</p>` : ''}
        </td>
      </tr>
    </table>`
}

export function productShowcase({ imageUrl, altText, caption, width = 300 }) {
  if (!imageUrl) {
    return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:24px 32px;text-align:center;">
          <div style="padding:28px;background-color:${BRAND.warmGradientStart};background:linear-gradient(135deg, ${BRAND.warmGradientStart} 0%, ${BRAND.warmGradientEnd} 100%);border-radius:14px;">
            <p style="margin:0 0 4px 0;font-size:20px;font-weight:700;color:${BRAND.dark};">AeroTouch Performance Insoles</p>
            <p style="margin:0;font-size:14px;color:${BRAND.muted};">Targeted arch support &bull; Shock-absorbing cushioning</p>
          </div>
        </td>
      </tr>
    </table>`
  }
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:24px 32px;text-align:center;">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(altText || 'AeroTouch insoles')}" width="${width}" style="max-width:100%;height:auto;border-radius:14px;display:block;margin:0 auto;" />
          ${caption ? `<p style="margin:10px 0 0 0;font-size:13px;color:${BRAND.muted};">${escapeHtml(caption)}</p>` : ''}
        </td>
      </tr>
    </table>`
}

export function discountCode(code, { label = 'Your exclusive code', description = '20% off your order' } = {}) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:8px 32px;">
          <div style="padding:22px 20px;background:${BRAND.orangeLight};border:2px dashed ${BRAND.orangeBorder};border-radius:14px;text-align:center;">
            <span style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.muted};font-weight:600;">${escapeHtml(label)}</span><br/>
            <span style="font-size:30px;font-weight:800;letter-spacing:3px;color:${BRAND.orange};line-height:2;">${escapeHtml(code)}</span><br/>
            <span style="font-size:14px;color:${BRAND.text};">${escapeHtml(description)}</span>
          </div>
        </td>
      </tr>
    </table>`
}

export function ctaButton(text, url) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:24px 32px;text-align:center;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${escapeHtml(url)}" style="height:52px;v-text-anchor:middle;width:240px;" arcsize="23%" fillcolor="${BRAND.orange}">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${escapeHtml(text)}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-->
          <a href="${escapeHtml(url)}" style="display:inline-block;padding:16px 44px;background-color:${BRAND.orange};color:${BRAND.white};font-weight:700;font-size:16px;text-decoration:none;border-radius:12px;letter-spacing:0.3px;line-height:1;">
            ${escapeHtml(text)}
          </a>
          <!--<![endif]-->
        </td>
      </tr>
    </table>`
}

export function secondaryButton(text, url) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:8px 32px;text-align:center;">
          <a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 36px;background:transparent;color:${BRAND.orange};font-weight:600;font-size:14px;text-decoration:none;border-radius:12px;border:2px solid ${BRAND.orange};line-height:1;">
            ${escapeHtml(text)}
          </a>
        </td>
      </tr>
    </table>`
}

export function starRating(count = 5) {
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < count
      ? `<span style="color:${BRAND.starGold};font-size:18px;">&#9733;</span>`
      : `<span style="color:${BRAND.border};font-size:18px;">&#9734;</span>`
  ).join('')
  return `<span style="letter-spacing:2px;">${stars}</span>`
}

export function trustSection(reviews) {
  const defaultReviews = [
    { text: "I'm on my feet 12 hours a day as a nurse. These are the first insoles that actually held up past week two.", name: 'Sarah J.', role: 'Nurse, Verified Buyer', rating: 5 },
    { text: 'My knee pain during runs completely disappeared. Wish I found these years ago.', name: 'Michael T.', role: 'Runner, Verified Buyer', rating: 5 },
  ]
  const list = reviews || defaultReviews

  const reviewCards = list.map(r => `
        <div style="padding:18px 20px;background:${BRAND.lightBg};border-radius:12px;margin-bottom:12px;">
          <div style="margin-bottom:8px;">${starRating(r.rating || 5)}</div>
          <p style="margin:0 0 10px 0;font-style:italic;color:${BRAND.text};font-size:14px;line-height:1.55;">"${escapeHtml(r.text)}"</p>
          <p style="margin:0;font-size:13px;font-weight:700;color:${BRAND.dark};">${escapeHtml(r.name)}</p>
          ${r.role ? `<p style="margin:2px 0 0 0;font-size:12px;color:${BRAND.muted};">${escapeHtml(r.role)}</p>` : ''}
        </div>`
  ).join('')

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:24px 32px;">
          <p style="margin:0 0 16px 0;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:${BRAND.muted};font-weight:700;">What our customers say</p>
          <div style="text-align:center;margin-bottom:16px;">
            ${starRating(5)}
            <span style="margin-left:8px;font-size:14px;font-weight:700;color:${BRAND.dark};">4.9/5</span>
            <span style="font-size:13px;color:${BRAND.muted};"> from 2,400+ reviews</span>
          </div>
          ${reviewCards}
        </td>
      </tr>
    </table>`
}

export function benefitsList(items) {
  const rows = items.map(item => `
          <tr>
            <td style="padding:5px 10px 5px 0;vertical-align:top;width:20px;color:${BRAND.orange};font-size:16px;font-weight:700;">&#10003;</td>
            <td style="padding:5px 0;color:${BRAND.text};font-size:14px;line-height:1.5;">${escapeHtml(item)}</td>
          </tr>`
  ).join('')
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:8px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${rows}
          </table>
        </td>
      </tr>
    </table>`
}

export function bodyText(html) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:8px 32px;color:${BRAND.text};font-size:15px;line-height:1.6;">
          ${html}
        </td>
      </tr>
    </table>`
}

export function spacer(height = 16) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr><td style="height:${height}px;line-height:${height}px;font-size:1px;">&nbsp;</td></tr></table>`
}

export function divider() {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr><td style="padding:0 32px;"><div style="border-top:1px solid ${BRAND.border};"></div></td></tr>
    </table>`
}

export function guaranteeBanner() {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:8px 32px;">
          <div style="padding:16px 20px;background:${BRAND.greenLight};border:1px solid ${BRAND.greenBorder};border-radius:12px;text-align:center;">
            <span style="font-size:14px;font-weight:600;color:${BRAND.green};">&#10003; 60-Day Risk-Free Returns</span>
            <span style="color:${BRAND.greenBorder};margin:0 8px;">|</span>
            <span style="font-size:14px;font-weight:600;color:${BRAND.green};">&#10003; Free Shipping $50+</span>
          </div>
        </td>
      </tr>
    </table>`
}

export function cartItemsTable(cartSnapshot) {
  if (!Array.isArray(cartSnapshot) || cartSnapshot.length === 0) return ''
  const rows = cartSnapshot.slice(0, 5).map(item => {
    const img = item.image
      ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name || '')}" width="68" height="68" style="border-radius:10px;object-fit:cover;display:block;" />`
      : `<div style="width:68px;height:68px;border-radius:10px;background:${BRAND.lightBg};"></div>`
    const details = [
      item.size ? `Size: ${escapeHtml(item.size)}` : '',
      item.color ? `Color: ${escapeHtml(item.color)}` : '',
      item.quantity > 1 ? `Qty: ${item.quantity}` : '',
    ].filter(Boolean).join(' &middot; ')
    return `
          <tr>
            <td style="padding:10px 14px 10px 0;vertical-align:middle;width:68px;">${img}</td>
            <td style="padding:10px 0;vertical-align:middle;">
              <span style="font-weight:600;color:${BRAND.dark};font-size:14px;">${escapeHtml(item.name)}</span>
              ${details ? `<br/><span style="font-size:12px;color:${BRAND.muted};">${details}</span>` : ''}
            </td>
            ${item.price != null ? `<td style="padding:10px 0 10px 12px;vertical-align:middle;text-align:right;font-weight:700;color:${BRAND.dark};font-size:14px;white-space:nowrap;">$${escapeHtml(String(item.price))}</td>` : ''}
          </tr>`
  }).join('')
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:8px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            ${rows}
          </table>
        </td>
      </tr>
    </table>`
}

export function orderSummaryTable({ items, subtotal, shipping, discount, total }) {
  const itemRows = (items || []).slice(0, 10).map(item => `
          <tr>
            <td style="padding:6px 0;color:${BRAND.text};font-size:14px;">${escapeHtml(item.name)}${item.quantity > 1 ? ` &times; ${item.quantity}` : ''}</td>
            <td style="padding:6px 0;text-align:right;color:${BRAND.dark};font-size:14px;font-weight:600;">$${escapeHtml(String(item.price || '0.00'))}</td>
          </tr>`
  ).join('')

  const summaryRows = [
    subtotal != null ? `<tr><td style="padding:4px 0;color:${BRAND.muted};font-size:13px;">Subtotal</td><td style="padding:4px 0;text-align:right;color:${BRAND.text};font-size:13px;">$${escapeHtml(String(subtotal))}</td></tr>` : '',
    shipping != null ? `<tr><td style="padding:4px 0;color:${BRAND.muted};font-size:13px;">Shipping</td><td style="padding:4px 0;text-align:right;color:${BRAND.text};font-size:13px;">${shipping === 0 || shipping === '0.00' ? 'FREE' : '$' + escapeHtml(String(shipping))}</td></tr>` : '',
    discount != null ? `<tr><td style="padding:4px 0;color:${BRAND.green};font-size:13px;">Discount</td><td style="padding:4px 0;text-align:right;color:${BRAND.green};font-size:13px;font-weight:600;">-$${escapeHtml(String(discount))}</td></tr>` : '',
  ].filter(Boolean).join('')

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:8px 32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            ${itemRows}
          </table>
          ${summaryRows ? `
          <div style="border-top:1px solid ${BRAND.border};margin:12px 0 8px 0;"></div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            ${summaryRows}
          </table>` : ''}
          ${total != null ? `
          <div style="border-top:2px solid ${BRAND.dark};margin:8px 0;"></div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;">
            <tr>
              <td style="padding:6px 0;color:${BRAND.dark};font-size:16px;font-weight:800;">Total</td>
              <td style="padding:6px 0;text-align:right;color:${BRAND.dark};font-size:16px;font-weight:800;">$${escapeHtml(String(total))}</td>
            </tr>
          </table>` : ''}
        </td>
      </tr>
    </table>`
}

export function trackingInfo({ carrier, trackingNumber, trackingUrl, estimatedDelivery }) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:8px 32px;">
          <div style="padding:20px;background:${BRAND.lightBg};border-radius:14px;border:1px solid ${BRAND.border};">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
              ${carrier ? `<tr><td style="padding:4px 0;color:${BRAND.muted};font-size:13px;width:140px;">Carrier</td><td style="padding:4px 0;color:${BRAND.dark};font-size:14px;font-weight:600;">${escapeHtml(carrier)}</td></tr>` : ''}
              ${trackingNumber ? `<tr><td style="padding:4px 0;color:${BRAND.muted};font-size:13px;width:140px;">Tracking Number</td><td style="padding:4px 0;color:${BRAND.dark};font-size:14px;font-weight:600;">${trackingUrl ? `<a href="${escapeHtml(trackingUrl)}" style="color:${BRAND.orange};text-decoration:underline;">${escapeHtml(trackingNumber)}</a>` : escapeHtml(trackingNumber)}</td></tr>` : ''}
              ${estimatedDelivery ? `<tr><td style="padding:4px 0;color:${BRAND.muted};font-size:13px;width:140px;">Estimated Delivery</td><td style="padding:4px 0;color:${BRAND.dark};font-size:14px;font-weight:700;">${escapeHtml(estimatedDelivery)}</td></tr>` : ''}
            </table>
          </div>
        </td>
      </tr>
    </table>`
}

export function footer({ unsubscribeUrl, siteBaseUrl = 'https://aerotouch.com' } = {}) {
  const base = siteBaseUrl.replace(/\/+$/, '')
  const year = new Date().getFullYear()
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:32px;background:${BRAND.lightBg};border-top:1px solid ${BRAND.border};">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="text-align:center;padding-bottom:18px;">
                <a href="${escapeHtml(base)}" style="text-decoration:none;">
                  <span style="font-size:18px;font-weight:800;letter-spacing:2px;color:${BRAND.dark};">AERO</span><span style="font-size:18px;font-weight:800;letter-spacing:2px;color:${BRAND.orange};">TOUCH</span>
                </a>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;padding-bottom:18px;">
                <a href="${escapeHtml(base)}/support" style="color:${BRAND.muted};text-decoration:none;font-size:13px;">Support</a>
                <span style="color:${BRAND.border};margin:0 6px;">&#8226;</span>
                <a href="${escapeHtml(base)}/returns" style="color:${BRAND.muted};text-decoration:none;font-size:13px;">Returns &amp; Exchanges</a>
                <span style="color:${BRAND.border};margin:0 6px;">&#8226;</span>
                <a href="${escapeHtml(base)}/size-guide" style="color:${BRAND.muted};text-decoration:none;font-size:13px;">Size Guide</a>
                <span style="color:${BRAND.border};margin:0 6px;">&#8226;</span>
                <a href="${escapeHtml(base)}/warranty" style="color:${BRAND.muted};text-decoration:none;font-size:13px;">Warranty</a>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;padding-bottom:12px;">
                <span style="font-size:13px;color:${BRAND.muted};">Free shipping on orders over $50 &middot; 60-day risk-free returns</span>
              </td>
            </tr>
            <tr>
              <td style="text-align:center;">
                <span style="font-size:12px;color:${BRAND.muted};">&copy; ${year} AeroTouch. All rights reserved.</span>
                ${unsubscribeUrl ? `<br/><a href="${escapeHtml(unsubscribeUrl)}" style="font-size:12px;color:${BRAND.muted};text-decoration:underline;margin-top:4px;display:inline-block;">Unsubscribe</a>` : ''}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`
}
