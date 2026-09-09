import { type SemanticColorKey, type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

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
    width: size,
  };
}
