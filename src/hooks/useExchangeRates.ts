import { useEffect, useState } from "react";
import type { CurrencyCode } from "../lib/currencies";

interface RatesResponse {
  result: string;
  rates: Record<string, number>;
}

interface CacheEntry {
  rates: Record<string, number>;
  timestamp: number;
}

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, CacheEntry>();

export function useExchangeRates(base: CurrencyCode) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = cache.get(base);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setRates(cached.rates);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`https://open.er-api.com/v6/latest/${base}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: RatesResponse) => {
        if (data.result !== "success") {
          throw new Error("Could not fetch exchange rates");
        }
        cache.set(base, { rates: data.rates, timestamp: Date.now() });
        setRates(data.rates);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError("Could not fetch exchange rates. Check your connection.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [base]);

  return { rates, loading, error };
}
