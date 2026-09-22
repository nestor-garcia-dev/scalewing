import { type Theme } from '@scalewing/tokens';
import { type TextStyle } from 'react-native';

import {
  mapControlFrameStyle,
  type ControlFrameState,
} from './map-control-frame-style.js';

/**
 * Native text inputs size their own line box. A fixed `lineHeight` inside the
 * 44-point control clips glyphs on iOS, so the input takes the body font
 * without one and centers vertically on Android.
 */
export function mapFieldInputStyle(
  theme: Theme,
  state: ControlFrameState,
): TextStyle {
  const type = theme.typography.body;

  return {
    ...mapControlFrameStyle(theme, state),
    color: theme.colors.text,
    fontSize: type.fontSize,
    fontWeight: String(type.fontWeight) as TextStyle['fontWeight'],
    includeFontPadding: false,
    letterSpacing: type.letterSpacing,
    paddingVertical: theme.space[2],
    textAlignVertical: 'center',
  };
}
