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
  rows = 1,
): TextStyle {
  const type = theme.typography.body;
  const frame = mapControlFrameStyle(theme, state);
  const single = rows <= 1;

  return {
    ...frame,
    color: theme.colors.text,
    fontSize: type.fontSize,
    fontWeight: String(type.fontWeight) as TextStyle['fontWeight'],
    includeFontPadding: false,
    letterSpacing: type.letterSpacing,
    minHeight: single ? frame.minHeight : fieldRowsHeight(theme, rows),
    paddingVertical: theme.space[2],
    textAlignVertical: single ? 'center' : 'top',
  };
}

/**
 * The height that shows `rows` lines of body text inside the frame's
 * padding; a multi-line field starts there and grows with its text.
 */
export function fieldRowsHeight(theme: Theme, rows: number): number {
  return theme.typography.body.lineHeight * rows + theme.space[2] * 2;
}
