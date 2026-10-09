import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Box } from './components/Box.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { breakpointQuery } from './index.js';
import { visibilityClassNames } from './visibility-classes.js';

afterEach(() => cleanup());

describe('visibilityClassNames', () => {
  it('returns no classes by default', () => {
    expect(visibilityClassNames({})).toEqual([]);
  });

  it('maps each prop to its generated class', () => {
    expect(visibilityClassNames({ hideBelow: 'md' })).toEqual([
      'sw-hide-below-md',
    ]);
    expect(visibilityClassNames({ hideFrom: 'md' })).toEqual([
      'sw-hide-from-md',
    ]);
    expect(visibilityClassNames({ hideBelow: 'lg', hideFrom: 'md' })).toEqual([
      'sw-hide-below-lg',
      'sw-hide-from-md',
    ]);
  });

  it('refuses a breakpoint it does not know', () => {
    expect(() =>
      // @ts-expect-error an unknown breakpoint from untyped code
      visibilityClassNames({ hideBelow: 'xl' }),
    ).toThrow('hideBelow must be one of md, lg');
    expect(() =>
      // @ts-expect-error an unknown breakpoint from untyped code
      visibilityClassNames({ hideFrom: 'sm' }),
    ).toThrow(RangeError);
  });

  it('generates md at 48rem and lg at 64rem, both directions', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '@media not all and (min-width: 64rem) {\n  .sw-hide-below-lg { display: none; }\n}',
    );
    expect(css).toContain(
      '@media (min-width: 64rem) {\n  .sw-hide-from-lg { display: none; }\n}',
    );
    expect(css).toContain(
      '@media not all and (min-width: 48rem) {\n  .sw-hide-below-md { display: none; }\n}',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-hide-below-md',
        'sw-hide-from-md',
        'sw-hide-below-lg',
        'sw-hide-from-lg',
      ]),
    );
  });
});

describe('Box visibility', () => {
  it('adds the hide class beside spacing and custom classes', () => {
    const { container } = render(
      <Box className="custom" hideBelow="md" padding={2}>
        Wide only
      </Box>,
    );
    const box = container.firstElementChild;

    expect(box?.className).toContain('sw-padding-2');
    expect(box?.className).toContain('sw-hide-below-md');
    expect(box?.className).toContain('custom');
  });

  it('does not forward visibility props to the DOM', () => {
    const { container } = render(<Box hideFrom="md">Narrow only</Box>);
    const box = container.firstElementChild;

    expect(box?.className).toContain('sw-hide-from-md');
    expect(box?.hasAttribute('hidefrom')).toBe(false);
    expect(box?.hasAttribute('hideFrom')).toBe(false);
  });
});

describe('breakpointQuery', () => {
  it('is the query the hide classes use, for script that follows them', () => {
    expect(breakpointQuery('below', 'lg')).toBe(
      'not all and (min-width: 64rem)',
    );
    expect(breakpointQuery('from', 'md')).toBe('(min-width: 48rem)');
  });

  it('refuses a direction or a breakpoint it does not know', () => {
    // @ts-expect-error an unknown direction from untyped code
    expect(() => breakpointQuery('above', 'md')).toThrow(
      'direction must be one of from, below',
    );
    // @ts-expect-error an unknown breakpoint from untyped code
    expect(() => breakpointQuery('below', 'xl')).toThrow(
      'breakpoint must be one of md, lg',
    );
  });
});

describe('Nav buttons on a coarse pointer', () => {
  it('grow to the 44 px touch target both ways', () => {
    expect(generateStylesheet()).toContain(
      '@media (pointer: coarse) {\n  .sw-nav .sw-button {\n    min-height: var(--sw-control-md-min-height);\n    min-width: var(--sw-control-md-min-height);\n  }\n}',
    );
  });
});
