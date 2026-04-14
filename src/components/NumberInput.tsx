interface NumberInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  step?: string;
}

export function NumberInput({
  label,
  value,
  onChange,
  placeholder = "0",
  step,
}: NumberInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {label}
      </label>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        step={step}
        className="w-full h-10 px-3 text-sm font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100/60 dark:bg-white/5 rounded-[10px] transition-colors duration-150 outline-none focus:bg-neutral-100 dark:focus:bg-white/10 placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
      />
    </div>
  );
}
