import { type SemanticColorKey, type Theme } from '@scalewing/tokens';
import { type TextStyle, type ViewStyle } from 'react-native';

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
    paddingHorizontal: theme.space[1],
  };
}

export function mapTabBarContentStyle(): ViewStyle {
  return { minWidth: 0, width: '100%' };
}

export function mapTabBarLabelStyle(): TextStyle {
  return { maxWidth: '100%', textAlign: 'center' };
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
