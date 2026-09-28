import { render, screen } from '@testing-library/react';
import {
  buttonVariants,
  contrastRatio,
  createTheme,
  paletteIds,
  type SemanticColorKey,
} from '@scalewing/tokens';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './components/Button.js';
import { cssButtonClasses } from './css/css-button.js';
import { ThemeProvider } from './theme/ThemeProvider.js';

describe('Button', () => {
  it('renders a native button with generated variant and md size classes', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Button onPress={() => undefined}>Save</Button>
      </ThemeProvider>,
    );

    const control = screen.getByRole('button', { name: 'Save' });
    expect(control.tagName).toBe('BUTTON');
    expect(control).toHaveProperty('type', 'button');
    expect(control.className).toContain('sw-button');
    expect(control.className).toContain('sw-button-primary');
    expect(control.className).toContain('sw-button-md');
  });

  it('blocks onPress when disabled and supports submit type', () => {
    const onPress = vi.fn();

    render(
      <ThemeProvider colorScheme="light">
        <Button disabled onPress={onPress} type="submit" variant="danger">
          Publish
        </Button>
      </ThemeProvider>,
    );

    const control = screen.getByRole('button', { name: 'Publish' });
    expect(control).toHaveProperty('disabled', true);
    expect(control).toHaveProperty('type', 'submit');
    expect(control.className).toContain('sw-button-danger');
    control.click();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('passes aria-pressed through to a toggle button', () => {
    render(
      <ThemeProvider colorScheme="light">
        <Button
          aria-pressed={false}
          onPress={() => undefined}
          variant="secondary"
        >
          Forest
        </Button>
      </ThemeProvider>,
    );

    const control = screen.getByRole('button', {
      name: 'Forest',
      pressed: false,
    });
    expect(control.getAttribute('aria-pressed')).toBe('false');
    expect(control.className).toContain('sw-button-secondary');
  });
});

describe('pressed ring contrast', () => {
  // The generated ring: `0 0 0 <gap>px var(--sw-color-<gap>), 0 0 0 <ring>px
  // var(--sw-color-<ring>)`, read from the stylesheet so the test follows it.
  const rule =
    /\.sw-button\[aria-pressed='true'\] \{ box-shadow: 0 0 0 (\d+)px var\(--sw-color-(\w+)\), 0 0 0 (\d+)px var\(--sw-color-(\w+)\); \}/.exec(
      cssButtonClasses(),
    );

  it('draws the ring outside the fill, past a gap', () => {
    expect(rule).not.toBeNull();
    const [, gapWidth, , ringWidth] = rule!;
    expect(Number(gapWidth)).toBeGreaterThan(0);
    expect(Number(ringWidth)).toBeGreaterThan(Number(gapWidth));
  });

  it('keeps 3:1 against the page for every variant, palette and scheme', () => {
    const gapToken = rule![2] as SemanticColorKey;
    const ringToken = rule![4] as SemanticColorKey;
    for (const palette of paletteIds) {
      for (const colorScheme of ['light', 'dark'] as const) {
        const { colors } = createTheme({ colorScheme, palette });
        for (const variant of buttonVariants) {
          // The ring touches only the gap inside it and the page outside it,
          // never the variant's fill, so each variant sees the same pair.
          const label = `${palette} ${colorScheme} ${variant}`;
          expect(
            contrastRatio(colors[ringToken], colors[gapToken]),
            label,
          ).toBeGreaterThanOrEqual(3);
          expect(
            contrastRatio(colors[ringToken], colors.background),
            label,
          ).toBeGreaterThanOrEqual(3);
        }
      }
    }
  });
});
