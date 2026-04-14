import { formatCurrency, type CurrencyCode } from "../lib/currencies";

interface ResultDisplayProps {
  total: number;
  baseCurrency: CurrencyCode;
  convertCurrency: CurrencyCode;
  convertedAmount: number | null;
  rate: number | null;
  loading: boolean;
  error: string | null;
}

export function ResultDisplay({
  total,
  baseCurrency,
  convertCurrency,
  convertedAmount,
  rate,
  loading,
  error,
}: ResultDisplayProps) {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
          Total
        </span>
        <span className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
          {formatCurrency(total, baseCurrency)}
        </span>
      </div>

      {baseCurrency !== convertCurrency && (
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            {convertCurrency}
          </span>
          {loading ? (
            <span className="text-lg font-medium text-neutral-400 dark:text-neutral-500">
              —
            </span>
          ) : error ? (
            <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500">
              {error}
            </span>
          ) : convertedAmount !== null ? (
            <>
              <span className="text-lg font-semibold text-neutral-700 dark:text-neutral-300 tabular-nums">
                {formatCurrency(convertedAmount, convertCurrency)}
              </span>
              {rate !== null && (
                <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 tabular-nums">
                  1 {baseCurrency} = {rate.toFixed(convertCurrency === "AMD" ? 2 : 4)} {convertCurrency}
                </span>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
