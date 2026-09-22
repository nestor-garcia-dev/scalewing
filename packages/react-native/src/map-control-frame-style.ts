import { type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export type ControlFrameState = {
  disabled: boolean;
  focused: boolean;
  invalid: boolean;
};

/** The bordered surface shared by Field and the disclosure-style inputs. */
export function mapControlFrameStyle(
  theme: Theme,
  state: ControlFrameState,
): ViewStyle {
  return {
    backgroundColor: theme.colors.surface,
    borderColor: state.invalid
      ? theme.colors.danger
      : state.focused
        ? theme.colors.accent
        : theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    minHeight: theme.control.md.minHeight,
    opacity: state.disabled ? theme.disabledOpacity : 1,
    paddingHorizontal: theme.control.md.paddingInline,
  };
}

/** A pressable frame centers its single line of text like Field does. */
export function mapDisclosureControlStyle(
  theme: Theme,
  state: ControlFrameState,
): ViewStyle {
  return {
    ...mapControlFrameStyle(theme, state),
    justifyContent: 'center',
    paddingVertical: theme.space[2],
  };
}
