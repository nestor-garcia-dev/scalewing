import { render } from '@testing-library/react';
import {
  compactControlScale,
  controlScale,
  typographyVariants,
} from '@scalewing/tokens';
import { describe, expect, it } from 'vitest';

import { cssDensityClasses, themeDensities } from './css/css-density.js';
import { generateStylesheet } from './css/stylesheet.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

const css = generateStylesheet();
const density = cssDensityClasses();

function root(container: HTMLElement): HTMLElement {
  return container.querySelector<HTMLElement>('[data-theme]')!;
}

describe('ThemeProvider density', () => {
  it('sets no attribute by default, so the default markup is unchanged', () => {
    const { container } = render(<ThemeProvider>Heron</ThemeProvider>);
    expect(root(container).hasAttribute('data-density')).toBe(false);
  });

  it('sets no attribute for an explicit comfortable either', () => {
    const { container } = render(
      <ThemeProvider density="comfortable">Heron</ThemeProvider>,
    );
    expect(root(container).hasAttribute('data-density')).toBe(false);
  });

  it('sets the attribute for compact', () => {
    const { container } = render(
      <ThemeProvider density="compact">Heron</ThemeProvider>,
    );
    expect(root(container).getAttribute('data-density')).toBe('compact');
  });

  it('reaches a ThemeProvider nested in a compact one, whatever it asks for', () => {
    const { container } = render(
      <ThemeProvider density="compact">
        <ThemeProvider colorScheme="dark">
          <ThemeProvider density="comfortable">Heron</ThemeProvider>
        </ThemeProvider>
      </ThemeProvider>,
    );
    const roots = container.querySelectorAll('[data-theme]');
    expect(roots).toHaveLength(3);
    for (const each of roots)
      expect(each.getAttribute('data-density')).toBe('compact');
  });

  it('lets a compact ThemeProvider nest in a comfortable one', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeProvider density="compact">Heron</ThemeProvider>
      </ThemeProvider>,
    );
    const [outer, inner] = container.querySelectorAll('[data-theme]');
    expect(outer!.hasAttribute('data-density')).toBe(false);
    expect(inner!.getAttribute('data-density')).toBe('compact');
  });

  it('throws on an unknown density', () => {
    expect(() =>
      render(
        // @ts-expect-error an unknown density
        <ThemeProvider density="tight">Heron</ThemeProvider>,
      ),
    ).toThrow(RangeError);
    expect(themeDensities).toEqual(['comfortable', 'compact']);
  });
});

describe('the default output stays the same without compact', () => {
  it('declares the comfortable control scale on every themed root', () => {
    const [firstBlock] = css.split("[data-theme='dark'] {");
    for (const [size, value] of Object.entries(controlScale)) {
      for (const block of [firstBlock!, css]) {
        expect(block).toContain(
          `--sw-control-${size}-min-height: ${value.minHeight}px;`,
        );
        expect(block).toContain(
          `--sw-control-${size}-padding-inline: ${value.paddingInline}px;`,
        );
      }
    }
  });

  it('keeps every compact value inside the one density block', () => {
    expect(css.split(density)).toHaveLength(2);
    const rest = css.replace(density, '');
    expect(rest).not.toContain('data-density');
    expect(rest).not.toContain('--sw-filter-chip-min-height: ');
    expect(rest).not.toContain('(pointer: fine)');
  });

  it('keeps the card at the large radius and the canvas at the body type', () => {
    expect(css).toContain(
      '.sw-card {\n  border-radius: var(--sw-radius-lg);\n  color: var(--sw-color-text);\n}',
    );
    const { fontSize, lineHeight } = typographyVariants.body;
    const canvas = css.slice(css.indexOf('[data-theme] {\n  background-color'));
    expect(canvas).toContain(`font-size: ${fontSize}px;`);
    expect(canvas).toContain(`line-height: ${lineHeight}px;`);
  });

  it('draws a chip at the md control height with its box inside it', () => {
    const face = css.slice(css.indexOf('.sw-filter-chip-face {'));
    const rule = face.slice(0, face.indexOf('}'));
    expect(rule).toContain('box-sizing: border-box;');
    expect(rule).toContain(
      'min-height: var(--sw-filter-chip-min-height, var(--sw-control-md-min-height));',
    );
  });
});

describe('the compact density', () => {
  it('holds every rule under one fine-pointer query, so touch keeps 44 px', () => {
    expect(density.startsWith('@media (pointer: fine) {\n')).toBe(true);
    expect(density.endsWith('\n}')).toBe(true);
    expect(density.match(/@media/g)).toHaveLength(1);
    expect(css).toContain(
      '@media (pointer: coarse) {\n  .sw-button { min-height: var(--sw-control-md-min-height);',
    );
  });

  it('outranks the [data-theme] block that declares the comfortable values', () => {
    expect(density).toContain("[data-theme][data-density='compact'] {");
  });

  it('restates each control size, and the buttons read the variables', () => {
    for (const [size, value] of Object.entries(compactControlScale)) {
      expect(density).toContain(
        `--sw-control-${size}-min-height: ${value.minHeight}px;`,
      );
      expect(density).toContain(
        `--sw-control-${size}-padding-inline: ${value.paddingInline}px;`,
      );
      expect(css).toContain(
        `.sw-button-${size} { min-height: var(--sw-control-${size}-min-height); padding-inline: var(--sw-control-${size}-padding-inline); }`,
      );
    }
    expect(compactControlScale.md).toEqual({
      minHeight: 36,
      paddingInline: 14,
    });
    expect(density).toContain('--sw-filter-chip-min-height: 32px;');
  });

  it('sets reading text in a card, a table and a description list at bodySm', () => {
    const { fontSize, lineHeight } = typographyVariants.bodySm;
    expect([fontSize, lineHeight]).toEqual([15, 22]);
    expect(typographyVariants.bodySm.fontWeight).toBe(400);
    const rule = density.slice(
      density.indexOf(
        ':is(.sw-card, .sw-table, .sw-description-list) .sw-text-body {',
      ),
    );
    expect(rule.slice(0, rule.indexOf('}'))).toContain(
      `font-size: ${fontSize}px;`,
    );
  });

  it('rounds a card at the md radius', () => {
    expect(density).toContain(
      '.sw-card {\n    border-radius: var(--sw-radius-md);',
    );
  });

  it('counts a bounded table with its smaller line', () => {
    expect(density).toContain(
      '.sw-table-bounded {\n    --sw-table-row-line: 22px;',
    );
  });

  it('keeps a glyph tile, which holds letters, at its size', () => {
    expect(css).toContain('.sw-glyph-tile-md { --sw-glyph-tile-side: 28px;');
  });
});
