import { cleanup, render, screen } from '@testing-library/react';
import { contrastRatio, type SemanticColorKey } from '@scalewing/tokens';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SegmentedControl } from './components/SegmentedControl.js';
import { cssSegmentedClasses } from './css/css-segmented.js';
import { utilityClassCatalog } from './css/stylesheet.js';
import { forEveryTheme } from './every-theme.test-support.js';

afterEach(() => cleanup());

const items = [
  { id: 'add', label: 'Add' },
  { id: 'remove', label: 'Remove' },
];

describe('SegmentedControl error and required', () => {
  it('describes the group by its error, marks it invalid and keeps it mounted', () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <SegmentedControl
        ref={ref}
        aria-label="Direction"
        items={items}
        onChange={vi.fn()}
        required
        value=""
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Direction' });
    expect(ref.current).toBe(group);
    expect(group.getAttribute('aria-required')).toBe('true');
    expect(group.hasAttribute('aria-invalid')).toBe(false);
    expect(group.hasAttribute('aria-describedby')).toBe(false);

    rerender(
      <SegmentedControl
        ref={ref}
        aria-label="Direction"
        error="Choose add or remove."
        items={items}
        onChange={vi.fn()}
        required
        value=""
      />,
    );
    // The same element: an error does not remount the group or move focus.
    expect(screen.getByRole('radiogroup', { name: 'Direction' })).toBe(group);
    expect(group.getAttribute('aria-invalid')).toBe('true');
    const message = screen.getByText('Choose add or remove.');
    expect(message.className).toBe('sw-field-error');
    expect(message.getAttribute('aria-live')).toBe('polite');
    expect(group.getAttribute('aria-describedby')).toBe(message.id);
    expect(screen.queryByRole('alert')).toBeNull();
    // The radios themselves stay plain: the group carries the state.
    for (const radio of screen.getAllByRole('radio'))
      expect(radio.hasAttribute('aria-invalid')).toBe(false);
  });

  it('treats an empty error as no error and required as optional', () => {
    render(
      <SegmentedControl
        aria-label="Direction"
        error=""
        items={items}
        onChange={vi.fn()}
        value="add"
      />,
    );
    const group = screen.getByRole('radiogroup', { name: 'Direction' });
    expect(group.hasAttribute('aria-invalid')).toBe(false);
    expect(group.hasAttribute('aria-required')).toBe(false);
  });

  it('wraps the track in a field that mirrors its variant', () => {
    render(
      <>
        <SegmentedControl
          aria-label="Compact"
          items={items}
          onChange={vi.fn()}
          value="add"
        />
        <SegmentedControl
          aria-label="Filled"
          items={items}
          onChange={vi.fn()}
          value="add"
          variant="filled"
        />
      </>,
    );
    expect(
      screen.getByRole('radiogroup', { name: 'Compact' }).parentElement!
        .className,
    ).toBe('sw-segmented-field');
    expect(
      screen.getByRole('radiogroup', { name: 'Filled' }).parentElement!
        .className,
    ).toBe('sw-segmented-field sw-segmented-field-filled');
  });
});

describe('SegmentedControl invalid outline', () => {
  const css = cssSegmentedClasses();
  const rule =
    /\.sw-segmented\[aria-invalid='true'\] \{\n {2}border-color: var\(--sw-color-(\w+)\);/.exec(
      css,
    );

  it('generates the outline, its forced-colors mark and the classes', () => {
    expect(rule).not.toBeNull();
    expect(css).toContain(
      ".sw-segmented[aria-invalid='true'] { border-color: Mark; }",
    );
    expect(css).toContain(
      '.sw-segmented-field > .sw-field-error {\n  contain: inline-size;',
    );
    // Review of PR #75: a short track squeezed its message into a column.
    // The floor sits on the field, where 100% is the Stack or Inline; on the
    // contained message it would be cyclic and resolve to nothing.
    expect(css).toContain(
      '.sw-segmented-field:has(> .sw-field-error:not(:empty)) {\n  min-inline-size: min(100%, 24ch);',
    );
    expect(css).toContain(
      '.sw-inline > .sw-segmented-field > .sw-segmented {\n  align-self: flex-start;',
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-segmented-field',
        'sw-segmented-field-filled',
        'sw-segmented',
        'sw-segmented-disabled',
      ]),
    );
  });

  it('keeps the outline at 3:1 against the page and surface in every palette and scheme', () => {
    const token = rule![1] as SemanticColorKey;
    forEveryTheme((colors, label) => {
      expect(
        contrastRatio(colors[token], colors.background),
        label,
      ).toBeGreaterThanOrEqual(3);
      expect(
        contrastRatio(colors[token], colors.surface),
        label,
      ).toBeGreaterThanOrEqual(3);
    });
  });
});
