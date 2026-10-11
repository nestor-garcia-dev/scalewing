import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  type DenominationCellToneAppearance,
  DenominationGrid,
  type DenominationGridFrame,
  type DenominationGridRow,
  type DenominationTotalEmphasis,
} from './components/DenominationGrid.js';
import { cssNoticeClasses } from './css/css-notice.js';
import { generateStylesheet, utilityClassCatalog } from './css/stylesheet.js';
import { toneTintFill, toneTintInk } from './css/tone-tint.js';

afterEach(() => cleanup());

const columns = [
  { key: '1', label: '$1' },
  { key: '5', label: '$5' },
  { key: '20', label: '$20' },
];

const counted: DenominationGridRow = {
  id: 'counted',
  label: 'Counted',
  cells: [78, 30, 49],
  total: '$3,208.00',
};

const difference: DenominationGridRow = {
  id: 'difference',
  label: 'Difference',
  tone: 'danger',
  signed: true,
  cells: [0, null, -1],
  cellTones: [null, null, 'danger'],
  total: '−$20.00',
};

function grid(props: Partial<Parameters<typeof DenominationGrid>[0]> = {}) {
  return render(
    <DenominationGrid
      columns={columns}
      label="Audit"
      rows={[counted, difference]}
      totalLabel="Total"
      {...props}
    />,
  );
}

const table = () => screen.getByRole('table', { name: 'Audit' });
/** The scroll region around the strip (a landmark only while it overflows). */
const region = () => table().closest('.sw-denomination-scroll')!;

describe('DenominationGrid appearance defaults', () => {
  it('keeps the open strip, data totals and text tones', () => {
    grid();
    expect(table().className).toBe(
      'sw-denomination-grid sw-denomination-strip',
    );
    expect(region().className).not.toContain('sw-denomination-scroll-framed');
    // A zero still shows the dash.
    const row = screen.getByRole('row', { name: /Difference/ });
    expect(within(row).getAllByRole('cell')[0]!.textContent).toBe('—');
  });
});

describe('DenominationGrid frame', () => {
  it('frames the strip: the region carries the hairline, the table the fills and rules', () => {
    grid({ frame: 'table' });
    expect(region().className).toContain('sw-denomination-scroll-framed');
    expect(table().className).toContain('sw-denomination-framed');
    // The table keeps its semantics: column heads, row heads, cells.
    expect(screen.getAllByRole('columnheader')).toHaveLength(4);
    expect(screen.getByRole('rowheader', { name: 'Counted' })).toBeTruthy();
  });

  it('frames an aligned strip too: the frame and the label width together', () => {
    grid({ frame: 'table', labelWidth: 'sm' });
    expect(region().className).toContain('sw-denomination-scroll-aligned');
    expect(region().className).toContain('sw-denomination-scroll-framed');
    expect(table().className).toContain('sw-denomination-strip-aligned');
    expect(table().className).toContain('sw-denomination-framed');
  });

  it('leaves tiles unframed (only the strip has a frame)', () => {
    const { container } = grid({ frame: 'table', layout: 'tiles' });
    expect(container.querySelector('.sw-denomination-framed')).toBeNull();
  });

  it('fails closed on an unknown frame', () => {
    expect(() => grid({ frame: 'card' as DenominationGridFrame })).toThrow(
      RangeError,
    );
  });
});

describe('DenominationGrid blank zeros', () => {
  it('leaves zero and empty counts blank with an empty zero label, in both layouts', () => {
    grid({ zeroLabel: '' });
    const cells = within(
      screen.getByRole('row', { name: /Difference/ }),
    ).getAllByRole('cell');
    expect(cells[0]!.textContent).toBe('');
    expect(cells[1]!.textContent).toBe('');
    expect(cells[0]!.className).toContain('sw-denomination-cell-zero');
    expect(cells[2]!.textContent).toBe('−1');
    cleanup();
    const tiles = render(
      <DenominationGrid
        columns={columns}
        label="Tiles"
        layout="tiles"
        rows={[difference]}
        subtotal={(count) => `$${count}`}
        zeroLabel=""
      />,
    );
    const blanks = tiles.container.querySelectorAll(
      '.sw-denomination-cell-zero',
    );
    expect(blanks).toHaveLength(2);
    blanks.forEach((cell) => expect(cell.textContent).toBe(''));
  });
});

describe('DenominationGrid totalEmphasis', () => {
  it('marks strong totals on the strip and the tiles', () => {
    grid({ totalEmphasis: 'strong' });
    expect(table().className).toContain('sw-denomination-totals-strong');
    cleanup();
    const tiles = render(
      <DenominationGrid
        columns={columns}
        label="Tiles"
        layout="tiles"
        rows={[counted, difference]}
        totalEmphasis="strong"
      />,
    );
    expect(
      tiles.container.querySelector('.sw-denomination-tiles')?.className,
    ).toContain('sw-denomination-totals-strong');
  });

  it('fails closed on an unknown emphasis', () => {
    expect(() =>
      grid({ totalEmphasis: 'loud' as DenominationTotalEmphasis }),
    ).toThrow(RangeError);
  });
});

