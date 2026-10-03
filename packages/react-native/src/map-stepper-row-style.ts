import { type Theme } from '@scalewing/tokens';
import { type Insets, type TextStyle, type ViewStyle } from 'react-native';

import { stepperButtonHitSlop } from './map-stepper-style.js';

/**
 * A row button's visual diameter: the smallest control height, so the row
 * keeps a `ListRow`'s 44-point height inside its vertical padding.
 */
export function stepperRowButtonSize(theme: Theme): number {
  return theme.control.xs.minHeight;
}

/** Extra touch area so each row button still answers like a 44-point control. */
export function stepperRowButtonHitSlop(theme: Theme): Insets {
  return stepperButtonHitSlop(theme, stepperRowButtonSize(theme));
}

/** The leading slot, title, and detail: one adjustable element. */
export function mapStepperRowLabelStyle(theme: Theme): ViewStyle {
  return {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: theme.space[3],
    minWidth: 0,
  };
}

/**
 * Minus, count, and plus on the end side. The gap is at least each button's
 * hit slop, so the two touch areas never reach each other.
 */
export function mapStepperRowControlsStyle(theme: Theme): ViewStyle {
  return {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[2],
  };
}

/**
 * A round button filled with the quiet `subtle` colour. The Stepper's raised
 * button sits on its own glass track; a row has no track, so the fill alone
 * marks the button on the list panel. At its bound it fades.
 */
export function mapStepperRowButtonStyle(
  theme: Theme,
  enabled: boolean,
): ViewStyle {
  const size = stepperRowButtonSize(theme);
  return {
    alignItems: 'center',
    backgroundColor: theme.colors.subtle,
    borderRadius: theme.radius.pill,
    height: size,
    justifyContent: 'center',
    opacity: enabled ? 1 : theme.disabledOpacity,
    width: size,
  };
}

/** Room for a two-digit count, so the buttons do not move as it changes. */
export function mapStepperRowValueStyle(theme: Theme): ViewStyle {
  return { alignItems: 'center', minWidth: theme.space[5] };
}

/** Digits of equal width, so 1 and 8 take the same room. */
export const stepperRowValueTextStyle: TextStyle = {
  fontVariant: ['tabular-nums'],
};
