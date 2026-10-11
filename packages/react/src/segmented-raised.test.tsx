import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { contrastRatio } from '@scalewing/tokens';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from './components/SegmentedControl.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme, tintOver } from './every-theme.test-support.js';

afterEach(() => cleanup());

const items = [
  { id: 'largest', label: 'Largest first' },
  { id: 'twenties', label: 'Twenties only' },
];

describe('SegmentedControl variant raised', () => {
  it('keeps the compact track by default', () => {
    render(
      <SegmentedControl
        aria-label="Bills"
        items={items}
        onChange={vi.fn()}
        value="largest"
      />,
    );
    expect(screen.getByRole('radiogroup').className).toBe('sw-segmented');
  });

  it('marks the raised track and keeps radio semantics', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="Bills"
        items={items}
        onChange={onChange}
        value="largest"
        variant="raised"
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Bills' });
    expect(group.className).toBe('sw-segmented sw-segmented-raised');
    expect(
      screen
        .getByRole('radio', { name: 'Largest first' })
        .getAttribute('aria-checked'),
    ).toBe('true');
    screen.getByRole('radio', { name: 'Twenties only' }).click();
    expect(onChange).toHaveBeenCalledWith('twenties');
  });

  it('keeps the raised look with marks, not the compact icon track', () => {
    render(
      <SegmentedControl
        aria-label="Service"
        items={items.map((item) => ({ ...item, icon: <svg /> }))}
        onChange={vi.fn()}
        value="largest"
        variant="raised"
      />,
    );
    expect(screen.getByRole('radiogroup').className).toBe(
      'sw-segmented sw-segmented-raised sw-segmented-with-icons',
    );
  });

  it('generates the grey track, the raised selected segment and forced colours', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toContain('sw-segmented-raised');
    expect(css).toContain(`.sw-segmented.sw-segmented-raised {
  background: color-mix(in srgb, var(--sw-color-muted) 16%, transparent);
  border-color: transparent;
  border-radius: calc(var(--sw-radius-sm) + 2px);
}`);
    expect(css)
      .toContain(`.sw-segmented.sw-segmented-raised .sw-segmented-item {
  border-radius: var(--sw-radius-sm);
  color: var(--sw-color-text);`);
    expect(css)
      .toContain(`.sw-segmented.sw-segmented-raised .sw-segmented-item-selected {
  background: var(--sw-color-surface);
  box-shadow: var(--sw-elevation-sm);
  font-weight: 600;
}`);
    expect(css).toContain(
      '.sw-segmented.sw-segmented-raised .sw-segmented-item-selected { outline: 2px solid Highlight; }',
    );
    expect(css).toContain(
      '.sw-segmented-field > .sw-segmented.sw-segmented-raised {\n  align-self: flex-start;\n}',
    );
    // The compact icon rules leave a raised track alone.
    expect(css).toContain(
      '.sw-segmented.sw-segmented-with-icons:not(.sw-segmented-filled, .sw-segmented-raised) {',
    );
  });
});

describe('SegmentedControl raised in the dark scheme and with an error', () => {
  it('rings the selected segment in the muted color, 3:1 or more on the track in every dark palette', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      "[data-theme='dark'] .sw-segmented.sw-segmented-raised .sw-segmented-item-selected {\n  box-shadow: inset 0 0 0 1px var(--sw-color-muted);\n}",
    );
    forEveryTheme((colors, label) => {
      if (!label.endsWith('dark')) return;
      for (const under of [colors.background, colors.surface]) {
        const track = tintOver(colors.muted, 0.16, under);
        expect(
          contrastRatio(colors.muted, track),
          label,
        ).toBeGreaterThanOrEqual(3);
        expect(contrastRatio(colors.text, track), label).toBeGreaterThanOrEqual(
          4.5,
        );
      }
    });
  });

  it('restates the danger outline after the raised track, and Mark in forced colors', () => {
    const css = generateStylesheet();
    const invalid =
      ".sw-segmented.sw-segmented-raised[aria-invalid='true'] {\n  border-color: var(--sw-color-danger);\n}";
    expect(css).toContain(invalid);
    expect(css.indexOf(invalid)).toBeGreaterThan(
      css.indexOf('.sw-segmented.sw-segmented-raised {'),
    );
    expect(css).toContain(
      ".sw-segmented.sw-segmented-raised[aria-invalid='true'] { border-color: Mark; }",
    );
  });

  it('moves the choice with the arrow keys', () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        aria-label="Bills"
        items={items}
        onChange={onChange}
        value="largest"
        variant="raised"
      />,
    );
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('twenties');
  });
});
