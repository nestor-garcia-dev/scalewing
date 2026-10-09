import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DenominationGrid } from './components/DenominationGrid.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const columns = [
  { key: '1', label: '$1' },
  { key: '5', label: '$5' },
  { key: '10', label: '$10' },
];

describe('DenominationGrid labelWidth', () => {
  it('leaves a plain strip as it was', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Received"
        rows={[{ id: 'in', label: 'Received', cells: [1, 0, 2] }]}
      />,
    );
    const table = screen.getByRole('table', { name: 'Received' });
    expect(table.className).toBe('sw-denomination-grid sw-denomination-strip');
    expect(table.getAttribute('style')).toBeNull();
    expect(table.parentElement?.className).toBe('sw-denomination-scroll');
  });

  it('lines a strip up: the label width class, the column count, no total share', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Removed"
        labelWidth="md"
        rows={[{ id: 'out', label: 'Removed', cells: [0, 1, 0] }]}
      />,
    );
    const table = screen.getByRole('table', { name: 'Removed' });
    expect(table.className).toBe(
      'sw-denomination-grid sw-denomination-strip sw-denomination-strip-aligned sw-denomination-label-md',
    );
    expect(table.style.getPropertyValue('--sw-denomination-columns')).toBe('3');
    expect(table.style.getPropertyValue('--sw-denomination-total')).toBe('0');
    expect(table.parentElement?.className).toBe(
      'sw-denomination-scroll sw-denomination-scroll-aligned',
    );
  });

  it('gives a total column a share when a row has a total', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Flow"
        labelWidth="lg"
        rows={[{ id: 'in', label: 'In', cells: [1, 0, 2], total: '$21' }]}
        totalLabel="Total"
      />,
    );
    const table = screen.getByRole('table', { name: 'Flow' });
    expect(table.style.getPropertyValue('--sw-denomination-total')).toBe('1');
  });

  it('ignores labelWidth in the tiles layout, and refuses an unknown width', () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Kit"
        labelWidth="sm"
        layout="tiles"
        rows={[{ id: 'kit', label: 'Kit', cells: [1, 0, 2] }]}
      />,
    );
    expect(document.querySelector('.sw-denomination-strip-aligned')).toBeNull();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    try {
      expect(() =>
        render(
          <DenominationGrid
            columns={columns}
            label="Bad"
            // @ts-expect-error not a width.
            labelWidth="12ch"
            rows={[{ id: 'kit', label: 'Kit', cells: [1, 0, 2] }]}
          />,
        ),
      ).toThrow('Unknown labelWidth: 12ch');
    } finally {
      consoleError.mockRestore();
    }
  });

  it('generates the container, the label widths and the shared columns', () => {
    const css = generateStylesheet();
    expect(css).toContain(
      '.sw-denomination-scroll-aligned {\n  container-type: inline-size;\n}',
    );
    expect(css).toContain(
      '.sw-denomination-label-md { --sw-denomination-label-width: 8rem; }',
    );
    expect(css).toMatch(
      /--sw-denomination-share: calc\(\n {4}\(100cqi - var\(--sw-denomination-label-width\)\) \/\n {6}\(var\(--sw-denomination-columns\) \+ var\(--sw-denomination-total\) \* var\(--sw-denomination-total-shown\)\)\n {2}\);/,
    );
    expect(css).toContain(
      '.sw-denomination-strip-aligned .sw-denomination-label,\n.sw-denomination-strip-aligned thead .sw-denomination-corner:first-child {\n  width: var(--sw-denomination-label-width);\n}',
    );
    // Below md the total column collapses and takes no share.
    expect(css).toMatch(
      /@media not all and \(min-width: 48rem\) \{\n {2}\.sw-denomination-strip-aligned \{ --sw-denomination-total-shown: 0; \}/,
    );
    expect(utilityClassCatalog()).toEqual(
      expect.arrayContaining([
        'sw-denomination-scroll-aligned',
        'sw-denomination-strip-aligned',
        'sw-denomination-label-xs',
        'sw-denomination-label-xl',
      ]),
    );
  });
});
