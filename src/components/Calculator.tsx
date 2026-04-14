import { useState } from "react";
import { NumberInput } from "./NumberInput";
import { CurrencySelect } from "./CurrencySelect";
import { DayToggle } from "./DayToggle";
import { ResultDisplay } from "./ResultDisplay";
import { calculateTotal, convertAmount, floorToDecimals } from "../lib/calculate";
import { useExchangeRates } from "../hooks/useExchangeRates";
import { getFractionDigits, type CurrencyCode } from "../lib/currencies";

export function Calculator() {
  const [pricePerDay, setPricePerDay] = useState("");
  const [days, setDays] = useState("");
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>("USD");
  const [convertCurrency, setConvertCurrency] = useState<CurrencyCode>("AMD");
  const [includeLastDay, setIncludeLastDay] = useState(true);

  const { rates, loading, error } = useExchangeRates(baseCurrency);

  const priceNum = parseFloat(pricePerDay) || 0;
  const daysNum = parseInt(days) || 0;
  const total = calculateTotal(priceNum, daysNum, includeLastDay);

  const rate = rates[convertCurrency] ?? null;
  const convertedAmount =
    rate !== null
      ? floorToDecimals(convertAmount(total, rate), getFractionDigits(convertCurrency))
      : null;

  return (
    <div className="w-full max-w-md flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Rental calculator
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <NumberInput
            label="Price per day"
            value={pricePerDay}
            onChange={setPricePerDay}
            step="0.01"
          />
          <CurrencySelect
            label="Currency"
            value={baseCurrency}
            onChange={setBaseCurrency}
            compact
          />
        </div>

        <NumberInput
          label="Number of days"
          value={days}
          onChange={setDays}
        />

        <DayToggle includeLastDay={includeLastDay} onChange={setIncludeLastDay} />

        <CurrencySelect
          label="Convert to"
          value={convertCurrency}
          onChange={setConvertCurrency}
        />
      </div>

      <ResultDisplay
        total={total}
        baseCurrency={baseCurrency}
        convertCurrency={convertCurrency}
        convertedAmount={convertedAmount}
        rate={rate}
        loading={loading}
        error={error}
      />
    </div>
  );
}
