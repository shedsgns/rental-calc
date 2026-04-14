import { useState } from "react";
import { NumberInput } from "./NumberInput";
import { CurrencySelect } from "./CurrencySelect";
import { DayToggle } from "./DayToggle";
import { ModeToggle, type DurationMode } from "./ModeToggle";
import { DateRangePicker, type DateRange } from "./DateRangePicker";
import { ResultDisplay } from "./ResultDisplay";
import {
  calculateTotal,
  convertAmount,
  daysBetween,
  roundDownNice,
} from "../lib/calculate";
import { useExchangeRates } from "../hooks/useExchangeRates";
import type { CurrencyCode } from "../lib/currencies";

export function Calculator() {
  const [pricePerDay, setPricePerDay] = useState("");
  const [days, setDays] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [mode, setMode] = useState<DurationMode>("days");
  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>("USD");
  const [convertCurrency, setConvertCurrency] = useState<CurrencyCode>("AMD");
  const [includeFirstDay, setIncludeFirstDay] = useState(true);
  const [includeLastDay, setIncludeLastDay] = useState(true);

  const { rates, loading, error } = useExchangeRates(baseCurrency);

  const priceNum = parseFloat(pricePerDay) || 0;
  const daysNum =
    mode === "days"
      ? parseInt(days) || 0
      : dateRange?.from && dateRange?.to
        ? daysBetween(dateRange.from, dateRange.to)
        : 0;

  const total = calculateTotal(priceNum, daysNum, includeFirstDay, includeLastDay);

  const rate = rates[convertCurrency] ?? null;
  const convertedAmount =
    rate !== null ? roundDownNice(convertAmount(total, rate)) : null;

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

        <ModeToggle mode={mode} onChange={setMode} />

        {mode === "days" ? (
          <NumberInput
            label="Number of days"
            value={days}
            onChange={setDays}
          />
        ) : (
          <DateRangePicker range={dateRange} onChange={setDateRange} />
        )}

        <div className="flex flex-col gap-3">
          <DayToggle
            label="Include first day"
            value={includeFirstDay}
            onChange={setIncludeFirstDay}
          />
          <DayToggle
            label="Include last day"
            value={includeLastDay}
            onChange={setIncludeLastDay}
          />
        </div>

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
