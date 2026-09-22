import { type SemanticColorKey, type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export type ChipState = {
  disabled: boolean;
  selected: boolean;
};

/** A checkable pill on the control scale so every chip is a 44-point target. */
export function mapChipStyle(theme: Theme, state: ChipState): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: state.selected
      ? theme.colors.accent
      : theme.colors.surface,
    borderColor: state.selected ? theme.colors.accent : theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: theme.control.md.minHeight,
    opacity: state.disabled ? theme.disabledOpacity : 1,
    paddingHorizontal: theme.control.md.paddingInline,
  };
}

export function chipLabelColor(selected: boolean): SemanticColorKey {
  return selected ? 'onAccent' : 'text';
}
