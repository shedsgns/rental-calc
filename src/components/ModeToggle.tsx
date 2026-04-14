export type DurationMode = "days" | "dates";

interface ModeToggleProps {
  mode: DurationMode;
  onChange: (mode: DurationMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        Duration
      </span>
      <div className="relative grid grid-cols-2 h-10 p-0.5 rounded-[10px] bg-neutral-100/60 dark:bg-white/5">
        <div
          className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-[8px] bg-white dark:bg-white/10 shadow-sm ${
            mode === "dates" ? "translate-x-full" : "translate-x-0"
          }`}
          style={{ transition: "transform 150ms ease-out" }}
        />
        <button
          type="button"
          onClick={() => onChange("days")}
          className={`relative z-10 text-sm font-medium cursor-pointer ${
            mode === "days"
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-400 dark:text-neutral-500"
          }`}
        >
          Days
        </button>
        <button
          type="button"
          onClick={() => onChange("dates")}
          className={`relative z-10 text-sm font-medium cursor-pointer ${
            mode === "dates"
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-400 dark:text-neutral-500"
          }`}
        >
          Dates
        </button>
      </div>
    </div>
  );
}
