/**
 * Coarse shipping regions for PDP estimates (calendar days from order date).
 * Detection uses IANA timezone + browser locale; users can override via localStorage.
 */

export type ShippingRegionId =
  | 'us'
  | 'ca'
  | 'uk_eu'
  | 'au_nz'
  | 'asia'
  | 'latam'
  | 'other';

export const SHIPPING_REGION_STORAGE_KEY = 'aerotouch_shipping_region';

export const SHIPPING_REGION_LABELS: Record<ShippingRegionId, string> = {
  us: 'United States',
  ca: 'Canada',
  uk_eu: 'UK & Europe',
  au_nz: 'Australia & New Zealand',
  asia: 'Asia',
  latam: 'Latin America',
  other: 'Other regions'
};

/** Stable order for region pickers */
export const SHIPPING_REGION_ORDER: ShippingRegionId[] = [
  'us',
  'ca',
  'uk_eu',
  'au_nz',
  'asia',
  'latam',
  'other'
];

/** Shipped / delivered ranges are inclusive calendar-day offsets from today (order date). */
export const SHIPPING_DAY_RANGES: Record<
  ShippingRegionId,
  { shipped: [number, number]; delivered: [number, number] }
> = {
  us: { shipped: [3, 4], delivered: [8, 14] },
  ca: { shipped: [3, 5], delivered: [10, 17] },
  uk_eu: { shipped: [4, 6], delivered: [12, 20] },
  au_nz: { shipped: [5, 7], delivered: [15, 23] },
  asia: { shipped: [5, 7], delivered: [14, 22] },
  latam: { shipped: [5, 8], delivered: [16, 24] },
  other: { shipped: [5, 8], delivered: [18, 28] }
};

const CANADA_TIMEZONES = new Set([
  'America/Toronto',
  'America/Vancouver',
  'America/Winnipeg',
  'America/Edmonton',
  'America/Halifax',
  'America/St_Johns',
  'America/Regina',
  'America/Moncton',
  'America/Thunder_Bay',
  'America/Rainy_River',
  'America/Atikokan',
  'America/Blanc-Sablon',
  'America/Creston',
  'America/Dawson',
  'America/Dawson_Creek',
  'America/Fort_Nelson',
  'America/Glace_Bay',
  'America/Goose_Bay',
  'America/Inuvik',
  'America/Iqaluit',
  'America/Rankin_Inlet',
  'America/Resolute',
  'America/Swift_Current',
  'America/Yellowknife',
  'America/Whitehorse',
  'America/Nipigon'
]);

const LATAM_TIMEZONE_PREFIXES = [
  'America/Mexico',
  'America/Cancun',
  'America/Merida',
  'America/Monterrey',
  'America/Mazatlan',
  'America/Chihuahua',
  'America/Hermosillo',
  'America/Tijuana',
  'America/Bogota',
  'America/Lima',
  'America/La_Paz',
  'America/Havana',
  'America/Jamaica',
  'America/Panama',
  'America/Guatemala',
  'America/El_Salvador',
  'America/Managua',
  'America/Costa_Rica',
  'America/Tegucigalpa',
  'America/Guayaquil',
  'America/Caracas',
  'America/Cuiaba',
  'America/Campo_Grande',
  'America/Belem',
  'America/Fortaleza',
  'America/Recife',
  'America/Araguaina',
  'America/Maceio',
  'America/Bahia',
  'America/Sao_Paulo',
  'America/Rio_Branco',
  'America/Porto_Velho',
  'America/Boa_Vista',
  'America/Manaus',
  'America/Eirunepe',
  'America/Santarem',
  'America/Argentina',
  'America/Asuncion',
  'America/Montevideo',
  'America/Santiago',
  'America/Punta_Arenas'
];

function regionFromTimeZone(timeZone: string): ShippingRegionId {
  if (CANADA_TIMEZONES.has(timeZone)) return 'ca';

  if (timeZone.startsWith('Europe/') || timeZone === 'Arctic/Longyearbyen') {
    return 'uk_eu';
  }

  if (timeZone.startsWith('Africa/')) return 'other';

  if (
    timeZone.startsWith('Australia/') ||
    timeZone === 'Pacific/Auckland' ||
    timeZone === 'Pacific/Chatham'
  ) {
    return 'au_nz';
  }

  if (timeZone.startsWith('Asia/')) return 'asia';

  if (timeZone.startsWith('Pacific/')) {
    if (
      timeZone === 'Pacific/Honolulu' ||
      timeZone === 'Pacific/Midway' ||
      timeZone === 'Pacific/Guam' ||
      timeZone === 'Pacific/Saipan'
    ) {
      return timeZone === 'Pacific/Honolulu' ? 'us' : 'asia';
    }
    return 'other';
  }

  if (timeZone.startsWith('America/')) {
    if (LATAM_TIMEZONE_PREFIXES.some((p) => timeZone.startsWith(p))) {
      return 'latam';
    }
    return 'us';
  }

  if (timeZone.startsWith('Atlantic/')) return 'uk_eu';

  return 'other';
}

function regionFromLocale(locale: string): ShippingRegionId | null {
  const lower = locale.toLowerCase();
  const region = lower.split('-')[1]?.toUpperCase();
  if (!region) return null;

  if (region === 'US') return 'us';
  if (region === 'CA') return 'ca';
  if (
    [
      'GB',
      'IE',
      'FR',
      'DE',
      'IT',
      'ES',
      'PT',
      'NL',
      'BE',
      'AT',
      'CH',
      'SE',
      'NO',
      'DK',
      'FI',
      'PL',
      'CZ',
      'GR',
      'RO',
      'HU'
    ].includes(region)
  ) {
    return 'uk_eu';
  }
  if (region === 'AU' || region === 'NZ') return 'au_nz';
  if (
    [
      'JP',
      'KR',
      'CN',
      'TW',
      'HK',
      'SG',
      'MY',
      'TH',
      'VN',
      'IN',
      'ID',
      'PH'
    ].includes(region)
  ) {
    return 'asia';
  }
  if (
    ['MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'CR', 'PA', 'EC', 'UY'].includes(region)
  ) {
    return 'latam';
  }

  return null;
}

export function detectShippingRegion(): ShippingRegionId {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone) {
      return regionFromTimeZone(timeZone);
    }
  } catch {
    /* ignore */
  }

  if (typeof navigator !== 'undefined' && navigator.language) {
    const fromLocale = regionFromLocale(navigator.language);
    if (fromLocale) return fromLocale;
    const langs = navigator.languages || [];
    for (const lang of langs) {
      const r = regionFromLocale(lang);
      if (r) return r;
    }
  }

  return 'us';
}

export function isShippingRegionId(value: string): value is ShippingRegionId {
  return Object.prototype.hasOwnProperty.call(SHIPPING_DAY_RANGES, value);
}

export function readShippingRegionOverride(): ShippingRegionId | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SHIPPING_REGION_STORAGE_KEY);
    if (raw && isShippingRegionId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeShippingRegionOverride(region: ShippingRegionId | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (region === null) localStorage.removeItem(SHIPPING_REGION_STORAGE_KEY);
    else localStorage.setItem(SHIPPING_REGION_STORAGE_KEY, region);
  } catch {
    /* ignore */
  }
}

export function getEffectiveShippingRegion(override: ShippingRegionId | null): ShippingRegionId {
  return override ?? detectShippingRegion();
}
