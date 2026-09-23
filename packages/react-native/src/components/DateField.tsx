import { useState } from 'react';

import { useExclusiveDisclosure } from '../theme/DisclosureGroup.js';
import { Pressable, View } from 'react-native';

import {
  formatDateLabel,
  monthTitle,
  weekdayLabels,
} from '../calendar-labels.js';
import {
  monthGrid,
  monthOf,
  shiftMonth,
  type CalendarMonth,
  type WeekStart,
} from '../calendar-month.js';
import { assertDateOnly, isOutsideDateRange } from '../date-only.js';
import {
  calendarDayColor,
  mapCalendarDayStyle,
  mapCalendarNavStyle,
  mapCalendarPanelStyle,
} from '../map-calendar-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { DisclosureControl } from './DisclosureControl.js';
import { Inline } from './Inline.js';
import { LabeledControl } from './LabeledControl.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

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
  assertDateOnly('value', value, true);
  if (min !== undefined) assertDateOnly('min', min);
  if (max !== undefined) assertDateOnly('max', max);
  if (min !== undefined && max !== undefined && min > max)
    throw new RangeError('min must not be after max');

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

type CalendarPanelProps = {
  locale: string | undefined;
  max: string | undefined;
  min: string | undefined;
  month: CalendarMonth;
  nextMonthLabel: string;
  onMonthChange: (month: CalendarMonth) => void;
  onSelect: (value: string) => void;
  previousMonthLabel: string;
  value: string;
  weekStartsOn: WeekStart;
};

function CalendarPanel({
  locale,
  max,
  min,
  month,
  nextMonthLabel,
  onMonthChange,
  onSelect,
  previousMonthLabel,
  value,
  weekStartsOn,
}: CalendarPanelProps) {
  const theme = useTheme();
  const navStyle = mapCalendarNavStyle(theme);

  return (
    <Stack gap={1} style={mapCalendarPanelStyle(theme)}>
      <Inline justify="between">
        <Pressable
          accessibilityLabel={previousMonthLabel}
          accessibilityRole="button"
          onPress={() => onMonthChange(shiftMonth(month, -1))}
          style={navStyle}
        >
          <Text variant="title">‹</Text>
        </Pressable>
        <Text accessibilityRole="header" variant="label">
          {monthTitle(month, locale)}
        </Text>
        <Pressable
          accessibilityLabel={nextMonthLabel}
          accessibilityRole="button"
          onPress={() => onMonthChange(shiftMonth(month, 1))}
          style={navStyle}
        >
          <Text variant="title">›</Text>
        </Pressable>
      </Inline>
      <Inline>
        {weekdayLabels(locale, weekStartsOn).map((weekday, index) => (
          <View key={index} style={{ alignItems: 'center', flex: 1 }}>
            <Text color="muted" variant="caption">
              {weekday}
            </Text>
          </View>
        ))}
      </Inline>
      {monthGrid(month, weekStartsOn).map((row, rowIndex) => (
        <Inline key={rowIndex}>
          {row.map((cell) => {
            const state = {
              disabled: isOutsideDateRange(cell.value, min, max),
              inMonth: cell.inMonth,
              selected: cell.value === value,
            };
            return (
              <Pressable
                accessibilityLabel={formatDateLabel(cell.value, locale, 'full')}
                accessibilityRole="button"
                accessibilityState={{
                  disabled: state.disabled,
                  selected: state.selected,
                }}
                disabled={state.disabled}
                key={cell.value}
                onPress={() => onSelect(cell.value)}
                style={mapCalendarDayStyle(theme, state)}
              >
                <Text color={calendarDayColor(state)} variant="label">
                  {String(cell.day)}
                </Text>
              </Pressable>
            );
          })}
        </Inline>
      ))}
    </Stack>
  );
}
