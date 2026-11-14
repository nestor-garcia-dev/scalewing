import { cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DenominationGrid } from './components/DenominationGrid.js';
import { breakpointQuery } from './css/breakpoints.js';
import { generateStylesheet } from './css/stylesheet.js';

let narrow = true;

beforeEach(() => {
  narrow = true;
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query === breakpointQuery('below', 'md') ? narrow : false;
    },
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const columns = [
  { key: 'one', label: 'Burrows of one' },
  { key: 'five', label: 'Burrows of five' },
];

function pinnedTexts(): string[] {
  return [...document.querySelectorAll('.sw-denomination-transposed-end')].map(
    (cell) => cell.textContent ?? '',
  );
}

describe('DenominationGrid pinEnd', () => {
  it('pins the last row’s value line and its total at the end while transposed', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Burrows kept"
        pinEnd
        rows={[
          { id: 'seen', label: 'Seen', cells: [1, 2] },
          {
            id: 'keep',
            label: 'Keep',
            cells: [3, 1],
            total: '8',
            valueRow: { label: 'Worth', cells: ['3', '5'] },
          },
        ]}
        totalLabel="Total"
        transposeBelow="md"
      />,
    );
    expect(
      document.querySelector('.sw-denomination-scroll-pin-end'),
    ).not.toBeNull();
    // The value line's head, its two values and the total: one column.
    expect(pinnedTexts()).toEqual(['Worth', '3', '5', '8']);
  });

  it('pins a last row’s counts when it has no value line', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Burrows kept"
        pinEnd
        rows={[{ id: 'seen', label: 'Seen', cells: [1, 2], total: '11' }]}
        transposeBelow="md"
      />,
    );
    expect(pinnedTexts()).toEqual(['Seen', '1', '2', '11']);
  });

  it('pins nothing by default or while not transposed, and needs transposeBelow', () => {
    const rows = [{ id: 'seen', label: 'Seen', cells: [1, 2], total: '11' }];
    const { rerender } = render(
      <DenominationGrid
        columns={columns}
        label="Burrows kept"
        rows={rows}
        transposeBelow="md"
      />,
    );
    expect(pinnedTexts()).toEqual([]);
    narrow = false;
    rerender(
      <DenominationGrid
        columns={columns}
        label="Burrows kept"
        pinEnd
        rows={rows}
        transposeBelow="md"
      />,
    );
    expect(pinnedTexts()).toEqual([]);
    expect(() =>
      render(
        <DenominationGrid
          columns={columns}
          label="Burrows kept"
          pinEnd
          rows={rows}
        />,
      ),
    ).toThrow(TypeError);
  });

  it('generates the sticky end column and its shade', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-denomination-scroll-pin-end .sw-denomination-transposed-end {',
    );
    expect(css).toMatch(
      /\.sw-denomination-scroll-pin-end \.sw-denomination-transposed-end \{[^}]*inset-inline-end: 0;\s*position: sticky;/,
    );
    expect(css).toContain(
      '.sw-denomination-scroll-pin-end.sw-scroll-more-end .sw-denomination-transposed-end::before',
    );
    // Right to left the shade turns; forced colours draw none.
    expect(css).toMatch(
      /\.sw-denomination-scroll-pin-end\.sw-scroll-more-end:dir\(rtl\) \.sw-denomination-transposed-end::before \{\s*background: linear-gradient\(to right,/,
    );
    expect(css).toMatch(
      /@media \(forced-colors: active\) \{\s*\.sw-denomination-scroll-pin-end\.sw-scroll-more-end \.sw-denomination-transposed-end::before \{ display: none; \}/,
    );
  });

  it('keeps a quiet last row’s fill and an opaque, muted disabled one on the pinned column', () => {
    const css = generateStylesheet();
    // The glass fill skips value and quiet cells, which keep the subtle fill.
    expect(css).toContain(
      '.sw-denomination-scroll-pin-end .sw-denomination-transposed-end:not(.sw-denomination-transposed-value, .sw-denomination-transposed-quiet) {\n  background-color: var(--sw-glass-fill);',
    );
    const disabled =
      '.sw-denomination-scroll-pin-end .sw-denomination-grid.sw-denomination-transposed .sw-denomination-transposed-end.sw-denomination-transposed-disabled {\n  color: var(--sw-color-muted);\n  opacity: 1;';
    expect(css).toContain(disabled);
    // Later than the transposed grid's fade, and more specific, so it wins.
    expect(css.indexOf(disabled)).toBeGreaterThan(
      css.indexOf('.sw-denomination-transposed-disabled:is('),
    );
    render(
      <DenominationGrid
        columns={columns}
        label="Burrows kept"
        pinEnd
        rows={[
          { id: 'seen', label: 'Seen', cells: [1, 2] },
          {
            id: 'gone',
            label: 'Gone',
            cells: [0, 0],
            total: '0',
            emphasis: 'quiet',
            disabled: true,
          },
        ]}
        transposeBelow="md"
      />,
    );
    for (const cell of document.querySelectorAll(
      'tbody .sw-denomination-transposed-end',
    )) {
      expect(cell.classList.contains('sw-denomination-transposed-quiet')).toBe(
        true,
      );
      expect(
        cell.classList.contains('sw-denomination-transposed-disabled'),
      ).toBe(true);
    }
  });
});
