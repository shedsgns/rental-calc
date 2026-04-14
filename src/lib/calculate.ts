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
