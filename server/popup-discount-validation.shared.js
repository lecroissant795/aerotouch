/** Shared validation for popup discount signup (server + dev middleware). */

export function normalizeEmail(email) {
  return String(email || '')
    .trim()
    .toLowerCase()
}

export function isValidEmailFormat(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function sanitizeFirstName(name) {
  return String(name || '')
    .trim()
    .replace(/[^a-zA-Z\s'-]/g, '')
    .slice(0, 50)
}
