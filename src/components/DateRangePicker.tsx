import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";

interface DateRangePickerProps {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DateRangePicker({ range, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const label =
    range?.from && range?.to
      ? `${formatDate(range.from)} — ${formatDate(range.to)}`
      : range?.from
        ? `${formatDate(range.from)} — ?`
        : "Pick a date range";

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        Dates
      </label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full h-10 px-3 text-sm font-medium text-left text-neutral-900 dark:text-neutral-100 bg-neutral-100/60 dark:bg-white/5 rounded-[10px] outline-none hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer"
      >
        {label}
      </button>

      {open && (
        <div className="rounded-[12px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 p-2 shadow-sm">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={onChange}
            numberOfMonths={1}
            showOutsideDays
            classNames={{
              root: "text-sm font-medium text-neutral-900 dark:text-neutral-100",
              caption_label: "text-sm font-semibold",
              nav_button: "cursor-pointer",
              day: "rounded-[8px]",
              day_selected: "bg-gradient-to-r from-pink-500 to-rose-400 text-white",
              day_range_middle: "bg-pink-100 dark:bg-pink-500/20 text-neutral-900 dark:text-neutral-100",
            }}
          />
        </div>
      )}
    </div>
  );
}
