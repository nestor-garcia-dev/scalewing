import {
  trackInset,
  type SemanticColorKey,
  type Theme,
} from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export function mapSegmentedControlStyle(
  theme: Theme,
  scrollable = false,
): ViewStyle {
  return {
    // A scrolling track still spans the row when its items fit.
    ...(scrollable ? { flexGrow: 1 } : {}),
    backgroundColor: theme.glass.fill,
    borderColor: theme.glass.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: trackInset,
    padding: trackInset,
  };
}

/**
 * Items share the track equally; in a scrolling track each keeps its
 * label's width and grows only to fill spare room.
 */
export function mapSegmentedItemStyle(
  theme: Theme,
  selected: boolean,
  scrollable = false,
): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: selected ? theme.colors.accent : 'transparent',
    borderRadius: theme.radius.pill,
    ...(scrollable ? { flexGrow: 1, flexShrink: 0 } : { flex: 1 }),
    justifyContent: 'center',
    minHeight: theme.control.md.minHeight,
    paddingHorizontal: theme.control.xs.paddingInline,
  };
}

export function segmentedItemColor(selected: boolean): SemanticColorKey {
  return selected ? 'onAccent' : 'muted';
}
