import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Band } from './components/Band.js';
import { Text } from './components/Text.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

afterEach(() => cleanup());

const css = generateStylesheet();

/** The body of the first rule whose selector line is exactly `selector`. */
function rule(selector: string): string {
  const start = css.indexOf(`${selector} {\n`);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return css.slice(start, css.indexOf('}', start));
}

describe('Band', () => {
  it('draws a full-width section with its content in a container column', () => {
    render(
      <Band aria-label="Closing" tone="inverse">
        <Text>Words</Text>
      </Band>,
    );
    const band = screen.getByRole('region', { name: 'Closing' });
    expect(band.tagName).toBe('SECTION');
    expect(band.className).toBe('sw-band sw-band-inverse sw-padding-y-8');
    const inner = band.firstElementChild as HTMLElement;
    expect(inner.className).toBe('sw-band-inner sw-band-inner-container');
    expect(inner.textContent).toBe('Words');
  });

  it('takes an element, a reading width, padding steps and a class', () => {
    const { container } = render(
      <Band
        as="footer"
        className="extra"
        paddingBottom={5}
        paddingTop={8}
        paddingY={6}
        tone="subtle"
        width="reading"
      >
        x
      </Band>,
    );
    const band = container.firstElementChild as HTMLElement;
    expect(band.tagName).toBe('FOOTER');
    expect(band.className).toBe(
      'sw-band sw-band-subtle sw-padding-y-6 sw-padding-top-8 sw-padding-bottom-5 extra',
    );
    expect(band.firstElementChild?.className).toBe(
      'sw-band-inner sw-band-inner-reading',
    );
  });

  it.each(['div', 'aside'] as const)('renders as %s', (as) => {
    const { container } = render(
      <Band as={as} tone="surface">
        x
      </Band>,
    );
    expect(container.firstElementChild?.tagName).toBe(as.toUpperCase());
  });

  it('throws on an unknown tone, width or element', () => {
    expect(() => render(<Band tone={'navy' as never}>x</Band>)).toThrow(
      'Unknown Band tone: navy',
    );
    expect(() =>
      render(
        <Band tone="inverse" width={'wide' as never}>
          x
        </Band>,
      ),
    ).toThrow('Unknown Band width: wide');
    expect(() =>
      render(
        <Band as={'main' as never} tone="inverse">
          x
        </Band>,
      ),
    ).toThrow('Unknown Band element: main');
  });

  it('reads a brand band colour from the theme overlay', () => {
    const { container } = render(
      <ThemeProvider colorScheme="light" colors={{ inverse: '#0B2038' }}>
        <Band tone="inverse">x</Band>
      </ThemeProvider>,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--sw-color-inverse')).toBe('#0B2038');
    expect(root.style.getPropertyValue('--sw-color-onInverse')).toBe('#FFFFFF');
  });
});

describe('Band CSS', () => {
  it('re-scopes words, muted words, hairlines and the accent inside the inverse band', () => {
    const inverse = rule('.sw-band-inverse');
    for (const declaration of [
      '--sw-color-text: var(--sw-color-onInverse);',
      '--sw-color-muted: color-mix(in srgb, var(--sw-color-onInverse) 78%, var(--sw-color-inverse));',
      '--sw-color-border: color-mix(in srgb, var(--sw-color-onInverse) 18%, var(--sw-color-inverse));',
      '--sw-color-subtle: color-mix(in srgb, var(--sw-color-onInverse) 10%, var(--sw-color-inverse));',
      '--sw-color-accent: var(--sw-color-onInverse);',
      '--sw-color-onAccent: var(--sw-color-inverse);',
      'background: var(--sw-color-inverse);',
      'color: var(--sw-color-onInverse);',
    ])
      expect(inverse).toContain(declaration);
  });

  it('draws plain links in the band words, half underlined and fully on hover, and leaves button links alone', () => {
    const link = rule('[data-theme] .sw-band-inverse a:not(.sw-button)');
    expect(link).toContain('color: var(--sw-color-onInverse);');
    expect(link).toContain(
      'text-decoration-color: color-mix(in srgb, currentColor 50%, transparent);',
    );
    expect(
      rule('[data-theme] .sw-band-inverse a:not(.sw-button):hover'),
    ).toContain('text-decoration-color: currentColor;');
  });

  it('keeps the phone gutter, widens it from md, and caps the column', () => {
    expect(rule('.sw-band-inner')).toContain(
      'padding-inline: var(--sw-space-4);',
    );
    expect(css).toContain(
      '@media (min-width: 48rem) {\n  .sw-band-inner { padding-inline: var(--sw-space-5); }\n}',
    );
    expect(css).toContain(
      '.sw-band-inner-container { max-width: calc(var(--sw-container-max) + 2 * var(--sw-space-5)); }',
    );
    expect(css).toContain(
      '.sw-band-inner-reading { max-width: calc(var(--sw-reading-max) + 2 * var(--sw-space-5)); }',
    );
  });

  it('outlines the inverse band in forced colours and lists its classes', () => {
    expect(css).toContain(
      '@media (forced-colors: active) {\n  .sw-band-inverse { border-block: 1px solid CanvasText; }\n}',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-band',
        'sw-band-inner',
        'sw-band-surface',
        'sw-band-subtle',
        'sw-band-inverse',
        'sw-band-inner-container',
        'sw-band-inner-reading',
      ]),
    );
  });
});
