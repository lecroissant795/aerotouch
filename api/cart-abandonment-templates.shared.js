function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function unsubscribeFooter(unsubscribeUrl) {
  if (!unsubscribeUrl) {
    return `
      <p style="margin:20px 0 0 0;font-size:12px;color:#64748b;">
        AeroTouch &middot; If you did not request this, you can ignore this email.
      </p>
    `
  }
  return `
    <p style="margin:24px 0 0 0;font-size:12px;color:#64748b;line-height:1.5;">
      AeroTouch &middot; You're receiving this because you showed interest in our products.<br/>
      No longer interested? <a href="${escapeHtml(unsubscribeUrl)}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a>.
    </p>
  `
}

function cartItemsHtml(cartSnapshot) {
  if (!Array.isArray(cartSnapshot) || cartSnapshot.length === 0) return ''
  const rows = cartSnapshot.slice(0, 5).map(item => {
    const img = item.image
      ? `<img src="${escapeHtml(item.image)}" alt="" width="60" height="60" style="border-radius:8px;object-fit:cover;display:block;" />`
      : ''
    return `
      <tr>
        <td style="padding:8px 12px 8px 0;vertical-align:middle;width:60px;">${img}</td>
        <td style="padding:8px 0;vertical-align:middle;">
          <span style="font-weight:600;color:#0f172a;">${escapeHtml(item.name)}</span>
          ${item.size ? `<br/><span style="font-size:12px;color:#64748b;">Size: ${escapeHtml(item.size)}</span>` : ''}
          ${item.quantity > 1 ? `<br/><span style="font-size:12px;color:#64748b;">Qty: ${item.quantity}</span>` : ''}
        </td>
      </tr>
    `
  }).join('')
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:16px 0;">
      ${rows}
    </table>
  `
}

function ctaButton(text, siteBaseUrl) {
  const url = siteBaseUrl ? `${siteBaseUrl.replace(/\/+$/, '')}` : '#'
  return `
    <div style="margin:24px 0;text-align:center;">
      <a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 32px;background:#ea580c;color:#ffffff;font-weight:700;font-size:16px;text-decoration:none;border-radius:12px;">
        ${escapeHtml(text)}
      </a>
    </div>
  `
}

function discountBadge(code) {
  return `
    <div style="margin:16px 0;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;text-align:center;">
      <span style="font-size:14px;color:#64748b;">Your 15% off code:</span><br/>
      <span style="font-size:24px;font-weight:700;letter-spacing:1px;color:#ea580c;">${escapeHtml(code)}</span>
    </div>
  `
}

function buildReminderHtml({ firstName, discountCode, cartSnapshot, unsubscribeUrl, siteBaseUrl }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:600px;margin:0 auto;padding:16px;">
      <h2 style="margin:0 0 12px 0;">${escapeHtml(firstName)}, you left something behind</h2>
      <p style="margin:0 0 12px 0;">We noticed you didn't finish checking out. No worries — your items are still waiting for you.</p>
      ${cartItemsHtml(cartSnapshot)}
      <p style="margin:12px 0;">Use this exclusive code for <strong>15% off</strong> your order:</p>
      ${discountBadge(discountCode)}
      ${ctaButton('Complete Your Order', siteBaseUrl)}
      <p style="margin:12px 0 0 0;font-size:13px;color:#64748b;">This code expires in 7 days and can only be used once.</p>
      ${unsubscribeFooter(unsubscribeUrl)}
    </div>
  `
}

function buildSocialProofHtml({ firstName, discountCode, cartSnapshot, unsubscribeUrl, siteBaseUrl }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:600px;margin:0 auto;padding:16px;">
      <h2 style="margin:0 0 12px 0;">People are loving what's in your cart</h2>
      <p style="margin:0 0 4px 0;">Hey ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 12px 0;">Our customers rate AeroTouch products 4.9/5 stars. Here's what people are saying:</p>
      <div style="margin:16px 0;padding:16px;background:#f8fafc;border-radius:10px;border-left:4px solid #ea580c;">
        <p style="margin:0;font-style:italic;color:#334155;">"The moment I put them in, the heel pain vanished. I'm back to running 20 miles a week."</p>
        <p style="margin:8px 0 0 0;font-size:13px;font-weight:600;color:#64748b;">— Michael T., Verified Buyer</p>
      </div>
      <p style="margin:16px 0 4px 0;">Your 15% off code is still active:</p>
      ${discountBadge(discountCode)}
      ${ctaButton('Complete Your Order', siteBaseUrl)}
      ${unsubscribeFooter(unsubscribeUrl)}
    </div>
  `
}

function buildFinalNudgeHtml({ firstName, discountCode, cartSnapshot, unsubscribeUrl, siteBaseUrl }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:600px;margin:0 auto;padding:16px;">
      <h2 style="margin:0 0 12px 0;">Last chance: your 15% off expires soon</h2>
      <p style="margin:0 0 4px 0;">Hey ${escapeHtml(firstName)},</p>
      <p style="margin:0 0 12px 0;">Just a heads up — your exclusive <strong>15% off</strong> code is about to expire. Once it's gone, it's gone.</p>
      ${cartItemsHtml(cartSnapshot)}
      ${discountBadge(discountCode)}
      ${ctaButton('Use My Code Now', siteBaseUrl)}
      <p style="margin:12px 0 0 0;font-size:13px;color:#64748b;">After this, we won't email you about this cart again.</p>
      ${unsubscribeFooter(unsubscribeUrl)}
    </div>
  `
}

export const CART_ABANDONMENT_STEPS = [
  {
    id: 'reminder',
    column: 'reminder_sent_at',
    hoursAfterSignup: 1,
    subject: (firstName) => `${firstName}, you left something behind`,
    build: buildReminderHtml,
  },
  {
    id: 'social_proof',
    column: 'social_proof_sent_at',
    hoursAfterSignup: 24,
    subject: () => "People are loving what's in your cart",
    build: buildSocialProofHtml,
  },
  {
    id: 'final_nudge',
    column: 'final_nudge_sent_at',
    hoursAfterSignup: 72,
    subject: () => 'Last chance: your 15% off expires soon',
    build: buildFinalNudgeHtml,
  },
]
