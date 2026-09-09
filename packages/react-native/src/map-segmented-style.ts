import {
  trackInset,
  type SemanticColorKey,
  type Theme,
} from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export function mapSegmentedControlStyle(theme: Theme): ViewStyle {
  return {
    backgroundColor: theme.glass.fill,
    borderColor: theme.glass.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: trackInset,
    padding: trackInset,
  };
}

export function mapSegmentedItemStyle(
  theme: Theme,
  selected: boolean,
): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: selected ? theme.colors.surface : 'transparent',
    borderRadius: theme.radius.pill,
    flex: 1,
    justifyContent: 'center',
    minHeight: theme.control.xs.minHeight,
    paddingHorizontal: theme.control.xs.paddingInline,
  };
}

export function segmentedItemColor(selected: boolean): SemanticColorKey {
  return selected ? 'text' : 'muted';
}
