/** Category routes that should show bundle kit cards (same UI as landing / bundle kits page). */
export function isBundleKitsCategory(category: string): boolean {
  const c = category.trim().toLowerCase();
  return (
    c === 'bundle kits' ||
    c === 'bundle kit' ||
    c === 'bundles' ||
    c === 'recovery kits' ||
    c === 'kit bundles'
  );
}
