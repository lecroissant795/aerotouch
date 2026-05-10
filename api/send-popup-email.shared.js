function sanitizeName(name) {
  return String(name || '')
    .trim()
    .replace(/[^a-zA-Z\s'-]/g, '')
    .slice(0, 50)
}

function sanitizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function buildHtml({ firstName, discountCode }) {
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:600px;margin:0 auto;padding:16px;">
      <h2 style="margin:0 0 12px 0;">Hey ${firstName}, your AeroTouch discount is ready.</h2>
      <p style="margin:0 0 12px 0;">Thanks for signing up. Here is your personal code:</p>
      <div style="margin:16px 0;padding:14px 16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;display:inline-block;">
        <span style="font-size:24px;font-weight:700;letter-spacing:1px;color:#ea580c;">${discountCode}</span>
      </div>
      <p style="margin:12px 0 0 0;">Use it at checkout on your next order.</p>
      <p style="margin:20px 0 0 0;font-size:12px;color:#64748b;">If you did not request this, you can ignore this email.</p>
    </div>
  `
}

export async function sendPopupEmail({ firstName, email, discountCode, resendApiKey, fromEmail }) {
  const safeFirstName = sanitizeName(firstName)
  const safeEmail = sanitizeEmail(email)
  const safeCode = String(discountCode || '')
    .trim()
    .toUpperCase()
    .slice(0, 32)

  if (!safeFirstName || !safeEmail || !safeCode) {
    return { ok: false, status: 400, error: 'firstName, email and discountCode are required.' }
  }
  if (!isValidEmail(safeEmail)) {
    return { ok: false, status: 400, error: 'Invalid email address.' }
  }
  if (!resendApiKey) {
    return { ok: false, status: 500, error: 'Email service is not configured yet.' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [safeEmail],
        subject: `Your AeroTouch discount code: ${safeCode}`,
        html: buildHtml({ firstName: safeFirstName, discountCode: safeCode }),
      }),
    })

    let data = {}
    try {
      data = await response.json()
    } catch {
      data = {}
    }

    if (!response.ok) {
      const resendMessage =
        typeof data?.message === 'string' && data.message.trim()
          ? data.message
          : 'Failed to send discount email.'
      return { ok: false, status: 502, error: resendMessage }
    }

    return { ok: true, status: 200, id: data.id || null }
  } catch (error) {
    console.error('sendPopupEmail provider error:', error)
    return { ok: false, status: 500, error: 'Could not connect to email provider.' }
  }
}
