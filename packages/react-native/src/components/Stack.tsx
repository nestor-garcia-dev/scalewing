import { type SpacingStep } from '@scalewing/tokens';

import {
  alignItems,
  justifyContent,
  type Align,
  type Justify,
} from '../alignment.js';
import { Box, type BoxProps } from './Box.js';

export type { Align, Justify };

export type StackProps = BoxProps & {
  align?: Align;
  gap?: SpacingStep;
  justify?: Justify;
};

export function Stack({
  align = 'stretch',
  gap = 0,
  justify = 'start',
  style,
  ...rest
}: StackProps) {
  return (
    <Box
      gap={gap}
      style={[
        {
          alignItems: alignItems[align],
          flexDirection: 'column',
          justifyContent: justifyContent[justify],
        },
        style,
      ]}
      {...rest}
    />
  );
}
