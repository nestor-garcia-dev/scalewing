import { type CardVariant, type Theme } from '@scalewing/tokens';
import { type ViewStyle } from 'react-native';

export function mapCardViewStyle(
  theme: Theme,
  variant: CardVariant,
): ViewStyle {
  switch (variant) {
    case 'glass':
      return {
        backgroundColor: theme.glass.fill,
        borderColor: theme.glass.border,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
      };
    case 'outlined':
      return {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
      };
    case 'elevated':
      return {
        backgroundColor: theme.colors.surface,
        borderColor: 'transparent',
        borderRadius: theme.radius.lg,
        borderWidth: 0,
        elevation: 3,
        shadowColor: theme.colors.text,
        shadowOffset: { height: 8, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
      };
  }
}
