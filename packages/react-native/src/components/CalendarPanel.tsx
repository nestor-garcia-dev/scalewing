import { Pressable, View } from 'react-native';

import {
  formatDateLabel,
  monthTitle,
  weekdayLabels,
} from '../calendar-labels.js';
import {
  monthGrid,
  shiftMonth,
  type CalendarMonth,
  type WeekStart,
} from '../calendar-month.js';
import { isOutsideDateRange } from '../date-only.js';
import {
  calendarDayColor,
  mapCalendarDayStyle,
  mapCalendarNavStyle,
  mapCalendarPanelStyle,
} from '../map-calendar-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Inline } from './Inline.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type CalendarPanelProps = {
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

/** Private month grid shared by DateField and the inline Calendar. */
export function CalendarPanel({
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
