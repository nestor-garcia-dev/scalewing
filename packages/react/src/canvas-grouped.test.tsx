import { contrastRatio } from '@scalewing/tokens';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  groupedCanvasMutedShare,
  themeCanvases,
} from './css/css-canvas-grouped.js';
import { generateStylesheet } from './css/stylesheet.js';
import { forEveryTheme, tintOver } from './every-theme.test-support.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function canvasOf(text: string): HTMLElement {
  return screen.getByText(text).closest('[data-theme]') as HTMLElement;
}

describe('ThemeProvider canvas', () => {
  it('leaves the canvas unmarked by default and marks a grouped one', () => {
    render(
      <>
        <ThemeProvider colorScheme="light">
          <p>Plain page</p>
        </ThemeProvider>
        <ThemeProvider canvas="grouped" colorScheme="light">
          <p>Grouped page</p>
        </ThemeProvider>
      </>,
    );
    expect(canvasOf('Plain page').hasAttribute('data-canvas')).toBe(false);
    expect(canvasOf('Grouped page').getAttribute('data-canvas')).toBe(
      'grouped',
    );
    expect(themeCanvases).toEqual(['default', 'grouped']);
  });

  it('refuses an unknown canvas', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <ThemeProvider canvas={'grey' as never}>
          <p>Page</p>
        </ThemeProvider>,
      ),
    ).toThrow('Unknown ThemeProvider canvas: grey');
  });

  it('paints the grouped grey only where a canvas asks for it', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '[data-theme] {\n  --sw-canvas-grouped: color-mix(in srgb, var(--sw-color-muted) 7%, var(--sw-color-background));\n}',
    );
    expect(css).toContain(
      "[data-theme='dark'] {\n  --sw-canvas-grouped: var(--sw-color-background);\n}",
    );
    expect(css).toContain(
      "[data-theme][data-canvas='grouped'] {\n  background-color: var(--sw-canvas-grouped);\n}",
    );
  });

  it('keeps the text and muted colours readable on it and sets cards apart in every palette', () => {
    forEveryTheme((colors, label, theme) => {
      const grouped =
        theme.colorScheme === 'dark'
          ? colors.background
          : tintOver(colors.muted, groupedCanvasMutedShare, colors.background);
      expect(
        contrastRatio(colors.text, grouped),
        `${label} text`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrastRatio(colors.muted, grouped),
        `${label} muted`,
      ).toBeGreaterThanOrEqual(4.5);
      // In either scheme a card's surface stands apart from the grouped page.
      expect(
        contrastRatio(colors.surface, grouped),
        `${label} surface apart`,
      ).toBeGreaterThan(1.04);
    });
  });
});
