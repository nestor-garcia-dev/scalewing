import { type SemanticColorKey, type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export type ChipState = {
  disabled: boolean;
  selected: boolean;
};

/**
 * A checkable outlined pill on the control scale so every chip is a
 * 44-point target. It never fills, so it cannot read as a button: a
 * selected chip turns its outline and label to the accent and adds a check.
 */
export function mapChipStyle(theme: Theme, state: ChipState): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: state.selected ? theme.colors.accent : theme.colors.border,
    columnGap: theme.space[1],
    flexDirection: 'row',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: theme.control.md.minHeight,
    opacity: state.disabled ? theme.disabledOpacity : 1,
    paddingHorizontal: theme.control.md.paddingInline,
  };
}

export function chipLabelColor(selected: boolean): SemanticColorKey {
  return selected ? 'accent' : 'text';
}
