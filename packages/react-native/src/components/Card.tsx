import { type CardVariant, type SpacingStep } from '@scalewing/tokens';

import { Box, type BoxProps } from './Box.js';
import { mapCardViewStyle } from '../map-card-style.js';
import { useTheme } from '../theme/ThemeProvider.js';

export type { CardVariant };

export type CardProps = BoxProps & {
  padding?: SpacingStep;
  variant?: CardVariant;
};

export function Card({
  padding = 4,
  style,
  variant = 'glass',
  ...rest
}: CardProps) {
  const theme = useTheme();

  return (
    <Box
      padding={padding}
      style={[mapCardViewStyle(theme, variant), style]}
      {...rest}
    />
  );
}
