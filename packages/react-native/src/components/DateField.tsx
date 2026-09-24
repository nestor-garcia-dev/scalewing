import { useState } from 'react';

import { useExclusiveDisclosure } from '../theme/DisclosureGroup.js';
import { formatDateLabel } from '../calendar-labels.js';
import {
  monthOf,
  type CalendarMonth,
  type WeekStart,
} from '../calendar-month.js';
import { assertDateBounds, isOutsideDateRange } from '../date-only.js';
import { CalendarPanel } from './CalendarPanel.js';
import { DisclosureControl } from './DisclosureControl.js';
import { LabeledControl } from './LabeledControl.js';

export type DateFieldProps = {
  disabled?: boolean;
  error?: string;
  hint?: string;
  label: string;
  /** BCP 47 tag for month, weekday, and value labels; device default when omitted. */
  locale?: string;
  max?: string;
  min?: string;
  nextMonthLabel: string;
  onChange: (value: string) => void;
  placeholder: string;
  previousMonthLabel: string;
  /** Calendar date `YYYY-MM-DD`, or empty for no selection. */
  value: string;
  weekStartsOn?: WeekStart;
};

export function DateField({
  disabled = false,
  error,
  hint,
  label,
  locale,
  max,
  min,
  nextMonthLabel,
  onChange,
  placeholder,
  previousMonthLabel,
  value,
  weekStartsOn = 1,
}: DateFieldProps) {
  assertDateBounds(value, min, max);

  const [open, setOpen] = useExclusiveDisclosure();
  const [browsedMonth, setBrowsedMonth] = useState<CalendarMonth | null>(null);
  const visibleMonth = open
    ? (browsedMonth ?? monthOf(value, new Date()))
    : null;
  const invalid = Boolean(error) || isOutsideDateRange(value, min, max);

  return (
    <LabeledControl error={error} hint={hint} label={label}>
      <DisclosureControl
        accessibilityHint={error ?? hint}
        disabled={disabled}
        expanded={open}
        invalid={invalid}
        label={label}
        onPress={() => {
          setBrowsedMonth(null);
          setOpen(!open);
        }}
        placeholder={placeholder}
        valueText={formatDateLabel(value, locale, 'medium')}
      />
      {visibleMonth ? (
        <CalendarPanel
          locale={locale}
          max={max}
          min={min}
          month={visibleMonth}
          nextMonthLabel={nextMonthLabel}
          onMonthChange={setBrowsedMonth}
          onSelect={(next) => {
            setOpen(false);
            onChange(next);
          }}
          previousMonthLabel={previousMonthLabel}
          value={value}
          weekStartsOn={weekStartsOn}
        />
      ) : null}
    </LabeledControl>
  );
}
