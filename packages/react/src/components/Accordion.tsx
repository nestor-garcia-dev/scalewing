'use client';

import { type DetailsHTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { spacingClassNames } from '../spacing-classes.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type AccordionProps = Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  'onToggle' | 'open' | 'title' | 'children'
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
};

export function Accordion({
  children,
  className,
  onOpenChange,
  open,
  title,
  ...rest
}: AccordionProps) {
  return (
    <details
      {...rest}
      className={cx('sw-accordion', className)}
      open={open}
      onToggle={(event) => {
        const next = event.currentTarget.open;
        if (next !== open) {
          onOpenChange(next);
        }
      }}
    >
      <summary
        className={cx(
          'sw-accordion-summary',
          ...spacingClassNames({ padding: 4 }),
        )}
      >
        <Text as="span" variant="title">
          {title}
        </Text>
      </summary>
      <Stack gap={4} padding={4} paddingTop={0}>
        {children}
      </Stack>
    </details>
  );
}
