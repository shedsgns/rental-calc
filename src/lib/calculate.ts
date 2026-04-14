export function effectiveDays(
  days: number,
  includeFirstDay: boolean,
  includeLastDay: boolean,
): number {
  let result = days;
  if (!includeFirstDay) result -= 1;
  if (!includeLastDay) result -= 1;
  return Math.max(result, 0);
}

export function calculateTotal(
  pricePerDay: number,
  days: number,
  includeFirstDay: boolean,
  includeLastDay: boolean,
): number {
  return pricePerDay * effectiveDays(days, includeFirstDay, includeLastDay);
}

/**
 * Inclusive day count between two dates (ignoring time).
 * daysBetween(Jan 1, Jan 1) = 1, daysBetween(Jan 1, Jan 7) = 7.
 */
export function daysBetween(start: Date, end: Date): number {
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endUTC = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  const diff = Math.round((endUTC - startUTC) / (1000 * 60 * 60 * 24));
  return Math.max(diff + 1, 0);
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
