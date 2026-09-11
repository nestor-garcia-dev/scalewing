import { focusRing, type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export function mapAccordionStyle(theme: Theme): ViewStyle {
  return {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
  };
}

export function mapAccordionHeaderStyle(theme: Theme): ViewStyle {
  return {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: theme.glass.fill,
  };
}

export function mapAccordionPressStyle(
  theme: Theme,
  pressed: boolean,
): ViewStyle {
  return {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space[3],
    minHeight: theme.control.md.minHeight + theme.space[3],
    minWidth: theme.control.md.minHeight,
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[3],
    opacity: pressed ? theme.disabledOpacity : 1,
  };
}

export function mapAccordionChevronStyle(
  theme: Theme,
  open: boolean,
): ViewStyle {
  return {
    width: theme.space[2],
    height: theme.space[2],
    borderBottomWidth: focusRing.width,
    borderRightWidth: focusRing.width,
    borderColor: theme.colors.muted,
    transform: [{ rotate: open ? '225deg' : '45deg' }],
  };
}
