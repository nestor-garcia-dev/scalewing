'use client';

import { type DetailsHTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { spacingClassNames } from '../spacing-classes.js';
import { Stack } from './Stack.js';
import { Text } from './Text.js';

export type AccordionSize = 'sm' | 'md';

export type AccordionProps = Omit<
  DetailsHTMLAttributes<HTMLDetailsElement>,
  'onToggle' | 'open' | 'title' | 'children'
> & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** One muted line under the title, such as a summary of the content. */
  subtitle?: string;
  /** `sm` is a quieter disclosure nested inside other content. */
  size?: AccordionSize;
  children: ReactNode;
};

const spaceBySize = { sm: 3, md: 4 } as const;
const titleVariantBySize = { sm: 'label', md: 'title' } as const;

export function Accordion({
  children,
  className,
  onOpenChange,
  open,
  size = 'md',
  subtitle,
  title,
  ...rest
}: AccordionProps) {
  const space = spaceBySize[size];

  return (
    <details
      {...rest}
      className={cx(
        'sw-accordion',
        size === 'sm' && 'sw-accordion-sm',
        className,
      )}
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
          ...spacingClassNames({ padding: space }),
        )}
      >
        <span className="sw-accordion-heading">
          <Text as="span" variant={titleVariantBySize[size]}>
            {title}
          </Text>{' '}
          {subtitle ? (
            <Text as="span" color="muted" variant="caption">
              {subtitle}
            </Text>
          ) : null}
        </span>
        <span aria-hidden="true" className="sw-accordion-marker" />
      </summary>
      <Stack gap={space} padding={space} paddingTop={0}>
        {children}
      </Stack>
    </details>
  );
}
