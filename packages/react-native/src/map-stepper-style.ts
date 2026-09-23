import { type Theme } from '@scalewing/tokens';
import { type Insets, type ViewStyle } from 'react-native';

/** Thickness of the drawn minus and plus strokes. */
const glyphStroke = 2;

/** A button's visual diameter; its hit area grows to a full control height. */
export function stepperButtonSize(theme: Theme): number {
  return theme.control.sm.minHeight;
}

/** Extra touch area so each button answers like a 44-point control. */
export function stepperButtonHitSlop(theme: Theme): Insets {
  const slop = (theme.control.md.minHeight - stepperButtonSize(theme)) / 2;
  return { bottom: slop, left: slop, right: slop, top: slop };
}

/** The glass pill track that fills its column and holds both buttons. */
export function mapStepperTrackStyle(
  theme: Theme,
  state: { disabled: boolean; invalid: boolean },
): ViewStyle {
  return {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.glass.fill,
    borderColor: state.invalid ? theme.colors.danger : theme.glass.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: theme.control.md.minHeight,
    opacity: state.disabled ? theme.disabledOpacity : 1,
    padding: theme.space[1],
  };
}

/** A raised round button; at its bound it fades like any disabled control. */
export function mapStepperButtonStyle(
  theme: Theme,
  enabled: boolean,
): ViewStyle {
  const size = stepperButtonSize(theme);
  return {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    elevation: 2,
    height: size,
    justifyContent: 'center',
    opacity: enabled ? 1 : theme.disabledOpacity,
    shadowColor: theme.colors.text,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    width: size,
  };
}

/** The value between the buttons takes the remaining width, centered. */
export function mapStepperValueStyle(): ViewStyle {
  return { alignItems: 'center', flex: 1, justifyContent: 'center' };
}

/** One horizontal stroke; the plus adds the same stroke turned upright. */
export function mapStepperGlyphStyle(
  theme: Theme,
  orientation: 'horizontal' | 'vertical',
): ViewStyle {
  const length = theme.space[3];
  return {
    backgroundColor: theme.colors.text,
    borderRadius: glyphStroke,
    height: orientation === 'horizontal' ? glyphStroke : length,
    position: 'absolute',
    width: orientation === 'horizontal' ? length : glyphStroke,
  };
}
