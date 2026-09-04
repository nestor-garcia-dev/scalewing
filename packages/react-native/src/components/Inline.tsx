import { type SpacingStep } from '@scalewing/tokens';

import {
  alignItems,
  justifyContent,
  type Align,
  type Justify,
} from '../alignment.js';
import { Box, type BoxProps } from './Box.js';

export type InlineProps = BoxProps & {
  align?: Align;
  gap?: SpacingStep;
  justify?: Justify;
  wrap?: boolean;
};

export function Inline({
  align = 'center',
  gap = 0,
  justify = 'start',
  style,
  wrap = false,
  ...rest
}: InlineProps) {
  return (
    <Box
      gap={gap}
      style={[
        {
          alignItems: alignItems[align],
          flexDirection: 'row',
          flexWrap: wrap ? 'wrap' : 'nowrap',
          justifyContent: justifyContent[justify],
        },
        style,
      ]}
      {...rest}
    />
  );
}