describe('DenominationGrid cellToneAppearance', () => {
  it('gives every read-only count a value box, which the pill appearance fills', () => {
    grid({ cellToneAppearance: 'pill', zeroLabel: '' });
    expect(table().className).toContain('sw-denomination-cell-tones-pill');
    const cell = within(
      screen.getByRole('row', { name: /Difference/ }),
    ).getAllByRole('cell')[2]!;
    expect(cell.className).toContain('sw-denomination-cell-tone-danger');
    expect(cell.querySelector('.sw-denomination-cell-value')?.textContent).toBe(
      '−1',
    );
  });

  it('fails closed on an unknown appearance', () => {
    expect(() =>
      grid({
        cellToneAppearance: 'badge' as DenominationCellToneAppearance,
      }),
    ).toThrow(RangeError);
  });
});

describe('DenominationGrid entry limitAppearance', () => {
  it("passes the entry's limit appearance to every Stepper", () => {
    render(
      <DenominationGrid
        columns={columns}
        label="Take"
        rows={[
          {
            id: 'take',
            label: 'Take',
            cells: [null, 2, 0],
            entry: {
              decrementLabel: 'One less',
              incrementLabel: 'One more',
              limitAppearance: 'plain',
              onChange: vi.fn(),
            },
          },
        ]}
      />,
    );
    const steppers = document.querySelectorAll('.sw-stepper');
    expect(steppers).toHaveLength(3);
    steppers.forEach((stepper) =>
      expect(stepper.className).toContain('sw-stepper-limit-plain'),
    );
    // − at 0 is still disabled.
    const less = screen.getByRole('group', { name: 'Take $1' });
    expect(
      (
        within(less).getByRole('button', {
          name: 'One less',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
});

describe('DenominationGrid appearance CSS', () => {
  const css = generateStylesheet();

  it('catalogs the appearance classes', () => {
    for (const name of [
      'sw-denomination-scroll-framed',
      'sw-denomination-framed',
      'sw-denomination-totals-strong',
      'sw-denomination-cell-tones-pill',
      'sw-denomination-cell-value',
    ])
      expect(utilityClassCatalog()).toContain(name);
  });

  it('draws the frame on the region and the fills and rules on the table', () => {
    expect(css).toContain(`.sw-denomination-scroll-framed {
  background: var(--sw-color-surface);
  border: 1px solid var(--sw-color-border);
  border-radius: var(--sw-radius-sm);
  box-sizing: border-box;
}`);
    expect(css).toContain(
      '.sw-denomination-strip.sw-denomination-framed :is(th, td) + :is(th, td) {\n  border-inline-start: 1px solid var(--sw-color-border);\n}',
    );
    expect(css).toContain(
      '.sw-denomination-strip.sw-denomination-framed thead :where(th, td),\n.sw-denomination-strip.sw-denomination-framed thead .sw-denomination-corner:first-child {\n  background: var(--sw-color-subtle);',
    );
    // The cell padding has no specificity past the frame, so an entry cell
    // keeps its own and a quiet row's pinned label keeps its fill.
    expect(css).toContain(
      '.sw-denomination-strip.sw-denomination-framed :where(th, td) {\n  padding: var(--sw-space-4) var(--sw-space-3);\n}',
    );
    expect(css).toContain(
      '.sw-denomination-strip.sw-denomination-framed :where(.sw-denomination-label) {',
    );
  });

  it('emits the frame after the label appearances and the narrow padding, and re-collapses the total column', () => {
    const frame = css.indexOf('.sw-denomination-scroll-framed {');
    expect(frame).toBeGreaterThan(
      css.indexOf(
        '.sw-denomination-strip.sw-denomination-labels-plain .sw-denomination-label {',
      ),
    );
    expect(frame).toBeGreaterThan(
      css.indexOf(
        '.sw-denomination-strip .sw-denomination-label { padding-inline-start: calc(var(--sw-space-1) * 2); }',
      ),
    );
    expect(css).toContain(
      '.sw-denomination-strip.sw-denomination-framed .sw-denomination-total-head { border-inline-start: 0; padding: 0; }',
    );
  });

  it('sets strong totals in bold label type, a neutral row in the text color', () => {
    expect(css).toContain(
      '.sw-denomination-totals-strong .sw-denomination-total {\n  font-size: 15px;\n  font-weight: 700;',
    );
    expect(css).toContain(
      '.sw-denomination-totals-strong .sw-denomination-row-neutral .sw-denomination-total,\n.sw-denomination-totals-strong .sw-denomination-row-neutral .sw-denomination-total-inline {\n  color: var(--sw-color-text);\n}',
    );
  });

  it("fills a toned pill with the Notice's tint and ink, outlined in forced colors", () => {
    const pill =
      '.sw-denomination-cell-tones-pill .sw-denomination-cell-toned .sw-denomination-cell-value:not(:empty)';
    expect(css).toContain(`${pill} {
  background: var(--sw-denomination-cell-fill);`);
    expect(css).toContain(
      `${pill} { color: inherit; outline: 1px solid CanvasText; }`,
    );
    // The same tint and ink as the Notice, whose test checks 4.5:1 on every palette.
    expect(css).toContain(
      `.sw-denomination-cell-tone-accent { --sw-denomination-cell-tone: var(--sw-color-accent); --sw-denomination-cell-fill: ${toneTintFill('accent')}; --sw-denomination-cell-ink: ${toneTintInk('accent')}; }`,
    );
    const notices = cssNoticeClasses();
    expect(notices).toContain(`--sw-notice-fill: ${toneTintFill('danger')};`);
    expect(notices).toContain(`--sw-notice-ink: ${toneTintInk('danger')};`);
    expect(notices).toContain(`--sw-notice-fill: ${toneTintFill('accent')};`);
  });
});
