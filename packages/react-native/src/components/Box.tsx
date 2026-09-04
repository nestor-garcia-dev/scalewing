import { type RadiusStep, type SemanticColorKey } from '@scalewing/tokens';
import { type ReactNode } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { mapSpacingStyle, type SpacingProps } from '../map-spacing-style.js';
import { useTheme } from '../theme/ThemeProvider.js';

export type BoxProps = SpacingProps &
  ViewProps & {
    background?: Extract<SemanticColorKey, 'background' | 'surface'>;
    border?: boolean;
    children?: ReactNode;
    radius?: RadiusStep;
  };

export function Box({
  background,
  border,
  padding,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingX,
  paddingY,
  gap,
  radius,
  style,
  ...rest
}: BoxProps) {
  const theme = useTheme();
  const resolvedStyle: ViewStyle = {
    ...mapSpacingStyle(theme, {
      gap,
      padding,
      paddingBottom,
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingX,
      paddingY,
    }),
    backgroundColor: background ? theme.colors[background] : undefined,
    borderColor: border ? theme.colors.border : undefined,
    borderRadius: radius ? theme.radius[radius] : undefined,
    borderWidth: border ? 1 : undefined,
  };

  return <View style={[resolvedStyle, style]} {...rest} />;
}
