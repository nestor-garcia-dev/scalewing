import { type Theme } from '@scalewing/tokens';
import { type TextStyle } from 'react-native';

export function mapFieldInputStyle(
  theme: Theme,
  options: {
    disabled: boolean;
    focused: boolean;
    invalid: boolean;
  },
): TextStyle {
  const type = theme.typography.body;

  return {
    backgroundColor: theme.colors.surface,
    borderColor: options.invalid
      ? theme.colors.danger
      : options.focused
        ? theme.colors.accent
        : theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: type.fontSize,
    fontWeight: String(type.fontWeight) as TextStyle['fontWeight'],
    letterSpacing: type.letterSpacing,
    lineHeight: type.lineHeight,
    minHeight: theme.control.md.minHeight,
    opacity: options.disabled ? theme.disabledOpacity : 1,
    paddingHorizontal: theme.control.md.paddingInline,
    paddingVertical: theme.space[2],
  };
}
