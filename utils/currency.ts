export const SUPPORTED_CURRENCIES = ['USD', 'CAD', 'GBP', 'EUR', 'AUD', 'NZD'] as const;

export type SupportedCurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export interface CurrencyMarket {
  code: SupportedCurrencyCode;
  countryCode: string;
  locale: string;
  label: string;
}

export const DEFAULT_CURRENCY: SupportedCurrencyCode = 'USD';
export const CURRENCY_STORAGE_KEY = 'aerotouch_currency';

export const CURRENCY_MARKETS: Record<SupportedCurrencyCode, CurrencyMarket> = {
  USD: { code: 'USD', countryCode: 'US', locale: 'en-US', label: 'USD $' },
  CAD: { code: 'CAD', countryCode: 'CA', locale: 'en-CA', label: 'CAD $' },
  GBP: { code: 'GBP', countryCode: 'GB', locale: 'en-GB', label: 'GBP £' },
  EUR: { code: 'EUR', countryCode: 'DE', locale: 'de-DE', label: 'EUR €' },
  AUD: { code: 'AUD', countryCode: 'AU', locale: 'en-AU', label: 'AUD $' },
  NZD: { code: 'NZD', countryCode: 'NZ', locale: 'en-NZ', label: 'NZD $' },
};

const EUROPEAN_EUR_REGIONS = new Set([
  'AT',
  'BE',
  'CY',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PT',
  'SK',
  'SI',
  'ES',
]);

export function isSupportedCurrency(value: unknown): value is SupportedCurrencyCode {
  return typeof value === 'string' && SUPPORTED_CURRENCIES.includes(value as SupportedCurrencyCode);
}

function currencyFromRegion(region: string | undefined): SupportedCurrencyCode | null {
  if (!region) return null;
  const normalized = region.toUpperCase();
  if (normalized === 'US') return 'USD';
  if (normalized === 'CA') return 'CAD';
  if (normalized === 'GB') return 'GBP';
  if (normalized === 'AU') return 'AUD';
  if (normalized === 'NZ') return 'NZD';
  if (EUROPEAN_EUR_REGIONS.has(normalized)) return 'EUR';
  return null;
}

function regionFromLocale(locale: string): string | undefined {
  try {
    const localeParts = new Intl.Locale(locale);
    return localeParts.region;
  } catch {
    const match = locale.match(/[-_]([A-Za-z]{2}|\d{3})\b/);
    return match?.[1];
  }
}

function currencyFromTimeZone(timeZone: string | undefined): SupportedCurrencyCode | null {
  if (!timeZone) return null;
  if (timeZone === 'Pacific/Auckland' || timeZone === 'Pacific/Chatham') return 'NZD';
  if (timeZone.startsWith('Australia/')) return 'AUD';
  if (
    timeZone.startsWith('America/Toronto') ||
    timeZone.startsWith('America/Vancouver') ||
    timeZone.startsWith('America/Winnipeg') ||
    timeZone.startsWith('America/Edmonton') ||
    timeZone.startsWith('America/Halifax') ||
    timeZone.startsWith('America/St_Johns') ||
    timeZone.startsWith('America/Regina')
  ) {
    return 'CAD';
  }
  if (timeZone === 'Europe/London' || timeZone === 'Europe/Jersey' || timeZone === 'Europe/Guernsey') {
    return 'GBP';
  }
  if (timeZone.startsWith('Europe/')) return 'EUR';
  return null;
}

export function detectCurrency(): SupportedCurrencyCode {
  if (typeof navigator !== 'undefined') {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language].filter(Boolean);
    for (const language of languages) {
      const detected = currencyFromRegion(regionFromLocale(language));
      if (detected) return detected;
    }
  }

  try {
    const detected = currencyFromTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    if (detected) return detected;
  } catch {
    /* Browser detection is best-effort only. */
  }

  return DEFAULT_CURRENCY;
}

export function readStoredCurrency(): SupportedCurrencyCode | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    return isSupportedCurrency(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function writeStoredCurrency(currency: SupportedCurrencyCode): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  } catch {
    /* ignore storage failures */
  }
}

export function resolveCurrency(value: unknown): SupportedCurrencyCode {
  return isSupportedCurrency(value) ? value : DEFAULT_CURRENCY;
}

/** 3-letter ISO code for Intl, or USD if unusable. */
export function normalizeIsoCurrencyCode(value: unknown): string {
  if (typeof value !== 'string') return DEFAULT_CURRENCY;
  const t = value.trim().toUpperCase();
  if (t.length === 3 && /^[A-Z]{3}$/.test(t)) return t;
  return DEFAULT_CURRENCY;
}

export function formatCurrencyAmount(
  amount: number,
  currencyInput: unknown = DEFAULT_CURRENCY,
  localeOverride?: string
): string {
  const currency = normalizeIsoCurrencyCode(currencyInput);
  const locale =
    localeOverride ??
    (isSupportedCurrency(currency) ? CURRENCY_MARKETS[currency].locale : 'en-US');

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);
  } catch {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: DEFAULT_CURRENCY,
    }).format(amount);
  }
}

export function getCheckoutStorageKey(currency: SupportedCurrencyCode): string {
  return `shopify_checkout_id_${currency.toLowerCase()}`;
}
