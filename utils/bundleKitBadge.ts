/** Leading emoji per bundle kit badge copy (cards + kit detail). */
const BUNDLE_KIT_BADGE_EMOJI: Record<string, string> = {
  'Best For Rehab': '🩹',
  'Top Rated': '⭐',
  'Doctor Choice': '🩺',
  'Ultimate Value': '💎',
};

/** Badge string with emoji when the label matches curated kit copy. */
export function bundleKitBadgeLabel(badge: string): string {
  const emoji = BUNDLE_KIT_BADGE_EMOJI[badge];
  return emoji ? `${emoji} ${badge}` : badge;
}
