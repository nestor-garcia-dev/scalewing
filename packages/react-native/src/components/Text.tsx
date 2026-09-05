import {
  type SemanticColorKey,
  type TypographyVariant,
} from '@scalewing/tokens';
import {
  Text as NativeText,
  type TextProps as NativeTextProps,
  type TextStyle,
} from 'react-native';

import { useTheme } from '../theme/ThemeProvider.js';

export type TextProps = NativeTextProps & {
  color?: SemanticColorKey;
  truncate?: boolean;
  variant?: TypographyVariant;
};

export function Text({
  color = 'text',
  style,
  truncate = false,
  variant = 'body',
  ...rest
}: TextProps) {
  const theme = useTheme();
  const type = theme.typography[variant];
  const fontVariant: TextStyle['fontVariant'] =
    'tabularNums' in type && type.tabularNums ? ['tabular-nums'] : undefined;

  return (
    <NativeText
      numberOfLines={truncate ? 1 : undefined}
      style={[
        {
          color: theme.colors[color],
          fontSize: type.fontSize,
          fontVariant,
          fontWeight: String(type.fontWeight) as
            '400' | '500' | '600' | '700' | '800',
          letterSpacing: type.letterSpacing,
          lineHeight: type.lineHeight,
        },
        style,
      ]}
      {...rest}
    />
  );
}
