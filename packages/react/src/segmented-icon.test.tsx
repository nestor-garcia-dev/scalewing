import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SegmentedControl } from './components/SegmentedControl.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

describe('SegmentedControl item icon', () => {
  it('puts a hidden mark before each label, named by the label alone', () => {
    render(
      <SegmentedControl
        aria-label="Habitat"
        items={[
          { id: 'forest', label: 'Forest', icon: <svg data-testid="leaf" /> },
          { id: 'lake', label: 'Lake', icon: <svg /> },
        ]}
        onChange={() => undefined}
        value="lake"
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Habitat' });
    expect(group.className).toBe('sw-segmented sw-segmented-with-icons');
    const forest = screen.getByRole('radio', { name: 'Forest' });
    const icon = forest.firstElementChild;
    expect(icon?.className).toBe('sw-segmented-item-icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
    expect(icon?.contains(screen.getByTestId('leaf'))).toBe(true);
    expect(
      screen.getByRole('radio', { name: 'Lake' }).getAttribute('aria-checked'),
    ).toBe('true');
  });

  it('leaves a track without icons as it was', () => {
    render(
      <SegmentedControl
        aria-label="Habitat"
        items={[
          { id: 'forest', label: 'Forest' },
          { id: 'lake', label: 'Lake' },
        ]}
        onChange={() => undefined}
        value="lake"
      />,
    );
    expect(screen.getByRole('radiogroup').className).toBe('sw-segmented');
    expect(screen.getByRole('radio', { name: 'Forest' }).innerHTML).toBe(
      'Forest',
    );
  });

  it('raises every item to the md control height with label type, on a subtle track', () => {
    const css = generateStylesheet();
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-segmented-with-icons',
        'sw-segmented-item-icon',
      ]),
    );
    const compact =
      '.sw-segmented-with-icons:not(.sw-segmented-filled, .sw-segmented-raised)';
    expect(css).toContain(
      `${compact} .sw-segmented-item {\n  font-size: 15px;`,
    );
    expect(css).toMatch(
      /:not\(\.sw-segmented-filled, \.sw-segmented-raised\) \.sw-segmented-item \{[^}]*min-height: var\(--sw-control-md-min-height\);/,
    );
    // The track is the subtle fill and the selection is raised.
    expect(css).toContain(
      `.sw-segmented${compact} {\n  background: var(--sw-color-subtle);`,
    );
    expect(css).toContain(
      `${compact} .sw-segmented-item-selected {\n  box-shadow: var(--sw-elevation-sm);`,
    );
  });

  it('keeps the danger outline on an icon track, in forced colours too', () => {
    const css = generateStylesheet();
    const track = css.indexOf(
      '.sw-segmented.sw-segmented-with-icons:not(.sw-segmented-filled, .sw-segmented-raised) {',
    );
    const invalid = css.indexOf(
      ".sw-segmented.sw-segmented-with-icons[aria-invalid='true'] {\n  border-color: var(--sw-color-danger);",
    );
    expect(track).toBeGreaterThan(-1);
    expect(invalid).toBeGreaterThan(track);
    expect(css).toMatch(
      /@media \(forced-colors: active\) \{[^@]*\.sw-segmented\.sw-segmented-with-icons:not\(\.sw-segmented-filled, \.sw-segmented-raised\) \{ border-color: CanvasText; \}[^@]*outline: 2px solid Highlight;[^@]*\.sw-segmented\.sw-segmented-with-icons\[aria-invalid='true'\] \{ border-color: Mark; \}/,
    );
  });

  it('keeps the subtle track under reduced transparency', () => {
    const css = generateStylesheet();
    // The reduced-transparency reset names the track by one class; the
    // icon track's fill is two classes and more, so it wins.
    expect(css).toMatch(/prefers-reduced-transparency[^]*\.sw-segmented[,\s]/);
    expect(css).not.toMatch(
      /prefers-reduced-transparency[^@]*\.sw-segmented\.sw-segmented-with-icons/,
    );
  });

  it('leaves a filled track its own look and only adds the marks', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-segmented-with-icons .sw-segmented-item {\n  align-items: center;\n  display: inline-flex;\n  gap: var(--sw-space-2);',
    );
    expect(css).not.toMatch(
      /\.sw-segmented-with-icons \.sw-segmented-item \{[^}]*font-size/,
    );
    render(
      <SegmentedControl
        aria-label="Habitat"
        items={[
          { id: 'forest', label: 'Forest', icon: <svg /> },
          { id: 'lake', label: 'Lake', icon: <svg /> },
        ]}
        onChange={() => undefined}
        value="lake"
        variant="filled"
      />,
    );
    expect(screen.getByRole('radiogroup').className).toContain(
      'sw-segmented-filled',
    );
  });

  it('marks a disabled icon track disabled', () => {
    render(
      <SegmentedControl
        aria-label="Habitat"
        disabled
        items={[
          { id: 'forest', label: 'Forest', icon: <svg /> },
          { id: 'lake', label: 'Lake' },
        ]}
        onChange={() => undefined}
        value="lake"
      />,
    );
    expect(screen.getByRole('radiogroup').className).toBe(
      'sw-segmented sw-segmented-with-icons sw-segmented-disabled',
    );
  });
});
