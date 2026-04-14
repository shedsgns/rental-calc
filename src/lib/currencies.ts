export const CURRENCIES = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  AMD: { code: "AMD", symbol: "֏", name: "Armenian Dram", locale: "hy-AM" },
  RUB: { code: "RUB", symbol: "₽", name: "Russian Ruble", locale: "ru-RU" },
  AED: { code: "AED", symbol: "AED", name: "UAE Dirham", locale: "ar-AE" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export function getFractionDigits(code: CurrencyCode): number {
  return code === "AMD" ? 0 : 2;
}

export function formatCurrency(amount: number, code: CurrencyCode): string {
  const decimals = getFractionDigits(code);
  return new Intl.NumberFormat(CURRENCIES[code].locale, {
    style: "currency",
    currency: code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}
