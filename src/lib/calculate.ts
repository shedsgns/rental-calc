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
 * Used to round converted currency in favor of the renter — they always pay
 * the lowest representable amount in the target currency.
 */
export function floorToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.floor(value * factor) / factor;
}
