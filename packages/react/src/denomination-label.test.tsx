import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  DenominationGrid,
  type DenominationLabelAppearance,
} from './components/DenominationGrid.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';

afterEach(() => cleanup());

const columns = [
  { key: '1', label: '$1' },
  { key: '5', label: '$5' },
];

const rows = [
  { id: 'in', label: 'Received', cells: [1, 2], tone: 'success' as const },
  { id: 'out', label: 'Change', cells: [0, 1], tone: 'danger' as const },
];

describe('DenominationGrid labelAppearance', () => {
  it('keeps the toned labels by default', () => {
    render(<DenominationGrid columns={columns} label="Count" rows={rows} />);
    expect(screen.getByRole('table', { name: 'Count' }).className).toBe(
      'sw-denomination-grid sw-denomination-strip',
    );
  });

  it('marks a plain strip and plain tiles, rows keeping their tone class', () => {
    const { container } = render(
      <>
        <DenominationGrid
          columns={columns}
          label="Strip"
          labelAppearance="plain"
          rows={rows}
        />
        <DenominationGrid
          columns={columns}
          label="Tiles"
          labelAppearance="plain"
          layout="tiles"
          rows={rows}
        />
      </>,
    );
    expect(screen.getByRole('table', { name: 'Strip' }).className).toBe(
      'sw-denomination-grid sw-denomination-strip sw-denomination-labels-plain',
    );
    expect(container.querySelector('.sw-denomination-tiles')?.className).toBe(
      'sw-denomination-grid sw-denomination-tiles sw-denomination-labels-plain',
    );
    expect(
      screen.getByRole('rowheader', { name: 'Received' }).closest('tr')
        ?.className,
    ).toContain('sw-denomination-row-success');
  });

  it('fails closed on an unknown appearance', () => {
    expect(() =>
      render(
        <DenominationGrid
          columns={columns}
          label="Count"
          labelAppearance={'bold' as DenominationLabelAppearance}
          rows={rows}
        />,
      ),
    ).toThrow(RangeError);
  });
});

describe('DenominationGrid plain label CSS', () => {
  const css = generateStylesheet();

  it('drops the stripe, sets the text color, keeps the total toned, and follows the narrow padding', () => {
    expect(utilityClassCatalog()).toContain('sw-denomination-labels-plain');
    expect(css).toContain(
      '.sw-denomination-labels-plain .sw-denomination-label {\n  border-inline-start: 0;\n  color: var(--sw-color-text);\n}',
    );
    expect(css).toContain(
      '.sw-denomination-labels-plain .sw-denomination-total-inline { color: var(--sw-denomination-tone); }',
    );
    expect(css).toContain(
      '.sw-denomination-strip.sw-denomination-labels-plain .sw-denomination-label::before { content: none; }',
    );
    expect(
      css.indexOf('.sw-denomination-strip.sw-denomination-labels-plain'),
    ).toBeGreaterThan(
      css.indexOf(
        '.sw-denomination-strip .sw-denomination-label { padding-inline-start: calc(var(--sw-space-1) * 2); }',
      ),
    );
  });
});
