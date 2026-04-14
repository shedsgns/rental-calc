interface DayToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function DayToggle({ label, value, onChange }: DayToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative w-10 h-6 rounded-full cursor-pointer shrink-0 ml-4 ${
          value
            ? "bg-gradient-to-r from-pink-500 to-rose-400"
            : "bg-neutral-200 dark:bg-neutral-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm ${
            value ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
