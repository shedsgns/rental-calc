export function calculateTotal(
  pricePerDay: number,
  days: number,
  includeLastDay: boolean,
): number {
  const effectiveDays = includeLastDay ? days : Math.max(days - 1, 0);
  return pricePerDay * effectiveDays;
}

export function convertAmount(amount: number, rate: number): number {
  return amount * rate;
}

/**
 * Floor a value to the given number of decimals.
 */
export function floorToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}

/**
 * Round a value down to a "nice" number by keeping 3 significant digits and
 * flooring the rest. Always rounds in favor of the renter.
 *
 *   262,802.72 → 262,000
 *    62,993.70 →  62,900
 *     6,993.12 →   6,990
 *       699.93 →     699
 */
export function roundDownNice(value: number): number {
  if (value <= 0) return Math.floor(value);
  const magnitude = Math.floor(Math.log10(value));
  const divisor = Math.pow(10, Math.max(magnitude - 2, 0));
  return Math.floor(value / divisor) * divisor;
}
