import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Text, type TextFont, textFonts } from './index.js';
import { generateStylesheet } from './css/stylesheet.js';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Text font', () => {
  it('knows sans and mono', () => {
    expect(textFonts).toEqual(['sans', 'mono']);
  });

  it('sets mono with the generated monospace class at any variant', () => {
    render(
      <Text color="muted" font="mono" variant="headline">
        R8M 3TW
      </Text>,
    );
    const code = screen.getByRole('heading', { name: 'R8M 3TW' });
    expect(code.className).toBe('sw-text-headline sw-font-mono');
    expect(code.style.color).toBe('var(--sw-color-muted)');
  });

  it('keeps the sans variant class alone by default and with sans', () => {
    for (const font of [undefined, 'sans'] as const) {
      render(<Text font={font}>Snow leopard</Text>);
      expect(screen.getByText('Snow leopard').className).toBe('sw-text-body');
      cleanup();
    }
  });

  it('refuses an unknown font', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(<Text font={'serif' as TextFont}>Snow leopard</Text>),
    ).toThrow(new RangeError('Unknown Text font: serif'));
  });

  it('outranks the variant family: the mono rule is more specific than sw-text-*', () => {
    const css = generateStylesheet();
    expect(css).toContain('[data-theme] .sw-font-mono,\n[data-theme] :is(');
    expect(css).toContain('font-family: ui-monospace, monospace;');
    expect(css).toMatch(
      /\.sw-text-headline \{ font-family: var\(--sw-font-sans\);/,
    );
  });
});
