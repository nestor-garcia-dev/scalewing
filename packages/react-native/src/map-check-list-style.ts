import { type SemanticColorKey, type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export type CheckRowState = {
  disabled: boolean;
  first: boolean;
};

/** One bordered panel holds the rows, like the calendar panel. */
export function mapCheckListStyle(theme: Theme): ViewStyle {
  return {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  };
}

/** A full-width row on the control scale, divided from the row above. */
export function mapCheckRowStyle(
  theme: Theme,
  state: CheckRowState,
): ViewStyle {
  return {
    alignItems: 'center',
    borderTopColor: theme.colors.border,
    borderTopWidth: state.first ? 0 : 1,
    flexDirection: 'row',
    gap: theme.space[2],
    minHeight: theme.control.md.minHeight,
    opacity: state.disabled ? theme.disabledOpacity : 1,
    paddingHorizontal: theme.control.md.paddingInline,
  };
}

export function checkMarkColor(selected: boolean): SemanticColorKey {
  return selected ? 'accent' : 'muted';
}
