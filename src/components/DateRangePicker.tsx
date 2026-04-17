import { useEffect, useRef, useState } from "react";

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateRangePickerProps {
  range: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function buildMonth(viewDate: Date): (Date | null)[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function toInputDate(d: Date | undefined): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromInputDate(s: string): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

interface MonthGridProps {
  monthDate: Date;
  range: DateRange | undefined;
  today: Date;
  onDayClick: (day: Date) => void;
}

function MonthGrid({ monthDate, range, today, onDayClick }: MonthGridProps) {
  const cells = buildMonth(monthDate);
  return (
    <div className="flex-1 min-w-0">
      <div className="text-center text-[15px] font-semibold text-neutral-900 dark:text-neutral-100 mb-5">
        {MONTHS[monthDate.getMonth()]} {monthDate.getFullYear()}
      </div>
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((w, i) => (
          <div
            key={i}
            className="h-7 flex items-center justify-center text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="aspect-square" />;

          const isToday = sameDay(day, today);
          const isPast = day.getTime() < today.getTime() && !isToday;
          const isFrom = !!range?.from && sameDay(day, range.from);
          const isTo = !!range?.to && sameDay(day, range.to);
          const isSingleDay =
            !!range?.from && !!range?.to && sameDay(range.from, range.to);

          let isMiddle = false;
          if (range?.from && range?.to && !isSingleDay) {
            const t = day.getTime();
            isMiddle = t > range.from.getTime() && t < range.to.getTime();
          }

          const isSelected = isFrom || isTo;

          let stripClass = "";
          if (isMiddle) stripClass = "left-0 right-0";
          else if (isFrom && range?.to && !isSingleDay) stripClass = "left-1/2 right-0";
          else if (isTo && !isSingleDay) stripClass = "left-0 right-1/2";

          const textColor = isSelected
            ? "text-white dark:text-neutral-900"
            : isPast
              ? "text-neutral-300 dark:text-neutral-700"
              : "text-neutral-900 dark:text-neutral-100";

          const bgClass = isSelected
            ? "bg-neutral-900 dark:bg-white"
            : "hover:bg-neutral-100 dark:hover:bg-white/10";

          return (
            <div key={i} className="relative aspect-square p-0.5">
              {stripClass && (
                <div
                  className={`absolute inset-y-0.5 ${stripClass} bg-neutral-100 dark:bg-white/5`}
                />
              )}
              <button
                type="button"
                onClick={() => onDayClick(day)}
                className={`relative z-10 w-full h-full flex items-center justify-center text-[14px] font-medium rounded-full cursor-pointer transition-colors ${bgClass} ${textColor}`}
              >
                <span className="relative">
                  {day.getDate()}
                  {isToday && !isSelected && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neutral-900 dark:bg-white" />
                  )}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePicker({ range, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(() => range?.from ?? new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const label =
    range?.from && range?.to
      ? `${formatDate(range.from)} — ${formatDate(range.to)}`
      : range?.from
        ? `${formatDate(range.from)} — ?`
        : "Pick a date range";

  const today = startOfDay(new Date());

  function handleDayClick(day: Date) {
    const d = startOfDay(day);
    if (!range?.from || (range.from && range.to)) {
      onChange({ from: d, to: undefined });
      return;
    }
    if (d.getTime() < range.from.getTime()) {
      onChange({ from: d, to: range.from });
    } else {
      onChange({ from: range.from, to: d });
    }
  }

  const nativeInputClass =
    "w-full h-10 px-3 text-sm font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100/60 dark:bg-white/5 rounded-[10px] outline-none appearance-none transition-colors duration-150 focus:bg-neutral-100 dark:focus:bg-white/10 [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:invert";

  return (
    <div className="flex flex-col gap-2">
      {/* Mobile: two labeled native date inputs */}
      <div className="md:hidden grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            From
          </label>
          <input
            type="date"
            value={toInputDate(range?.from)}
            onChange={(e) =>
              onChange({ from: fromInputDate(e.target.value), to: range?.to })
            }
            className={nativeInputClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            To
          </label>
          <input
            type="date"
            value={toInputDate(range?.to)}
            onChange={(e) =>
              onChange({ from: range?.from, to: fromInputDate(e.target.value) })
            }
            className={nativeInputClass}
          />
        </div>
      </div>

      {/* Desktop: custom two-month calendar popover */}
      <label className="hidden md:block text-[11px] font-medium uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        Dates
      </label>
      <div ref={containerRef} className="hidden md:block relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full h-10 px-3 text-sm font-medium text-left text-neutral-900 dark:text-neutral-100 bg-neutral-100/60 dark:bg-white/5 rounded-[10px] outline-none hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer"
        >
          {label}
        </button>
        {open && (
          <div className="absolute z-20 top-full mt-2 left-1/2 -translate-x-1/2 w-[680px] rounded-[20px] bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-white/10 p-6 shadow-[0_16px_48px_rgba(0,0,0,0.14)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
            <button
              type="button"
              onClick={() => setViewDate(addMonths(viewDate, -1))}
              className="absolute left-4 top-[26px] w-8 h-8 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer"
              aria-label="Previous month"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3.5L5.5 8L10 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewDate(addMonths(viewDate, 1))}
              className="absolute right-4 top-[26px] w-8 h-8 flex items-center justify-center rounded-full text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer"
              aria-label="Next month"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 3.5L10.5 8L6 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="flex items-start gap-10 px-10">
              <MonthGrid
                monthDate={viewDate}
                range={range}
                today={today}
                onDayClick={handleDayClick}
              />
              <MonthGrid
                monthDate={addMonths(viewDate, 1)}
                range={range}
                today={today}
                onDayClick={handleDayClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
