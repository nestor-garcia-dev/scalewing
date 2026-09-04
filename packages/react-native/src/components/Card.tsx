import { type SpacingStep } from '@scalewing/tokens';

import { Box, type BoxProps } from './Box.js';
import { useTheme } from '../theme/ThemeProvider.js';

export type CardVariant = 'outlined' | 'elevated';

export type CardProps = BoxProps & {
  padding?: SpacingStep;
  variant?: CardVariant;
};

export function Card({
  padding = 4,
  style,
  variant = 'outlined',
  ...rest
}: CardProps) {
  const theme = useTheme();

  return (
    <Box
      background="surface"
      border={variant === 'outlined'}
      padding={padding}
      radius="md"
      style={[
        variant === 'elevated'
          ? {
              shadowColor: theme.colors.text,
              shadowOffset: { height: 8, width: 0 },
              shadowOpacity: 0.12,
              shadowRadius: 16,
              elevation: 3,
            }
          : undefined,
        style,
      ]}
      {...rest}
    />
  );
}
