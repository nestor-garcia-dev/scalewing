import {
  type ButtonSize,
  type ButtonVariant,
  type SemanticColorKey,
  type Theme,
} from '@scalewing/tokens';
import { type TextStyle, type ViewStyle } from 'react-native';

export function buttonLabelColor(variant: ButtonVariant): SemanticColorKey {
  switch (variant) {
    case 'primary':
      return 'onAccent';
    case 'secondary':
      return 'text';
    case 'ghost':
      return 'accent';
    case 'danger':
      return 'onDanger';
  }
}

export function mapButtonViewStyle(
  theme: Theme,
  options: {
    disabled: boolean;
    size: ButtonSize;
    variant: ButtonVariant;
  },
): ViewStyle {
  const control = theme.control[options.size];
  const fill = buttonFill(theme, options.variant);

  return {
    alignItems: 'center',
    backgroundColor: fill.backgroundColor,
    borderColor: fill.borderColor,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: control.minHeight,
    opacity: options.disabled ? theme.disabledOpacity : 1,
    paddingHorizontal: control.paddingInline,
  };
}

export function mapButtonLabelStyle(
  theme: Theme,
  variant: ButtonVariant,
): TextStyle {
  const type = theme.typography.label;

  return {
    color: theme.colors[buttonLabelColor(variant)],
    fontSize: type.fontSize,
    fontWeight: String(type.fontWeight) as TextStyle['fontWeight'],
    letterSpacing: type.letterSpacing,
    lineHeight: type.lineHeight,
  };
}

function buttonFill(
  theme: Theme,
  variant: ButtonVariant,
): {
  backgroundColor: string;
  borderColor: string;
} {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.colors.accent,
        borderColor: 'transparent',
      };
    case 'secondary':
      return {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      };
    case 'danger':
      return {
        backgroundColor: theme.colors.danger,
        borderColor: 'transparent',
      };
  }
}
