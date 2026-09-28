'use client';

import { type DetailsHTMLAttributes, type ReactNode } from 'react';

import { cx } from '../class-names.js';
import { spacingClassNames, type SpacingProps } from '../spacing-classes.js';
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
/* The sm header is an sm control: a step of block padding over its generated
   min-height instead of the full inset, so it sits lower than a section. */
const summarySpacingBySize = {
  sm: { paddingX: 3, paddingY: 1 },
  md: { padding: 4 },
} as const satisfies Record<AccordionSize, SpacingProps>;
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
          ...spacingClassNames(summarySpacingBySize[size]),
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
