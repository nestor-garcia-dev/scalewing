import { type SemanticColorKey, type Theme } from '@scalewing/tokens';
import { StyleSheet, type ViewStyle } from 'react-native';

import { wheelEdgeRows, wheelVisibleRows } from './wheel-geometry.js';

/** One row is a control-height target so a tap lands where a finger rests. */
export function wheelRowHeight(theme: Theme): number {
  return theme.control.md.minHeight;
}

/** The scrolling column: a fixed window of rows on the control surface. */
export function mapWheelColumnStyle(
  theme: Theme,
  disabled: boolean,
): ViewStyle {
  return {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    flex: 1,
    height: wheelRowHeight(theme) * wheelVisibleRows,
    opacity: disabled ? theme.disabledOpacity : 1,
    overflow: 'hidden',
  };
}

/** Padding that lets the first and last items reach the selection band. */
export function mapWheelContentStyle(theme: Theme): ViewStyle {
  return { paddingVertical: wheelRowHeight(theme) * wheelEdgeRows() };
}

export function mapWheelRowStyle(theme: Theme): ViewStyle {
  return {
    alignItems: 'center',
    height: wheelRowHeight(theme),
    justifyContent: 'center',
  };
}

/** Hairline band over the middle row; it never takes touches. */
export function mapWheelBandStyle(theme: Theme): ViewStyle {
  return {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: wheelRowHeight(theme),
    left: 0,
    position: 'absolute',
    right: 0,
    top: wheelRowHeight(theme) * wheelEdgeRows(),
  };
}

export function wheelRowColor(selected: boolean): SemanticColorKey {
  return selected ? 'text' : 'muted';
}
