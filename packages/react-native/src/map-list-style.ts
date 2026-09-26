import {
  focusRing,
  type SemanticColorKey,
  type Theme,
} from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

/** What a row shows at its end side. */
export type ListRowAccessory = 'chevron' | 'check' | 'none';

export type ListRowState = {
  disabled: boolean;
  pressed: boolean;
};

/**
 * The accessory a row draws: a choice shows its check only while
 * selected, a pressable row defaults to a chevron, and a read-only row
 * shows nothing.
 */
export function listRowAccessory(options: {
  accessory?: 'chevron' | 'none';
  pressable: boolean;
  selected?: boolean;
}): ListRowAccessory {
  if (options.selected !== undefined)
    return options.selected ? 'check' : 'none';
  if (!options.pressable) return 'none';
  return options.accessory ?? 'chevron';
}

/** One bordered panel holds the rows, like the select lists. */
export function mapListGroupStyle(theme: Theme): ViewStyle {
  return {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  };
}

/** The hairline between two rows of a group. */
export function mapListSeparatorStyle(theme: Theme): ViewStyle {
  return {
    backgroundColor: theme.colors.border,
    height: 1,
  };
}

/**
 * A full-width row on the control scale; it grows for a detail line and
 * fills with the quiet `subtle` colour while pressed.
 */
export function mapListRowStyle(theme: Theme, state: ListRowState): ViewStyle {
  return {
    alignItems: 'center',
    backgroundColor: state.pressed ? theme.colors.subtle : 'transparent',
    flexDirection: 'row',
    gap: theme.space[3],
    minHeight: theme.control.md.minHeight,
    opacity: state.disabled ? theme.disabledOpacity : 1,
    paddingHorizontal: theme.control.md.paddingInline,
    // Room for a detail line under the title.
    paddingVertical: theme.space[2],
  };
}

/** A right-pointing chevron drawn from two borders, like the Accordion's. */
export function mapListChevronStyle(theme: Theme): ViewStyle {
  return {
    borderBottomWidth: focusRing.width,
    borderColor: theme.colors.muted,
    borderRightWidth: focusRing.width,
    height: theme.space[2],
    transform: [{ rotate: '-45deg' }],
    width: theme.space[2],
  };
}

export const listCheckColor: SemanticColorKey = 'accent';
