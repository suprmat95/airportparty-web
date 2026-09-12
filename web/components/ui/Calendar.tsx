'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  WEEKDAY_HEADER,
  dayChipLabel,
  localDate,
  maxBookingDate,
  monthGrid,
  monthTitle,
  splitIso,
} from '@/lib/dates';

type Props = {
  /** Selected day, ISO `YYYY-MM-DD`. */
  value: string;
  onChange: (iso: string) => void;
  /** First selectable day; also anchors the booking horizon. */
  today: string;
  className?: string;
};

/**
 * Month-grid day picker bounded to [today, today + BOOKING_HORIZON_DAYS].
 * Shared by the home picker and the airport-page selector so both offer the
 * same range and the same look.
 */
export function Calendar({ value, onChange, today, className }: Props) {
  const max = maxBookingDate(today);
  const [view, setView] = useState(() => {
    const { year, monthIndex } = splitIso(value);
    return { year, monthIndex };
  });

  // Follow the selection when the parent changes it (e.g. sheet reopened on a new day).
  useEffect(() => {
    const { year, monthIndex } = splitIso(value);
    setView({ year, monthIndex });
  }, [value]);

  const minView = splitIso(today);
  const maxView = splitIso(max);
  const canPrev =
    view.year > minView.year ||
    (view.year === minView.year && view.monthIndex > minView.monthIndex);
  const canNext =
    view.year < maxView.year ||
    (view.year === maxView.year && view.monthIndex < maxView.monthIndex);

  function shift(delta: number) {
    setView((v) => {
      const d = new Date(Date.UTC(v.year, v.monthIndex + delta, 1));
      return { year: d.getUTCFullYear(), monthIndex: d.getUTCMonth() };
    });
  }

  const cells = monthGrid(view.year, view.monthIndex);

  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Mese precedente"
          disabled={!canPrev}
          onClick={() => shift(-1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line text-ink-soft transition hover:bg-card-alt disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <div
          aria-live="polite"
          className="text-[14px] font-semibold capitalize text-ink"
        >
          {monthTitle(view.year, view.monthIndex)}
        </div>
        <button
          type="button"
          aria-label="Mese successivo"
          disabled={!canNext}
          onClick={() => shift(1)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line text-ink-soft transition hover:bg-card-alt disabled:opacity-30 disabled:pointer-events-none"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center">
        {WEEKDAY_HEADER.map((w, i) => (
          <div
            key={i}
            aria-hidden
            className="text-[10px] font-semibold uppercase tracking-[1px] text-ink-muted"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((iso, i) => {
          if (!iso) return <div key={`pad-${i}`} aria-hidden />;
          const disabled = iso < today || iso > max;
          const selected = iso === value;
          const chip = dayChipLabel(iso, today);
          const d = localDate(iso);
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-label={d.toLocaleDateString('it-IT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              onClick={() => onChange(iso)}
              className={cn(
                'relative flex h-10 w-full items-center justify-center rounded-sm text-[14px] font-medium transition',
                selected
                  ? 'bg-primary text-white'
                  : disabled
                    ? 'text-ink-muted/60'
                    : 'text-ink hover:bg-card-alt',
                !selected && chip === 'oggi' && 'font-semibold text-primary'
              )}
            >
              {d.getDate()}
              {chip === 'oggi' && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute bottom-1 h-1 w-1 rounded-pill',
                    selected ? 'bg-white' : 'bg-primary'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
