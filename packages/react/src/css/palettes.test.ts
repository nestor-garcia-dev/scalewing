import { describe, expect, it } from 'vitest';

import { generatePaletteStylesheet } from './css-palettes.js';
import { generateStylesheet } from './stylesheet.js';

describe('default palette stylesheet', () => {
  it('does not emit a stylesheet for the default indigo palette', () => {
    expect(() => generatePaletteStylesheet('indigo')).toThrow(/no overlay/);
  });
});

describe('generated palette CSS', () => {
  const css = generateStylesheet();

  it('paints named palettes with data-palette on the existing canvas', () => {
    expect(css).toContain("[data-theme='light'][data-palette='cerulean']");
    expect(css).toContain("[data-theme='dark'][data-palette='sunburst']");
    expect(css).toContain('--sw-color-accent: #0066CC');
    expect(css).toContain('--sw-color-background: #F6DCAC');
    expect(css).not.toContain("data-palette='indigo'");
    expect(css).not.toContain("data-palette='azure'");
  });

  it('emits a root overlay file for a single palette import', () => {
    const cerulean = generatePaletteStylesheet('cerulean');
    expect(cerulean).toContain(':root');
    expect(cerulean).toContain('--sw-color-accent: #0066CC');
    expect(cerulean).toContain('--sw-color-accent: #5AC8FA');
    expect(cerulean).toContain('--sw-glass-fill:');
  });
});
