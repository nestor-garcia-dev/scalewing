import { type ButtonSize, type ButtonVariant } from '@scalewing/tokens';
import { type ReactNode } from 'react';
import { Pressable } from 'react-native';

import { buttonLabelColor, mapButtonViewStyle } from '../map-button-style.js';
import { useTheme } from '../theme/ThemeProvider.js';
import { Text } from './Text.js';

export type { ButtonSize, ButtonVariant };

export type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  onPress: () => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function Button({
  children,
  disabled = false,
  onPress,
  size = 'md',
  variant = 'primary',
}: ButtonProps) {
  const theme = useTheme();
  const label = typeof children === 'string' ? children : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={mapButtonViewStyle(theme, { disabled, size, variant })}
    >
      {typeof children === 'string' ? (
        <Text color={buttonLabelColor(variant)} variant="label">
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
