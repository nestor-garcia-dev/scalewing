import {
  type SemanticColorKey,
  type SpacingStep,
  type Theme,
} from '@scalewing/tokens';
import { type TextStyle, type ViewStyle } from 'react-native';

/** The space step between the destinations and the trailing control. */
export const tabBarTrailingGap: SpacingStep = 2;

/**
 * How far a destination's label may shrink to fit its column before it
 * ellipsizes, as iOS tab labels do: five labels of up to 13 characters
 * fit beside a trailing control on a 390-point phone at the default size.
 */
export const tabBarLabelMinimumFontScale = 0.7;

export function mapTabBarStyle(
  theme: Theme,
  options: { bottomInset: number } = { bottomInset: 0 },
): ViewStyle {
  return {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    paddingBottom: theme.space[2] + options.bottomInset,
    paddingHorizontal: theme.space[3],
    paddingTop: theme.space[2],
  };
}

export function tabBarItemColor(selected: boolean): SemanticColorKey {
  return selected ? 'accent' : 'muted';
}

export function mapTabBarDestinationStyle(): ViewStyle {
  return { flex: 1, minWidth: 0 };
}

export function mapTabBarItemStyle(theme: Theme): ViewStyle {
  return {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: theme.control.md.minHeight,
    minWidth: 0,
  };
}

export function mapTabBarContentStyle(): ViewStyle {
  return { minWidth: 0, width: '100%' };
}

export function mapTabBarLabelStyle(): TextStyle {
  return { maxWidth: '100%', textAlign: 'center' };
}

/** The icon's own box, which the badge hangs off. */
export function mapTabBarIconStyle(): ViewStyle {
  return { position: 'relative' };
}

/**
 * A count badge on the danger fill, its start edge at the icon's centre
 * and raised over the icon's top, a circle for one digit and a pill past it.
 */
export function mapTabBarBadgeStyle(theme: Theme): ViewStyle {
  const size = theme.typography.caption.lineHeight;

  return {
    alignItems: 'center',
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.pill,
    justifyContent: 'center',
    minHeight: size,
    minWidth: size,
    paddingHorizontal: theme.space[1],
    position: 'absolute',
    start: '50%',
    top: -theme.space[1],
  };
}

export function mapTabBarTrailingStyle(theme: Theme): ViewStyle {
  const size = theme.control.md.minHeight;

  return {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    height: size,
    justifyContent: 'center',
    flexShrink: 0,
    width: size,
  };
}
