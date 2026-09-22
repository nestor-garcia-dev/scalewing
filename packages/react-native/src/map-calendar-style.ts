import { type SemanticColorKey, type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export type CalendarDayState = {
  disabled: boolean;
  inMonth: boolean;
  selected: boolean;
};

export function mapCalendarDayStyle(
  theme: Theme,
  state: CalendarDayState,
): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: state.selected ? theme.colors.accent : 'transparent',
    borderRadius: theme.radius.pill,
    flex: 1,
    justifyContent: 'center',
    minHeight: theme.control.md.minHeight,
    opacity: state.disabled ? theme.disabledOpacity : 1,
  };
}

export function calendarDayColor(state: CalendarDayState): SemanticColorKey {
  if (state.selected) return 'onAccent';
  return state.inMonth ? 'text' : 'muted';
}

/** Month navigation buttons share the day cell footprint. */
export function mapCalendarNavStyle(theme: Theme): ViewStyle {
  return {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: theme.control.md.minHeight,
    minWidth: theme.control.md.minHeight,
  };
}

export function mapCalendarPanelStyle(theme: Theme): ViewStyle {
  return {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    padding: theme.space[2],
  };
}
