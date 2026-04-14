import { CURRENCIES, CURRENCY_CODES, type CurrencyCode } from "../lib/currencies";

interface CurrencySelectProps {
  label: string;
  value: CurrencyCode;
  onChange: (value: CurrencyCode) => void;
  compact?: boolean;
}

export function CurrencySelect({
  label,
  value,
  onChange,
  compact = false,
}: CurrencySelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CurrencyCode)}
        className="w-full h-10 px-3 text-sm font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100/60 dark:bg-white/5 rounded-[10px] transition-colors duration-150 outline-none focus:bg-neutral-100 dark:focus:bg-white/10 cursor-pointer appearance-none"
      >
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code}>
            {compact ? code : `${code} — ${CURRENCIES[code].name}`}
          </option>
        ))}
      </select>
    </div>
  );
}
