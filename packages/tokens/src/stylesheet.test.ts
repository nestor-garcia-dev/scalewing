import { describe, expect, it } from 'vitest';

import { contrastRatio } from './contrast.js';
import { createTheme } from './create-theme.js';
import { product } from './product.js';
import { spacingClass } from './spacing-classes.js';
import { generateStylesheet, utilityClassCatalog } from './stylesheet.js';
import { darkTheme, lightTheme } from './theme.js';

describe('product', () => {
  it('uses Scalewing as the display name', () => {
    expect(product.displayName).toBe('Scalewing');
  });
});

describe('createTheme', () => {
  it('overlays a brand accent on the light palette', () => {
    const theme = createTheme({
      colorScheme: 'light',
      colors: { accent: '#164F37' },
    });

    expect(theme.colors.accent).toBe('#164F37');
    expect(theme.colors.background).toBe(lightTheme.colors.background);
    expect(theme.glass.fill).toBe(lightTheme.glass.fill);
  });

  it('rejects unknown color keys', () => {
    expect(() =>
      createTheme({
        colorScheme: 'light',
        colors: { primary: '#000000' } as never,
      }),
    ).toThrow(/Unknown color token/);
  });

  it('rejects empty or non-hex colors', () => {
    expect(() =>
      createTheme({
        colorScheme: 'dark',
        colors: { text: 'blue' },
      }),
    ).toThrow(/Invalid color/);
  });

  it('applies light and dark brand overlays when the user switches scheme', () => {
    const colors = {
      light: { accent: '#0066CC', onAccent: '#FFFFFF' },
      dark: { accent: '#5AC8FA', onAccent: '#101214' },
    };

    expect(createTheme({ colorScheme: 'light', colors }).colors.accent).toBe(
      '#0066CC',
    );
    expect(createTheme({ colorScheme: 'dark', colors }).colors.accent).toBe(
      '#5AC8FA',
    );
  });

  it('rejects mixing a flat overlay with light/dark maps', () => {
    expect(() =>
      createTheme({
        colorScheme: 'light',
        colors: {
          accent: '#0066CC',
          light: { accent: '#164F37' },
        } as never,
      }),
    ).toThrow(/not both/);
  });
});

