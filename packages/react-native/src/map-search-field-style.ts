import { focusRing, type Theme } from '@scalewing/tokens';
import { type Insets, type TextStyle, type ViewStyle } from 'react-native';

import { type ControlFrameState } from './map-control-frame-style.js';
import { mapFieldTextStyle } from './map-field-style.js';

/** The search frame's border; transparent at rest so focus moves nothing. */
const frameBorderWidth = 1;

/**
 * A filled capsule on the quiet `subtle` colour with no hairline at rest.
 * Focus and an error draw the same accent and danger borders as the
 * outlined field.
 */
export function mapSearchFrameStyle(
  theme: Theme,
  state: ControlFrameState,
): ViewStyle {
  return {
    alignItems: 'stretch',
    backgroundColor: theme.colors.subtle,
    borderColor: state.invalid
      ? theme.colors.danger
      : state.focused
        ? theme.colors.accent
        : 'transparent',
    borderRadius: theme.radius.pill,
    borderWidth: frameBorderWidth,
    flexDirection: 'row',
    minHeight: theme.control.md.minHeight,
    opacity: state.disabled ? theme.disabledOpacity : 1,
    paddingStart: theme.control.md.paddingInline,
  };
}

/** The consumer glyph, centred on the text line, one small gap before it. */
export function mapSearchLeadingStyle(theme: Theme): ViewStyle {
  return { justifyContent: 'center', marginEnd: theme.space[2] };
}

/**
 * The text fills the frame's height so the native input centres it, with
 * no `lineHeight` (see `mapFieldTextStyle`). The clear button brings its own
 * room on the end side, so the input keeps the frame's end padding only
 * while it is hidden.
 */
export function mapSearchInputStyle(
  theme: Theme,
  clearable: boolean,
): TextStyle {
  return {
    ...mapFieldTextStyle(theme),
    flex: 1,
    minWidth: 0,
    paddingEnd: clearable ? 0 : theme.control.md.paddingInline,
    paddingStart: 0,
    paddingVertical: theme.space[2],
    textAlignVertical: 'center',
  };
}

/** The clear button is a control-height square at the frame's end. */
export function mapSearchClearStyle(theme: Theme): ViewStyle {
  return {
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.control.md.minHeight,
  };
}

/** Makes up the frame's border so the clear button answers at 44 points. */
export function searchClearHitSlop(): Insets {
  return { bottom: frameBorderWidth, top: frameBorderWidth };
}

/** The muted disc behind the clear cross. */
export function mapSearchClearDiscStyle(theme: Theme): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radius.pill,
    height: theme.space[4],
    justifyContent: 'center',
    width: theme.space[4],
  };
}

/** One stroke of the cross; the other is the same stroke turned the other way. */
export function mapSearchClearStrokeStyle(
  theme: Theme,
  turn: '45deg' | '-45deg',
): ViewStyle {
  return {
    backgroundColor: theme.colors.surface,
    borderRadius: focusRing.width,
    height: focusRing.width,
    position: 'absolute',
    transform: [{ rotate: turn }],
    width: theme.space[2],
  };
}
