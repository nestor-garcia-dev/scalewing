import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Box } from './components/Box.js';
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