describe('contrast', () => {
  it('keeps body text above 4.5:1 on light and dark canvases', () => {
    expect(
      contrastRatio(lightTheme.colors.text, lightTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(lightTheme.colors.muted, lightTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(lightTheme.colors.text, lightTheme.colors.surface),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(darkTheme.colors.text, darkTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(darkTheme.colors.muted, darkTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps button label colors at 4.5:1 on accent and danger', () => {
    expect(
      contrastRatio(lightTheme.colors.onAccent, lightTheme.colors.accent),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(lightTheme.colors.onDanger, lightTheme.colors.danger),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(darkTheme.colors.onAccent, darkTheme.colors.accent),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(darkTheme.colors.onDanger, darkTheme.colors.danger),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps indigo accent readable on the canvas and away from success', () => {
    expect(lightTheme.colors.accent).toBe('#5B3DF5');
    expect(darkTheme.colors.accent).toBe('#A78BFA');
    expect(
      contrastRatio(lightTheme.colors.accent, lightTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrastRatio(darkTheme.colors.accent, darkTheme.colors.background),
    ).toBeGreaterThanOrEqual(4.5);
    expect(lightTheme.colors.accent).not.toBe(lightTheme.colors.success);
    expect(darkTheme.colors.accent).not.toBe(darkTheme.colors.success);
  });
});

describe('generated CSS', () => {
  const css = generateStylesheet();
  const catalog = utilityClassCatalog();

  it('emits spacing step 4 as a class, not 4px in the name', () => {
    expect(spacingClass('padding', 'top', 4)).toBe('sw-padding-top-4');
    expect(css).toContain('.sw-padding-top-4');
    expect(css).toContain('--sw-space-4: 16px');
    expect(catalog).toContain('sw-padding-top-4');
    expect(catalog).not.toContain('sw-padding-top-13px');
  });

  it('includes the bounded layout catalog', () => {
    expect(catalog).toEqual(expect.arrayContaining(['sw-stack', 'sw-sr-only']));
    expect(css).toContain('.sw-stack');
    expect(css).not.toContain('!important');
  });

  it('emits the document canvas, glass cards, and pill buttons', () => {
    expect(css).toMatch(/\[data-theme\] \[data-theme\] \{\s*min-height: 0;/);
    expect(css).toContain('--sw-glass-specular:');
    expect(css).toContain('inset 0 1px 0 var(--sw-glass-specular)');
    expect(css).toContain('.sw-card-glass');
    expect(css).toContain('backdrop-filter:');
    expect(css).toContain('border-radius: var(--sw-radius-pill)');
    expect(css).toContain('.sw-app-header');
    expect(css).toContain('.sw-nav a');
    expect(css).toContain(".sw-nav a[aria-current='page']");
    expect(css).toContain('.sw-field-xs');
    expect(css).toContain('[data-theme] select');
    expect(css).toContain('appearance: none');
    expect(css).toContain('box-sizing: content-box');
    expect(css).toContain('[data-theme] select:focus-visible');
    expect(css).toContain(
      'var(--sw-control-xs-padding-inline) + var(--sw-space-5)',
    );
    expect(css).toContain('textarea):focus-visible');
    expect(catalog).toEqual(
      expect.arrayContaining(['sw-card-glass', 'sw-card-outlined']),
    );
  });

  it('emits button classes from tokens, including a 44px md control', () => {
    expect(catalog).toEqual(
      expect.arrayContaining([
        'sw-button',
        'sw-button-primary',
        'sw-button-md',
      ]),
    );
    expect(css).toContain('.sw-button-primary');
    expect(css).toContain('--sw-control-md-min-height: 44px');
    expect(css).toContain('.sw-button-md { min-height: 44px');
    expect(css).toContain('--sw-control-xs-min-height: 28px');
    expect(css).toContain('.sw-button-xs { min-height: 28px');
    expect(catalog).toContain('sw-button-xs');
  });

  it('emits opt-in density type, tabular numerals, and dashboard classes', () => {
    expect(css).toContain('.sw-text-data');
    expect(css).toContain('font-variant-numeric: tabular-nums');
    expect(css).toContain('.sw-tabular');
    expect(catalog).toEqual(
      expect.arrayContaining([
        'sw-text-data',
        'sw-tabular',
        'sw-badge',
        'sw-badge-accent',
        'sw-badge-sm',
        'sw-segmented',
        'sw-table',
        'sw-table-numeric',
        'sw-table-clip',
        'sw-table-sticky',
        'sw-table-compact',
        'sw-table-row-selected',
        'sw-bar-chart',
        'sw-bar-chart-fill',
      ]),
    );
    expect(css).toContain('.sw-badge-sm');
    expect(css).toContain('.sw-table-compact');
    expect(css).toContain('.sw-bar-chart-fill');
    expect(css).toContain('width: calc(var(--sw-bar-fill, 0) * 100%)');
    expect(css).toContain('.sw-dialog');
    expect(css).toContain('.sw-dialog::backdrop');
    expect(css).toContain('margin: auto');
    expect(css).toContain('--sw-dialog-max: 32rem');
    expect(css).toContain('--sw-select-max: 16rem');
    expect(css).toContain('.sw-select-trigger');
    expect(css).toContain('.sw-select-list');
    expect(catalog).toContain('sw-select');
    expect(catalog).toContain('sw-select-list');
    expect(catalog).toContain('sw-select-action');
    expect(css).toContain('.sw-select-action');
    expect(css).toContain('.sw-action-menu-list');
    expect(css).toContain('.sw-action-menu-item-danger');
    expect(catalog).toContain('sw-action-menu-trigger');
    for (const className of [
      'sw-switch',
      'sw-switch-control',
      'sw-switch-input',
      'sw-switch-track',
      'sw-switch-thumb',
      'sw-switch-copy',
      'sw-switch-label',
      'sw-switch-description',
    ]) {
      expect(css).toContain(`.${className}`);
      expect(catalog).toContain(className);
    }
    expect(css).toContain('.sw-switch-input:checked + .sw-switch-track');
    for (const className of [
      'sw-checkbox',
      'sw-checkbox-label',
      'sw-checkbox-control',
      'sw-checkbox-input',
      'sw-checkbox-mark',
      'sw-checkbox-text',
      'sw-checkbox-description',
      'sw-checkbox-error',
    ]) {
      expect(css).toContain(`.${className}`);
      expect(catalog).toContain(className);
    }
    expect(css).toContain('.sw-checkbox-input:checked + .sw-checkbox-mark');
    for (const className of [
      'sw-radio-group',
      'sw-radio-group-legend',
      'sw-radio-group-options',
      'sw-radio-group-option',
      'sw-radio-group-control',
      'sw-radio-group-input',
      'sw-radio-group-mark',
      'sw-radio-group-text',
      'sw-radio-group-description',
      'sw-radio-group-error',
    ]) {
      expect(css).toContain(`.${className}`);
      expect(catalog).toContain(className);
    }
    expect(css).toContain(
      '.sw-radio-group-input:checked + .sw-radio-group-mark',
    );
    for (const className of [
      'sw-spinner',
      'sw-spinner-sm',
      'sw-spinner-md',
      'sw-spinner-lg',
      'sw-spinner-icon',
    ]) {
      expect(css).toContain(`.${className}`);
      expect(catalog).toContain(className);
    }
    expect(css).toContain('@keyframes sw-spinner-rotate');
    expect(css).toContain('.sw-spinner-icon { animation: none; }');
    for (const className of [
      'sw-progress',
      'sw-progress-accent',
      'sw-progress-success',
      'sw-progress-danger',
      'sw-progress-heading',
      'sw-progress-label',
      'sw-progress-count',
      'sw-progress-bar',
    ]) {
      expect(css).toContain(`.${className}`);
      expect(catalog).toContain(className);
    }
    expect(css).toContain('.sw-progress-bar::-webkit-progress-value');
    expect(css).toContain('.sw-progress-bar::-moz-progress-bar');
    expect(css).toContain(
      '.sw-checkbox-input:focus-visible + .sw-checkbox-mark',
    );
    expect(css).toContain('@media (forced-colors: active)');
    for (const className of [
      'sw-date-field',
      'sw-date-field-label',
      'sw-date-field-input',
      'sw-date-field-description',
      'sw-date-field-error',
    ]) {
      expect(css).toContain(`.${className}`);
      expect(catalog).toContain(className);
    }
    expect(catalog).toContain('sw-dialog');
    expect(css).toContain('.sw-accordion');
    expect(css).toContain('.sw-accordion-summary');
    expect(catalog).toContain('sw-accordion');
    expect(catalog).toContain('sw-accordion-summary');
    expect(css).toContain('.sw-split');
    expect(css).toContain('.sw-split-handle');
    expect(css).toContain('.sw-split-grip');
    expect(css).toContain('--sw-split-min: 14rem');
    expect(css).toContain('--sw-split-size: 22rem');
    expect(css).toContain('--sw-split-max: 32rem');
    expect(catalog).toContain('sw-split');
    expect(catalog).toContain('sw-split-handle');
    expect(css).toContain('.sw-toast');
    expect(css).toContain('sw-toast-float');
    expect(css).toContain('--sw-quiet-opacity:');
    expect(css).toContain('--sw-motion-default:');
    expect(css).toContain(".sw-button[aria-pressed='false']");
    expect(catalog).toContain('sw-toast');
    expect(catalog).toContain('sw-toast-travel');
    expect(css).toContain('--sw-motion-travel:');
    expect(css).toContain('--sw-motion-travel-easing:');
    expect(css).toContain('scale: 1.2');
  });

  it('keeps light and dark semantic color variables in parity', () => {
    for (const key of Object.keys(lightTheme.colors)) {
      expect(css).toContain(
        `--sw-color-${key}: ${lightTheme.colors[key as keyof typeof lightTheme.colors]}`,
      );
      expect(css).toContain(
        `--sw-color-${key}: ${darkTheme.colors[key as keyof typeof darkTheme.colors]}`,
      );
    }
  });
});
