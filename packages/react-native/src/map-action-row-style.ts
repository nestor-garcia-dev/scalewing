import {
  quietOpacity,
  type SemanticColorKey,
  type Theme,
} from '@scalewing/tokens';
import { type TextStyle, type ViewStyle } from 'react-native';

export type ActionTileState = {
  disabled: boolean;
  pressed: boolean;
};

/** Tiles in one row, a small gap apart. */
export function mapActionRowStyle(theme: Theme): ViewStyle {
  return {
    alignSelf: 'stretch',
    columnGap: theme.space[2],
    flexDirection: 'row',
  };
}

/**
 * The tile's height: taller than a control so a glyph sits over its label,
 * composed from two spacing steps (48 + 16 in the default scale).
 */
export function actionTileMinHeight(theme: Theme): number {
  return theme.space[8] + theme.space[4];
}

/**
 * Every slot takes a quarter of the row after the gaps, filled or not, so
 * a tile never changes size or place as actions are added.
 */
export function mapActionSlotStyle(): ViewStyle {
  return { flexBasis: 0, flexGrow: 1, minWidth: 0 };
}

/**
 * A rounded tile on the accent tint with its glyph over its label. It
 * quiets while pressed and dims, in place, while disabled.
 */
export function mapActionTileStyle(
  theme: Theme,
  state: ActionTileState,
): ViewStyle {
  return {
    ...mapActionSlotStyle(),
    alignItems: 'center',
    backgroundColor: theme.colors.accentSubtle,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    minHeight: actionTileMinHeight(theme),
    opacity: actionTileOpacity(theme, state),
    paddingHorizontal: theme.space[1],
    paddingVertical: theme.space[2],
    rowGap: theme.space[1],
  };
}

function actionTileOpacity(theme: Theme, state: ActionTileState): number {
  if (state.disabled) return theme.disabledOpacity;
  return state.pressed ? quietOpacity : 1;
}

/** Glyphs and labels on a tile take the accent. */
export const actionTileColor: SemanticColorKey = 'accent';

/**
 * The one-line label: the `caption` size (from the Text variant) at the
 * `label` weight, so a short word reads clearly under its glyph.
 */
export function mapActionTileLabelStyle(theme: Theme): TextStyle {
  return {
    fontWeight: String(
      theme.typography.label.fontWeight,
    ) as TextStyle['fontWeight'],
    textAlign: 'center',
  };
}
