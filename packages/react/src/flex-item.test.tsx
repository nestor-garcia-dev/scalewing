import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Box } from './components/Box.js';
import { Inline } from './components/Inline.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

describe('Box shrink', () => {
  it('adds sw-no-shrink only for shrink false, on any Box-based layout', () => {
    render(
      <>
        <Box data-testid="default">a</Box>
        <Box data-testid="shrinks" shrink>
          b
        </Box>
        <Inline data-testid="kept" gap={2} shrink={false}>
          c
        </Inline>
      </>,
    );
    expect(screen.getByTestId('default').className).toBe('');
    expect(screen.getByTestId('shrinks').className).toBe('');
    expect(screen.getByTestId('kept').className).toBe(
      'sw-no-shrink sw-inline sw-gap-2 sw-align-center sw-justify-start',
    );
  });

  it('generates a flex item that gives up no width', () => {
    expect(utilityClassCatalog()).toContain('sw-no-shrink');
    const css = generateStylesheet();
    expect(css).toContain('.sw-no-shrink { flex-shrink: 0; }');
    // After the Inline's own rule, which it does not touch (min-width: 0).
    expect(css.indexOf('.sw-no-shrink {')).toBeGreaterThan(
      css.indexOf('.sw-inline {'),
    );
  });
});
