import { useState } from 'react';

import {
  monthOf,
  type CalendarMonth,
  type WeekStart,
} from '../calendar-month.js';
import { assertDateBounds } from '../date-only.js';
import { CalendarPanel } from './CalendarPanel.js';
import { LabeledControl } from './LabeledControl.js';

export type CalendarProps = {
  error?: string;
  hint?: string;
  label: string;
  /** BCP 47 tag for month, weekday, and day labels; device default when omitted. */
  locale?: string;
  max?: string;
  min?: string;
  nextMonthLabel: string;
  onChange: (value: string) => void;
  previousMonthLabel: string;
  /** Calendar date `YYYY-MM-DD`, or empty for no selection. */
  value: string;
  weekStartsOn?: WeekStart;
};

/**
 * The DateField month grid shown inline, always open, for a screen whose one
 * question is a date. It opens on the selected month (else today's), and a
 * pick keeps it open on that month.
 */
export function Calendar({
  error,
  hint,
  label,
  locale,
  max,
  min,
  nextMonthLabel,
  onChange,
  previousMonthLabel,
  value,
  weekStartsOn = 1,
}: CalendarProps) {
  assertDateBounds(value, min, max);
  const [browsedMonth, setBrowsedMonth] = useState<CalendarMonth | null>(null);

  return (
    <LabeledControl error={error} hint={hint} label={label}>
      <CalendarPanel
        locale={locale}
        max={max}
        min={min}
        month={browsedMonth ?? monthOf(value, new Date())}
        nextMonthLabel={nextMonthLabel}
        onMonthChange={setBrowsedMonth}
        onSelect={(next) => {
          setBrowsedMonth(null);
          onChange(next);
        }}
        previousMonthLabel={previousMonthLabel}
        value={value}
        weekStartsOn={weekStartsOn}
      />
    </LabeledControl>
  );
}
